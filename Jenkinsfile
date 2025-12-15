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
    image: public.ecr.aws/jenkins/jenkins-agent:latest
    args: ['\$(JENKINS_SECRET)', '\$(JENKINS_NAME)']
    tty: true

  - name: kaniko
    image: public.ecr.aws/kaniko-project/executor:v1.23.2
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
