# Meditation App Documentation

## Overview
The Meditation App is a full-stack web application that allows users to record and share their meditation experiences. Users can create posts with text content, images, and location data, interact with other users' posts through comments, and explore meditation experiences from around the world.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Container**: Docker
- **Orchestration**: Kubernetes
- **Authentication**: Passport.js with Local Strategy
- **Testing**: Jest, Supertest
- **CI/CD**: GitHub Actions

## Project Structure
```
meditation-app/
├── src/
│   ├── client/           # React frontend code
│   ├── routes/           # Express route handlers
│   ├── models/           # Sequelize models
│   ├── config/          # Configuration files
│   └── app.js           # Main application entry
├── views/               # EJS templates
├── public/             # Static assets
├── k8s/                # Kubernetes configurations
└── docker/             # Docker configurations
```

## Key Features

### 1. User Authentication
- User registration and login system
- Session-based authentication
- Password hashing using bcrypt
- Implementation can be found in `src/routes/users.js`

### 2. Blog Post Creation
- Rich text editing using TipTap editor
- Multiple image upload support (up to 5 images per post)
- Location tagging with Google Maps integration
- Implementation details in `src/routes/blog.js` and `src/client/blog/Create/CreatePost.js`

### 3. Database Schema
- Users table with UUID primary keys
- Posts table with location support
- Comments and Images tables with proper relationships
- Models and associations defined in `src/models/` directory

### 4. Testing Infrastructure
- Unit tests for models and utilities
- Integration tests for API endpoints
- Test environment configuration
- Separate SQLite database for testing
- Coverage reporting

### 5. CI/CD Pipeline
- Automated testing on push and pull requests
- Docker image building and publishing
- Multi-architecture support (amd64/arm64)
- Automated deployment workflow

## Development Setup

1. Clone the repository
```bash
git clone https://github.com/Ziqiao-git/meditation-app.git
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables in `.env` file
```
DB_HOST=localhost
NODE_ENV=development
GOOGLE_MAPS_API_KEY=your_api_key
```

4. Start the development server
```bash
npm run devStart
```

## Deployment

### Docker Configuration
- Dockerfile available in project root
- Uses Node.js 20-slim as base image
- Includes necessary directory setup and dependency installation
- See `Dockerfile` for implementation details

### Kubernetes Deployment
The application uses several Kubernetes configurations:

1. App Deployment (`k8s/app-development.yaml`)
   - Single replica deployment
   - Environment configuration
   - Volume mounts for uploads

2. MySQL Deployment (`k8s/mysql-deployment.yaml`)
   - Persistent volume for data storage
   - Root password configuration
   - Native password authentication

3. Services (`k8s/app-service.yaml`)
   - LoadBalancer type service
   - Port 3000 exposed

### Deployment Commands
```bash
# Build and deploy
docker build -t meditation-app:latest .
kubectl apply -f k8s/app-development.yaml
kubectl apply -f k8s/app-service.yaml

# Verify deployment
kubectl get pods -l app=meditation-app
kubectl port-forward service/meditation-app-service 3000:3000
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the ISC License.

## Author
Ziqiao Xi

For more information or issues, please visit the [GitHub repository](https://github.com/Ziqiao-git/meditation-app).
