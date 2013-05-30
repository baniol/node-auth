# Node authorization system

### Node & mysql + jade & less

Some ideas are taken from (https://github.com/braitsch/node-login)[https://github.com/braitsch/node-login]

> (not suitable for production puroposes !)

---

## Description

This is merely a draft of the node & mysql authorization system.

It hasn`t been extensively tested.


## Installation

1. run ``npm install`` in projects the root directory,

2. edit ``auth/config.js`` and provide your database details,

3. run ``node index.js --install`` in the projects root directory. This will create user table with a test user: test@test.com, password: test_user