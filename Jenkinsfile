pipeline {
    agent any

    tools {
        nodejs "Node24"            // Node.js instalado desde Jenkins (global tool config)
        dockerTool 'Dockertool'    // Si usas Docker también
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar pruebas') {
            steps {
                // Asegura que jest pueda ejecutarse aunque esté en node_modules
                sh 'npx jest'
            }
        }

        stage('Construcción de imagen Docker (opcional)') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                // Esto es opcional si vas a dockerizar la pasarela
                sh 'docker build -t pasarela-static:latest .'
            }
        }

        stage('Despliegue (opcional)') {
            when {
                expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
            }
            steps {
                // Simula despliegue local
                sh '''
                    docker stop pasarela-static || true
                    docker rm pasarela-static || true
                    docker run -d --name pasarela-static -p 8082:80 pasarela-static:latest
                '''
            }
        }
    }

    post {
        failure {
            echo '❌ Las pruebas fallaron o algo salió mal.'
        }
        success {
            echo '✅ Pipeline ejecutado correctamente.'
        }
    }
}
