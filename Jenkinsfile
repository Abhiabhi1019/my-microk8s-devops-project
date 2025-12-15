pipeline {
    agent {
        kubernetes {
            inheritFrom 'kaniko-agent'
            label 'kaniko'
        }
    }

    environment {
        REGISTRY = "localhost:32000"
        IMAGE_NAME = "myapp"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build Image') {
            steps {
                container('kaniko') {
                    sh """
                    /kaniko/executor \
                      --context . \
                      --dockerfile Dockerfile \
                      --destination $REGISTRY/$IMAGE_NAME:$IMAGE_TAG \
                      --insecure \
                      --skip-tls-verify
                    """
                }
            }
        }
    }
}
