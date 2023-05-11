#!/bin/bash

set -euo pipefail

rm -rf build/safarixcode
mkdir build/safarixcode
rm -rf build/safari
mkdir build/safari
cd build/safarixcode
if [ "${@: -1}" = "dev" ]; then
	xcrun safari-web-extension-converter ../safariraw
else
	xcrun safari-web-extension-converter ../safariraw --no-open
	xcodebuild -workspace "./Web Scrobbler/Web Scrobbler.xcodeproj/project.xcworkspace" -scheme "Web Scrobbler (macOS)" -configuration Release CONFIGURATION_BUILD_DIR="../../safari" build
fi
