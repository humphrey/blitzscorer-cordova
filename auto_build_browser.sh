## requires fswatch

## brew install fswatch

## https://github.com/emcrisostomo/fswatch
##

fswatch -or www/ | xargs -n1 -I{} cordova build browser