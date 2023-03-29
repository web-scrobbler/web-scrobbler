#!/bin/bash

set -euo pipefail

rm -rf build/safari
mkdir build/safari
cd build/safari
xcrun safari-web-extension-converter ../safariraw --no-open
xcodebuild -workspace "./Web Scrobbler/Web Scrobbler.xcodeproj/project.xcworkspace" -scheme "Web Scrobbler (macOS)" build
