#!/bin/sh

VAR_NAME='file'
URL='http://localhost:5001/upload'
FILE_NAME='p.jpeg'

# curl -X PUT -F '${VAR_NAME}=\@$(FILE_NAME)' $URL
curl -X PUT -F 'file=\@$(FILE_NAME)' $URL
