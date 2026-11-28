# MusicBrainz Artist Allowlist Generator

Generates a raw binary hash set of MusicBrainz artist names that contain
multi-artist delimiter substrings (e.g. " & ", " and ", ",") but should
still be treated as single-artist names — preventing incorrect splitting
by the "first artist only" feature.

## Dependencies

```bash
pip install xxhash
```

- `xxhash` — xxh3_64 hashing (used for the binary hash set)

## MusicBrainz Data

The two input files are downloaded separately with `wget` or `curl`; the
script itself only reads them from disk.

### Artist JSONL

Download from <https://data.metabrainz.org/pub/musicbrainz/data/json-dumps/>:

```bash
wget https://data.metabrainz.org/pub/musicbrainz/data/json-dumps/artist.tar.xz
tar -xJf artist.tar.xz
```

This extracts `mbdump/artist`, a newline-delimited JSONL file (one JSON
record per artist per line), ~1.7 GB compressed / ~17 GB decompressed.

> **Pitfall**: the full export
> (<https://data.metabrainz.org/pub/musicbrainz/data/fullexport/>) also
> contains a file named `mbdump/artist`, but in TSV format — useless for this
> script, which parses each line with `json.loads()`. Always use the
> `json-dumps` artifact.

### Canonical artist CSV

Download from <https://data.metabrainz.org/pub/musicbrainz/canonical_data/>:

```bash
wget https://data.metabrainz.org/pub/musicbrainz/canonical_data/musicbrainz-canonical-dump-<date>.tar.zst
tar --zstd -xf musicbrainz-canonical-dump-<date>.tar.zst
```

This extracts `canonical/canonical_musicbrainz_data.csv` (~2.3 GB compressed)
with the columns `artist_mbids` and `artist_credit_name`. The older
`artist_alias.csv` no longer exists in current dumps.

## Separator Source of Truth

The delimiter substrings are not hard-coded in the script: they are read from
`src/core/scrobbler/lastfm/separators.json` (passed via the required
`--separators-json` argument), the single source of truth shared with the
TypeScript first-artist extractor. The JSON also carries the separators the
extractor splits on, and `load_substrings()` asserts the invariant
`separators ⊆ substrings` — the script exits with an error when it is
violated, so no name carrying a separator can ever be missed by the allowlist
filter.

**Behavioral consequence of the separator set**: separators are deliberate,
conservative multi-artist markers (`", "`, `" & "`, `" / "`, `" feat. "`,
`" ft. "`, `" with "`). Classes such as `" vs. "`, `" x "`, `" + "`,
`" featuring "`, `" presents "`, `" pres. "`, `" prod. "`, `" • "`, and a bare
`","` are intentionally *not* separators, so names carrying them are **never**
truncated by the first-artist feature — even when they are not in the allowlist
(the full credit name is kept, which is the benign default behavior). This is
deliberate; `" x "` collaborations in particular cannot both be split correctly
and allowlisted under the old code. Do not add `" x "` back as a separator.

## Usage

```bash
python scripts/data/generate-musicbrainz-allowlist.py \
    --output src/static-data/musicbrainz_artist_hashes.bin \
    --separators-json src/core/scrobbler/lastfm/separators.json \
    --musicbrainz-jsonl /path/to/mbdump/artist \
    --artists-csv /path/to/canonical/canonical_musicbrainz_data.csv
```

Optional `--debug` flag writes a text file listing canonical-only names
(those found in the CSV but not in the JSONL dump):

```bash
python scripts/data/generate-musicbrainz-allowlist.py \
    --output src/static-data/musicbrainz_artist_hashes.bin \
    --separators-json src/core/scrobbler/lastfm/separators.json \
    --musicbrainz-jsonl /path/to/mbdump/artist \
    --artists-csv /path/to/canonical/canonical_musicbrainz_data.csv \
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

The `.bin` file is the ground truth consumed by the extension at
`src/static-data/musicbrainz_artist_hashes.bin`.

## How It Works

1. **Read MusicBrainz artist JSONL** — collect artist names, aliases, and
   relation credits that contain multi-artist delimiter substrings (loaded
   from `src/core/scrobbler/lastfm/separators.json`).
2. **Read canonical artist CSV** — collect single-artist credit names
   (rows with a single `artist_mbids`) that also contain delimiters but
   are NOT already covered by the JSONL dump.
3. **Merge and deduplicate** — combine both sets.
4. **Hash** — compute `xxhash.xxh3_64()` of each lowercased name.
5. **Sort and write** — output sorted hashes as raw binary.
