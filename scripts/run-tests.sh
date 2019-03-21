#!/bin/bash

matches=$(git diff --name-only $TRAVIS_COMMIT_RANGE | grep 'src/connectors/' | sed 's/src\/connectors\///' | rev | cut -c 4- | rev | paste -sd ":" -)

if [ -z "$matches" ]
	then

	exit 0
fi

# ./node_modules/.bin/grunt
./node_modules/.bin/grunt test:$matches;

