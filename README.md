# RoadBuddy

A carpooling application designed for friends, colleagues, and large families planning trips. RoadBuddy helps assign passengers to cars efficiently with Google Maps integration for route visualization.

## Features

- Create and manage carpool rides
- Assign passengers to rides with capacity limits
- Visualize routes with Google Maps integration
- Filter and search available rides
- BDD-driven development with comprehensive test coverage

## Tech Stack

### Backend
- **Framework:** FastAPI
- **Server:** Uvicorn
- **Database:** SQLAlchemy with SQLite
- **Language:** Python 3.9+

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router
- **Maps:** Google Maps API (@react-google-maps/api)

### Testing
- **BDD Tests:** Behave
- **E2E Tests:** Cypress with Cucumber

## Getting Started

### Prerequisites

- Python 3.9 or higher
- Node.js 16 or higher
- Google Maps API key ([Get one here](https://console.cloud.google.com/google/maps-apis))

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional for AI features):
   ```bash
   cp .env.example .env
   # Edit .env and add your GEMINI_API_KEY if needed
   ```

5. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```

6. Access the API documentation at http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env and add your Google Maps API key:
   # VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

### Running Tests

#### BDD Tests (Behave)

1. Install test dependencies:
   ```bash
   pip install behave requests
   ```

2. Run tests from the project root:
   ```bash
   behave
   ```

#### E2E Tests (Cypress)

1. Make sure both backend and frontend servers are running

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Open Cypress:
   ```bash
   npx cypress open
   ```

## Development Process

This project follows Behavior Driven Development (BDD):

1. Refine business scenarios for new features
2. Prototype the frontend
3. Write Cypress test steps
4. Implement frontend changes
5. Develop backend code (API, database, migrations)
6. Execute test scenarios
7. Iterate until tests pass

## Project Structure

```
RoadBuddy/
├── backend/           # FastAPI backend
│   ├── main.py       # Application entry point
│   ├── models.py     # SQLAlchemy ORM models
│   ├── schemas.py    # Pydantic request/response models
│   ├── database.py   # Database configuration
│   ├── crud.py       # Database operations
│   └── routers/      # API route handlers
├── frontend/         # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── CarpoolForm.jsx
│   │   ├── LoginPage.jsx
│   │   └── RouteMap.jsx
│   └── cypress/      # E2E tests
└── features/         # BDD test features
```

## API Endpoints

- `POST /login` - User authentication
- `POST /carpools/rides/` - Create a new ride
- `GET /carpools/rides/` - List all rides with passengers
- `POST /carpools/rides/{ride_id}/passengers` - Add passenger to ride
- `POST /test/reset` - Reset database (development only)

## Contributing

This project is shared for educational and training purposes. Feel free to fork and experiment!

## License

MIT License - feel free to use this project for learning and teaching purposes.

## Links

- [ChatGPT Discussion](https://chatgpt.com/share/68437220-4370-800b-a29a-c263f1d7673b)
- [Miro Board](https://miro.com/app/board/uXjVIqewPdU=/)
