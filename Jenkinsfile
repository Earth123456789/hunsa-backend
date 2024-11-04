pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'earth123456789/hunsabackend:latest'
        DOCKER_CREDENTIALS = credentials('dockerhub')
    }

    stages {
        stage('Start Jenkins') {
            steps {
                // Logging for debugging purposes
                echo 'Start Jenkins............'
                echo "docker : user = ${DOCKER_CREDENTIALS_USR} : password = ${DOCKER_CREDENTIALS_PSW}"
            }
        }

        stage('Checkout Code') {
            steps {
                script {
                    // Checkout source code from repository
                    echo 'Checking out code...'
                    git url: 'https://github.com/Earth123456789/hunsa-backend.git', branch: 'main'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    // Build Docker image for backend
                    echo 'Building backend Docker image...'
                    sh 'docker build -t $DOCKER_IMAGE_BACKEND .'
                }
            }
        }

        stage('Push Backend Docker Image to Docker Hub') {
            steps {
                script {
                    // Push backend Docker image to Docker Hub
                    echo 'Pushing backend Docker image to Docker Hub...'
                    sh 'echo $DOCKER_CREDENTIALS_PSW | docker login --username $DOCKER_CREDENTIALS_USR --password-stdin'
                    sh 'docker push $DOCKER_IMAGE_BACKEND'
                }
            }
        }

        stage('Start Docker Compose') {
            steps {
                script {
                    // Start services using Docker Compose
                    echo 'Starting services with Docker Compose...'
                    sh 'docker-compose -f docker-compose.yml up --build -d'
                }
            }
        }
    }

    post {
        always {
            // Logout from Docker Hub
            sh 'docker logout'
        }
    }
} 