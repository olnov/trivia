# Trivia Game Application

This is a full-stack Trivia Game application built with a SpringBoot backend and React frontend. The application allows users to register, login and participate in a trivia quiz. It also includes a leaderboard to track users' scores.

## Features

- User Authentication (Signup/Login)
- Trivia Game with multiple-choice questions
- Leaderboard to display top scores
- RESTful API integration for user and game management
- Dynamic question fetching from the Open Trivia Database
- Responsive design

## Tech Stack

### Backend (API)
- Java
- Spring Boot
- JPA/Hibernate
- H2 Database (for development)
- REST API

### Frontend (UI)
- React.js
- JavaScript (ES6+)
- CSS Modules

## Backend Structure

- **Controllers**: Handles incoming requests and routes them to appropriate services
  - `HelloController.java`: Basic greeting endpoint
  - `ScoresController.java`: Manages scores for the trivia game
  - `UserController.java`: Handles user authentication and management
- **Models**: Entity classes that represent the data
  - `Game.java`: Represents a trivia game session
  - `GameQuestion.java`: Represents a trivia question
  - `User.java`: Represents a user of the application
- **Repositories**: Interfaces for database access
  - `GameRepository.java`: Handles CRUD operations for the `Game` model
  - `GameQuestionRepository.java`: Handles CRUD operations for `GameQuestion`
  - `UserRepository.java`: Handles user-related database operations
- **Security**: Basic authentication and security setup in `TriviaApplication.java`
- **Database Migration**: 
  - SQL schema defined in `V1__initial_db_schema.sql`

### Frontend Structure

- **Pages**:
  - `Game.jsx`: Handles the trivia game logic and UI
  - `Home.jsx`: Homepage of the application
  - `Leaderboard.jsx`: Displays top scores
  - `Login.jsx`: User login form
  - `Signup.jsx`: User registration form
  - `Users.jsx`: Displays a list of users (Admin functionality)
- **Services**:
  - `GameService.js`: Fetches trivia questions from an external API&#8203;:contentReference[oaicite:0]{index=0}
  - `UserService.js`: Handles user-related requests (login, signup, fetching users)&#8203;:contentReference[oaicite:1]{index=1}
- **CSS**:
  - `App.css`: General styles for the app including layout and animations&#8203;:contentReference[oaicite:2]{index=2}
  - `index.css`: Global styling and theme&#8203;:contentReference[oaicite:3]{index=3}

## How to Run

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/trivia-game-backend.git
   cd trivia-game-backend
   ```


2. Build and run the Spring Boot application:
```bash
./gradlew bootRun
```


### Frontend
1. Navigate to the frontend folder:
```bash
cd trivia-frontend
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm start
```
Open http://localhost:3000 in your browser to view the application.
