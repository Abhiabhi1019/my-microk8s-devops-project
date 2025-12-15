pipeline {
  agent {
    kubernetes {
      label 'kaniko'
      inheritFrom 'kaniko-agent'
    }
  }

  environment {
    REGISTRY = "localhost:32000"
    IMAGE = "${REGISTRY}/node-app"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build image with Kaniko') {
      steps {
        container('kaniko') {
          sh """
          /kaniko/executor \
            --context $WORKSPACE \
            --dockerfile Dockerfile \
            --destination ${IMAGE}:${BUILD_NUMBER} \
            --insecure \
            --skip-tls-verify
          """
        }
      }
    }
  }
}
