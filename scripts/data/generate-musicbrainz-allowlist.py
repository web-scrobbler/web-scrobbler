#!/usr/bin/env python3
"""
Generate MusicBrainz artist hash allowlist binary file.

Adapted from pano-scrobbler's collect-musicbrainz-artist-names.py:
  https://github.com/kawaiiDango/pano-scrobbler/blob/3cf8216cbb1fd95b26e8de2352f5f579a597a962/py-scripts/collect-musicbrainz-artist-names.py

Output format:
  Raw binary, little-endian unsigned 64-bit integers (u64).
  Exactly 8 bytes per hash, one hash per artist name.
  Hashes are sorted ascending for binary search compatibility.
  This matches the format used by pano-scrobbler.

Algorithm:
  1. Read MusicBrainz artist JSONL dump, collect artist names, aliases, and
     relation credits that contain multi-artist delimiter substrings ("," ,
     " & ", " / ", " and ", etc. — names that might be incorrectly split).
  2. Read canonical artist CSV, collect single-artist credit names that
     contain delimiters but are NOT already in the JSONL-derived set.
  3. Merge both sets, deduplicate, compute xxh3_64 hash (lowercased) for
     each name, sort hashes, and write as raw binary.
"""

import argparse
import csv
import json
import os
import sys

import xxhash


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Generate a binary allowlist of xxh3_64 hashes for artist names "
            "that should be treated as single artists (not split into multiple)."
        ),
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Path to output .bin file (raw little-endian u64 hashes)",
    )
    parser.add_argument(
        "--musicbrainz-jsonl",
        required=True,
        help="Path to MusicBrainz artist JSONL dump file (e.g. mbdump/artist)",
    )
    parser.add_argument(
        "--artists-csv",
        required=True,
        help=(
            "Path to canonical artist alias CSV file "
            "(e.g. canonical_musicbrainz_data/artist_alias.csv)"
        ),
    )
    parser.add_argument(
        "--debug",
        default=None,
        help=(
            "Optional path to write a debug text file listing canonical-only "
            "names that were added from the CSV (not found in JSONL)"
        ),
    )
    return parser.parse_args(argv)


# Multi-artist delimiter substrings — names containing these may be
# incorrectly split by music players / taggers, so we record them as
# valid single-artist names not to be split.
SUBSTRINGS: list[str] = [
    ", ",
    "、",  # Chinese, Japanese comma
    "، ",  # Urdu, Persian comma
    " و ",  # Arabic comma
    "፣ ",  # Amharic comma
    ";",
    " & ",
    "＆",  # Fullwidth ampersand used in Japanese
    " / ",
    # the rest is for youtube music
    " and ",
    " en ",  # Afrikaans
    " və ",  # Azerbaijani
    " dan ",  # Bahasa Indonesia, Bahasa Malaysia
    " i ",  # Bosnian, Catalan, Croatian, Polish, Belarusian, Ukrainian
    " a ",  # Czech, Slovenčina
    " og ",  # Danish, Icelandic, Norwegian
    " und ",  # German
    " ja ",  # Estonian, Finnish
    " y ",  # Spanish
    " eta ",  # Basque
    ", at ",  # Filipino
    " et ",  # French
    " e ",  # Galician, Portuguese
    ", ne-",  # Zulu
    " na ",  # Swahili
    " un ",  # Latvian
    " ir ",  # Lithuanian
    " és ",  # Hungarian
    " va ",  # Uzbek
    " dhe ",  # Albanian
    " și ",  # Romanian
    " in ",  # Slovenščina
    " och ",  # Swedish
    " và ",  # Vietnamese
    " ve ",  # Turkish
    " и ",  # Bulgarian, Macedonian, Russian, Serbian
    " жана ",  # Kyrgyz
    " και ",  # Greek
    " և ",  # Armenian
    " ו-",  # Hebrew
    " اور ",  # Urdu
    "، و ",  # Persian
    " र ",  # Nepali
    " आणि ",  # Marathi
    " और ",  # Hindi
    " আৰু ",  # Assamese
    " এবং ",  # Bengali
    " ਅਤੇ ",  # Punjabi
    " અને ",  # Gujarati
    ", ଓ ",  # Odia
    " மற்றும் ",  # Tamil
    " మరియు ",  # Telugu
    ", ಮತ್ತು ",  # Kannada
    " എന്നിവ",  # Malayalam (This comes at the end of the phrase)
    ", සහ ",  # Sinhala
    " และ",  # Thai
    " ແລະ ",  # Lao
    "နှင့် ",  # Burmese
    " და ",  # Georgian
    " እና ",  # Amharic
    " និង ",  # Khmer
    "和",  # Chinese (Simplified)
    "及",  # Chinese (Hong Kong)
    " 및 ",  # Korean
]


