'use strict';
const aws = require('aws-sdk');
const crypto = require("crypto");
require('dotenv').config()

module.exports.presign = async (event, context) => {
    var s3 = new aws.S3({
        accessKeyId: process.env.ACCESS_KEY_ID,
        sercretAccessKey: process.env.SECRET_ACCESS_KEY,
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
    })
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: url,
                input: event,
            }
        )
    }
}

module.exports.hello = async event => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
            },
            null,
            2
        ),
    };

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
