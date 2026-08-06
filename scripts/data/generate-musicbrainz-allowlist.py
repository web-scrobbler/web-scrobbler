#!/usr/bin/env python3
"""Regenerate the MusicBrainz artist-hash allowlist binary.

This tool rebuilds ``musicbrainz_artist_hashes.bin``, a compact binary
allowlist of artist names that Web Scrobbler treats as multi-artist
collaborations (that is, names that join several artists together).

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

# Delimiter fragments that mark a name as a multi-artist collaboration.
# Grouped by script for readability; only membership matters, not order.
SUBSTRINGS = (
    # ASCII punctuation combinations.
    ", ",
    ";",
    " & ",
    " / ",
    ", at ",
    ", ne-",
    # Latin-script conjunctions (space-delimited).
    " and ",
    " en ",
    " və ",
    " dan ",
    " i ",
    " a ",
    " og ",
    " und ",
    " ja ",
    " y ",
    " eta ",
    " et ",
    " e ",
    " na ",
    " un ",
    " ir ",
    " és ",
    " va ",
    " dhe ",
    " și ",
    " in ",
    " och ",
    " và ",
    " ve ",
    # CJK / ideographic.
    "、",
    "＆",
    "和",
    "及",
    # Arabic / Persian.
    "، ",
    " و ",
    " اور ",
    "، و ",
    # Indic scripts.
    " र ",
    " आणि ",
    " और ",
    " আৰু ",
    " এবং ",
    " ਅਤੇ ",
    " અને ",
    ", ଓ ",
    " மற்றும் ",
    " మరియు ",
    ", ಮತ್ತು ",
    " എന്നിവ",
    ", සහ ",
    # Southeast Asian scripts.
    " และ",
    " ແລະ ",
    "နှင့် ",
    " និង ",
    # Other scripts.
    "፣ ",
    " и ",
    " жана ",
    " και ",
    " և ",
    " ו-",
    " და ",
    " እና ",
    " 및 ",
)


def has_delimiter(name: str) -> bool:
    """Return True when *name* contains a known multi-artist delimiter."""
    return any(fragment in name for fragment in SUBSTRINGS)


def collect_jsonl_names(path: str) -> set[str]:
    """Collect delimiter-bearing lowercased names from the MB artist dump.

    Each JSONL line is a MusicBrainz artist record. Names are gathered from
    the artist's own ``name`` field, from every alias ``name``, and from the
    ``source-credit`` / ``target-credit`` of every relation.
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
                if candidate and has_delimiter(candidate):
                    names.add(candidate.lower())
    return names


def collect_csv_names(path: str) -> set[str]:
    """Collect single-MBID delimiter-bearing lowercased aliases from the CSV.

    Only rows whose ``artist_mbids`` is non-empty and free of commas are
    considered; their ``artist_credit_name`` is kept when it carries a
    delimiter.
    """
    names = set()
    with open(path, "r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            mbids = row.get("artist_mbids") or ""
            if not mbids or "," in mbids:
                continue
            credit = row.get("artist_credit_name")
            if credit and has_delimiter(credit):
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

    jsonl_names = collect_jsonl_names(args.musicbrainz_jsonl)
    csv_names = collect_csv_names(args.artists_csv)

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
