pipeline {
  agent any
    environment {
      PROJECT_NAME = "buy01"
        PROJECT_VERSION = ""
        NEXUS_DOCKER_REPO = "161.35.24.93:8082/repository/buy02-docker-images"
        NEXUS_DOCKER_LOGIN_CONN = "161.35.24.93:8082"
    }
  stages {
    // stage('Run Tests: User Service') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('user-service') {
    //       sh 'mvn test'
    //     }
    //   }
    // }
    // stage('Run Tests: Product Service') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('product-service') {
    //       sh 'mvn test'
    //     }
    //   }
    // }
    // stage('Run Tests: Media Service') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('media-service') {
    //       sh 'mvn test'
    //     }
    //   }
    // }
    // stage('Run Tests: Order Service') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('order-service') {
    //       sh 'mvn test'
    //     }
    //   }
    // }
    // stage('Run Tests: Angular') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('angular') {
    //       sh 'export CHROME_BIN=/usr/bin/google-chrome'
    //         sh 'npm install'
    //         sh 'ng test --watch=false --progress=false --browsers ChromeHeadless'
    //     }
    //   }
    // }
    // stage('User Service SonarQube Analysis & Quality Gate') {
    //   steps {
    //     script {
    //       dir('user-service') {
    //         withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
    //           withSonarQubeEnv('peter droplet') {
    //             sh 'mvn clean compile'
    //               sh """
    //               mvn sonar:sonar \
    //               -Dsonar.projectKey=buy-01-user-service \
    //               -Dsonar.host.url=http://64.226.78.45:9000 \
    //               -Dsonar.token=$SONAR_AUTH_TOKEN
    //               """
    //           }
    //         }
    //         timeout(time: 1, unit: 'HOURS') {
    //           waitForQualityGate abortPipeline: true
    //         }
    //       }
    //     }
    //   }
    // }
    // stage('Product Service SonarQube Analysis & Quality Gate') {
    //   steps {
    //     script {
    //       dir('product-service') {
    //         withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
    //           withSonarQubeEnv('peter droplet') {
    //             sh 'mvn clean compile'
    //               sh """
    //               mvn sonar:sonar \
    //               -Dsonar.projectKey=buy-01-product-service \
    //               -Dsonar.host.url=http://64.226.78.45:9000 \
    //               -Dsonar.token=$SONAR_AUTH_TOKEN
    //               """
    //           }
    //         }
    //         timeout(time: 1, unit: 'HOURS') {
    //           waitForQualityGate abortPipeline: true
    //         }
    //       }
    //     }
    //   }
    // }
    // stage('Media Service SonarQube Analysis & Quality Gate') {
    //   steps {
    //     script {
    //       dir('media-service') {
    //         withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
    //           withSonarQubeEnv('peter droplet') {
    //             sh 'mvn clean compile'
    //               sh """
    //               mvn sonar:sonar \
    //               -Dsonar.projectKey=buy-01-media-service \
    //               -Dsonar.host.url=http://64.226.78.45:9000 \
    //               -Dsonar.token=$SONAR_AUTH_TOKEN
    //               """
    //           }
    //         }
    //       }
    //       timeout(time: 1, unit: 'HOURS') {
    //         waitForQualityGate abortPipeline: true
    //       }
    //     }
    //   }
    // }
    // stage('Order Service SonarQube Analysis & Quality Gate') {
    //   steps {
    //     script {
    //       dir('order-service') {
    //         withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
    //           withSonarQubeEnv('peter droplet') {
    //             sh 'mvn clean compile'
    //               sh """
    //               mvn sonar:sonar \
    //               -Dsonar.projectKey=buy-01-order-service \
    //               -Dsonar.host.url=http://64.226.78.45:9000 \
    //               -Dsonar.token=$SONAR_AUTH_TOKEN
    //               """
    //           }
    //         }
    //       }
    //       timeout(time: 1, unit: 'HOURS') {
    //         waitForQualityGate abortPipeline: true
    //       }
    //     }
    //   }
    // }
    // stage('Angular SonarQube Analysis & Quality Gate') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('angular') {
    //       sh 'npm install'
    //         sh 'ng test --watch=false --progress=false --karma-config=karma.conf.js --code-coverage'
    //         withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
    //           sh """
    //             sonar-scanner -X \
    //             -Dsonar.projectKey=buy-01-frontend \
    //             -Dsonar.host.url=http://64.226.78.45:9000 \
    //             -Dsonar.token=$SONAR_AUTH_TOKEN \
    //             -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
    //             -Dsonar.testExecutionReportPaths=reports/test-report.xml
    //             """
    //         }
    //       timeout(time: 1, unit: 'HOURS') {
    //         waitForQualityGate abortPipeline: true
    //       }
    //     }
    //   }
    // }
    stage('Deploy User Service to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('user-service') {
          sh 'mvn clean deploy -Pprod'
        }
      }
    }
    stage('Deploy Product Service to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('product-service') {
          sh 'mvn clean deploy'
        }
      }
    }
    stage('Deploy Media Service to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('media-service') {
          sh 'mvn clean deploy'
        }
      }
    }
    stage('Deploy Order Service to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('order-service') {
          sh 'mvn clean deploy'
        }
      }
    }
    stage('Deploy Frontend to Nexus') {
      agent {
        label 'master'
      }
      steps {
        dir('angular') {
          sh 'npm install'
            sh 'ng build'
            sh 'npm publish'
        }
      }
    }
    stage('Extract Version') {
      steps {
        script {
          PROJECT_VERSION = sh(script: "mvn help:evaluate -Dexpression=project.version -q -DforceStdout | sed -r 's/\\x1B\\[[0-9;]*[JKmsu]//g'", returnStdout: true).trim()
            echo "Project Version: ${PROJECT_VERSION}"
        }
      }
    }
    stage('Login to Nexus Docker Repository') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "echo ${NEXUS_PASSWORD} | docker login ${NEXUS_DOCKER_LOGIN_CONN} -u ${NEXUS_USERNAME} --password-stdin"
          }
        }
      }
    }
    stage('Build and Push Docker Images to Nexus') {
      steps {
        echo "Building and pushing user-service docker image"
          sh "docker build -t ${NEXUS_DOCKER_REPO}/user-service:${PROJECT_VERSION} -f Dockerfile-user-nexus --build-arg VERSION=${PROJECT_VERSION} ./user-service/"
          sh "docker push ${NEXUS_DOCKER_REPO}/user-service:${PROJECT_VERSION}"

          echo "Building and pushing product-service docker image"
          sh "docker build -t ${NEXUS_DOCKER_REPO}/product-service:${PROJECT_VERSION} -f Dockerfile-product-nexus --build-arg VERSION=${PROJECT_VERSION} ./product-service/"
          sh "docker push ${NEXUS_DOCKER_REPO}/product-service:${PROJECT_VERSION}"

          echo "Building and pushing media-service docker image"
          sh "docker build -t ${NEXUS_DOCKER_REPO}/media-service:${PROJECT_VERSION} -f Dockerfile-media-nexus --build-arg VERSION=${PROJECT_VERSION} ./media-service/"
          sh "docker push ${NEXUS_DOCKER_REPO}/media-service:${PROJECT_VERSION}"

          echo "Building and pushing order-service docker image"
          sh "docker build -t ${NEXUS_DOCKER_REPO}/order-service:${PROJECT_VERSION} -f Dockerfile-order-nexus --build-arg VERSION=${PROJECT_VERSION} ./order-service/"
          sh "docker push ${NEXUS_DOCKER_REPO}/order-service:${PROJECT_VERSION}"

          echo "Building and pushing frontend docker image"
          sh "docker build -t ${NEXUS_DOCKER_REPO}/frontend:${PROJECT_VERSION} -f Dockerfile-frontend-nexus --build-arg VERSION=${PROJECT_VERSION} ./angular/"
          sh "docker push ${NEXUS_DOCKER_REPO}/frontend:${PROJECT_VERSION}"
      }
    }
    stage('Upload Docker Compose File to Nexus') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'nexus', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "curl -u ${NEXUS_USERNAME}:${NEXUS_PASSWORD} --upload-file ./docker-compose-nexus.yml http://161.35.24.93:8081/repository/buy02-raw/docker-compose/docker-compose-${PROJECT_VERSION}.yml"
          }
        }
      }
    }
    stage('Deploy to Production') {
      agent {
        label 'deploy'
      }
      steps {
        script {
          sshagent(credentials: ['prod-jenkins-user']) {
            def dir = "${env.HOME}/production/buy-01"
              def gitRepo = "git@github.com:petervekony/buy-01.git"
              def rollbackVersionFile = "${env.HOME}/production/rollback_version.txt"
              // check if rollback version file exists and read it
              def lastSuccessfulCommit = ''
              if (fileExists(rollbackVersionFile)) {
                lastSuccessfulCommit = readFile(rollbackVersionFile).trim()
              }

            try {
              // normal deployment process
              if (fileExists(dir)) {
                sh "cd ${dir} && docker-compose --env-file .env.prod down --remove-orphans --volumes"
                  sleep time: 5, unit: 'SECONDS'
                  sh "docker system prune -f"
                  sh "rm -rf ~/production/buy-01"
              }

              sh "git clone ${gitRepo} ~/production/buy-01"
                sh "cd ~/production/buy-01 && git pull origin main && docker-compose --env-file .env.prod build --no-cache && docker-compose --env-file .env.prod up -d"

                // health check
                def services = ['buy-01_user-service_1', 'buy-01_product-service_1', 'buy-01_media-service_1', 'buy-01_order-service_1']
                def maxWaitTime = 180 // maximum wait time in seconds
                boolean allHealthy = false
                int elapsedTime = 0
                int checkInterval = 10 // seconds

                while(!allHealthy && elapsedTime < maxWaitTime) {
                  allHealthy = true
                    for (service in services) {
                      def healthStatus = ''
                        try {
                          healthStatus = sh(script: "docker inspect --format='{{.State.Health.Status}}' ${service}", returnStdout: true).trim()
                        } catch (Exception e) {
                          echo "Error inspecting ${service}: ${e.message}"
                            allHealthy = false
                            break
                        }
                      if (healthStatus != 'healthy') {
                        allHealthy = false
                          break
                      }
                    }
                  if (!allHealthy) {
                    sleep(checkInterval)
                      elapsedTime += checkInterval
                  }
                }

              if (allHealthy) {
                // update the rollback version file with the current commit hash
                def currentCommit = sh(script: "cd ~/production/buy-01 && git rev-parse HEAD", returnStdout: true).trim()
                  writeFile file: rollbackVersionFile, text: currentCommit
              } else {
                error("Deployment failed. Rolling back to last successful version.")
              }
            } catch (Exception e) {
              // rollback
              if (lastSuccessfulCommit) {
                echo "Rolling back to commit: ${lastSuccessfulCommit}"
                  sh "cd ${dir} && git checkout ${lastSuccessfulCommit}"
                  sh "cd ${dir} && docker-compose --env-file .env.prod build --no-cache && docker-compose --env-file .env.prod up -d"

                  // mark the build as a failure on rollback
                  currentBuild.result = 'FAILURE'
                  error("Rollback to commit ${lastSuccessfulCommit} was successful. Marking build as failure.")
              } else {
                currentBuild.result = 'FAILURE'
                  error("Rollback failed. No previous successful commit available.")
              }
            }
          }
        }
      }
    }
  }
  post {
    success {
      mail to: 'tnlmkhnn@me.com,peter.vekony@protonmail.com', 
           subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - SUCCESS",
           body: "The pipeline was a SUCCESS. Check console output at ${env.BUILD_URL} to view the results."
    }
    failure {
      mail to: 'tnlmkhnn@me.com,peter.vekony@protonmail.com', 
           subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - FAILURE",
           body: "The pipeline was a FAILURE. Check console output at ${env.BUILD_URL} to view the results."
    }
  }
}
