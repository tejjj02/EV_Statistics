# EV Charger Statistics Backend API

## Project Overview

This project is a Node.js + Express + TypeScript backend API for serving electric vehicle (EV) charger usage statistics. It is designed to provide mock data for dashboards, analytics, or other client applications that need access to EV charging session statistics. The API reads data from a JSON file and exposes it via a RESTful endpoint.

## Features
- RESTful API built with Express and TypeScript
- Serves mock EV charger statistics from a JSON file


## File Structure
```
EV/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── statisticsController.ts
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   ├── routes/
│   │   │   └── statistics.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── public/
│   └── mock-data.json
```

## Setup & Installation
1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server will start on [http://localhost:3001](http://localhost:3001) by default.

## Usage
- The API serves EV charger statistics from the file `public/mock-data.json`.
- Make sure `mock-data.json` exists in the `public` directory at the root of the project.

## API Endpoints
### `GET /api/statistics`
- **Description:** Returns the full set of EV charger statistics as JSON.
- **Response Example:**
  ```json
  {
    "statistics": {
      "dailySessions": [ ... ],
      "monthlyStats": [ ... ],
      "summary": { ... }
    }
  }
  ```
- **Error Response:**
  ```json
  {
    "status": "error",
    "message": "Error fetching statistics"
  }
  ```

## Customization
- To use real data, replace the logic in `statisticsController.ts` to fetch from a database or another data source.
- To add more endpoints, create new route/controller files in the `src/routes` and `src/controllers` directories.

## License
MIT
