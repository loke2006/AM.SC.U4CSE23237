# Campus Notifications Priority Inbox System

This microservice intelligently fetches, prioritizes, and maintains the top 10 campus notifications using a Min-Heap priority queue architecture.

## Project Architecture
- **Framework:** Node.js, Express.js
- **Logging:** Winston (Logs available in `logs/` directory)
- **Data Structures:** Custom Min-Heap for highly efficient Top 10 maintenance in $O(\log K)$ time.
- **Background Jobs:** In-memory interval polling to dynamically fetch notifications from the external evaluation service.

See [NotificationSystemDesign.md](./NotificationSystemDesign.md) for an in-depth explanation of the architecture and data structures.

## Setup Instructions

### 1. Prerequisites
Ensure you have Node.js (v14 or higher) installed on your system.

### 2. Installation
Navigate to the project root directory and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Ensure the `.env` file exists in the root directory. You can configure:
```env
PORT=3000
EXTERNAL_API_URL=http://20.207.122.201/evaluation-service/notifications
POLL_INTERVAL_MS=30000
```

### 4. Running Locally
To start the server:
```bash
node src/server.js
```
For development with auto-reload (requires `nodemon`):
```bash
npx nodemon src/server.js
```

## API Endpoint Examples

### Get Top 10 Notifications
Returns the top 10 ranked notifications based on Priority Weight (Placement > Result > Event) and Recency.
```http
GET /notifications/top
```
**Sample Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "ID": "d146095a-0d86-4a34-9e69-3900a14576bc",
      "Type": "Placement",
      "Message": "Placement Drive",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ]
}
```

### Get All Notifications
Returns all notifications fetched during the lifecycle of the service.
```http
GET /notifications/all
```
**Sample Response:**
```json
{
  "success": true,
  "count": 100,
  "data": [ ... ]
}
```

### Health Check
Check if the service is running.
```http
GET /health
```
**Sample Response:**
```json
{
  "success": true,
  "status": "up",
  "timestamp": "2026-05-06T00:00:00.000Z"
}
```

## Frontend Application

The frontend React application is located in `notification_app_fe`.

### Setup
```bash
cd notification_app_fe
npm install
npm run dev
```
The frontend will run exclusively on `http://localhost:3000`.

<img width="1919" height="1018" alt="image" src="https://github.com/user-attachments/assets/797a650f-2332-40f3-820e-e3b50db5baf9" />
<img width="1918" height="1013" alt="image" src="https://github.com/user-attachments/assets/415f42e5-fd6f-47ee-8074-afc3d380f562" />

