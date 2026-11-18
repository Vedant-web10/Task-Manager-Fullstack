# Full-Stack Task Management Dashboard

A secure, multi-tenant, production-ready Kanban task management platform built as a capstone project. This application features a decoupled client-server architecture with strict user data isolation, relational database cascading, and persistent session management.

## 🚀 Key Features

* **Secure User Authentication:** Custom-implemented login and signup workflow verifying credentials against a relational PostgreSQL database.
* **Multi-Tenant Data Isolation:** `@ManyToOne` database relationships and customized repository queries (`findByUserId`) ensure that users securely fetch, view, and modify only their own private projects and tasks.
* **Persistent Sessions:** React `localStorage` integration maintains user sessions across page refreshes, seamlessly restoring dashboard state.
* **Dynamic Kanban Board:** Reactive UI utilizing Axios for real-time asynchronous CRUD operations without full-page reloads.
* **Relational Data Integrity:** Hibernate `CascadeType.ALL` automatically cascades deletions from parent projects to child tasks, preventing orphaned rows in the database.
* **Bidirectional JSON Handling:** Utilizes `@JsonManagedReference` and `@JsonBackReference` to cleanly serialize relational entities while eliminating recursive `StackOverflowError` exceptions in the REST API.

---

## 🛠️ Technology Stack

### **Frontend**
* **React.js** (Vite build tool for high-performance bundling)
* **Bootstrap 5** for responsive styling and UI components
* **Axios** for HTTP network requests and REST API communication

### **Backend**
* **Java 17** & **Spring Boot 3**
* **Spring Web** (RESTful API architecture)
* **Spring Data JPA** & **Hibernate ORM** for database abstraction

### **Database & Tools**
* **PostgreSQL** relational database
* **Eclipse IDE** & **IntelliJ IDEA** (Backend development)
* **VS Code** (Frontend development & version control)
* **Git & GitHub** for source code management

---

## 📂 Architecture & Project Structure

```text
Task-Manager-Fullstack/
│
├── taskmanager/                  # Spring Boot Backend API
│   └── src/main/java/com/excelr/taskmanager/
│       ├── controller/           # REST Controllers (ProjectController, UserController)
│       ├── model/                # JPA Entities (User, Project, Task)
│       └── repository/           # Spring Data JPA Interfaces
│
└── taskmanager-frontend/         # React Client Application
    └── src/
        └── App.jsx               # Main component handling auth, routing, and Kanban UI
