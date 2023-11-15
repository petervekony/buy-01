pipeline {
  agent any
    environment {
      DOCKER_REPO = 'tvntvn'
        DOCKER_PROJECT = 'buy01'
          PROJECT_NAME = "buy01"
      SONAR_AUTH_TOKEN = credentials('sonarqube_token')
    }
  stages {
    stage('Media Service') {
      agent {
        label 'master'
      }
      steps {
        dir('media-service') {
          sh 'mvn test'
        }
      }
    }
    stage('User Service') {
      agent {
        label 'master'
      }
      steps {
        dir('user-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Product Service') {
      agent {
        label 'master'
      }
      steps {
        dir('product-service') {
          sh 'mvn test'
        }
      }
    }
    stage('Angular') {
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
    stage('SonarQube Analysis') {
      steps {
        script {
          sh """
            mvn sonar:sonar \
            -Dsonar.projectKey=your_project_key \
            -Dsonar.host.url=http://your.sonarqube.server:9000 \
            -Dsonar.login=${SONAR_AUTH_TOKEN}
          """
        }
      }
    }
    // stage('Build Docker Images') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     script {
    //       sh 'docker build -f media-service/Dockerfile -t "${DOCKER_REPO}/${DOCKER_PROJECT}:media_latest" .'
    //         sh 'docker build -f user-service/Dockerfile -t "${DOCKER_REPO}/${DOCKER_PROJECT}:user_latest" .'
    //         sh 'docker build -f product-service/Dockerfile -t "${DOCKER_REPO}/${DOCKER_PROJECT}:product_latest" .'
    //         sh 'docker build -f angular/Dockerfile -t "${DOCKER_REPO}/${DOCKER_PROJECT}:angular_latest" .'
    //     }
    //   }
    // }
    // stage('Push to docker hub'){
    //   agent {
    //     label 'master'
    //   }
    //   steps{
    //     withCredentials([usernamePassword(credentialsId: 'dockerhub2', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
    //       sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
    //         sh 'docker push "${DOCKER_REPO}/${DOCKER_PROJECT}:media_latest"'
    //         sh 'docker push "${DOCKER_REPO}/${DOCKER_PROJECT}:user_latest"'
    //         sh 'docker push "${DOCKER_REPO}/${DOCKER_PROJECT}:product_latest"'
    //         sh 'docker push "${DOCKER_REPO}/${DOCKER_PROJECT}:angular_latest"'
    //     }
    //   }
    // }
    // stage('Cleaning up'){
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     script {
    //       def images = sh(script: 'docker images -q "${DOCKER_REPO}/${DOCKER_PROJECT}*"', returnStdout: true).trim()
    //         images.split('\n').each { imageId ->
    //           try {
    //             sh "docker rmi $imageId"
    //           } catch (Exception e) {
    //             echo "Failed to remove image $imageId: ${e.message}"
    //               // do something or just log it
    //           }
    //         }
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
                def maxWaitTime = 300 // maximum wait time in seconds
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
    always{
      sh 'docker logout'
    }
    // success {
    //   mail to: 'tnlmkhnn@me.com,peter.vekony@protonmail.com', 
    //        subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - SUCCESS",
    //        body: "The pipeline was a SUCCESS. Check console output at ${env.BUILD_URL} to view the results."
    // }
    // failure {
    //   mail to: 'tnlmkhnn@me.com,peter.vekony@protonmail.com', 
    //        subject: "Pipeline ${env.PROJECT_NAME} - Build # ${env.BUILD_NUMBER} - FAILURE",
    //        body: "The pipeline was a FAILURE. Check console output at ${env.BUILD_URL} to view the results."
    // }
  }
}
