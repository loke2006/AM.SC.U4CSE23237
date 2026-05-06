# Campus Notifications Priority Inbox System - System Design

## Architecture Overview
The system is built as a lightweight microservice using Node.js and Express.js. It operates independently, polling an external evaluation service for new notifications and maintaining an organized structure of the most critical notifications.

### Components
1. **Express Server:** Handles HTTP requests, routes them to controllers, and manages lifecycle.
2. **Notification Service:** A singleton service that orchestrates the polling of external APIs, maintains local state, and interacts with the priority queue.
3. **Min-Heap Data Structure:** A custom implementation of a Priority Queue that efficiently maintains the top 10 most important notifications at all times.
4. **Logging Middleware:** Reusable Winston-based logger that records application lifecycle events, API request metrics, and errors into rotating local files (`logs/app.log`, `logs/error.log`).

## Ranking Strategy
Notifications are ranked based on a composite score derived from two factors:
1. **Type Weight:** `Placement (3) > Result (2) > Event (1)`
2. **Timestamp Recency:** Newer notifications have higher priority.

**Score Calculation:**
`Score = (Weight * 1e15) + Timestamp (in milliseconds)`
This ensures that the Weight is the primary sorting key, and the Timestamp acts as a tiebreaker for notifications of the same type.

## Priority Queue Explanation (Min-Heap)
To efficiently maintain the Top 10 notifications without continuously sorting the entire dataset, we use a Min-Heap capped at a capacity of 10.
- **Why Min-Heap?** A Min-Heap keeps the *smallest* element at the root. In our case, the "smallest" element is the *lowest-priority* notification among the top 10.
- **Insertion Logic:** 
  - If the heap has fewer than 10 elements, we simply insert and heapify up.
  - If the heap has 10 elements, we compare the new notification's score to the root's score. If the new score is greater (more important), we replace the root and heapify down. This ensures we never hold more than 10 items in the heap, maintaining bounded memory.

## Complexity Analysis
- **Space Complexity:** $O(N)$ where $N$ is the total number of notifications stored for the `/all` endpoint. The Min-Heap consumes $O(K)$ space where $K = 10$.
- **Time Complexity:**
  - **Fetching & Processing:** $O(M \log K)$ where $M$ is the number of newly fetched notifications and $K = 10$. Since $K$ is constant, this is effectively $O(M)$.
  - **Retrieving Top 10:** $O(K \log K)$ to sort the heap elements before returning. Since $K = 10$, this operation is $O(1)$.
  - **Retrieving All:** $O(1)$ simply returns the reference to the array.

## Scalability Considerations & Future Improvements
Currently, the system is designed as an in-memory microservice. While highly performant for smaller scales, there are considerations for massive scale:
1. **Database Integration:** The `allNotifications` array grows unbounded. Implementing Redis or a Time-Series Database (TSDB) would prevent memory exhaustion.
2. **Horizontal Scaling:** Because state is held in-memory, horizontal scaling (running multiple instances) would result in distinct heaps per instance. Utilizing Redis Sorted Sets (`ZADD`, `ZREVRANGE`) would allow shared state across multiple Node instances.
3. **WebSockets/Server-Sent Events (SSE):** Instead of clients polling the `/top` endpoint, the server could push the updated Top 10 to connected clients in real-time.
4. **Resilience:** Add exponential backoff to the external API fetch service to handle extended downtimes.
