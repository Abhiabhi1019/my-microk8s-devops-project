pipeline {
  agent {
    kubernetes {
      defaultContainer 'jnlp'
      yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins
  containers:
  - name: jnlp
    image: docker.io/jenkins/inbound-agent:latest
    tty: true

  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    command:
      - /busybox/cat
    tty: true
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker

  volumes:
  - name: kaniko-secret
    secret:
      secretName: regcred
"""
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

    stage('Build & Push Image') {
      steps {
        container('kaniko') {
          sh """
          /kaniko/executor \
            --context \$(pwd) \
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
