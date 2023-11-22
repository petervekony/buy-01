pipeline {
  agent any
    environment {
      PROJECT_NAME = "buy01"
        // SONAR_AUTH_TOKEN = credentials('sonarqube')
    }
  stages {
    stage('Run Tests: Media Service') {
      agent {
        label 'master'
      }
      steps {
        dir('media-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: User Service') {
      agent {
        label 'master'
      }
      steps {
        dir('user-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Product Service') {
      agent {
        label 'master'
      }
      steps {
        dir('product-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Run Tests: Angular') {
      agent {
        label 'master'
      }
      steps {
        dir('angular') {
          sh 'export CHROME_BIN=/usr/bin/google-chrome'
            sh 'npm install'
            sh 'ng test --watch=false --progress=false --browsers ChromeHeadless'
        }
      }
    }
    // THIS PART FOR THE SONARQUBE, NOT NEEDED FOR MR-JENK
    // stage('SonarQube Analysis') {
    //   steps {
    //     script {
    //     withSonarQubeEnv('peter droplet') {
    //       sh """
    //         mvn sonar:sonar \
    //         -Dsonar.projectKey=buy-01 \
    //         -Dsonar.host.url=http://64.226.78.45:9000 \
    //         -Dsonar.login=${SONAR_AUTH_TOKEN}
    //       """
    //       }
    //     }
    //   }
    // }
    // stage('Angular Analysis') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('angular') {
    //       sh 'npm install'
    //         sh 'ng test --watch=false --progress=false --karma-config=karma.conf.js --code-coverage'
    //         sh """
    //         sonar-scanner \
    //         -Dsonar.projectKey=buy-01-frontend \
    //         -Dsonar.host.url=http://64.226.78.45:9000 \
    //         -Dsonar.login=${SONAR_AUTH_TOKEN} \
    //         -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
    //         -Dsonar.testExecutionReportPaths=test-results/test-report.xml
    //         """
    //     }
    //   }
    // }
    // stage('Quality Gate') {
    //   steps {
    //     timeout(time: 1, unit: 'HOURS') {
    //       waitForQualityGate abortPipeline: true
    //     }
    //   }
    // }   
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
                def services = ['buy-01_user-service_1', 'buy-01_product-service_1', 'buy-01_media-service_1']
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
