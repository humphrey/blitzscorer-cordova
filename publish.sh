
# S3: http://blitzscorer.com/
cordova build browser
s3cmd sync -r platforms/browser/www/ s3://blitzscorer.com/

