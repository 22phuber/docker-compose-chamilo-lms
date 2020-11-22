#!/bin/bash
# wait-for-selenium-grid.sh
# usage: $ ./wait-for-selenium-grid.sh npm test

set -e
set -o pipefail

sleepTime=2
loopCount=0
stopLoopCount=30 # 30 * 2s => 60s

while ! curl -sSL "http://localhost:4444/wd/hub/status" 2>&1 \
| grep -i -A1 value | tr -d '\n| |,' | awk -F':' '{print $3}' 2>&1 | grep "true" >/dev/null; do

    printf "Waiting for the Selenium Grid ... %ss\n" "$(((stopLoopCount-loopCount)*sleepTime))"
    sleep ${sleepTime}
    loopCount=$((loopCount+1))
    [[ "${loopCount}" -ge "${stopLoopCount}" ]] \
    && {
        printf "ERROR: Selenium Grid was not able to start in %s seconds\n" "$((stopLoopCount*sleepTime))";
        exit 1;
    }

done

>&2 echo "Selenium Grid is up"

# shellcheck disable=SC2068
exec $@