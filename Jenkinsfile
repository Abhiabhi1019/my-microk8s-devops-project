pipeline {
  agent {
    kubernetes {
      yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:latest
    tty: true

  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command: ["/busybox/cat"]
    tty: true
    volumeMounts:
      - name: kaniko-secret
        mountPath: /kaniko/.docker

  volumes:
  - name: kaniko-secret
    secret:
      secretName: regcred
'''
    }
  }

  environment {
    REGISTRY = "192.168.220.11:32000"
    IMAGE = "192.168.220.11:32000/node-app"
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

    stage('Update Helm values') {
      steps {
        sh """
          sed -i 's/tag:.*/tag: "${BUILD_NUMBER}"/' helm/node-app/values.yaml
        """
      }
    }

    stage('Commit & Push Helm update') {
      steps {
        withCredentials([sshUserPrivateKey(
          credentialsId: 'github-ssh',
          keyFileVariable: 'SSH_KEY'
        )]) {
          sh '''
            git config user.email "jenkins@ci"
            git config user.name "Jenkins CI"
            git add helm/node-app/values.yaml
            git commit -m "ci: update image tag to ${BUILD_NUMBER}"
            git push origin main
          '''
        }
      }
    }
  }
}
