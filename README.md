# Battery Management System API

This project is a backend system designed to manage and retrieve battery data from electric vehicles. It provides a RESTful API built with Node.js, Express.js, and MySQL for storing time-series data from multiple batteries and retrieving it based on various criteria.

## Features

- **Data Storage**: Efficiently stores battery telemetry data (current, voltage, temperature).
- **RESTful API**: Clean and well-structured endpoints for data management.
- **Authentication**: Secure data retrieval endpoints using JSON Web Tokens (JWT).
- **Relational Database**: Uses MySQL for robust and reliable data storage.
- **Efficient Indexing**: Database schema is indexed for fast queries on time-series data.
- **Ready for Scale**: Built with a connection pool to handle multiple concurrent database requests.

---

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Password Hashing**: `bcryptjs`
- **Node-MySQL Driver**: `mysql2`
- **Environment Variables**: `dotenv`
- **HTTP Logging**: `morgan`

---

## API Endpoints

The base URL for all endpoints is `http://localhost:3000`.

### Authentication (`/api/auth`)

| Method | Endpoint | Security | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Creates a new user account. |
| `POST` | `/api/auth/login` | Public | Authenticates a user and returns a JWT. |

### Battery Data (`/api/battery`)

| Method | Endpoint | Security | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/battery/data` | Public | Stores a new data point from a vehicle. |
| `GET` | `/api/battery/:id` | **JWT Required** | Retrieves all data for a specific battery ID. |
| `GET` | `/api/battery/:id/:field` | **JWT Required** | Retrieves a specific field (e.g., `voltage`) for a battery. |
| `GET` | `/api/battery/:id/:field?start=...&end=...` | **JWT Required** | Retrieves a specific field within a given time range. |

---

## Setup and Installation

Follow these steps to get the project running locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- A REST Client like [Postman](https://www.postman.com/) for testing the API.

### 1. Clone the Repository

```bash
git clone https://github.com/KARINGU-RAVI/Battery-Management-System.git
cd Battery-Management-System
