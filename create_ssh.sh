#!/bin/sh

#-t algo -b nbits -C setting email -f "filename"
ssh-keygen -t rsa -b 4096 -C "ramscendance@gmail.com" -f "key"

chmod 700 key
chmod 700 key.pub
chmod 600 ~/.ssh/id_rsa
chmod 700 ~/.ssh