def has_delimiter(name: str) -> bool:
    """Return True if *name* contains any multi-artist delimiter substring."""
    return any(sub in name for sub in SUBSTRINGS)


def collect_names_from_jsonl(path: str) -> set[str]:
    """
    Read MusicBrainz artist JSONL dump and collect names that contain
    multi-artist delimiters.

    Checks:
      - artist.name
      - relation source-credit / target-credit
      - alias names
    """
    names: set[str] = set()

    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                artist = json.loads(line)
            except json.JSONDecodeError:
                continue

            # Artist name
            name = artist.get("name", "")
            if has_delimiter(name):
                names.add(name.lower())

            # Relation credits (source-credit / target-credit)
            for relation in artist.get("relations", []):
                src = relation.get("source-credit", "")
                if has_delimiter(src):
                    names.add(src.lower())
                tgt = relation.get("target-credit", "")
                if has_delimiter(tgt):
                    names.add(tgt.lower())

            # Aliases
            for alias in artist.get("aliases", []):
                alias_name = alias.get("name", "")
                if has_delimiter(alias_name):
                    names.add(alias_name.lower())

    return names


def collect_names_from_csv(path: str) -> set[str]:
    """
    Read canonical artist alias CSV and collect single-artist credit names
    that contain multi-artist delimiters.

    Only picks rows where artist_mbids contains a single MBID (no comma),
    ensuring we only add names that actually belong to one artist.
    """
    names: set[str] = set()

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            artist_mbids = row.get("artist_mbids", "")
            # Skip multi-artist rows (comma-separated MBIDs)
            if not artist_mbids or "," in artist_mbids:
                continue

            artist_name = row.get("artist_credit_name", "")
            if has_delimiter(artist_name):
                names.add(artist_name.lower())

    return names


def main() -> None:
    args = parse_args(sys.argv[1:])

    # --- Validate input files ---
    errors: list[str] = []
    for label, path in [
        ("--musicbrainz-jsonl", args.musicbrainz_jsonl),
        ("--artists-csv", args.artists_csv),
    ]:
        if not os.path.isfile(path):
            errors.append(f"ERROR: {label} file not found: {path}")
    if errors:
        for err in errors:
            print(err, file=sys.stderr)
        sys.exit(1)

    # --- Step 1: Collect names from MusicBrainz artist JSONL ---
    print(f"Reading MusicBrainz artist JSONL: {args.musicbrainz_jsonl}")
    names_set = collect_names_from_jsonl(args.musicbrainz_jsonl)
    print(f"  -> {len(names_set)} artist names / aliases with delimiters")

    # --- Step 2: Collect names from canonical artist CSV ---
    print(f"Reading canonical artist CSV: {args.artists_csv}")
    credit_names = collect_names_from_csv(args.artists_csv)
    print(f"  -> {len(credit_names)} artist credit names with delimiters")

    # Only add CSV-only names (not already covered by the JSONL dump)
    filtered_credit = credit_names - names_set
    print(f"  -> {len(filtered_credit)} CSV-only names after dedup against JSONL")
    names_set.update(filtered_credit)

    print(f"Total unique names to hash: {len(names_set)}")

    # --- Step 3: Optional debug output ---
    if args.debug:
        with open(args.debug, "w", encoding="utf-8") as f:
            for name in sorted(filtered_credit):
                f.write(f"{name}\n")
        print(f"Debug file written: {args.debug}")

    # --- Step 4: Hash all names with xxh3_64 ---
    hasher = xxhash.xxh3_64()
    hashes: set[bytes] = set()
    for name in names_set:
        hasher.reset()
        hasher.update(name.encode("utf-8"))
        hashes.add(hasher.digest())  # xxh3_64 digest is 8 bytes

    # Sort hashes for deterministic output and binary search compatibility
    sorted_hashes = sorted(hashes)

    # --- Step 5: Write output binary ---
    # Format: raw little-endian u64, 8 bytes per hash, sorted ascending
    with open(args.output, "wb") as f:
        for h in sorted_hashes:
            f.write(h)

    print(f"Output written: {args.output}")
    print(f"  -> {len(sorted_hashes)} hashes ({len(sorted_hashes) * 8} bytes)")


if __name__ == "__main__":
    main()
