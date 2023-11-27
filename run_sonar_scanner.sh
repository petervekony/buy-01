#!/bin/bash

# Move to the specified directory
cd $1

# Shift the first argument so that $@ contains only the sonar-scanner arguments
shift

# Run SonarScanner with all remaining arguments
sonar-scanner "$@"

# Move to the specified directory
cd $1

# Run SonarScanner with the provided arguments
sonar-scanner -X $2
