pipeline {
    agent any

	environment {
		CI=false
	}

	stages {
        /*stage('Build') {
			when {
				expression {
					return env.GIT_BRANCH == 'origin/develop'
				}
			}
			steps {
				updateGitlabCommitStatus(name: 'build', state: 'pending')
				checkout scm
				echo 'Pulling... ' + env.GIT_BRANCH
				echo 'Git url: ' + scm.userRemoteConfigs[0].url
				updateGitlabCommitStatus(name: 'build', state: 'running') 
				nodejs(nodeJSInstallationName: 'nodejs-lts') {
					sh 'yarn'
                	sh 'yarn build'
				}
			}
			post {
				failure {
					updateGitlabCommitStatus(name: 'build', state: 'failed')
				}
				success {
					updateGitlabCommitStatus(name: 'build', state: 'success')
				}
			}
        }*/
        
		stage('Publish Dev') {
			when {
				expression {
					return env.GIT_BRANCH == 'origin/develop'
				}
			}
			steps {
				updateGitlabCommitStatus(name: 'deploy', state: 'pending')
				updateGitlabCommitStatus(name: 'deploy', state: 'running')

				withCredentials([usernamePassword(credentialsId: 'abc-registry-jenkins', passwordVariable: 'dockerPass', usernameVariable: 'dockerUser')]) {
					sh "docker login --username $dockerUser --password '$dockerPass' abc-registry.abcsoft.vn"
					sh "docker build -t storefront-web-dev:${env.BUILD_NUMBER} ."
					sh "docker tag storefront-web-dev:${env.BUILD_NUMBER} storefront-web-dev:latest"
					sh "docker tag storefront-web-dev:${env.BUILD_NUMBER} abc-registry.abcsoft.vn/storefront/storefront-web-dev:${env.BUILD_NUMBER}"
					sh "docker push abc-registry.abcsoft.vn/storefront/storefront-web-dev:${env.BUILD_NUMBER}"

					sshagent(credentials : ['ssh-67-server']) {
						sh "ssh -p 1854 abcsoft@123.30.145.67 docker login --username $dockerUser --password '$dockerPass' abc-registry.abcsoft.vn"
						sh "ssh -p 1854 abcsoft@123.30.145.67 docker pull abc-registry.abcsoft.vn/storefront/storefront-web-dev:${env.BUILD_NUMBER}"
						sh "ssh -p 1854 abcsoft@123.30.145.67 docker container stop StorefrontWebDev || true && ssh -p 1854 abcsoft@123.30.145.67 docker container rm StorefrontWebDev || true"
						sh "ssh -p 1854 abcsoft@123.30.145.67 docker run -d -p 10100:3000 --name StorefrontWebDev --env ASPNETCORE_ENVIRONMENT=Staging abc-registry.abcsoft.vn/storefront/storefront-web-dev:${env.BUILD_NUMBER}"
					}
				}
			}
			post {
				failure {
					updateGitlabCommitStatus(name: 'deploy', state: 'failed')
				}
				success {
					updateGitlabCommitStatus(name: 'deploy', state: 'success')
				}
			}
		}
    }
	post {
		always {
			cleanWs()
		}
	}
}
