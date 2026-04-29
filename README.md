# Student Record Management

## Description

A full-stack, lightweight web application designed to create, read, update, and delete (CRUD) student records efficiently. Built without heavy frontend frameworks, this project demonstrates a highly optimized serverless architecture designed explicitly for Vercel deployments. It solves the need for a fast, responsive, and easily maintainable student directory system with centralized MongoDB storage.

## Live Demo

- **Frontend / Application URL**: [https://student-record-management-frontend.vercel.app/](https://student-record-management-frontend.vercel.app/)
- **API Base URL**: `https://student-record-management-virid.vercel.app/api/students`

## Features

- **Stateless Serverless Backend**: Optimized Express.js API customized for Vercel edge/serverless execution.
- **Client-Side SPA**: Pure vanilla JavaScript frontend utilizing the native `fetch` API for asynchronous state updates without page reloads.
- **Smart DB Connection Pooling**: Prevents MongoDB connection exhaustion and cold-start timeouts in ephemeral serverless environments.
- **Unified Routing**: Transparent `vercel.json` routing configuration that serves both a static frontend and dynamic API from the same domain seamlessly.
- **Global Error Handling**: Centralized error middleware and async route wrappers for resilient API failure states.
- **Data Validation**: Enforced unique `student_id` constraints and required payload schema validation.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend Environment**: Node.js, Express.js (^5.2.1)
- **Database**: MongoDB, Mongoose (^9.6.0)
- **Middleware / Utilities**: CORS, cookie-parser, morgan, dotenv
- **Hosting / Infrastructure**: Vercel Serverless Functions

## Architecture Overview

The backend follows a strict layered MVC-like architecture for separation of concerns and maintainability:

- **Routes (`sudent.routes.js`)**: Intercepts HTTP requests and maps them to appropriate controllers. Uses an `asyncHandler` wrapper to automatically catch and forward promise rejections to the global error middleware.
- **Controllers (`sudent.controller.js`)**: Handles HTTP request parsing, extracts parameters/body payloads, performs initial payload validation, and delegates business logic to the service layer.
- **Services (`sudent.service.js`)**: Contains the core business logic. Executes Mongoose operations against the database and abstracts DB queries away from the HTTP layer.
- **Models (`student.model.js`)**: Defines the MongoDB schema using Mongoose (Fields: `student_name`, `student_id`, `phone`) and enables Mongoose timestamps.

## Project Structure

```text
student-record-management/
├── api/
│   └── index.js                 # Vercel serverless entry point
├── client/
│   ├── index.html               # Frontend UI
│   ├── script.js                # Vanilla JS API integration
│   └── style.css                # Responsive UI styling
├── server/
│   └── src/
│       ├── app.js               # Express application configuration
│       ├── routes.js            # Main API router registry
│       ├── server.js            # Local development server entry
│       ├── config/
│       │   ├── db.js            # Serverless-friendly MongoDB connection
│       │   └── env.js           # Environment variable initialization
│       ├── module/
│       │   └── student/
│       │       ├── student.model.js
│       │       ├── sudent.controller.js
│       │       ├── sudent.routes.js
│       │       └── sudent.service.js
│       └── shared/
│           ├── middlewares/
│           │   └── error.middleware.js
│           └── utils/
│               ├── asyncHandler.js
│               └── error.js
├── .env
├── package.json
└── vercel.json                  # Vercel deployment routing configurations
```

## API Documentation

### Base URL: `/api/students`

#### 1. Get All Students

- **Endpoint**: `/`
- **Method**: `GET`
- **Response Format**:
  ```json
  [
    {
      "_id": "64abcdef1234567890",
      "student_name": "John Doe",
      "student_id": "S1001",
      "phone": "123-456-7890",
      "createdAt": "2026-04-29T10:00:00.000Z",
      "updatedAt": "2026-04-29T10:00:00.000Z"
    }
  ]
  ```

#### 2. Create Student

- **Endpoint**: `/`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "student_name": "John Doe",
    "student_id": "S1001",
    "phone": "123-456-7890"
  }
  ```
- **Response Format**: Returns the created student object.

#### 3. Update Student

- **Endpoint**: `/:id` (MongoDB `_id`)
- **Method**: `PUT`
- **Request Body** (All fields optional):
  ```json
  {
    "student_name": "Jane Doe",
    "phone": "098-765-4321"
  }
  ```
- **Response Format**: Returns the updated student object.

#### 4. Delete Student

- **Endpoint**: `/:id` (MongoDB `_id`)
- **Method**: `DELETE`
- **Response Format**:
  ```json
  {
    "message": "Student deleted Successfully"
  }
  ```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=developement
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/studentDB
```

