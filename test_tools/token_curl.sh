#!/bin/sh

UID=u-s4t2ud-0c37d03cd23811742359c4f1bbf37d6db41003029d2073720a958af8085bb3e7
SECRET=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

curl -X POST 'https://api.intra.42.fr/v2/oauth/token' \
	-H 'Content-Type: application/x-www-form-urlencoded' \
	-u "$UID:$SECRET" \
	-d 'grant_type=client_credentials'\
#	-d 'client_secret=SECRET' \
