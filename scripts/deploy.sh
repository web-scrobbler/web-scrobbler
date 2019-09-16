#!/bin/bash

./node_modules/.bin/grunt publish:chrome
./node_modules/.bin/grunt publish:firefox
./node_modules/.bin/grunt github_release
