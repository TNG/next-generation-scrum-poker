#!/bin/bash

set -eu
cd "$(dirname "${BASH_SOURCE[0]}")"
BASE_DIR=$(pwd)

display_usage() {
    echo ""
    echo "If no --prod flag is given your stack will be deploy based on your custom aws.config."
    echo ""
    echo "scrumctrl [--deploy] [-d|--delete] [--prod] [-h|--help]"
    echo "  -h|--help              Displays this help."
    echo "  --prod                 Target production environment."
    echo "  --deploy               Deploys the current code. Can be combined with --prod."
    echo "  --delete               Deletes the current deployment. Can be combined with --prod."
}

build() {
  if [[ ! -d "$1" ]]
    then
      echo "$1 is not a directory"
      exit 1
  fi
  echo
  echo "Building \"$1\":"
  cd "$1"
  rm -rf dist
  npm ci
  npm run build
  cd "$BASE_DIR"
  echo "\"$1\" built."
}

deploy(){
  build frontend
  build backend/onconnect
  build backend/ondisconnect
  build backend/sendmessage

  aws s3 sync frontend/dist s3://${S3Frontend} --delete

  sam package \
      --template-file backend/template.yaml \
      --output-template-file backend/packaged.yaml \
      --s3-bucket ${S3Backend}

  sam deploy \
      --template-file backend/packaged.yaml \
      --stack-name ${StackBackend} \
      --capabilities CAPABILITY_IAM \
      --parameter-overrides TableName=${tablename} \
          BaseDomain=${basedomainname} \
          SubDomain=${subdomainname} \
          CertificateArn=${certificate} \
          CloudFrontCertificate=${cloudfrontcertificate} \
          S3Frontend=${S3Frontend}
}

delete() {
  aws cloudformation delete-stack --stack-name ${StackBackend}
}

PROD=0
DELETE=0
DEPLOY=0
while test $# -gt 0; do
    case "$1" in
        -h|--help)
            display_usage
            exit 0 ;;
        --prod)
            PROD=1
            shift ;;
        --delete)
            DELETE=1
            shift ;;
        --deploy)
            DEPLOY=1
            shift ;;
        *)
            display_usage
            exit 1 ;;
    esac
done

if [[ DELETE -eq 1 && DEPLOY -eq 1 ]] || [[ DELETE -ne 1 && DEPLOY -ne 1 ]]
  then
    echo "ERROR: you must select exactly one of \"--delete\" or \"--deploy\""
    exit 1
fi

if [[ PROD -eq 1 ]]
  then
    if source aws-prod.config
      then echo "succesfully read aws-prod.config"
      else echo "ERROR: your aws-prod.config is missing or broken"; exit 1
    fi
  else
    if source aws.config
      then echo "Succesfully read custom aws.config"
      else echo "ERROR: your custom aws.config is missing or broken"; exit 1
    fi
fi



if [[ DELETE -eq 1 ]]
  then
    delete && echo "stack deleted"
  else
    deploy
fi

