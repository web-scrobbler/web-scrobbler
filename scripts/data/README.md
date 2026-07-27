# MusicBrainz Artist Allowlist Generator

Generates a raw binary hash set of MusicBrainz artist names that contain
multi-artist delimiter substrings (e.g. " & ", " and ", ",") but should
still be treated as single-artist names — preventing incorrect splitting
by the "first artist only" feature.

## Dependencies

```bash
pip install xxhash requests
```

- `xxhash` — xxh3_64 hashing (used for the binary hash set)
- `requests` — downloading MusicBrainz data (optional, see below)

## MusicBrainz Data

Download the latest MusicBrainz data dump from:

<https://data.metabrainz.org/pub/musicbrainz/data/fullexport/>

You need two files from the dump:

1. **Artist JSONL** — `mbdump/artist` (newline-delimited JSON, one artist per line)
2. **Canonical artist CSV** — `canonical_musicbrainz_data/artist_alias.csv`

Extract both from the archive. The full dump is ~3 GB compressed; you can
also download individual files using `wget` or `requests`.

## Usage

```bash
python scripts/data/generate-musicbrainz-allowlist.py \
    --output src/static-data/musicbrainz_artist_hashes.bin \
    --musicbrainz-jsonl /path/to/mbdump/artist \
    --artists-csv /path/to/artist_alias.csv
```

Optional `--debug` flag writes a text file listing canonical-only names
(those found in the CSV but not in the JSONL dump):

```bash
python scripts/data/generate-musicbrainz-allowlist.py \
    --output src/static-data/musicbrainz_artist_hashes.bin \
    --musicbrainz-jsonl /path/to/mbdump/artist \
    --artists-csv /path/to/artist_alias.csv \
    --debug /tmp/debug-names.txt
```

## Output Format

The output `.bin` file is a raw binary sequence of:

- **Little-endian unsigned 64-bit integers** (u64)
- **8 bytes per hash**
- **Sorted ascending** for binary search compatibility
- **One hash per artist name**
- **Deduplicated** (duplicate names from multiple sources are hashed once)
- **Lowercased** before hashing

This matches the format used by pano-scrobbler's allowlist.

## How It Works

1. **Read MusicBrainz artist JSONL** — collect artist names, aliases, and
   relation credits that contain multi-artist delimiter substrings.
2. **Read canonical artist CSV** — collect single-artist credit names
   (rows with a single `artist_mbids`) that also contain delimiters but
   are NOT already covered by the JSONL dump.
3. **Merge and deduplicate** — combine both sets.
4. **Hash** — compute `xxhash.xxh3_64()` of each lowercased name.
5. **Sort and write** — output sorted hashes as raw binary.

## Source

Adapted from pano-scrobbler:

<https://github.com/kawaiiDango/pano-scrobbler/blob/3cf8216cbb1fd95b26e8de2352f5f579a597a962/py-scripts/collect-musicbrainz-artist-names.py>
