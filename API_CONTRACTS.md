## Task API Endpoints

### GET /api/tasks
- Returns: `[ { id, title, description, completed, createdAt, updatedAt } ]`

### POST /api/tasks
- Body: `{ title: String, description: String }`
- Returns: `201 Created { new Task object }`

### PUT /api/tasks/:id
- Body: `{ title?, description?, completed? }`
- Returns: `{ updated Task object }`

### DELETE /api/tasks/:id
- Returns: `204 No Content`
