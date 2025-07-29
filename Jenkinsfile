pipeline {
    agent any

    tools {
        nodejs "Node24"            // Nombre de tu instalación Node.js en Jenkins
        dockerTool 'Dockertool'    // Nombre de tu instalación Docker en Jenkins
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar pruebas') {
            steps {
                sh 'npx jest'
            }
        }

        stage('Construcción de imagen Docker (opcional)') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh 'docker build -t pasarela-static:latest .'
            }
        }

        stage('Despliegue (opcional)') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                sh '''
                    docker stop pasarela-static || true
                    docker rm pasarela-static || true
                    docker run -d --name pasarela-static -p 8081:80 pasarela-static:latest
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline ejecutado correctamente.'
        }
        failure {
            echo '❌ Las pruebas fallaron o algo salió mal.'
        }
    }
}
