pipeline {
  agent any

  stages {
    stage('Instalar dependencias') {
      steps {
        sh 'npm install'
      }
    }

    stage('Ejecutar pruebas') {
      steps {
        sh 'npm test'
      }
    }

    stage('Desplegar') {
      steps {
        echo 'Aquí se haría el despliegue (por ejemplo, copiar archivos al servidor o subir a Netlify)'
        // sh './deploy.sh' (si tienes uno)
      }
    }
  }

  post {
    success {
      echo '✅ Todo correcto.'
    }
    failure {
      echo '❌ Fallaron las pruebas.'
    }
  }
}
