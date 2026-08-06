#!/usr/bin/env python3
"""Regenerate the MusicBrainz artist-hash allowlist binary.

This tool rebuilds ``musicbrainz_artist_hashes.bin``, a compact binary
allowlist of artist names that Web Scrobbler treats as multi-artist
collaborations (that is, names that join several artists together).

The delimiter substrings are not hard-coded here: they are read from
``src/core/scrobbler/lastfm/separators.json``, the single source of truth
shared with the TypeScript first-artist extractor. That file also carries
the separators the extractor splits on, and this tool asserts the invariant
that every separator is present among the substrings, so no name carrying a
separator can ever be missed by the allowlist filter.

The allowlist is assembled from two upstream data sources:

* the MusicBrainz artist JSONL dump (``mbdump/artist``), from which only
  names containing a known multi-artist delimiter are kept; and
* the canonical artist-alias CSV, which contributes alias spellings that do
  not appear in the JSONL dump.

Every accepted name is lowercased, hashed with xxh3-64, and written to the
output file as a sorted list of little-endian 8-byte digests. Sorting is done
on the raw digest bytes, so the resulting file is byte-ascending.
"""

import argparse
import csv
import json

import xxhash


def load_substrings(path: str) -> tuple[str, ...]:
    """Load and validate the shared multi-artist delimiter substrings.

    Reads the single source of truth ``separators.json``, flattens the
    script-grouped ``substrings`` object into a tuple, and asserts the
    invariant that every separator is also a substring. A violation means a
    delimiter the extractor splits on could never reach the allowlist, so
    the tool refuses to generate anything.

    :param path: Path to the separators JSON file
    :returns: Flattened tuple of delimiter substrings
    """
    with open(path, "r", encoding="utf-8") as handle:
        data = json.load(handle)

    separators = data["separators"]
    substrings = tuple(
        fragment for group in data["substrings"].values() for fragment in group
    )

    missing = [sep for sep in separators if sep not in substrings]
    if missing:
        raise ValueError(
            "separators.json violates the invariant separators ⊆ substrings; "
            f"missing from substrings: {missing}"
        )

    return substrings


def has_delimiter(name: str, substrings: tuple[str, ...]) -> bool:
    """Return True when *name* contains a known multi-artist delimiter.

    :param name: Artist name to test
    :param substrings: Delimiter substrings loaded from the separators JSON
    :returns: True when any substring occurs in *name*
    """
    return any(fragment in name for fragment in substrings)


def collect_jsonl_names(path: str, substrings: tuple[str, ...]) -> set[str]:
    """Collect delimiter-bearing lowercased names from the MB artist dump.

    Each JSONL line is a MusicBrainz artist record. Names are gathered from
    the artist's own ``name`` field, from every alias ``name``, and from the
    ``source-credit`` / ``target-credit`` of every relation.

    :param path: Path to the MusicBrainz artist JSONL dump
    :param substrings: Delimiter substrings loaded from the separators JSON
    :returns: Set of lowercased delimiter-bearing names
    """
    names = set()
    with open(path, "r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue

            candidates = [record.get("name")]
            for alias in record.get("aliases", []):
                candidates.append(alias.get("name"))
            for relation in record.get("relations", []):
                candidates.append(relation.get("source-credit"))
                candidates.append(relation.get("target-credit"))

            for candidate in candidates:
                if candidate and has_delimiter(candidate, substrings):
                    names.add(candidate.lower())
    return names


def collect_csv_names(path: str, substrings: tuple[str, ...]) -> set[str]:
    """Collect single-MBID delimiter-bearing lowercased aliases from the CSV.

    Only rows whose ``artist_mbids`` is non-empty and free of commas are
    considered; their ``artist_credit_name`` is kept when it carries a
    delimiter.

    :param path: Path to the canonical artist-alias CSV
    :param substrings: Delimiter substrings loaded from the separators JSON
    :returns: Set of lowercased delimiter-bearing alias names
    """
    names = set()
    with open(path, "r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            mbids = row.get("artist_mbids") or ""
            if not mbids or "," in mbids:
                continue
            credit = row.get("artist_credit_name")
            if credit and has_delimiter(credit, substrings):
                names.add(credit.lower())
    return names


def main():
    parser = argparse.ArgumentParser(
        description="Regenerate the MusicBrainz artist-hash allowlist."
    )
    parser.add_argument(
        "--output",
        required=True,
        help="path to the output .bin file",
    )
    parser.add_argument(
        "--separators-json",
        required=True,
        help="path to the shared separators.json (single source of truth)",
    )
    parser.add_argument(
        "--musicbrainz-jsonl",
        required=True,
        help="path to the MusicBrainz artist JSONL dump",
    )
    parser.add_argument(
        "--artists-csv",
        required=True,
        help="path to the canonical artist-alias CSV",
    )
    parser.add_argument(
        "--debug",
        default=None,
        help="optional path to write the CSV-only names (sorted)",
    )
    args = parser.parse_args()

    substrings = load_substrings(args.separators_json)

    jsonl_names = collect_jsonl_names(args.musicbrainz_jsonl, substrings)
    csv_names = collect_csv_names(args.artists_csv, substrings)

    # Names that only the CSV contributes, beyond what the JSONL dump has.
    only_in_csv = csv_names - jsonl_names
    if args.debug:
        with open(args.debug, "w", encoding="utf-8") as handle:
            for name in sorted(only_in_csv):
                handle.write(name + "\n")

    names = jsonl_names | csv_names

    hasher = xxhash.xxh3_64()
    digests = set()
    for name in names:
        hasher.reset()
        hasher.update(name.encode("utf-8"))
        digests.add(hasher.digest())

    with open(args.output, "wb") as handle:
        for digest in sorted(digests):
            handle.write(digest)


if __name__ == "__main__":
    main()
