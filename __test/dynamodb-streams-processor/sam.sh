#!/bin/bash

region="us-east-1"
stack="dynamodb-streams-processor"
bucket="gw-deploy-$region"

# Create deployment bucket if it doesn't exist
if [ "us-east-1" == $region ]
then
  aws s3api create-bucket --bucket $bucket --region $region
else
  aws s3api create-bucket --bucket $bucket --region $region --create-bucket-configuration LocationConstraint=$region
fi

# Build, package and deploy the backend
sam build --parameter-overrides stack=$stack
sam package --s3-bucket $bucket --output-template-file sam.yaml
sam deploy --template-file sam.yaml --region $region --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM --stack-name $stack --parameter-overrides stack=$stack
