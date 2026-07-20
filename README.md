# Outflow Backend

A Spring MVC backend for tracking subscriptions, monitoring expiration dates, and sending automated in-app and email notifications.

> **Note**
>
> This project is built using the **Spring Framework (Spring MVC)** directly and **does not use Spring Boot**. Configuration, dependency injection, servlet initialization, security, database persistence, transaction management, and scheduled tasks are all explicitly configured in Java code to explore Spring Framework internals.

---

## Table of Contents

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Configuration](#configuration)
  - [Build & Run](#build--run)
  - [Default Credentials](#default-credentials)
- [Security & Authentication](#security--authentication)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [User Account](#user-account)
  - [User Subscriptions](#user-subscriptions)
  - [Notifications](#notifications)
  - [Admin Users](#admin-users)
  - [Admin Subscriptions](#admin-subscriptions)
- [Background Scheduler & Notifications](#background-scheduler--notifications)
- [References](#references)
- [Lessons Learned](#lessons-learned)

---

# Features

- **Subscription Tracking**: Manage subscriptions, billing cycles, pricing, logos, and categories.
- **Automated Expiration Warnings**: Daily scheduled task (`@Scheduled`) to scan for subscriptions nearing expiration or already expired.
- **Multi-channel Notifications**:
  - **In-App Notifications**: Stored in PostgreSQL with status filtering (`EXPIRED`, `NEARING_EXPIRATION`).
  - **Email Alerts**: Automated email dispatch using Spring JavaMailSender & Jakarta Mail.
- **JWT Security & RBAC**: Stateless authentication with JSON Web Tokens and Role-Based Access Control (`ROLE_USER` and `ROLE_ADMIN`).
- **Data Seeding**: Automatic database initialization with test admin and user accounts on startup.
- **Aspect-Oriented Logging**: Execution logging across service methods using AspectJ AOP.
- **Object Mapping**: Type-safe DTO-to-Entity conversion using MapStruct.

---

# Architecture & Tech Stack

Outflow follows a classic multi-tier layered architecture:

```
Controller Layer (REST Endpoints)
       ↓
 Service Layer (Business Logic & Notifications)
       ↓
   DAO Layer (Spring Data JPA Repositories)
       ↓
Database (PostgreSQL / H2)
```

## Core Technologies

| Component        | Technology                            |
| ---------------- | ------------------------------------- |
| Java Version     | Java 17                               |
| Framework        | Spring Framework 6.1.5                |
| Web              | Spring MVC                            |
| Security         | Spring Security 6.5.11 + JWT (0.13.0) |
| Persistence      | Spring Data JPA 3.2.4                 |
| ORM              | Hibernate ORM 6.4.4.Final             |
| Database         | PostgreSQL 17 (Production) / H2       |
| Connection Pool  | HikariCP 5.1.0                        |
| Mail Sender      | Spring Mail + Angus Mail 2.0.5        |
| Object Mapping   | MapStruct 1.6.3                       |
| JSON             | Jackson Datatype JSR310 2.21.2        |
| AOP              | AspectJ 1.9.25.1                      |
| Code Coverage    | JaCoCo 0.8.15                         |
| Logging          | SLF4J 2.0.13 + Logback 1.5.6          |
| Build Tool       | Maven 3.9                             |
| Containerization | Docker & Docker Compose               |

---

# Project Structure

```
Outflow
├── compose.yaml                    # Docker Compose for PostgreSQL 17 (port 1997)
└── backend
    └── outflow
        ├── Dockerfile              # Multi-stage build (Maven 3.9 + Tomcat 10.1)
        ├── pom.xml                 # Maven dependencies & build configuration
        └── src
            ├── main
            │   ├── java
            │   │   └── com.gwynejsn
            │   │       ├── App.java
            │   │       ├── aop             # AspectJ Service Logging
            │   │       ├── config          # Java Configuration (AppConfig, SecurityConfig)
            │   │       ├── controller      # REST Controllers (Auth, User, Admin)
            │   │       ├── dao             # Spring Data JPA Repositories (UserDao, SubscriptionDao, NotificationDao)
            │   │       ├── dto             # Data Transfer Objects (Auth, Subscriptions, Users, Notifications)
            │   │       ├── enums           # Category, Cycle, ExpirationType, Role
            │   │       ├── exception       # Custom Exceptions & GlobalExceptionHandler
            │   │       ├── filter          # JwtAuthenticationFilter
            │   │       ├── model           # JPA Entities (User, Subscription, Notification, ExpiringSubscription)
            │   │       ├── scheduler       # SubscriptionExpirationNotificationScheduler
            │   │       ├── security        # SecurityWebApplicationInitializer
            │   │       ├── service         # AuthService, UserService, SubscriptionService, Notification Services
            │   │       └── utils           # DataInitializer, MapStruct mappers
            │   └── resources
            │       └── application.properties # App & Database Configuration
            └── test
                └── java
                    └── com.gwynejsn
                        └── SubscriptionServiceTest.java # Unit & Mockito Tests
```

---

# Getting Started

## Prerequisites

- **Java JDK 17+**
- **Maven 3.9+**
- **Docker & Docker Compose** (or local PostgreSQL 17 server)
- **Apache Tomcat 10.1+ / 11** (for local WAR deployment)

---

## Database Setup

Start the PostgreSQL 17 database container using Docker Compose:

```bash
docker compose up outflow-postgres-db -d
```

This launches PostgreSQL configured with:

- **Port**: `1997` (mapped to container port `5432`)
- **Database**: `outflow_db`
- **Username**: `springuser`
- **Password**: `springpass`

---

## Configuration

Application configuration is stored in `backend/outflow/src/main/resources/application.properties`:

```properties
security.jwt.secret=55d1365cb035aab7ac0ff4abfb2182b0ee7b2ea5bbe26cbd078b9b99fe4f1356
security.jwt.expires=30
company.email=outflow@gmail.com
notification.expiration.email.lead.time=2

db.driver=org.postgresql.Driver
db.url=jdbc:postgresql://localhost:1997/outflow_db?sslmode=disable
db.user=springuser
db.pass=springpass

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_USERNAME
spring.mail.password=YOUR_SMTP_KEY
```

> **Note**: Update `spring.mail.username` and `spring.mail.password` with your SMTP provider details if testing email notifications.

---

## Build & Run

### 1. Build the Application

Navigate to the project root directory and compile with Maven:

```bash
cd backend/outflow
mvn clean package
```

This creates `target/outflow-1.0-SNAPSHOT.war`.

### 2. Deploy to Tomcat

Copy the generated WAR file into Apache Tomcat's `webapps/` directory or run Tomcat:

```bash
/path/to/tomcat/bin/catalina.sh run
```

Application Base URL:

```
http://localhost:8080/outflow
```

### 3. Run with Docker

Alternatively, build and containerize the application using the multi-stage `Dockerfile`:

```bash
docker build -t outflow-backend backend/outflow
```

---

## Default Credentials

The `DataInitializer` bean populates the database with initial mock users on startup:

| Role  | Username  | Password     | Email                 |
| ----- | --------- | ------------ | --------------------- |
| ADMIN | `admin`   | `admin123`   | `admin@outflow.com`   |
| USER  | `student` | `student123` | `student@outflow.com` |

---

# Security & Authentication

Authentication is stateless and uses JSON Web Tokens (JWT).

### Request Header Syntax

Protected endpoints require a valid JWT token passed in the HTTP Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Access Control Rules

- `/api/auth/login` - Publicly accessible
- `/api/user/**` - Requires `ROLE_USER`
- `/api/admin/**` - Requires `ROLE_ADMIN`

---

# API Reference

## Authentication

Base Path: `/api/auth`

| Method | Endpoint  | Access | Description                            |
| ------ | --------- | ------ | -------------------------------------- |
| POST   | `/login`  | Public | Authenticate user & receive JWT token. |
| POST   | `/create` | Public | Register a new user.                   |

---

## User Account

Base Path: `/api/user/account`

| Method | Endpoint  | Access    | Description                             |
| ------ | --------- | --------- | --------------------------------------- |
| GET    | `/`       | ROLE_USER | Retrieve current authenticated profile. |
| PUT    | `/update` | ROLE_USER | Update current authenticated profile.   |

---

## User Subscriptions

Base Path: `/api/user/subscriptions`

| Method | Endpoint  | Access    | Description                                  |
| ------ | --------- | --------- | -------------------------------------------- |
| GET    | `/`       | ROLE_USER | Retrieve all subscriptions for current user. |
| POST   | `/create` | ROLE_USER | Add a new subscription for current user.     |
| PUT    | `/update` | ROLE_USER | Update an existing subscription.             |

---

## Notifications

Base Path: `/api/user/notifications`

| Method | Endpoint | Access    | Description                                                                                        |
| ------ | -------- | --------- | -------------------------------------------------------------------------------------------------- |
| GET    | `/`      | ROLE_USER | Retrieve notifications (Optional query param `expirationType`: `EXPIRED` or `NEARING_EXPIRATION`). |
| GET    | `/clear` | ROLE_USER | Clear all notifications for the authenticated user.                                                |

---

## Admin Users

Base Path: `/api/admin/users`

| Method | Endpoint             | Access     | Description                 |
| ------ | -------------------- | ---------- | --------------------------- |
| GET    | `/`                  | ROLE_ADMIN | Retrieve list of all users. |
| GET    | `/{username}`        | ROLE_ADMIN | Retrieve user by username.  |
| POST   | `/create`            | ROLE_ADMIN | Create a new user.          |
| PUT    | `/update`            | ROLE_ADMIN | Update an existing user.    |
| DELETE | `/delete/{username}` | ROLE_ADMIN | Delete a user by username.  |

---

## Admin Subscriptions

Base Path: `/api/admin/subscriptions`

| Method | Endpoint       | Access     | Description                     |
| ------ | -------------- | ---------- | ------------------------------- |
| GET    | `/`            | ROLE_ADMIN | Retrieve all subscriptions.     |
| GET    | `/{id}`        | ROLE_ADMIN | Retrieve subscription by UUID.  |
| POST   | `/create`      | ROLE_ADMIN | Create a subscription for user. |
| PUT    | `/update`      | ROLE_ADMIN | Update any subscription.        |
| DELETE | `/delete/{id}` | ROLE_ADMIN | Delete subscription by UUID.    |

---

# Background Scheduler & Notifications

Outflow runs a daily scheduled job managed by `SubscriptionExpirationNotificationScheduler` (`@Scheduled(cron = "0 0 0 * * ?")`):

1. **Email Warnings**: Finds subscriptions approaching expiration and sends warning emails using `EmailNotificationService` via `JavaMailSender`.
2. **In-App Notifications**: Generates or updates in-app notification records (`NEARING_EXPIRATION` or `EXPIRED`) stored in PostgreSQL, accessible through `/api/user/notifications`.

---

# References

This project was built following official documentation for Spring Framework ecosystem components:

- **Spring Framework**: [Documentation](https://docs.spring.io/spring-framework/reference/) \| [API Javadoc](https://docs.spring.io/spring-framework/docs/current/javadoc-api/)
- **Spring Security**: [Reference Documentation](https://docs.spring.io/spring-security/reference/)
- **Spring Data JPA**: [Reference Documentation](https://docs.spring.io/spring-data/jpa/reference/)
- **Hibernate ORM**: [User Guide](https://docs.jboss.org/hibernate/orm/current/userguide/html_single/)
- **JJWT**: [Java JWT Library](https://github.com/jwtk/jjwt)
- **PostgreSQL**: [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- https://gitlab.com/ShowMeYourCodeYouTube/spring-mvc-without-spring-boot

---

## Additional Concepts Learned

- Explored multiple approaches for database access:
  - Spring JDBC (`JdbcTemplate`)
  - Spring + Hibernate
  - Spring Data JPA
  - Manual `EntityManager` usage

- Learned how Spring Data JPA repositories leverage interfaces to reduce boilerplate CRUD implementations.

- Implemented JWT authentication and understood its internals:
  - JWT consists of a **Header**, **Payload**, and **Signature**.
  - During authentication, the server signs the header and payload using a secret key.
  - During verification, the server recomputes the signature using the same secret key and compares it with the token's signature to verify integrity and authenticity.

- Gained a deeper understanding of Spring AOP proxy mechanisms:
  - Spring uses **JDK Dynamic Proxies** when a bean implements an interface.
  - Spring uses **CGLIB proxies** when proxying concrete classes.
  - Learned why a bean implementing only `UserDetailsService` exposes only the interface methods when proxied using JDK Dynamic Proxy.
  - Understood why separating `UserDetailsService` from the business service (or enabling `proxyTargetClass=true` to force CGLIB) resolves missing method issues.
  - Chose to keep the default JDK proxy behavior in this project to better understand how Spring's proxy mechanism works.

- Learned how JPQL supports DTO projections using constructor expressions (`SELECT new ...`), allowing queries to return custom DTOs instead of full entities when only partial data is needed.

- Gained hands-on experience configuring Spring MVC, Spring Security, Hibernate, and JPA manually without relying on Spring Boot auto-configuration.

- Developed a better understanding of the Spring container, dependency injection, bean lifecycle, servlet initialization, and application context configuration.

This project served as a practical exercise in learning the Spring ecosystem by configuring each subsystem explicitly rather than relying on auto-configuration.
