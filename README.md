# Universal Webhook Server

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/280938bbb6074f86ac8b9465491c8581)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=keyguru/keyhook&amp;utm_campaign=Badge_Grade)

[![Master](https://circleci.com/gh/keyguru/keyhook.svg?style=svg&circle-token=9972a40412c276438dab3b255c54899ac60d5cc1)](Master)

[![Coverage Status](https://coveralls.io/repos/github/keyguru/keyhook/badge.svg?branch=main)](https://coveralls.io/github/keyguru/keyhook?branch=main)

## Installation

        # Install latest node.js (tested with 14.x)
        curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
        sudo apt-get install -y nodejs

        # Install keyhook globally
		npm install -g @keyguru/keyhook

## Usage

Minimal setup (will use default example keyhook.json, mostly for testing)

        ./keyhook.js

Advanced setup (providing own configuration file)

        ./keyhook.js --config ./keyhook.json

Sample config file:

```
{
    "hooks": [
        {
            "name": "Test",
            "port": 32767,
            "path": "/test",
            "command": "echo test",
            "ref": "master"
        }
    ]
}
```
