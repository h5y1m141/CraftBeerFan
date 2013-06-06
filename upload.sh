#!/bin/bash
# Modified from the script by Justin Miller
# Source: http://developmentseed.org/blog/2011/sep/02/automating-development-uploads-testflight-xcode/

API_TOKEN='94bce620ff3e609d66df70af10d4321f_NTE1OTcyMjAxMi0wNy0wMiAxODowNTozMy44NjIyOTM'
TEAM_TOKEN='85423db38d7783adcaec18e9c82a9b93_MTA2MTgzMjAxMi0wNy0wMiAxODo0MjoxNC4wNTYyMTE'

SIGNING_IDENTITY='Hiroshi Oyamada (YCT5UZG297)'
PROVISIONING_PROFILE="$HOME/Library/MobileDevice/Provisioning Profiles/BD972F9F-2C05-48AF-B49E-A1BE30420E9B.mobileprovision"

PRODUCT_NAME='CraftBeerFan'

TERMINAL_NOTIFIER="/Users/hoyamada/.rvm/gems/ruby-1.9.2-p290/bin/terminal-notifier" 
#/usr/bin/open -a /Applications/Utilities/Console.app $LOG
 
#echo -n "Creating .ipa for ${PRODUCT_NAME}... " > $LOG
 
#echo "done." >> $LOG

RELEASE_NOTES='Build uploaded automatically'
DISTRIBUTION_LISTS='CraftBeerTokyo'
BUILD_PATH="/Users/hoyamada/Dropbox/Public/learning_javascript/titanium/CraftBeerFan/build/iphone/build/Debug-iphoneos"
/usr/bin/curl "http://testflightapp.com/api/builds.json" \
-F file=@"$BUILD_PATH/$(echo $PRODUCT_NAME).ipa" \
-F api_token=${API_TOKEN} \
-F notify="True" \
-F replace="True" \
-F team_token=${TEAM_TOKEN} \
-F distribution_lists=${DISTRIBUTION_LISTS} \
-F notes="${RELEASE_NOTES}"

echo "Uploaded to TestFlight" 