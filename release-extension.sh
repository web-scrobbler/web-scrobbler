#!/bin/bash

set -euo pipefail

VERSION=$(npm version $1 -m "Release v%s")
git push origin master
git push origin $VERSION
