pipeline {
  agent {
    kubernetes {
      label 'kaniko-agent'
      defaultContainer 'jnlp'
      yaml """
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: jenkins
  containers:
  - name: jnlp
    image: jenkins/inbound-agent:4.11-4
    tty: true

  - name: kaniko
    image: public.ecr.aws/kaniko-project/executor:latest
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

    stage('Build & Push Image (Kaniko)') {
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
        container('jnlp') {
          sh """
          sed -i 's/tag:.*/tag: "${BUILD_NUMBER}"/' helm-chart/values.yaml

          git config user.email "jenkins@local"
          git config user.name "jenkins"
          git add helm-chart/values.yaml
          git commit -m "ci: update image tag to ${BUILD_NUMBER}" || true
          """
        }
      }
    }

    stage('Push to GitHub') {
      steps {
        container('jnlp') {
          withCredentials([sshUserPrivateKey(credentialsId: 'github-ssh', keyFileVariable: 'SSH_KEY')]) {
            sh """
            eval \$(ssh-agent -s)
            ssh-add \$SSH_KEY
            git push origin HEAD:main
            """
          }
        }
      }
    }
  }
}
