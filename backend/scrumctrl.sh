#!/bin/bash

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

deploy(){
  sam package \
      --template-file template.yaml \
      --output-template-file packaged.yaml \
      --s3-bucket ${bucketname}

  sam deploy \
      --template-file packaged.yaml \
      --stack-name ${stackname} \
      --capabilities CAPABILITY_IAM \
      --parameter-overrides TableName=${dynamoname} \
          BaseDomain=${basedomainname} \
          SubDomain=${subdomainname} \
          CertificateArn=${certificate}
}

delete() {
  aws cloudformation delete-stack --stack-name ${stackname}
}

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
  then echo "ERROR: you must select exactly one of \"--delete\" or \"--deploy\""; exit 1
fi

if [[ PROD -eq 1 ]]
  then if source aws-prod.config
          then echo "succesfully read aws-prod.config"
          else echo "ERROR: your aws-prod.config is missing or broken"; exit 1
        fi
  else if source aws.config
          then echo "Succesfully read custom aws.config"
          else echo "ERROR: your custom aws.config is missing or broken"; exit 1
        fi
fi



if [[ DELETE -eq 1 ]]
  then delete && echo "stack deleted"
  else deploy
fi

