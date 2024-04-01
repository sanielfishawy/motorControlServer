#! /bin/sh

export ENV=test

unset TEST_DOMAIN
# export TEST_DOMAIN='http://foo.bar.com'

unset PORT
export PORT=8000

unset DEBUG
# export DEBUG='express:*'

# unset LOG_LEVEL
# export LOG_LEVEL=debug
# export LOG_LEVEL=info

# sudo -E node index.js &
# node index.js &
sleep 3

./node_modules/mocha/bin/_mocha -timeout 300000 --recursive 

# mac
kill -9 $(ps -ef | grep '[n]ode index.js' | awk '{print $2}') 

# linux
# sudo kill -9 $(ps -aux | grep '[n]ode index.js' | awk '{print $2}')
# sudo kill -9 $(ps -aux | grep '[n]odemon index.js' | awk '{print $2}')