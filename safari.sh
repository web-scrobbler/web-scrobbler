#!/bin/bash

set -euo pipefail

rm -rf build/safari
mkdir build/safari
cd .xcode
xcodebuild -workspace "./Web Scrobbler/Web Scrobbler.xcodeproj/project.xcworkspace" -scheme "Web Scrobbler (macOS)" -configuration Release CONFIGURATION_BUILD_DIR="../../build/safari" build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO
