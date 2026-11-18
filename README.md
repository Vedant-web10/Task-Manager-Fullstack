# Full-Stack Task Manager

A Kanban-style task management dashboard built to manage projects and tasks efficiently. This is a full-stack capstone project featuring a decoupled architecture with a React frontend and a Spring Boot REST API backend.

## 🛠️ Tech Stack
**Frontend:**
* React.js (Vite)
* Bootstrap 5
* Axios

**Backend:**
* Java 17
* Spring Boot 3 (Spring Web, Spring Data JPA)
* Hibernate

**Database:**
* PostgreSQL

## ✨ Features
* **Project Management:** Create, view, and delete projects.
* **Task Tracking:** Add tasks to specific projects with Low, Medium, or High priority levels.
* **Kanban Workflow:** Move tasks dynamically across "To Do", "In Progress", and "Done" statuses.
* **Relational Data Mapping:** Utilizes Hibernate `@OneToMany` relationships with `CascadeType.ALL` to automatically wipe associated tasks when a parent project is deleted.

## 🚀 How to Run the Project

### 1. Database Setup
* Open pgAdmin and create a new PostgreSQL database named `task_manager_db`.
* Update the `src/main/resources/application.properties` file in the backend folder with your local PostgreSQL username and password.

### 2. Start the Backend (Spring Boot)
* Import the `taskmanager` folder into Eclipse or IntelliJ.
* Run `TaskmanagerApplication.java` as a Java Application.
* The REST API will start on `http://localhost:8080`. Hibernate will automatically generate the required database tables.

### 3. Start the Frontend (React)
* Open a terminal and navigate to the `taskmanager-frontend` directory.
* Run `npm install` to install dependencies.
* Run `npm run dev` to start the Vite development server.
* Open `http://localhost:5173` in your browser to view the dashboard.
