# GitHub API Proxy Server

This is a simple API proxy server built with **Node.js** and **Express.js** that fetches user data from the **GitHub API**. It includes rate limiting, caching, and logging for better performance and API usage management.

## Features

- Proxy to the GitHub API `/users/:username` endpoint.
- Rate limiting: Max 5 requests per minute per IP.
- Caching: Stores responses for 5 minutes to reduce external API calls.
- Logging: Logs each request with a timestamp and IP address.
- Error handling for external API failures.
- Configurable via environment variables.

---

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pratikdeshmukh2004/api-proxy-server.git
   cd api-proxy-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

---

## Usage

1. Start the server:

   ```bash
   npm start
   ```

2. Make requests to the API:

   ```bash
   curl "http://localhost:3000/api/github?username=pratikdeshmukh2004"
   ```

---

## API Endpoint

### `GET /api/github?username=:username`

Fetches user information from the GitHub API for the provided username.

**Query Parameters:**
- `username` (required): The GitHub username to fetch data for.

**Response Example:**
```json
{
  "data": {
    "login": "pratikdeshmkh2004",
    "id": 583231,
    "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
    ...
  },
  "cached": false
}
```

---

## Configuration

You can configure the following environment variables via the `.env` file:

| Variable          | Description                            | Default Value |
|-------------------|----------------------------------------|---------------|
| `PORT`            | Port for the server                    | 3000          |
| `RATE_LIMIT_MAX`  | Max requests per IP per minute          | 5             |
| `RATE_LIMIT_WINDOW`| Time window for rate limiting (minutes) | 1             |
| `CACHE_DURATION`  | Cache duration for API responses (sec)  | 300           |
| `GITHUB_TOKEN`    | GitHub personal access token (optional) | None          |

---

## Error Handling

- Returns `400` if the `username` query parameter is missing.
- Returns `429` when rate limit is exceeded.
- Returns `500` for server errors or GitHub API failures.

---