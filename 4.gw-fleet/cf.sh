#!/bin/bash

source `dirname "../bash/$BASH_SOURCE"`/getopts.sh
source `dirname "../bash/$BASH_SOURCE"`/util.sh

root=../__build/server/$stage
data="$root/server_Data"
[ ! -d "$data" ] && quit "$data does not exist."
file="$root/amazon-cloudwatch-agent.json"
[ ! -f "$file" ] && quit "$file does not exist."
file="$root/install.sh"
[ ! -f "$file" ] && quit "$file does not exist."
file="$root/server.x86_64"
[ ! -f "$file" ] && quit "$file does not exist."

stack="gw-fleet"

# Returns the status of a stack
getstatus() {
	aws cloudformation describe-stacks --region $region --stack-name $1 --query Stacks[].StackStatus --output text 2>/dev/null
}

# Deploy the build to GameLift (Expecting that it was built from Unity already)
echo "Deploying build (Expecting it is prebuilt in $root folder)"
buildversion=$(date +%Y-%m-%d.%H:%M:%S)
aws gamelift upload-build --operating-system AMAZON_LINUX_2 --build-root $root --name "$stack-build-$stage" --build-version $buildversion --region $region

# Get the build version for fleet deployment
query='Builds[?Version==`'
query+=$buildversion
query+='`].BuildId'
buildid=$(aws gamelift list-builds --query $query --output text --region $region)
echo $buildid

# Deploy rest of the resources with CloudFromation
status=$(getstatus $stack-$stage)
if [ -z "$status" ]; then
  echo "Creating stack for example fleet (this will take some time)..."
  aws cloudformation --region $region create-stack --stack-name $stack-$stage \
      --template-body file://template.yaml \
      --parameters ParameterKey=stage,ParameterValue=$stage ParameterKey=stack,ParameterValue=$stack ParameterKey=buildid,ParameterValue=$buildid \
      --capabilities CAPABILITY_IAM
  aws cloudformation --region $region wait stack-create-complete --stack-name $stack-$stage
  echo "Done creating stack!"
else
  echo "Updating stack for example fleet (this will take some time)..."
  aws cloudformation --region $region update-stack --stack-name $stack-$stage \
     --template-body file://template.yaml \
     --parameters ParameterKey=stage,ParameterValue=$stage ParameterKey=stack,ParameterValue=$stack ParameterKey=buildid,ParameterValue=$buildid \
     --capabilities CAPABILITY_IAM
  aws cloudformation --region $region wait stack-update-complete --stack-name $stack-$stage
  echo "Done updating stack!"
fi
