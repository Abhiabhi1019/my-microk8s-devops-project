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
    image: gcr.io/kaniko-project/executor:latest
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
    GIT_CRED_ID = 'github-ssh'   // Jenkins credential ID for pushing to GitHub (SSH)
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
          // Kaniko expects /workspace to be context path; provide build context as working dir
          sh """
          /kaniko/executor \\
            --context `pwd` \\
            --dockerfile Dockerfile \\
            --destination ${IMAGE}:${BUILD_NUMBER} \\
            --insecure \\
            --skip-tls-verify
          """
        }
      }
    }

    stage('Update Helm values and push') {
      steps {
        container('jnlp') {
          sh """
          # update the helm-chart/values.yaml tag
          yq eval '.image.tag = \"${BUILD_NUMBER}\"' -i helm-chart/values.yaml || \
            (sed -E \"s/tag: .*/tag: \\\"${BUILD_NUMBER}\\\"/\" -i helm-chart/values.yaml)
          
          git config user.email "jenkins@local"
          git config user.name "jenkins"
          git add helm-chart/values.yaml
          git commit -m \"ci: bump image tag to ${BUILD_NUMBER}\" || true

          # push via SSH agent (configure Jenkins credential)
          GIT_SSH_COMMAND='ssh -o StrictHostKeyChecking=no' git push origin HEAD:main || true
          """
        }
      }
    }
  }
}
