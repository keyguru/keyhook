#!/bin/bash

echo "Testing 404"

# should cause 404
R1=$(curl -s -XPOST -d '{}' http://localhost:10010)
echo $R1
if [[ $R1 == "Bad URI" ]]; then
    echo "SUCCESS"
    SUCCESS1=true
fi

echo

# test 1
curl -XPOST -d '{ "ref" : "refs/head/master" }' http://localhost:10010/docker/deploy/landing-page

# test 2
curl -XPOST -d '{}' http://localhost:10002/githook-landing

