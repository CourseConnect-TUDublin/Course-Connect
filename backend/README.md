# Course Connect Backend

This is the backend server for Course Connect, built with Express.js and Socket.IO.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/course-connect
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Start MongoDB (make sure it's installed and running)

4. Run the development server:
```bash
npm run dev
```

The server will be available at http://localhost:4000.

## Project Structure

- `server.js` - Main Express server setup
- `socket.js` - Socket.IO real-time communication setup
- `models/` - MongoDB models and schemas
- `routes/` - API route handlers
- `middleware/` - Express middleware

## Available Scripts

- `npm run start` - Start production server
- `npm run dev` - Start development server with nodemon 