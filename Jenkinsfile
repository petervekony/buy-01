pipeline {
  agent any
    environment {
      DOCKER_REPO = 'tvntvn'
        DOCKER_PROJECT = 'buy01'
        PROJECT_NAME = "buy01"
    }
  stages {
    // stage('Media Service') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('media-service') {
    //       sh 'mvn test'
    //     }
    //   }
    // }
    // stage('User Service') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('user-service') {
    //       sh 'mvn test'
    //     }
    //   }
    // }
    // stage('Product Service') {
    //   agent {
    //     label 'master'
    //   }
    //   steps {
    //     dir('product-service') {
    //       sh 'mvn test'
    //     }
    //   }
    // }
    // stage('Angular') {
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
            if (fileExists('~/production/buy-01')) {
              sh 'docker-compose down -f ~/production/buy-01/docker-compose.yml --remove-orphans --volumes'
                sleep time: 15, unit: 'SECONDS'
            }
            // sh "docker pull ${DOCKER_REPO}/${DOCKER_PROJECT}:media_latest"
            //   sh "docker pull ${DOCKER_REPO}/${DOCKER_PROJECT}:user_latest"
            //   sh "docker pull ${DOCKER_REPO}/${DOCKER_PROJECT}:product_latest"
            //   sh "docker pull ${DOCKER_REPO}/${DOCKER_PROJECT}:angular_latest"

              sh 'rm -rf ~/production/buy-01'
              sh "git clone git@github.com:petervekony/buy-01.git ~/production/buy-01"
              sh "cd ~/production/buy-01 && git pull origin main"

              sh "docker-compose up -d"
          }
        }
      }
    }
  } 
  post {
    always{
      sh 'docker logout'
    }
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
