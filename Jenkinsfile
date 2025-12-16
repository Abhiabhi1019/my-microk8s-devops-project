stage('Build & Push Image') {
  steps {
    container('kaniko') {
      sh '''
      /kaniko/executor \
        --context $(pwd) \
        --dockerfile Dockerfile \
        --destination ${IMAGE}:${BUILD_NUMBER} \
        --insecure \
        --skip-tls-verify
      '''
    }
  }
}
