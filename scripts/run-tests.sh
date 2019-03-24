#!/bin/bash

MATCHER='master'

if [ ! -z "$TRAVIS" ]
then
	MATCHER=$TRAVIS_COMMIT_RANGE
fi

TEST_PATH="$(pwd)/tests/connectors/"
MATCHES=$(git diff --name-only $MATCHER | grep 'src/connectors/' | sed 's/src\/connectors\///' | rev | cut -c 4- | rev)
TEST_PATTERN=''


for CONNECTOR in $MATCHES
do
	CONNECTOR_TEST_PATH="$TEST_PATH$CONNECTOR.js"
	if [ -f $CONNECTOR_TEST_PATH ]; then
		TEST_PATTERN="$TEST_PATTERN:$CONNECTOR"
	fi
done

if [ -z "$TEST_PATTERN" ]
	then

	exit 0
fi

./node_modules/.bin/grunt
./node_modules/.bin/grunt test$TEST_PATTERN;

