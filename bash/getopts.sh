#!/bin/bash

unset stage region

usage()
{
  echo "usage: $0 [ -s stage ] [ -r region ]"
  exit 2
}

set_variable()
{
  local varname=$1
  shift
  if [ -z "${!varname}" ]; then
    eval "$varname=\"$@\""
  else
    echo "Error: $varname already set"
    usage
  fi
}

while getopts 's:r:?h' c
do
  case $c in
    s) set_variable stage $OPTARG ;;
    r) set_variable region $OPTARG ;;
    h|?) usage ;; esac
done

[ -z "$stage" ] || [ -z "$region" ] && usage