## Local Setup Instructions

### Backend Setup

1. Clone the repository.
2. Run `npm install` in the root directory.
3. Configure the `.env` file with your MongoDB credentials.
4. Run the local development server:
   ```bash
   npm run dev
   ```
   _The server will start on port 5000, connected to your MongoDB instance._

### Frontend Setup

Since the frontend uses vanilla HTML/CSS/JS without a build step:

1. Open the `/client/index.html` file directly in your web browser via `file://`.
2. Alternatively, serve the project root using a static server like Live Server or Python's `http.server`.
   _(Note: Because CORS is enabled on the backend, the frontend will successfully communicate with the local `localhost:5000` API out of the box)._

## Deployment Notes

This project is explicitly tailored for **Vercel** serverless environments.

- **Serverless Entry Point**: The file `api/index.js` exports the raw Express `app` instance. Vercel automatically detects the `/api` directory and wraps exported functions into AWS Lambdas.
- **Vercel Routing (`vercel.json`)**: Vercel routes `/api/(.*)` requests directly to `api/index.js`. Simultaneously, it rewrites root requests `/(.*)` to the `/client/$1` directory. This allows Vercel to serve both the static vanilla JS frontend and dynamic Express backend under the same domain without conflict.
- **Express Base Path**: The Express server implements `app.use("/api", routes)` to accurately mirror Vercel's edge network routing, ensuring parity between local testing and production execution.
- **Database Handling**: Ephemeral serverless functions can quickly exhaust MongoDB connection pools. The `server/src/config/db.js` logic evaluates `mongoose.connection.readyState >= 1` to reuse warm connections, avoiding `process.exit(1)` crashes which ordinarily result in persistent 502/504 errors on Vercel.

## Challenges & Solutions

1. **Challenge**: Vercel 504 Gateway Timeouts and API crashes during MongoDB initialization.
   - **Solution**: Removed native `process.exit(1)` calls inside the Mongoose connection catch block, which inherently killed the Vercel function. Implemented connection readiness checks to recycle warm connections across multiple stateless invocations.
2. **Challenge**: 404 Routing errors between the Express app and Vercel's directory structure.
   - **Solution**: Express expects `/students` routes, but Vercel forwards requests as `/api/students`. Explicitly mounted the base Express router to `/api` and implemented `vercel.json` rewrites to synchronize the path resolution.
3. **Challenge**: Frontend validation failing against backend payload expectations ("All fields are required").
   - **Solution**: Standardized schema variable naming conventions (`student_name` vs `name`) across the client fetch payload and the controller's request body destructuring logic.

## Future Improvements

- **Pagination**: Implement skip/limit pagination on the `GET /api/students` endpoint to ensure fast load times as the MongoDB collection scales.
- **Input Sanitization**: Introduce libraries like `xss-clean` or `express-mongo-sanitize` to actively prevent NoSQL injection attacks.
- **Request Validation**: Add a robust validation middleware (e.g., Zod or Joi) before the controller layer to strictly type-check incoming payloads.
- **Rate Limiting**: Integrate `express-rate-limit` to protect the serverless endpoints from DDOS or excessive function invocations.
