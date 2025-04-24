# Health Information System

A comprehensive health information system for managing client health programs, enrollments, and profiles.

## Features

- Create and manage health programs (TB, HIV, Malaria, etc.)
- Register clients with personal and contact information
- Enroll clients into multiple health programs
- Search for clients by name or ID
- View detailed client profiles with program enrollments
- RESTful API for integration with other systems
- Data validation and error handling
- Responsive UI for all devices

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express
- **Database**: SQLite
- **API**: RESTful architecture with CORS support

## Project Structure

The project follows the MVC (Model-View-Controller) pattern:

- **Models**: Database interaction and business logic
- **Controllers**: Handle request/response and validation
- **Routes**: Define API endpoints
- **Views**: React components (client-side rendering)

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/health-information-system.git
cd health-information-system
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173) and the API at [http://localhost:3000/api](http://localhost:3000/api).

## API Endpoints

### Health Programs

- `GET /api/programs` - Get all health programs
- `GET /api/programs/:id` - Get a specific health program
- `POST /api/programs` - Create a new health program
- `PUT /api/programs/:id` - Update a health program
- `DELETE /api/programs/:id` - Delete a health program
- `GET /api/programs/:id/clients` - Get clients enrolled in a program

### Clients

- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get a specific client
- `GET /api/clients/search?q=query` - Search clients by name or ID
- `POST /api/clients` - Register a new client
- `PUT /api/clients/:id` - Update a client
- `DELETE /api/clients/:id` - Delete a client
- `GET /api/clients/:id/programs` - Get programs a client is enrolled in
- `GET /api/clients/:id/profile` - Get complete client profile with enrollments

### Enrollments

- `GET /api/enrollments` - Get all enrollments
- `GET /api/enrollments/:id` - Get a specific enrollment
- `POST /api/enrollments` - Enroll a client in a program
- `PATCH /api/enrollments/:id/status` - Update enrollment status
- `DELETE /api/enrollments/:id` - Unenroll a client from a program

## Data Models

### Program

```
{
  id: number,
  name: string,
  description: string,
  created_at: timestamp
}
```

### Client

```
{
  id: number,
  name: string,
  age: number,
  gender: string,
  contact: string,
  address: string,
  created_at: timestamp
}
```

### Enrollment

```
{
  id: number,
  client_id: number,
  program_id: number,
  enrolled_at: timestamp,
  status: string
}
```

## Deployment

### Local Database

The application uses SQLite by default for simplicity. The database file will be created at `data/health_db.sqlite`.

### Production Deployment

For production deployment, you can use services like:

- **Render**: For hosting the Node.js backend
- **Vercel**: For hosting the React frontend
- **Railway**: For database hosting (if you want to migrate to PostgreSQL)

## Future Improvements

- Add authentication and user roles (Admin, Doctor, Nurse)
- Implement more detailed program metrics and reporting
- Add client visit tracking and scheduling
- Create data visualization for program enrollment statistics
- Support for offline mode and data synchronization
- Integration with external health systems via HL7 or FHIR standards

## License

This project is licensed under the MIT License - see the LICENSE file for details.