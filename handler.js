'use strict';
const aws = require('aws-sdk');
const crypto = require("crypto");
require('dotenv').config()

module.exports.s3_presign = async (event, context) => {
    var s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        sercretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-west-2'
    });

    var myBucket = event.bucket
    var myKey = crypto.randomBytes(20).toString('hex');
    var signedUrlExpireSeconds = 60 * 5
    const url = s3.getSignedUrl('putObject', {
        Bucket: myBucket,
        Key: myKey,
        ACL: event.acl,
        ContentType: event.content_type,
        Expires: signedUrlExpireSeconds
    });
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: url,
                input: event,
            }
        )
    }
};
