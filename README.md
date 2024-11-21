# InvAudit

**InvAudit** is an inventory auditing application designed to streamline the auditing process by enabling users to upload inventory data, track discrepancies, and maintain a detailed audit history. Built with scalability in mind, this project is currently under development with plans for a future release as a SaaS (Software as a Service) solution.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
  - [Frontend](#frontend-setup)
  - [Backend](#backend-setup)
- [Usage](#usage)
  - [Frontend](#frontend-usage)
  - [Backend](#backend-usage)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

- **File Uploads**: Securely upload inventory data via CSV files for analysis.
- **Discrepancy Detection**: Compare uploaded inventory files against stored records to identify mismatches.
- **Audit History**: Maintain and view a complete history of audits for improved traceability.
- **Frontend**:
  - Interactive dashboards for audit results and historical data.
  - Streamlined user interface for managing inventory data.
- **Backend**:
  - RESTful APIs for handling data processing and storage.
  - Efficient CSV parsing with SQLite for lightweight, persistent data management.


---

## Technologies

### **Frontend**
- **React**: For building dynamic user interfaces.
- **TypeScript**: Strongly typed development.
- **Vite**: For fast builds and development.
- **Tailwind CSS**: For styling.

### **Backend**
- **Node.js**: JavaScript runtime for building the server.
- **Express**: Framework for creating RESTful APIs.
- **SQLite**: Lightweight database for persistent data storage.
- **Multer**: For handling file uploads.
- **CSV Parser**: To process inventory files.

---

## Setup

### **Frontend Setup**

1. Clone the repository and navigate to the frontend directory.
    ```bash
    git clone <repository-url>
    cd frontend
    ```
2. Install dependencies.
    ```bash
    npm install
    ```
3. Start the development server.
    ```bash
    npm run dev
    ```
4. Build the production bundle.
    ```bash
    npm run build
    ```
5. Preview the production build.
    ```bash
    npm run preview
    ```

### **Backend Setup**

1. Navigate to the backend directory.
    ```bash
    cd backend
    ```
2. Install dependencies.
    ```bash
    npm install
    ```
3. Start the development server.
    ```bash
    npm run dev
    ```
4. Build the backend.
    ```bash
    npm run build
    ```
5. Start the production server.
    ```bash
    npm run start
    ```

---

## Usage

### **Frontend Usage**

1. Access the application via your local server (default: `http://localhost:5173`).
2. Navigate through the user-friendly interface to:
   - Upload CSV files for inventory audits.
   - View and manage audit discrepancies.
   - Browse historical audit records.

### **Backend Usage**

1. Interact with the RESTful API endpoints:
   - **POST** `/upload` - Upload inventory files.
   - **GET** `/audits` - Fetch audit history.
   - **GET** `/audit/:id` - View details of a specific audit.

2. Ensure the database (`SQLite`) is properly configured for data persistence.

---

## Future Enhancements

- **Desktop Application**: Transition from a web-based interface to a cross-platform desktop application using Electron.
- **User Authentication**: Implement secure user account management for multi-user access.
- **Cloud Integration**: Transition to cloud-hosted databases for enhanced scalability.
- **Advanced Reporting**: Generate detailed visual reports for discrepancies and trends.
- **Real-Time Collaboration**: Support multi-user auditing sessions.

## Development Notes

- **Current Progress**: Ongoing feature development for file uploads, audit discrepancies, and historical record views.
- **SaaS Scalability**: Planning architecture for transitioning to a multi-tenant SaaS platform with user authentication and role-based access.
- **Database Expansion**: Future migration to cloud-based solutions for enhanced storage and query performance.