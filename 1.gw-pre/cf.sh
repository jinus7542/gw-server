#!/bin/bash

source `dirname "../bash/$BASH_SOURCE"`/getopts.sh

stack="gw-pre"

# Returns the status of a stack
getstatus() {
	aws cloudformation describe-stacks --region $region --stack-name $1 --query Stacks[].StackStatus --output text 2>/dev/null
}

# Deploy the resources with CloudFromation
status=$(getstatus $stack-$stage)
if [ -z "$status" ]; then
  echo "Creating $stack-$stage stack (this will take some time)..."
  aws cloudformation --region $region create-stack --stack-name $stack-$stage \
      --template-body file://template.yaml \
      --parameters ParameterKey=stage,ParameterValue=$stage ParameterKey=stack,ParameterValue=$stack \
      --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
  aws cloudformation --region $region wait stack-create-complete --stack-name $stack-$stage
  echo "Done creating stack!"
else
  echo "Updating $stack-$stage stack (this will take some time)..."
  aws cloudformation --region $region update-stack --stack-name $stack-$stage \
     --template-body file://template.yaml \
     --parameters ParameterKey=stage,ParameterValue=$stage ParameterKey=stack,ParameterValue=$stack \
     --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
  aws cloudformation --region $region wait stack-update-complete --stack-name $stack-$stage
  echo "Done updating stack!"
fi

echo "You need to set this Role ARN to the cloudwatch agent configuration in /__build/server/$stage/amazon-cloudwatch-agent.json:"
echo $(aws cloudformation --region $region describe-stacks --stack-name $stack-$stage --query "Stacks[0].Outputs[0].OutputValue")
echo ""
echo "You need this identityPoolID in Global.cs:"
echo $(aws cloudformation --region $region describe-stacks --stack-name $stack-$stage --query "Stacks[0].Outputs[1].OutputValue")
