#!/bin/bash


display_usage() {
    echo ""
    echo "If no --prod flag is given your stack will be deploy based on your custom aws.config."
    echo ""
    echo "scrumctrl [--prod] [-h|--help]"
    echo "  -h|--help              Displays this help."
    echo "  --prod                 Target production environment."
}


init() {
    aws cloudformation deploy --template-file template.yaml --stack-name ${StackBase} \
          --parameter-overrides S3Frontend=${S3Frontend} S3Backend=${S3Backend}
}


while test $# -gt 0; do
    case "$1" in
        -h|--help)
            display_usage
            exit 0 ;;
        --prod)
            PROD=1
            shift ;;
        *)
            display_usage
            exit 1 ;;
    esac
done


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


init

