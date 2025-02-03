# API Contracts  
## Task Management  
### Create a Task  
**Endpoint**: `POST /api/task`  
**Request Body**:  
```json
{
  "title": "Complete Assignment",
  "course": "COMP101",
  "dueDate": "2024-12-01T23:59:00Z"
}