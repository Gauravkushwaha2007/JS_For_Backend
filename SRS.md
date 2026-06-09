# Software Requirements Specification

## KushMart — Digital Storefront for Kushwaha Kirana Store

---

| Document Attribute       | Detail                                         |
|--------------------------|------------------------------------------------|
| **Document Title**       | Software Requirements Specification — KushMart |
| **Version**              | 1.0.0                                          |
| **Status**               | Approved / Production Baseline                 |
| **Standard**             | IEEE Std 830-1998                              |
| **Prepared By**          | Principal Software Architect                   |
| **Organization**         | Kushwaha Kirana Store — Technology Division    |
| **Date of Issue**        | 2025                                           |
| **Classification**       | Internal — Confidential                        |

---

## Revision History

| Version | Date       | Author                      | Description                         |
|---------|------------|-----------------------------|-------------------------------------|
| 0.1     | 2025-01-01 | Engineering Team            | Initial Draft                       |
| 1.0     | 2025-06-01 | Principal Software Architect| Baseline SRS — Post-Development     |

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 Purpose
   - 1.2 Scope
   - 1.3 Definitions, Acronyms, and Abbreviations
   - 1.4 References
   - 1.5 Overview of Document
2. [Overall Description](#2-overall-description)
   - 2.1 Product Perspective
   - 2.2 Product Functions — Summary
   - 2.3 User Classes and Characteristics
   - 2.4 Operating Environment
   - 2.5 Design and Implementation Constraints
   - 2.6 Assumptions and Dependencies
3. [System Features and Functional Requirements](#3-system-features-and-functional-requirements)
   - 3.1 Entry Point & Global Application Configuration
   - 3.2 Index / General Routes
   - 3.3 User Authentication & Profile Subsystem
   - 3.4 Cart & Checkout Subsystem
   - 3.5 Order Fulfillment & Tracking Subsystem
   - 3.6 Product Management System
   - 3.7 Admin Infrastructure & Analytics Dashboard
4. [External Interface Requirements](#4-external-interface-requirements)
   - 4.1 User Interface Requirements
   - 4.2 Hardware Interfaces
   - 4.3 Software Interfaces
   - 4.4 Communication Interfaces
5. [Non-Functional Requirements](#5-non-functional-requirements)
   - 5.1 Performance Requirements
   - 5.2 Security Requirements
   - 5.3 Reliability and Availability
   - 5.4 Maintainability and Scalability
   - 5.5 Portability
   - 5.6 Usability

---

---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete, authoritative, and formal description of the functional behavior, architectural design decisions, external interfaces, and non-functional quality attributes of **KushMart** — the digital e-commerce storefront developed for Kushwaha Kirana Store.

This document is authored retrospectively following the completion of a fully operational, production-ready system. Its purpose is to serve as the canonical technical reference artifact for all present and future stakeholders including:

- **Development and Engineering Teams** undertaking ongoing maintenance, feature additions, or refactoring.
- **Quality Assurance (QA) Engineers** designing test plans, test cases, and validation suites against defined behavioral contracts.
- **System Administrators** responsible for deployment, infrastructure provisioning, and operational monitoring.
- **Business Stakeholders** requiring a formal record of system capabilities and operational scope.
- **Auditors and Compliance Officers** requiring traceability of system behavior against business requirements.

This document strictly conforms to the **IEEE Std 830-1998 — Recommended Practice for Software Requirements Specifications** standard. All functional requirements within are stated precisely, completely, and unambiguously. This SRS shall be treated as the primary source of truth for the KushMart system specification.

---

## 1.2 Scope

**KushMart** (hereafter referred to as "the System" or "the Application") is a full-stack, monolithic, server-rendered web application that digitizes the retail operations of Kushwaha Kirana Store, a grocery and kirana business.

### 1.2.1 System Identification

The System is identified by the following attributes:

- **Application Name:** KushMart
- **Business Identity:** Kushwaha Kirana Store — Digital Storefront
- **Architecture Pattern:** Monolithic MVC (Model-View-Controller)
- **Rendering Strategy:** Server-Side Rendering (SSR) via EJS templating engine, augmented with AJAX/Fetch-based partial updates for interactive components.
- **Deployment Topology:** Single-process Node.js server suitable for deployment on cloud VPS instances (e.g., AWS EC2, DigitalOcean Droplets, Railway, Render).

### 1.2.2 Scope of Functionality

The System provides the following high-level capabilities:

1. **Customer-Facing E-Commerce Portal:** A web-based shopping interface enabling registered customers to browse a live product catalog, perform real-time searches, manage a persistent shopping cart, select delivery addresses, place orders, and track order fulfillment status.

2. **User Identity & Session Management:** A full authentication lifecycle including registration with email OTP verification, session-based login/logout, and a secure password recovery flow using time-limited tokenized reset links delivered via email.

3. **Address & Profile Management:** An authenticated profile subsystem allowing users to manage multiple delivery addresses, toggle a primary (default) address, and leverage reverse geolocation via the OpenStreetMap Nominatim API to auto-populate address fields.

4. **Admin Control Panel:** A protected administrative interface enabling the store operator (admin) to manage the product catalog (create, edit, delete), process and update order dispatch statuses, and view a business intelligence analytics dashboard.

5. **Business Analytics:** A real-time analytics module computing key performance indicators (KPIs) including total revenue, total orders, monthly sales distribution, top-selling product rankings, and low-stock alerts.

### 1.2.3 Out of Scope

The following capabilities are explicitly excluded from the current version of the System:

- Payment gateway integration (online payment processing); the current system operates on a cash-on-delivery (COD) or offline payment model.
- Multi-vendor or multi-store marketplace functionality.
- Mobile native applications (iOS/Android).
- Real-time push notifications via WebSockets or Server-Sent Events.
- Third-party courier API integration for automated logistics tracking.
- Multi-language (i18n) or multi-currency support.
- Automated inventory replenishment or supplier management.

---

## 1.3 Definitions, Acronyms, and Abbreviations

| Term / Acronym | Definition |
|----------------|------------|
| **SRS** | Software Requirements Specification |
| **IEEE** | Institute of Electrical and Electronics Engineers |
| **MVC** | Model-View-Controller — an architectural design pattern separating data, presentation, and control logic |
| **SSR** | Server-Side Rendering — HTML is generated on the server and sent to the client |
| **AJAX** | Asynchronous JavaScript and XML — technique for making HTTP requests without full page reload |
| **API** | Application Programming Interface |
| **REST** | Representational State Transfer — an architectural style for networked HTTP APIs |
| **Node.js** | An open-source, cross-platform JavaScript runtime built on Chrome's V8 engine |
| **Express.js** | A minimal and flexible Node.js web application framework |
| **MongoDB** | A document-oriented NoSQL database |
| **Mongoose** | An Object Data Modeling (ODM) library for MongoDB and Node.js |
| **EJS** | Embedded JavaScript — a templating language for generating HTML with server-side data |
| **Tailwind CSS** | A utility-first CSS framework for rapid UI development |
| **OTP** | One-Time Password — a time-limited, single-use authentication code |
| **JWT** | JSON Web Token — a compact, URL-safe means of representing claims (used contextually for reset tokens) |
| **Session** | A server-side mechanism for persisting user state across multiple HTTP requests |
| **Cookie** | A small piece of data stored on the client browser and transmitted with each HTTP request |
| **Middleware** | Functions in the Express.js request-response cycle that have access to `req`, `res`, and `next` |
| **Multer** | A Node.js middleware for handling `multipart/form-data`, used for file uploads |
| **Nomiantin API** | OpenStreetMap's Nominatim — a geocoding/reverse geocoding API |
| **Pincode** | A 6-digit Indian Postal Index Number uniquely identifying a geographic delivery area |
| **regex** | Regular Expression — a sequence of characters defining a search pattern |
| **`$regex`** | MongoDB query operator for pattern-matching string fields |
| **`$options: 'i'`** | MongoDB regex option flag enabling case-insensitive matching |
| **`.reduce()`** | A JavaScript Array method that reduces an array to a single accumulated value |
| **`isLoggedIn`** | Custom Express middleware guard verifying that a request originates from an authenticated user session |
| **`isAdmin`** | Custom Express middleware guard verifying that the authenticated user possesses the admin role |
| **`attachUser`** | Global custom middleware that injects the current user object into `res.locals` for access in all EJS templates |
| **`res.locals`** | An Express.js object scoped to a single request-response cycle, accessible within views |
| **`connect-flash`** | A Node.js middleware for storing and retrieving one-time flash messages in the session |
| **`express-session`** | Node.js session middleware for Express |
| **`cookie-parser`** | Middleware for parsing the `Cookie` header and populating `req.cookies` |
| **`dotenv`** | A module for loading environment variables from a `.env` file into `process.env` |
| **DXA** | Document eXtended Attribute unit used in OOXML (not applicable to code; used only in this document template) |
| **KPI** | Key Performance Indicator — a measurable value demonstrating effectiveness |
| **COD** | Cash on Delivery — a payment method where payment is collected at time of delivery |
| **VPS** | Virtual Private Server |
| **URI** | Uniform Resource Identifier |
| **URL** | Uniform Resource Locator |
| **HTTP** | Hypertext Transfer Protocol |
| **HTTPS** | HTTP Secure — HTTP over TLS/SSL |
| **TLS** | Transport Layer Security |
| **ENV** | Environment variable |
| **ODM** | Object Data Modeling |
| **HTML** | Hypertext Markup Language |
| **CSS** | Cascading Style Sheets |
| **JS** | JavaScript |
| **FR** | Functional Requirement |
| **NFR** | Non-Functional Requirement |
| **CRUD** | Create, Read, Update, Delete |
| **UX** | User Experience |
| **UI** | User Interface |

---

## 1.4 References

| Reference ID | Document / Resource |
|--------------|---------------------|
| [IEEE-830] | IEEE Std 830-1998 — IEEE Recommended Practice for Software Requirements Specifications |
| [NODE-DOCS] | Node.js Official Documentation — https://nodejs.org/en/docs |
| [EXPRESS-DOCS] | Express.js Official Documentation — https://expressjs.com |
| [MONGOOSE-DOCS] | Mongoose ODM Official Documentation — https://mongoosejs.com/docs |
| [MONGODB-DOCS] | MongoDB Manual — https://www.mongodb.com/docs/manual |
| [EJS-DOCS] | EJS Templating Documentation — https://ejs.co |
| [TAILWIND-DOCS] | Tailwind CSS Documentation — https://tailwindcss.com/docs |
| [MULTER-DOCS] | Multer npm Package Documentation — https://github.com/expressjs/multer |
| [NOMINATIM-API] | OpenStreetMap Nominatim API Documentation — https://nominatim.org/release-docs/latest/api/Reverse |
| [CONNECT-FLASH] | connect-flash npm Package — https://github.com/jaredhanson/connect-flash |
| [EXPRESS-SESSION] | express-session npm Package — https://github.com/expressjs/session |
| [DOTENV] | dotenv npm Package — https://github.com/motdotla/dotenv |

---

## 1.5 Overview of Document

This document is organized into five primary sections following the IEEE 830-1998 standard structure:

- **Section 1 (Introduction):** Defines the purpose, scope, key terminology, and the document's structural organization.
- **Section 2 (Overall Description):** Provides a system-level perspective, describes the product context, enumerates user classes, details operating environment constraints, and articulates design and implementation assumptions.
- **Section 3 (System Features and Functional Requirements):** The central and most detailed section of this document. Each functional subsystem of KushMart — from routing configuration to business analytics — is documented exhaustively. Behavioral logic, input/processing/output states, state machines, error scenarios, and middleware guards are all specified using formal tables and structured prose.
- **Section 4 (External Interface Requirements):** Specifies all interface contracts: the user interface layout principles, database connection parameters, third-party API integration points, and the HTTP communication layer.
- **Section 5 (Non-Functional Requirements):** Documents all quality attributes including performance benchmarks, security mandates, reliability targets, maintainability standards, and portability considerations.

---

---

# 2. Overall Description

## 2.1 Product Perspective

KushMart is a **self-contained, monolithic web application** that operates as a standalone system. It does not exist as a component within a larger enterprise system or service mesh. It is a purpose-built digital transformation of a single brick-and-mortar kirana store's retail operations.

### 2.1.1 System Context Diagram (Textual Representation)

```
+---------------------------+       HTTP/HTTPS       +----------------------------+
|       Web Browser         |  <==================>  |   KushMart Node.js Server  |
|  (Customer / Admin UI)    |                        |  (Express.js Application)  |
+---------------------------+                        +----------------------------+
                                                              |         |
                                        +---------------------+         +-------------------+
                                        |                                                   |
                               +--------v--------+                          +--------------v-----------+
                               |   MongoDB Atlas  |                          | External Services:       |
                               | (or local MongoDB)|                         | - OpenStreetMap Nominatim|
                               |  via Mongoose ODM|                          |   (Reverse Geocoding)    |
                               +-----------------+                          | - SMTP Email Server      |
                                                                            |   (OTP & Password Reset) |
                                                                            +--------------------------+
```

### 2.1.2 Architectural Pattern

The system implements a layered **Model-View-Controller (MVC)** architecture:

- **Models (M):** Mongoose schemas and document models encapsulating data structure definitions and database interaction logic. Key models include User, Product, Cart, and Order.
- **Views (V):** EJS template files (`*.ejs`) responsible for rendering HTML responses. Views receive data via `res.render()` calls and have access to `res.locals` for globally injected data (e.g., the `user` object from `attachUser` middleware).
- **Controllers (C):** Express.js route handler functions defining the business logic for each endpoint. These functions orchestrate data retrieval from models, apply business rules, and invoke the appropriate view rendering or JSON response.

### 2.1.3 Routing Architecture Overview

The application mounts four primary router modules from the central `app.js` entry point:

| Mount Path  | Router Module   | Primary Responsibility                                      |
|-------------|-----------------|-------------------------------------------------------------|
| `/`         | `indexRouter`   | Home page, live search endpoint, static pages               |
| `/users`    | `userRouter`    | Authentication, profile management, addresses, cart, orders |
| `/products` | `productRouter` | Product catalog (public) and product CRUD (admin-protected) |
| `/admin`    | `adminRouter`   | Admin order management and business analytics dashboard     |

---

## 2.2 Product Functions — Summary

The System provides the following primary functional domains:

1. **Product Discovery:** Dynamic homepage catalog with search and category filtering; AJAX-powered live search with real-time results; full product catalog listing; individual product detail views.
2. **User Identity Management:** Registration with OTP-based email verification; session-based login/logout; forgot-password flow with secure tokenized reset links; profile update.
3. **Address Book Management:** Addition, editing, deletion, and default-toggling of multiple delivery addresses; automatic geolocation-based address population.
4. **Shopping Cart Management:** Adding/removing products; quantity adjustment; cart price computation; checkout initiation.
5. **Order Lifecycle Management:** Order placement from cart; multi-state order tracking (Ordered → Packing → Out for Delivery → Delivered); invoice/bill rendering.
6. **Admin Product Management:** Secure product creation with image upload; product editing; product deletion.
7. **Admin Order Management:** Order listing with full relational population; order status update (dispatch state control).
8. **Business Intelligence Analytics:** Revenue computation, monthly sales trend analysis, top-selling product identification, low-stock alert generation.

---

## 2.3 User Classes and Characteristics

The System recognizes two distinct user classes with separate privileges, interface access, and capability sets.

### 2.3.1 Customer (Registered End User)

| Attribute           | Description |
|---------------------|-------------|
| **Definition**      | A member of the public who has successfully registered and verified their email address on the KushMart platform. |
| **Technical Proficiency** | General internet user; no technical knowledge required. |
| **Access Level**    | Standard authenticated access. Protected routes require `isLoggedIn` middleware to pass. |
| **Primary Goals**   | Browse products, search catalog, manage cart, place orders, track delivery, manage personal profile and addresses. |
| **Session Behavior**| Session established upon login; persists until explicit logout or session expiration. |
| **Entry Points**    | Web browser via HTTP/HTTPS. No API key or CLI access. |

### 2.3.2 Administrator (Store Operator / Merchant)

| Attribute           | Description |
|---------------------|-------------|
| **Definition**      | A privileged user with an `isAdmin: true` flag set on their MongoDB User document. Typically the store owner or designated manager. |
| **Technical Proficiency** | Moderate; capable of operating a web-based admin panel, uploading images, and interpreting dashboard analytics. |
| **Access Level**    | Elevated administrative access. Protected routes require both `attachUser` and `isAdmin` middleware to pass. |
| **Primary Goals**   | Manage product catalog (CRUD), process and update customer order statuses, monitor business KPIs via the analytics dashboard. |
| **Session Behavior**| Same session mechanism as customers. Admin flag is evaluated per-request by the `isAdmin` middleware. |
| **Entry Points**    | Web browser via HTTP/HTTPS. Admin routes are accessible via `/admin` and `/products/create|edit|delete`. |
| **Unique Capabilities** | Access to `/admin/orders`, `/admin/analytics`, `/products/create`, `/products/edit/:id`, `/products/delete/:id`. |

### 2.3.3 Unauthenticated Visitor (Guest)

| Attribute           | Description |
|---------------------|-------------|
| **Definition**      | A user who has not yet registered or who has not logged in. |
| **Access Level**    | Read-only access to public-facing pages only. |
| **Accessible Routes** | `/` (homepage), `/products/allProducts`, `/products/view/:id`, `/about`, `/users/register`, `/users/login`, `/users/forgot-password`. |
| **Restrictions**    | Cart operations, checkout, order history, profile management, and all admin routes are inaccessible. Middleware redirects unauthorized access attempts to the login page. |

---

## 2.4 Operating Environment

### 2.4.1 Server-Side Environment

| Component           | Specification |
|---------------------|---------------|
| **Runtime**         | Node.js (LTS version ≥ 18.x recommended) |
| **Framework**       | Express.js (v4.x) |
| **Database**        | MongoDB (v5.x or later), accessed via Mongoose ODM |
| **Database Hosting**| MongoDB Atlas (cloud) or self-hosted MongoDB instance |
| **OS Compatibility**| Linux (Ubuntu 20.04+, CentOS 7+), macOS (12+), Windows Server 2019+ |
| **Memory**          | Minimum 512 MB RAM; 1 GB recommended for production |
| **Process Manager** | PM2 recommended for production process management and auto-restart |

### 2.4.2 Client-Side Environment

| Component           | Specification |
|---------------------|---------------|
| **Browser Support** | Google Chrome (v100+), Mozilla Firefox (v95+), Microsoft Edge (v100+), Safari (v15+) |
| **JavaScript**      | ES6+ required; Fetch API must be supported (native in all modern browsers) |
| **CSS**             | Tailwind CSS v3.x (compiled utility classes served as static asset) |
| **Viewport**        | Responsive design; supports desktop (≥1024px), tablet (768px–1023px), and mobile (320px–767px) viewports |

### 2.4.3 External Service Dependencies

| Service                    | Purpose                                             | Protocol |
|----------------------------|-----------------------------------------------------|----------|
| MongoDB Atlas / Local Mongo| Primary data persistence store                       | MongoDB Wire Protocol (TCP) |
| SMTP Email Server          | Delivery of OTP verification emails and password reset emails | SMTP (TLS port 587 or SSL port 465) |
| OpenStreetMap Nominatim API| Reverse geocoding for auto-populating delivery address fields | HTTPS (REST/JSON) |

---

## 2.5 Design and Implementation Constraints

| Constraint ID | Constraint Description |
|---------------|------------------------|
| **CON-01** | The system **must** be implemented as a monolithic Node.js/Express.js application. Microservices decomposition is not within scope. |
| **CON-02** | All HTML rendering **must** use EJS as the server-side templating engine. Client-side frameworks (React, Vue, Angular) are not used. |
| **CON-03** | All database interactions **must** use Mongoose as the ODM layer. Direct MongoDB driver calls are prohibited. |
| **CON-04** | All application styling **must** use Tailwind CSS utility classes. No custom CSS frameworks are introduced. |
| **CON-05** | File upload handling **must** use the Multer middleware for `multipart/form-data` processing. |
| **CON-06** | Session state **must** be managed exclusively via `express-session`. Token-based (stateless) authentication is not used. |
| **CON-07** | All sensitive configuration values (database URI, session secret, SMTP credentials, API keys) **must** be stored in environment variables loaded via `dotenv` and **must never** be hardcoded in source code. |
| **CON-08** | The `attachUser` middleware **must** execute globally on all routes to ensure consistent `res.locals.user` population for template rendering. |
| **CON-09** | The product image upload functionality **must** accept `multipart/form-data` encoding and store images in a designated server-side directory (e.g., `public/uploads/` or a cloud object store). |
| **CON-10** | The OpenStreetMap Nominatim API usage **must** comply with its usage policy, including the mandatory `User-Agent` header in all outgoing requests to that API. |
| **CON-11** | All admin-protected routes **must** be guarded by both `attachUser` and `isAdmin` middleware in sequence. |
| **CON-12** | The password reset token **must** be time-limited. Expired tokens must be rejected without providing information about valid user accounts. |

---

## 2.6 Assumptions and Dependencies

| ID     | Type         | Description |
|--------|--------------|-------------|
| **A-01** | Assumption | A valid MongoDB connection URI is available and configured in the environment variables prior to application startup. |
| **A-02** | Assumption | An SMTP mail server (or a transactional email service such as SendGrid, Mailgun, or Gmail SMTP) is configured and accessible for sending OTP and password reset emails. |
| **A-03** | Assumption | The deployment server has outbound HTTPS access to `nominatim.openstreetmap.org` on port 443 for the reverse geocoding feature. |
| **A-04** | Assumption | The administrator user account is manually seeded into the database with the `isAdmin: true` flag, or a separate admin seeding script/route is used for initial setup. |
| **A-05** | Assumption | Product images are stored either locally on the server's filesystem (in a publicly accessible directory) or on a cloud object storage service (e.g., AWS S3), and the image URL/path is persisted in the Product MongoDB document. |
| **A-06** | Assumption | The application operates behind a reverse proxy (e.g., Nginx) in production, which handles TLS termination and forwards requests to the Node.js application server on a local port. |
| **D-01** | Dependency | `express` — core HTTP server framework |
| **D-02** | Dependency | `mongoose` — MongoDB ODM |
| **D-03** | Dependency | `ejs` — server-side templating |
| **D-04** | Dependency | `express-session` — session management |
| **D-05** | Dependency | `connect-flash` — flash message middleware |
| **D-06** | Dependency | `cookie-parser` — HTTP cookie parsing |
| **D-07** | Dependency | `dotenv` — environment variable loading |
| **D-08** | Dependency | `multer` — multipart file upload handling |
| **D-09** | Dependency | `bcrypt` or `bcryptjs` — password hashing |
| **D-10** | Dependency | `nodemailer` — SMTP email dispatch |
| **D-11** | Dependency | `crypto` or `uuid` — secure token generation for password reset links |
| **D-12** | Dependency | Node.js built-in `https` or `node-fetch` / `axios` — outbound HTTP client for Nominatim API calls |

---

---

# 3. System Features and Functional Requirements

This section documents every functional feature of the KushMart system in full technical detail. Each subsystem is described with its routing specification, middleware chain, behavioral logic, input/processing/output state tables, error scenarios, and access control requirements.

---

## 3.1 Entry Point & Global Application Configuration

### 3.1.1 Feature Description

The `app.js` file serves as the application entry point, responsible for instantiating the Express.js application, registering all global middleware, mounting all router modules, and initiating the database connection.

### 3.1.2 Global Middleware Stack

The following middleware are registered globally (i.e., execute on every incoming HTTP request, in the order listed):

| Order | Middleware          | Package            | Function |
|-------|---------------------|--------------------|----------|
| 1     | `cookieParser()`    | `cookie-parser`    | Parses the HTTP `Cookie` header and populates `req.cookies` with a key-value object. |
| 2     | `express.json()`    | `express` (built-in) | Parses incoming requests with `application/json` payloads, populating `req.body`. |
| 3     | `express.urlencoded({ extended: true })` | `express` (built-in) | Parses incoming requests with `application/x-www-form-urlencoded` payloads (standard HTML form submissions), populating `req.body`. |
| 4     | `session({ secret, resave, saveUninitialized, cookie })` | `express-session` | Establishes server-side session management. The session secret is loaded from `process.env.SESSION_SECRET`. Generates and manages `connect.sid` session cookie on the client. |
| 5     | `flash()`           | `connect-flash`    | Enables `req.flash(type, message)` for writing and `req.flash(type)` for reading one-time messages stored in the session. Depends on session middleware running first. |
| 6     | `attachUser`        | Custom (local)     | Custom middleware that executes on every route. Reads the user identifier from `req.session` (if authenticated), fetches the corresponding User document from MongoDB, and assigns the result to `res.locals.user`. This makes `user` available in all EJS templates without explicitly passing it via `res.render()`. If no session exists, `res.locals.user` is set to `null`. |

### 3.1.3 `attachUser` Middleware — Detailed Specification

| Attribute       | Specification |
|-----------------|---------------|
| **Trigger**     | Every HTTP request to any route |
| **Input**       | `req.session.userId` (set upon successful login) |
| **Processing**  | 1. Check if `req.session.userId` is defined. 2. If yes: execute `User.findById(req.session.userId)`. 3. If no: set `res.locals.user = null`. 4. Assign the fetched User document (or null) to `res.locals.user`. 5. Call `next()`. |
| **Output**      | `res.locals.user` populated with User document or null |
| **Error Handling** | If `User.findById()` throws (e.g., invalid ObjectId, DB connectivity error), the middleware should catch the error, set `res.locals.user = null`, log the error, and call `next()` to prevent a complete request failure. |
| **Side Effects**| None (read-only operation) |

### 3.1.4 Router Module Mounting

| Mount Path  | Router Variable   | Source File              |
|-------------|-------------------|--------------------------|
| `/`         | `indexRouter`     | `routes/index.js`        |
| `/users`    | `userRouter`      | `routes/users.js`        |
| `/admin`    | `adminRouter`     | `routes/admin.js`        |
| `/products` | `productRouter`   | `routes/products.js`     |

### 3.1.5 Environment Configuration via `dotenv`

The `dotenv` package is initialized at the very top of `app.js` before any other module imports that may depend on environment variables. The following environment variables are expected to be defined in a `.env` file at the project root:

| Variable Name        | Description | Sensitivity |
|----------------------|-------------|-------------|
| `MONGODB_URI`        | Full MongoDB connection URI (e.g., `mongodb+srv://...`) | Critical Secret |
| `SESSION_SECRET`     | Secret key for signing session cookies | Critical Secret |
| `EMAIL_HOST`         | SMTP server hostname | Sensitive |
| `EMAIL_PORT`         | SMTP server port (587 or 465) | Sensitive |
| `EMAIL_USER`         | SMTP authentication username / email address | Sensitive |
| `EMAIL_PASS`         | SMTP authentication password or app-specific password | Critical Secret |
| `PORT`               | TCP port on which the application listens (default: 3000) | Configuration |
| `BASE_URL`           | The canonical public base URL of the application (e.g., `https://kushmart.in`), used for constructing password reset URLs | Configuration |

---

## 3.2 Index / General Routes

**Router:** `indexRouter` mounted at `/`

### 3.2.1 FR-IDX-01: Dynamic Home Page

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /` |
| **Access Control**| Public (no authentication required) |
| **Middleware**    | `attachUser` (global) |
| **Description**   | Renders the primary homepage of the KushMart application. Dynamically populates product listings based on optional query parameters. If the user is authenticated, injects live cart pricing data into the rendered context. |

**Query Parameters:**

| Parameter  | Type   | Required | Description |
|------------|--------|----------|-------------|
| `search`   | String | No       | A search keyword to filter products by name or description |
| `category` | String | No       | A category name to filter products by their assigned category |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Parse `req.query.search` and `req.query.category` from the incoming request. |
| 2 | Construct a MongoDB query filter object. If `search` is provided, add a `$regex` filter on the product name field with `$options: 'i'` for case-insensitive matching. If `category` is provided, add an exact equality filter on the product category field. |
| 3 | Execute `Product.find(filter)` to retrieve matching active product documents from MongoDB. |
| 4 | If `res.locals.user` is not null (authenticated user): Retrieve the Cart document associated with `req.session.userId`. Extract the total cart price (sum of all item prices × quantities) and inject it into the render context. |
| 5 | Render the home page EJS template (`views/index.ejs` or equivalent), passing the product list and cart price (if applicable). |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| No query parameters | `GET /` | All active products rendered; cart price shown if logged in |
| Search query only | `GET /?search=tomato` | Products matching "tomato" (case-insensitive) rendered |
| Category filter only | `GET /?category=vegetables` | Products in "vegetables" category rendered |
| Both search and category | `GET /?search=organic&category=fruits` | Products matching both criteria rendered |
| No matching products | `GET /?search=xyznonexistent` | Empty product list rendered; no error thrown |
| Authenticated user | `GET /` with valid session | Cart total price injected and displayed |
| Unauthenticated user | `GET /` without session | Page renders; cart price section hidden or shows zero/null |

**Error Scenarios:**

| Error Condition | System Behavior |
|-----------------|-----------------|
| MongoDB connection failure | Express error handler invoked; user sees generic 500 error page |
| Invalid query parameter types | Query parameters treated as strings; MongoDB regex handles gracefully |

---

### 3.2.2 FR-IDX-02: AJAX Live Search Endpoint

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /products/search` |
| **Access Control**| Public (no authentication required) |
| **Response Type** | JSON |
| **Description**   | An AJAX endpoint designed to serve real-time, partial-match product search results to the front-end search bar component. Returns a maximum of 6 matching product records. |

**Query Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `q`       | String | Yes      | The search query string typed by the user |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Extract `req.query.q` from the request. |
| 2 | Validate that `q` is a non-empty string. If empty or absent, return an empty array immediately. |
| 3 | Construct a MongoDB query: `Product.find({ name: { $regex: q, $options: 'i' } }).limit(6)`. The `$options: 'i'` flag ensures case-insensitive matching. The `.limit(6)` cap prevents excessive data transfer and ensures fast response times. |
| 4 | Serialize the result array and return it as a JSON response with HTTP 200. |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Valid partial match | `GET /products/search?q=rice` | JSON array of ≤6 Product documents matching "rice" |
| No matches | `GET /products/search?q=zzzabc` | JSON empty array `[]` |
| Missing `q` parameter | `GET /products/search` | JSON empty array `[]` or HTTP 400 with error message |
| Single character query | `GET /products/search?q=a` | JSON array of ≤6 products whose names contain "a" |
| Case variation | `GET /products/search?q=RICE` | Same results as `?q=rice` (case-insensitive) |

**Client-Side Integration:**
The front-end JavaScript must attach a debounced `input` event listener to the search bar `<input>` element. On each keystroke (after debounce delay, recommended 300ms), it dispatches a `fetch()` call to `GET /products/search?q={inputValue}`, parses the JSON response, and dynamically updates the search suggestion dropdown DOM element without triggering a full page reload.

**Error Scenarios:**

| Error Condition | System Behavior |
|-----------------|-----------------|
| MongoDB error during search | HTTP 500 with JSON error object `{ error: "Internal server error" }` |
| Malformed regex character in `q` (e.g., `[`) | Sanitize input or catch regex compilation error; return `[]` or HTTP 400 |

---

### 3.2.3 FR-IDX-03: Static About Page

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /about` |
| **Access Control**| Public |
| **Middleware**    | `attachUser` (global) |
| **Description**   | Renders a static informational page describing Kushwaha Kirana Store, its history, mission, and contact details. No dynamic data fetched from the database. |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Any user visits | `GET /about` | Static about page HTML rendered with navigation context (user session state reflected via `res.locals.user`) |

---

## 3.3 User Authentication & Profile Subsystem

**Router:** `userRouter` mounted at `/users`

### 3.3.1 FR-AUTH-01: User Registration

| Attribute         | Specification |
|-------------------|---------------|
| **Routes**        | `GET /users/register`, `POST /users/register` |
| **Access Control**| Public (redirect if already logged in) |

**GET /users/register:**

Renders the registration form view. If `res.locals.user` is not null, redirect the user to the homepage `/` (already authenticated users should not re-register).

**POST /users/register:**

| Attribute | Specification |
|-----------|---------------|
| **Content-Type** | `application/x-www-form-urlencoded` |
| **Body Parameters** | `fullName` (String), `email` (String), `password` (String), `confirmPassword` (String), `phone` (String) |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Extract and sanitize all body parameters. |
| 2 | **Validation:** Verify all required fields are present and non-empty. Validate email format using a regex pattern. Verify `password` and `confirmPassword` match. Verify password meets minimum length/complexity requirements (minimum 8 characters recommended). Validate phone is a valid Indian mobile number (10 digits). |
| 3 | **Uniqueness Check:** Query `User.findOne({ email })`. If a document is found, flash an error message and redirect back to `GET /users/register`. |
| 4 | **Password Hashing:** Hash the plaintext password using `bcrypt.hash(password, saltRounds)` where `saltRounds` is typically 10–12. |
| 5 | **OTP Generation:** Generate a cryptographically random 6-digit numeric OTP. Store the OTP and its expiry timestamp (current time + 10 minutes) either in a temporary in-memory structure, a database field on a pending user document, or a dedicated OTP collection. |
| 6 | **Email Dispatch:** Send an HTML email to the provided email address containing the OTP. Use `nodemailer` configured with SMTP credentials from environment variables. |
| 7 | **Session Storage:** Store the pending registration data (or a reference identifier) in `req.session` to allow the OTP verification step to access it. |
| 8 | **Redirect:** Redirect to `GET /users/verify-otp`. |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Valid new registration | All valid fields | OTP email sent; redirect to `/users/verify-otp` |
| Email already exists | Existing email | Flash error "Email already registered"; redirect to `/users/register` |
| Passwords don't match | `password !== confirmPassword` | Flash error "Passwords do not match"; redirect to `/users/register` |
| Missing required field | Any field empty | Flash validation error; redirect to `/users/register` |
| Invalid email format | `notanemail` | Flash error "Invalid email format"; redirect to `/users/register` |
| SMTP failure | Valid input, mail server down | Log error; flash error "Could not send OTP email. Try again."; redirect to `/users/register` |

---

### 3.3.2 FR-AUTH-02: OTP Verification

| Attribute         | Specification |
|-------------------|---------------|
| **Routes**        | `GET /users/verify-otp`, `POST /users/verify-otp` |
| **Access Control**| Public (requires pending registration session data) |

**GET /users/verify-otp:**

Renders the OTP entry form. If no pending registration data exists in the session, redirect to `GET /users/register`.

**POST /users/verify-otp:**

| Attribute | Specification |
|-----------|---------------|
| **Body Parameters** | `otp` (String — the 6-digit code entered by the user) |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Retrieve the pending OTP and its expiry timestamp from the session or OTP store. |
| 2 | **Expiry Check:** Compare the current server timestamp against the OTP expiry time. If expired, flash error "OTP has expired. Please register again." Clear pending session data. Redirect to `GET /users/register`. |
| 3 | **OTP Match Check:** Compare submitted `otp` against the stored OTP using a constant-time comparison to prevent timing attacks. If they do not match, flash error "Invalid OTP. Please try again." and redirect back to `GET /users/verify-otp`. Implement an attempt counter; after 5 failed attempts, invalidate the OTP and redirect to `/users/register`. |
| 4 | **Account Creation:** If OTP is valid and not expired: Create a new `User` document in MongoDB with the pending registration data. Set `isVerified: true` on the document. |
| 5 | **Session Establishment:** Set `req.session.userId = newUser._id`. |
| 6 | **Cleanup:** Remove pending OTP data from the session or OTP store. |
| 7 | **Redirect:** Flash success message. Redirect to `/` (homepage). |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Correct OTP within time limit | Valid 6-digit OTP | User created in DB; session established; redirect to homepage |
| Incorrect OTP | Wrong 6-digit code | Flash error "Invalid OTP"; remain on `/users/verify-otp` |
| Expired OTP | Correct OTP but after 10 minutes | Flash error "OTP expired"; redirect to `/users/register` |
| No pending registration | Direct navigation to `/users/verify-otp` | Redirect to `/users/register` |
| Too many failed attempts | 5+ incorrect OTPs | OTP invalidated; redirect to `/users/register` with explanation |

---

### 3.3.3 FR-AUTH-03: User Login

| Attribute         | Specification |
|-------------------|---------------|
| **Routes**        | `GET /users/login`, `POST /users/login` |
| **Access Control**| Public (redirect authenticated users) |

**GET /users/login:**

Renders the login form. If `res.locals.user` is not null, redirect to `/`.

**POST /users/login:**

| Body Parameters | `email` (String), `password` (String) |
|-----------------|---------------------------------------|

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Extract `email` and `password` from `req.body`. |
| 2 | **User Lookup:** Execute `User.findOne({ email })`. If no document found, flash generic error "Invalid email or password" and redirect to `GET /users/login`. (Generic message prevents user enumeration.) |
| 3 | **Verification Check:** If the User document exists but `isVerified: false`, flash error "Please verify your email before logging in." and redirect to `GET /users/login`. |
| 4 | **Password Verification:** Execute `bcrypt.compare(password, user.hashedPassword)`. If result is `false`, flash generic error "Invalid email or password" and redirect to `GET /users/login`. |
| 5 | **Session Creation:** Set `req.session.userId = user._id`. |
| 6 | **Redirect:** Flash success message. Redirect to `/` or to the originally requested URL if stored in session (post-login redirect). |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Valid credentials | Correct email and password | Session created; redirect to homepage |
| Wrong password | Correct email, wrong password | Flash "Invalid email or password"; redirect to login |
| Non-existent email | Unregistered email | Flash "Invalid email or password" (same message, no enumeration) |
| Unverified account | Valid credentials but unverified | Flash "Please verify your email"; redirect to login |
| Already logged in | Visit `/users/login` with active session | Redirect to `/` |

---

### 3.3.4 FR-AUTH-04: User Logout

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /users/logout` |
| **Access Control**| Authenticated (`isLoggedIn`) |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Call `req.session.destroy()` to invalidate and delete the server-side session. |
| 2 | Clear the `connect.sid` session cookie from the client browser via `res.clearCookie('connect.sid')`. |
| 3 | Redirect to `GET /users/login` with a flash success message "You have been logged out." |

---

### 3.3.5 FR-AUTH-05: Forgot Password Flow

| Attribute         | Specification |
|-------------------|---------------|
| **Routes**        | `GET /users/forgot-password`, `POST /users/forgot-password` |
| **Access Control**| Public |

**GET /users/forgot-password:**

Renders the forgot-password form requesting the user's registered email address.

**POST /users/forgot-password:**

| Body Parameters | `email` (String) |
|-----------------|-----------------|

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Lookup `User.findOne({ email })`. |
| 2 | **Unconditional Response:** Regardless of whether the email exists in the database, flash the message "If your email is registered, you will receive a password reset link." and redirect back to the form. This is mandatory to prevent user account enumeration. |
| 3 | **If user exists (internal, non-disclosed branch):** Generate a cryptographically secure random token using `crypto.randomBytes(32).toString('hex')`. |
| 4 | Compute the token expiry: `Date.now() + 3600000` (1 hour from now). |
| 5 | Store the `resetToken` (hashed version recommended) and `resetTokenExpiry` on the User document and save. |
| 6 | Construct the reset URL: `${process.env.BASE_URL}/users/reset-password/${token}`. |
| 7 | Send a password reset email to the user's address containing the reset URL. |

---

### 3.3.6 FR-AUTH-06: Password Reset

| Attribute         | Specification |
|-------------------|---------------|
| **Routes**        | `GET /users/reset-password/:token`, `POST /users/reset-password/:token` |
| **Access Control**| Public (token serves as temporary credential) |

**GET /users/reset-password/:token:**

| Step | Logic |
|------|-------|
| 1 | Extract `token` from `req.params.token`. |
| 2 | Query `User.findOne({ resetToken: hash(token), resetTokenExpiry: { $gt: Date.now() } })`. |
| 3 | If no matching user found, flash error "Password reset link is invalid or has expired." Redirect to `GET /users/forgot-password`. |
| 4 | If valid, render the password reset form, passing the token as a hidden field or embedding it in the action URL. |

**POST /users/reset-password/:token:**

| Body Parameters | `password` (String), `confirmPassword` (String) |
|-----------------|------------------------------------------------|

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Re-validate the token as in the GET step above. |
| 2 | Validate `password` meets minimum requirements and matches `confirmPassword`. |
| 3 | Hash the new password via `bcrypt.hash()`. |
| 4 | Update the User document: set the new hashed password, unset `resetToken` and `resetTokenExpiry`. |
| 5 | Save the document. |
| 6 | Flash success message "Password reset successfully. Please log in." Redirect to `GET /users/login`. |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Valid token within 1 hour | Correct token URL | Reset form displayed |
| Expired token | Correct token but after 1 hour | Flash "Link expired"; redirect to forgot-password |
| Invalid/tampered token | Malformed token | Flash "Invalid link"; redirect to forgot-password |
| Password mismatch | `password !== confirmPassword` | Flash validation error; re-render form |
| Successful reset | Valid token, matching passwords | Password updated in DB; tokens cleared; redirect to login |

---

### 3.3.7 FR-PROFILE-01: View User Profile

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /users/profile` |
| **Access Control**| Authenticated (`isLoggedIn` middleware) |
| **Middleware Chain** | `isLoggedIn` → Controller |

**Processing Logic:**
Retrieve the full User document for `req.session.userId` using `User.findById()`. Render the profile view EJS template, passing the user object (including full name, email, phone, and the addresses array).

---

### 3.3.8 FR-PROFILE-02: Update Profile via AJAX

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/profile/update` |
| **Access Control**| Authenticated (`isLoggedIn`) |
| **Request Type**  | AJAX (Fetch API call; `Content-Type: application/json` or URL-encoded) |
| **Response Type** | JSON |

**Body Parameters:**

| Parameter  | Type   | Required | Description |
|------------|--------|----------|-------------|
| `fullName` | String | No       | Updated full name |
| `phone`    | String | No       | Updated phone number |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Validate submitted fields. `fullName` must be non-empty if provided. `phone` must match a valid 10-digit Indian mobile number format if provided. |
| 2 | Execute `User.findByIdAndUpdate(req.session.userId, { fullName, phone }, { new: true, runValidators: true })`. |
| 3 | Return a JSON response: `{ success: true, message: "Profile updated successfully" }` on success. |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Valid name and phone | `{ fullName: "Ravi K.", phone: "9876543210" }` | HTTP 200, `{ success: true }` |
| Empty fullName | `{ fullName: "" }` | HTTP 400, `{ success: false, error: "Name cannot be empty" }` |
| Invalid phone | `{ phone: "12345" }` | HTTP 400, `{ success: false, error: "Invalid phone number" }` |
| DB error | Any valid input, DB failure | HTTP 500, `{ success: false, error: "Server error" }` |

**Client-Side Behavior:** The front-end JavaScript intercepts the form submit event, prevents default form submission, sends the data via `fetch()` to `POST /users/profile/update`, and upon receiving a success response, updates the DOM in-line without a full page reload (e.g., shows a "Saved" toast notification).

---

### 3.3.9 FR-ADDR-01: Add New Address

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/profile/address/add` |
| **Access Control**| Authenticated (`isLoggedIn`) |

**Body Parameters:**

| Parameter    | Type   | Required | Description |
|--------------|--------|----------|-------------|
| `label`      | String | Yes      | Address label (e.g., "Home", "Office") |
| `street`     | String | Yes      | Street address line |
| `city`       | String | Yes      | City name |
| `state`      | String | Yes      | State name |
| `pincode`    | String | Yes      | 6-digit Indian postal code |
| `country`    | String | No       | Country (defaults to "India") |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Validate all required fields. Validate `pincode` is exactly 6 digits. |
| 2 | Construct an address subdocument object. |
| 3 | Execute `User.findByIdAndUpdate(req.session.userId, { $push: { addresses: newAddress } })`. MongoDB assigns an `_id` to the new subdocument automatically. |
| 4 | If the user currently has no other addresses, automatically set this address as the default. |
| 5 | Redirect to `GET /users/profile` with a flash success message. |

---

### 3.3.10 FR-ADDR-02: Delete Address

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/profile/address/delete/:addressId` |
| **Access Control**| Authenticated (`isLoggedIn`) |
| **URL Parameter** | `addressId` — the MongoDB ObjectId `_id` of the address subdocument to delete |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Extract `addressId` from `req.params`. |
| 2 | Verify the address belongs to the current user (i.e., it exists within `req.session.userId`'s addresses array). Prevents unauthorized deletion. |
| 3 | Execute `User.findByIdAndUpdate(req.session.userId, { $pull: { addresses: { _id: addressId } } })`. |
| 4 | If the deleted address was the default address, promote another address to default (e.g., the first remaining address). |
| 5 | Redirect to `GET /users/profile` with flash message. |

---

### 3.3.11 FR-ADDR-03: Edit Address

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/profile/address/edit/:addressId` |
| **Access Control**| Authenticated (`isLoggedIn`) |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Extract `addressId` from `req.params`. |
| 2 | Extract updated fields from `req.body`. |
| 3 | Validate all updated fields per the same rules as `FR-ADDR-01`. |
| 4 | Use MongoDB positional operator to update the specific subdocument: `User.findOneAndUpdate({ _id: userId, 'addresses._id': addressId }, { $set: { 'addresses.$': updatedAddress } })`. |
| 5 | Redirect to `GET /users/profile` with flash success message. |

**Error Scenarios:**

| Error | System Behavior |
|-------|-----------------|
| `addressId` does not belong to the current user | HTTP 403 or redirect with flash "Unauthorized action" |
| Invalid ObjectId format | MongoDB cast error caught; redirect with flash error |

---

### 3.3.12 FR-ADDR-04: Set Default Address

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/profile/address/default/:addressId` |
| **Access Control**| Authenticated (`isLoggedIn`) |
| **Description**   | Toggles the specified address as the user's primary/default delivery address. Only one address may be the default at any time. |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Extract `addressId` from `req.params`. |
| 2 | Verify the address belongs to the current user. |
| 3 | **Atomic update in two steps:** a) Set `isDefault: false` on ALL addresses for this user: `User.updateOne({ _id: userId }, { $set: { 'addresses.$[].isDefault': false } })`. b) Set `isDefault: true` on the target address: `User.updateOne({ _id: userId, 'addresses._id': addressId }, { $set: { 'addresses.$.isDefault': true } })`. |
| 4 | Redirect to `GET /users/profile` with flash message confirming the default address has been updated. |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Valid address set as default | Valid `addressId` | All other addresses `isDefault: false`; target `isDefault: true` |
| Address already is default | Same `addressId` that is already default | No change; redirect with informational message |
| Invalid `addressId` | Non-existent or wrong user's ID | Redirect with "Unauthorized" or "Not found" flash error |

---

### 3.3.13 FR-ADDR-05: Smart Location Fetch (Reverse Geocoding)

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /users/profile/address/fetch-address` |
| **Access Control**| Authenticated (`isLoggedIn`) |
| **Response Type** | JSON |
| **Description**   | Accepts latitude and longitude coordinates from the client (obtained via the browser's `navigator.geolocation` API) and performs reverse geocoding via the OpenStreetMap Nominatim API to return a structured address object suitable for auto-populating the address form fields. |

**Query Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `lat`     | Float  | Yes      | WGS 84 Latitude coordinate |
| `lon`     | Float  | Yes      | WGS 84 Longitude coordinate |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Validate `lat` is in range [-90, 90] and `lon` is in range [-180, 180]. |
| 2 | Construct the Nominatim API URL: `https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}`. |
| 3 | Make an outbound HTTPS GET request to the Nominatim API, including the **mandatory** `User-Agent` header in the format `KushMart/1.0 (contact: {admin_email})`. This complies with Nominatim's Usage Policy, which prohibits unidentified requests. |
| 4 | Parse the JSON response from Nominatim. Extract the `address` object from the response body, which contains fields such as `road`, `suburb`, `city`, `state`, `postcode`, `country`. |
| 5 | **Pincode Extraction (Resilient Fallback):** Nominatim does not always return a `postcode` field for Indian addresses. If `response.address.postcode` is absent or invalid (not a 6-digit number), apply a regex pattern `/\b\d{6}\b/` against the `response.display_name` string. The `display_name` is the full formatted address string; Indian pincodes appear as 6-digit numbers within it. Use the first regex match as the fallback pincode. |
| 6 | Construct and return a JSON response with the structured address fields. |

**Input/Output State Table:**

| Scenario | Input | Expected Output |
|----------|-------|-----------------|
| Valid coordinates, Nominatim returns postcode | `?lat=28.6139&lon=77.2090` | JSON with full address including postcode |
| Valid coordinates, Nominatim lacks postcode | `?lat=26.8467&lon=80.9462` | JSON with address; pincode extracted from `display_name` via regex |
| Valid coordinates, no regex match for pincode | Rural/unmapped coordinates | JSON with partial address, `pincode: null` or empty |
| Invalid coordinates | `?lat=999&lon=999` | HTTP 400 with error "Invalid coordinates" |
| Nominatim API unreachable | Network error | HTTP 503 with error "Geolocation service unavailable" |
| Nominatim API rate limit | Too many requests | HTTP 429 passed through or error message |

**Pincode Regex Specification:**
```
Pattern: /\b\d{6}\b/g
Explanation: \b - Word boundary; \d{6} - Exactly 6 consecutive digits; \b - Word boundary
Purpose: Matches any standalone 6-digit number within the display_name string, which corresponds to an Indian PIN code.
```

---

## 3.4 Cart & Checkout Subsystem

**Router:** `userRouter` mounted at `/users/cart` (all routes require `isLoggedIn`)

All routes in this subsystem require active authentication. Unauthenticated requests are intercepted by the `isLoggedIn` middleware, which flashes an error message "Please log in to continue" and redirects to `GET /users/login`.

### 3.4.1 FR-CART-01: Add Product to Cart

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/cart/add-to-cart/:productId` |
| **Access Control**| `isLoggedIn` |
| **URL Parameter** | `productId` — MongoDB ObjectId of the product to add |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Validate `productId` as a valid MongoDB ObjectId. Fetch `Product.findById(productId)` to confirm the product exists and is in stock. |
| 2 | Retrieve the user's Cart document: `Cart.findOne({ userId: req.session.userId })`. If no cart exists, create a new Cart document. |
| 3 | **Duplicate Check:** Check if the product already exists in the cart's `items` array (match by `productId`). If it does, increment the quantity by 1. If it does not, push a new cart item: `{ productId, quantity: 1, price: product.price }`. |
| 4 | Recalculate the cart total price. |
| 5 | Save the updated Cart document. |
| 6 | Redirect to the previous page (`req.headers.referer`) or to `/` with a flash success message. |

**Error Scenarios:**

| Error | System Behavior |
|-------|-----------------|
| Product not found | Flash "Product not found"; redirect to product list |
| Product out of stock | Flash "Product is out of stock"; redirect |
| DB save failure | Flash error; redirect |

---

### 3.4.2 FR-CART-02: Remove Product from Cart

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/cart/remove-product/:productId` |
| **Access Control**| `isLoggedIn` |

**Processing Logic:**
Pull the cart item with the matching `productId` from the Cart document's `items` array using `$pull`. Recalculate the cart total. Save. Redirect to referrer or `/users/cart`.

---

### 3.4.3 FR-CART-03: Increase Item Quantity

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/cart/update/increaseQty/:productId` |
| **Access Control**| `isLoggedIn` |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Fetch the product to verify current stock level. |
| 2 | Find the cart item in the user's Cart. Check that the current quantity is less than the available `product.stock`. |
| 3 | If stock allows, increment the cart item quantity by 1 using the MongoDB positional operator: `Cart.updateOne({ userId, 'items.productId': productId }, { $inc: { 'items.$.quantity': 1 } })`. |
| 4 | Recalculate cart total. Redirect. |

**Error Scenarios:**

| Error | System Behavior |
|-------|-----------------|
| Requested quantity exceeds stock | Flash "Not enough stock available"; no quantity change |

---

### 3.4.4 FR-CART-04: Decrease Item Quantity

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/cart/update/descreaseQty/:productId` |
| **Access Control**| `isLoggedIn` |
| **Note**          | The route path "descrease" reflects the as-built production system spelling. |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Find the cart item. Check current quantity. |
| 2 | If `quantity > 1`: Decrement by 1 via `$inc: { 'items.$.quantity': -1 }`. |
| 3 | If `quantity === 1`: Automatically remove the item from the cart (same behavior as FR-CART-02) to prevent zero-quantity items. |
| 4 | Recalculate cart total. Redirect. |

---

### 3.4.5 FR-CART-05: Checkout

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /users/cart/checkout` |
| **Access Control**| `isLoggedIn` |
| **Description**   | Converts the user's current Cart into a confirmed Order document and clears the Cart. |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Retrieve the user's Cart document. Verify it is non-empty. |
| 2 | Retrieve the user's default delivery address from their User document (address where `isDefault: true`). |
| 3 | **Address Validation:** If no default address is set, flash error "Please add and select a delivery address before checkout." Redirect to `GET /users/profile`. |
| 4 | **Stock Verification:** For each cart item, fetch the corresponding Product document and verify that `product.stock >= cart_item.quantity`. If any product is insufficiently stocked, flash the specific error and abort checkout. |
| 5 | **Order Creation:** Create a new `Order` document with the following fields: `userId`, `items` (copy of cart items with product references, quantities, and price at time of purchase), `deliveryAddress` (snapshot of the default address at time of order), `totalPrice` (computed sum), `status: 'Ordered'`, `orderedAt: new Date()`. |
| 6 | **Stock Decrement:** For each item in the order, execute `Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } })` to decrement stock levels. |
| 7 | **Cart Clearance:** Delete or empty the Cart document for this user. |
| 8 | **Redirect:** Flash "Order placed successfully!" Redirect to `GET /users/orders`. |

**Error Scenarios:**

| Error | System Behavior |
|-------|-----------------|
| Empty cart | Flash "Your cart is empty"; redirect to `/` |
| No default address | Flash "Please set a delivery address"; redirect to `/users/profile` |
| Insufficient stock for one or more items | Flash itemized error; cart NOT cleared; redirect back to cart |
| Order save failure | Rollback stock changes if partially applied; flash DB error |

---

## 3.5 Order Fulfillment & Tracking Subsystem

**Router:** `userRouter` (routes under `/users/orders`, all require `isLoggedIn`)

### 3.5.1 FR-ORD-01: View Order History

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /users/orders` |
| **Access Control**| `isLoggedIn` |
| **Description**   | Renders the user's complete order history. Each order displays its current status within a visual state machine indicator. |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Query `Order.find({ userId: req.session.userId }).sort({ orderedAt: -1 })` to retrieve all orders for the current user, sorted by most recent first. |
| 2 | For each order, populate product references within the `items` array using `.populate('items.productId')` to include product name and image in the rendered view. |
| 3 | Render the orders view, passing the orders array. |

**Order Status State Machine:**

The order fulfillment lifecycle is modeled as a linear state machine with four defined states. The current state is stored as a string in the `Order.status` field. The UI renders a progress indicator (e.g., a step-bar or timeline) reflecting the current state.

| State Index | Status String       | Description | Visual Indicator |
|-------------|---------------------|-------------|-----------------|
| 0           | `"Ordered"`         | Order has been placed and is awaiting processing by the store | Step 1 active |
| 1           | `"Packing"`         | Store has acknowledged the order and is preparing/packing the items | Step 2 active |
| 2           | `"Out for Delivery"`| Packaged order has been dispatched for delivery | Step 3 active |
| 3           | `"Delivered"`       | Order has been successfully delivered to the customer | Step 4 active |

**State Transition Rules (enforced by Admin, see FR-ADMIN-02):**

```
Ordered → Packing → Out for Delivery → Delivered
```

Transitions are **unidirectional** — a status cannot be downgraded once advanced (enforced by validation in the admin update controller). Cancellation is not modeled in the current version.

---

### 3.5.2 FR-ORD-02: View Order Invoice / Bill

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /users/orders/bill/:orderId` |
| **Access Control**| `isLoggedIn` |
| **URL Parameter** | `orderId` — MongoDB ObjectId of the order |
| **Description**   | Renders a formatted invoice/bill view for a specific order. |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Extract `orderId` from `req.params`. |
| 2 | Query `Order.findById(orderId).populate('items.productId').populate('userId')`. |
| 3 | **Authorization Check:** Verify that `order.userId.toString() === req.session.userId.toString()`. If not, the requesting user does not own this order. Redirect with HTTP 403 or flash "Unauthorized." |
| 4 | Render the bill/invoice EJS template with the full order details including: order ID, ordered date, all line items (product name, quantity, unit price, line total), subtotal, any applicable taxes, and delivery address. |

**Error Scenarios:**

| Error | System Behavior |
|-------|-----------------|
| Order not found | Flash "Order not found"; redirect to `/users/orders` |
| Order belongs to another user | Flash "Unauthorized"; redirect to `/users/orders` |

---

## 3.6 Product Management System

**Router:** `productRouter` mounted at `/products`

This subsystem serves two user classes: public consumers (read-only access to catalog) and the administrator (full CRUD access).

### 3.6.1 FR-PROD-01: Product Catalog (All Products)

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /products/allProducts` |
| **Access Control**| Public |
| **Description**   | Renders the complete product catalog. If the user is authenticated, injects their current cart data (specifically, which products are already in the cart and in what quantities) to enable the "Add to Cart" / "Already in Cart" UI state distinction. |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Execute `Product.find({})` to retrieve all product documents. Optional: filter by `isActive: true` if products have an active/inactive flag. |
| 2 | If `res.locals.user` is not null: Retrieve `Cart.findOne({ userId: req.session.userId })` to get the active cart. |
| 3 | Render the catalog EJS template, passing both the `products` array and the `cart` object. The template can use the cart object to determine per-product button states (e.g., "Add to Cart" vs "In Cart"). |

---

### 3.6.2 FR-PROD-02: Single Product Detail View

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /products/view/:id` |
| **Access Control**| Public |
| **URL Parameter** | `id` — MongoDB ObjectId of the product |
| **Description**   | Renders the detail page for a single product, showing full description, price, stock status, and category. |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Execute `Product.findById(req.params.id)`. |
| 2 | If product not found or is inactive, redirect to `/products/allProducts` with flash error "Product not found." |
| 3 | Render the product detail EJS template with the product data. |

---

### 3.6.3 FR-PROD-03: Create New Product (Admin)

| Attribute         | Specification |
|-------------------|---------------|
| **Routes**        | `GET /products/create`, `POST /products/create` |
| **Access Control**| `attachUser` + `isAdmin` (both required) |
| **Middleware Chain** | `attachUser` → `isAdmin` → Multer file upload handler → Controller |

**GET /products/create:**
Renders the product creation form with fields for name, description, price, category, stock, and an image upload input.

**POST /products/create:**

| Content-Type | `multipart/form-data` (required for file upload via Multer) |
|---|---|

**Body Parameters:**

| Parameter     | Type    | Required | Description |
|---------------|---------|----------|-------------|
| `name`        | String  | Yes      | Product name |
| `description` | String  | Yes      | Detailed product description |
| `price`       | Number  | Yes      | Product price in INR (Indian Rupees) |
| `category`    | String  | Yes      | Product category (e.g., "Vegetables", "Grains") |
| `stock`       | Integer | Yes      | Initial available stock quantity |
| `image`       | File    | Yes      | Product image file (JPEG, PNG; Multer processes this field) |

**Multer Configuration:**

| Attribute | Value |
|-----------|-------|
| **Storage** | `diskStorage` — files stored on the server filesystem in a designated directory (e.g., `public/images/products/`) or memory storage if piped to cloud |
| **File Filter** | Accept only `image/jpeg` and `image/png` MIME types. Reject all other file types with an error. |
| **File Size Limit** | Maximum 5 MB per upload |
| **Filename** | Generated as a unique filename using `Date.now() + '-' + originalname` or a UUID to prevent collisions |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Multer middleware runs first, processing the `image` field and storing the file. The file path/filename is available at `req.file`. |
| 2 | Validate all text fields from `req.body`. |
| 3 | Create a new `Product` document with all validated fields, setting `image` to `req.file.filename` or `req.file.path`. |
| 4 | Save the document to MongoDB. |
| 5 | Redirect to `/products/allProducts` or the admin panel with a flash success message. |

**Error Scenarios:**

| Error | System Behavior |
|-------|-----------------|
| No image uploaded | Multer error caught; flash "Product image is required"; redirect to form |
| Invalid file type | Multer file filter rejects; flash "Only JPEG and PNG images allowed" |
| File size exceeded | Multer error; flash "Image must be smaller than 5MB" |
| Non-admin user attempts access | `isAdmin` middleware redirects to `/` with flash "Unauthorized" |
| Validation failure | Flash specific validation error; redirect to form |

---

### 3.6.4 FR-PROD-04: Delete Product (Admin)

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /products/delete/:id` |
| **Access Control**| `attachUser` + `isAdmin` |
| **URL Parameter** | `id` — MongoDB ObjectId of the product to delete |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Fetch `Product.findById(req.params.id)` to confirm existence. |
| 2 | Optionally delete the associated image file from the server filesystem using Node.js `fs.unlink()`. |
| 3 | Execute `Product.findByIdAndDelete(req.params.id)`. |
| 4 | Redirect to admin or product list with flash success message. |

**Error Scenarios:**

| Error | System Behavior |
|-------|-----------------|
| Product not found | Flash "Product not found"; redirect |
| Non-admin access | `isAdmin` middleware intercepts; redirect unauthorized |

---

### 3.6.5 FR-PROD-05: Edit Product (Admin)

| Attribute         | Specification |
|-------------------|---------------|
| **Routes**        | `GET /products/edit/:id`, `POST /products/edit/:id` |
| **Access Control**| `attachUser` + `isAdmin` |
| **Content-Type**  | `multipart/form-data` (Multer handles optional new image) |

**GET /products/edit/:id:**
Fetch the product by `id`. Render the edit form pre-populated with the current product data.

**POST /products/edit/:id:**

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Multer processes the form. `req.file` is defined only if a new image was uploaded. |
| 2 | Validate text fields from `req.body`. |
| 3 | Construct the update object with all submitted text fields. |
| 4 | If `req.file` is defined (new image provided): add the new image path/filename to the update object. Optionally delete the old image file from the filesystem. |
| 5 | Execute `Product.findByIdAndUpdate(req.params.id, updateObject, { new: true, runValidators: true })`. |
| 6 | Redirect with flash success message. |

---

## 3.7 Admin Infrastructure & Analytics Dashboard

**Router:** `adminRouter` mounted at `/admin`

All routes in this subsystem require `isAdmin` middleware. Unauthenticated or non-admin requests are intercepted and redirected.

### 3.7.1 FR-ADMIN-01: Admin Order List

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /admin/orders` |
| **Access Control**| `isAdmin` |
| **Description**   | Renders the admin order management panel listing all customer orders with full relational data population. |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Execute `Order.find({}).populate('userId').populate('items.productId').sort({ orderedAt: -1 })`. This populates: a) `userId` → full User document (for displaying customer name, email, phone). b) `items.productId` → full Product document for each line item (for displaying product name and image). |
| 2 | Render the admin orders EJS template with the populated orders array. |

**Data Rendering Requirements:**

| Field | Source | Rendered Display |
|-------|--------|-----------------|
| Customer Name | `order.userId.fullName` | Customer column |
| Customer Email | `order.userId.email` | Customer column |
| Order ID | `order._id` | Order ID column |
| Ordered Date | `order.orderedAt` | Date column (formatted) |
| Total Price | `order.totalPrice` | Amount column |
| Current Status | `order.status` | Status badge with color coding |
| Products | `order.items[]` with populated product | Items list |

---

### 3.7.2 FR-ADMIN-02: Update Order Status

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `POST /admin/orders/update/:id` |
| **Access Control**| `isAdmin` |
| **URL Parameter** | `id` — MongoDB ObjectId of the Order document |
| **Description**   | Updates the fulfillment status of a specific order, advancing it forward in the defined state machine. |

**Body Parameters:**

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `status`  | String | Yes      | The new status value. Must be one of: `"Packing"`, `"Out for Delivery"`, `"Delivered"`. |

**Processing Logic:**

| Step | Logic |
|------|-------|
| 1 | Extract `id` from `req.params` and `status` from `req.body`. |
| 2 | **Status Validation:** Verify that the submitted `status` is a member of the allowable set: `["Ordered", "Packing", "Out for Delivery", "Delivered"]`. Reject invalid values. |
| 3 | **State Machine Enforcement:** Retrieve the current Order document. Verify that the requested new status is a valid forward transition from the current status. Reject backward transitions. |
| 4 | Execute `Order.findByIdAndUpdate(id, { status: newStatus })`. |
| 5 | Redirect to `GET /admin/orders` with a flash success message. |

**State Transition Validation Table:**

| Current Status      | Allowed Next Status         | Disallowed Status |
|---------------------|-----------------------------|-------------------|
| `"Ordered"`         | `"Packing"`                 | All others |
| `"Packing"`         | `"Out for Delivery"`        | All others |
| `"Out for Delivery"`| `"Delivered"`               | All others |
| `"Delivered"`       | None (terminal state)       | Any |

**Error Scenarios:**

| Error | System Behavior |
|-------|-----------------|
| Invalid status string submitted | Flash "Invalid status value"; redirect |
| Backward state transition attempted | Flash "Cannot downgrade order status"; redirect |
| Order not found | Flash "Order not found"; redirect |

---

### 3.7.3 FR-ADMIN-03: Business Analytics Dashboard

| Attribute         | Specification |
|-------------------|---------------|
| **Route**         | `GET /admin/analytics` |
| **Access Control**| `isAdmin` |
| **Description**   | Renders an analytics dashboard providing key business performance indicators. All computations are performed server-side in the controller using JavaScript array methods applied to Order and Product collections. |

**Processing Logic:**

**Step 1 — Data Retrieval:**

Execute `Order.find({}).populate('items.productId')` to retrieve all orders in the system with product references populated.

Execute `Product.find({})` to retrieve all products for low-stock analysis.

**Step 2 — Total Orders Calculation:**

```
totalOrders = orders.length
```

Count of all Order documents in the collection.

**Step 3 — Total Revenue Calculation:**

```javascript
totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
```

Applies JavaScript's native `Array.prototype.reduce()` method to sum the `totalPrice` field across all Order documents. Revenue is calculated in Indian Rupees (INR).

**Step 4 — Monthly Sales Analysis:**

```javascript
// Initialize 12-element array indexed 0 (January) through 11 (December)
monthlySales = new Array(12).fill(0);

orders.forEach(order => {
  const monthIndex = new Date(order.orderedAt).getMonth(); // 0-indexed
  monthlySales[monthIndex] += order.totalPrice;
});
```

Parses each order's `orderedAt` timestamp, extracts the month index (0–11), and accumulates the order revenue into the corresponding array position. The resulting 12-element array represents total monthly revenue and is passed to the view for rendering as a bar or line chart.

**Step 5 — Top 5 Selling Products:**

```javascript
// Build a product sales frequency map
const productSalesMap = {};
orders.forEach(order => {
  order.items.forEach(item => {
    const productId = item.productId._id.toString();
    productSalesMap[productId] = (productSalesMap[productId] || 0) + item.quantity;
  });
});

// Sort by quantity sold descending, take top 5
const topProducts = Object.entries(productSalesMap)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([productId, quantitySold]) => ({
    product: order.items.find(i => i.productId._id.toString() === productId)?.productId,
    quantitySold
  }));
```

Maps each order's line items to accumulate total quantities sold per product, then sorts descending and slices the top 5 entries.

**Step 6 — Low Stock Alert:**

```javascript
const lowStockProducts = allProducts.filter(product => product.stock <= 5);
```

Filters the full product list to identify products with a stock level at or below the critical threshold of 5 units. These are flagged for immediate restocking attention.

**Analytics Dashboard Render Context:**

| Variable Name      | Type     | Description |
|--------------------|----------|-------------|
| `totalOrders`      | Integer  | Total number of all-time orders |
| `totalRevenue`     | Float    | Sum of all order `totalPrice` values in INR |
| `monthlySales`     | Array[12]| Revenue indexed by month (index 0 = January, index 11 = December) |
| `topProducts`      | Array[5] | Top 5 selling products with product object and quantity sold |
| `lowStockProducts` | Array    | All products with `stock <= 5` |

**Data Presentation Requirements:**

| KPI | Recommended Visualization |
|-----|--------------------------|
| Total Orders | Large metric card |
| Total Revenue | Large metric card with INR symbol |
| Monthly Sales | Bar chart or line chart (12 bars/points) |
| Top 5 Products | Ranked list with product name and units sold |
| Low Stock Items | Alert table with product name, current stock, red highlight |

---

---

# 4. External Interface Requirements

## 4.1 User Interface Requirements

### 4.1.1 General UI Principles

| Principle | Specification |
|-----------|---------------|
| **Responsive Design** | All pages must render correctly across desktop (≥1024px), tablet (768px–1023px), and mobile (320px–767px) viewports using Tailwind CSS responsive prefixes (`sm:`, `md:`, `lg:`). |
| **Templating Engine** | All server-rendered HTML is generated using EJS (`.ejs` files). Dynamic data is interpolated using EJS tags (`<%= %>`, `<% %>`). Partials are used for reusable components (header, footer, navigation bar). |
| **Global Navigation** | Every page displays a top navigation bar. The nav bar conditionally renders: (a) login/register links for unauthenticated users; (b) cart icon with item count, profile link, and logout for authenticated customers; (c) admin panel link for admin users. This is enabled by `res.locals.user` provided by `attachUser`. |
| **Flash Messages** | Server-side flash messages (`connect-flash`) are displayed as dismissible UI banners (success in green, error in red, info in blue) at the top of the page content area. Flash messages are consumed and cleared upon display. |
| **Form Validation Feedback** | Validation errors are communicated via flash messages (server-side) and, where applicable, HTML5 `required` and `pattern` attributes for immediate client-side feedback. |
| **Cart Count Badge** | The navigation cart icon displays the current number of distinct items in the user's cart as a numeric badge. This count is injected server-side via `res.locals`. |

### 4.1.2 Page-Specific UI Requirements

| Page | UI Requirement |
|------|----------------|
| **Homepage** | Product grid with category/search filter controls. Search bar triggers AJAX live search. Cart price displayed in nav. |
| **Live Search Dropdown** | A floating dropdown anchored below the search input. Populated by AJAX JSON responses. Each result is a clickable link to `GET /products/view/:id`. Disappears when input is cleared. |
| **Product Catalog** | Grid of product cards. Each card shows image, name, price, and "Add to Cart" button. Out-of-stock products display "Out of Stock" badge. |
| **Product Detail** | Full product image, name, description, price, category, stock count, and "Add to Cart" button. |
| **Login / Register Forms** | Centered card layout. Input fields with labels. Submit button. Link to switch between login and register. |
| **OTP Verification** | Single OTP input field. Submit button. Countdown timer (optional) showing OTP validity window. |
| **Profile Page** | Inline-editable fields for name and phone. Address list showing all saved addresses. Default address highlighted. Add/Edit/Delete/Set Default actions per address. "Use My Location" button for smart geolocation. |
| **Cart Page** | Table or list of cart items with product image, name, quantity controls (+ / −), unit price, line total. Cart grand total at bottom. Checkout button. |
| **Orders Page** | List of orders with status tracker component. Each order shows order ID, date, total, and a 4-step progress bar (`Ordered → Packing → Out for Delivery → Delivered`) with the current step highlighted. Invoice link per order. |
| **Invoice Page** | Print-friendly formatted invoice layout with KushMart branding, order details, line items table, and total. |
| **Admin Orders** | Full-width data table listing all customer orders. Dropdown or button group per row for status update. Color-coded status badges. |
| **Admin Analytics** | Dashboard layout with metric cards and chart area. Chart rendered via a JavaScript chart library (e.g., Chart.js) or server-side rendered progress bars. Low-stock table with warning highlights. |
| **Admin Product Create/Edit** | Multi-field form with image preview. Multer-compatible `enctype="multipart/form-data"`. |

---

## 4.2 Hardware Interfaces

The System does not directly interact with hardware peripherals. Hardware interaction is indirect:

| Interaction | Description |
|-------------|-------------|
| **Geolocation Sensor** | The browser's `navigator.geolocation.getCurrentPosition()` Web API accesses the device GPS or network-based location. The resulting latitude/longitude is sent to the server-side `GET /users/profile/address/fetch-address` endpoint via AJAX. The server then calls the Nominatim API. The System never directly accesses hardware. |
| **Camera / File System** | Product image uploads are handled via standard HTML `<input type="file">` elements. The browser's file system access is managed by the browser itself; the server receives the uploaded file via Multer. |

---

## 4.3 Software Interfaces

### 4.3.1 MongoDB Database Interface

| Attribute | Specification |
|-----------|---------------|
| **Interface Type** | Database — Document Store |
| **ODM Layer** | Mongoose v7.x or later |
| **Connection Method** | `mongoose.connect(process.env.MONGODB_URI)` executed at application startup in `app.js` |
| **Connection URI Format** | `mongodb+srv://<username>:<password>@<cluster-host>/<database-name>?retryWrites=true&w=majority` (for MongoDB Atlas) or `mongodb://localhost:27017/<database-name>` (for local instance) |
| **Connection Options** | `useNewUrlParser: true`, `useUnifiedTopology: true` (for older Mongoose versions; may be deprecated in Mongoose v7+) |
| **Error Handling** | Connection errors are caught and logged to `console.error`. The process may exit (`process.exit(1)`) on fatal connection failure. |
| **Mongoose Schemas** | All data models are defined as Mongoose Schemas with explicit field types, required validators, default values, and index definitions. |

**Core Data Models:**

| Model Name | Collection | Key Fields |
|------------|------------|------------|
| `User` | `users` | `fullName`, `email` (unique, indexed), `password` (hashed), `phone`, `isVerified`, `isAdmin`, `addresses[]` (subdocument array), `resetToken`, `resetTokenExpiry` |
| `Product` | `products` | `name`, `description`, `price`, `category`, `stock`, `image` (path/URL string), `isActive` |
| `Cart` | `carts` | `userId` (ref: User), `items[]` ({ `productId` (ref: Product), `quantity`, `price` }), `totalPrice` |
| `Order` | `orders` | `userId` (ref: User), `items[]` ({ `productId` (ref: Product), `quantity`, `price` }), `deliveryAddress` (snapshot object), `totalPrice`, `status` (enum), `orderedAt` |

**Address Subdocument Schema (embedded in User):**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated by Mongoose |
| `label` | String | Address label (e.g., "Home") |
| `street` | String | Street line |
| `city` | String | City |
| `state` | String | State |
| `pincode` | String | 6-digit Indian PIN code |
| `country` | String | Country (default: "India") |
| `isDefault` | Boolean | Default delivery address flag (default: false) |

---

### 4.3.2 SMTP Email Interface

| Attribute | Specification |
|-----------|---------------|
| **Interface Type** | External Service — Transactional Email |
| **Library** | `nodemailer` |
| **Protocol** | SMTP over TLS (port 587) or SMTP over SSL (port 465) |
| **Authentication** | Username + password credentials stored in environment variables |
| **Usage** | 1. OTP email for registration verification. 2. Password reset link email. |
| **From Address** | Configured in `EMAIL_USER` environment variable; display name set to "KushMart" |
| **Email Content Type** | HTML (for styled emails) with plain-text fallback |

---

### 4.3.3 OpenStreetMap Nominatim API Interface

| Attribute | Specification |
|-----------|---------------|
| **Interface Type** | External REST API |
| **Protocol** | HTTPS |
| **Base URL** | `https://nominatim.openstreetmap.org` |
| **Endpoint Used** | `/reverse` |
| **Method** | GET |
| **Request Format** | Query parameters: `format=json&lat={lat}&lon={lon}` |
| **Required Header** | `User-Agent: KushMart/1.0 (contact: {admin_contact_email})` — **Mandatory per Nominatim Usage Policy** |
| **Response Format** | JSON |
| **Rate Limiting** | Nominatim's public policy limits to 1 request per second maximum. The System should implement appropriate throttling or caching if this endpoint is called frequently. |
| **Error Handling** | Network timeout: respond with HTTP 503 to the client. Nominatim 4xx/5xx: log and respond with an error to the client. |
| **Fallback Behavior** | If `postcode` field is absent or invalid in the Nominatim response `address` object, the System applies the regex `/\b\d{6}\b/` on the `display_name` field to extract the Indian PIN code. |

**Sample Nominatim Response (partial):**
```json
{
  "display_name": "Connaught Place, New Delhi, Delhi, 110001, India",
  "address": {
    "road": "Connaught Place",
    "suburb": "Central Delhi",
    "city": "New Delhi",
    "state": "Delhi",
    "postcode": "110001",
    "country": "India",
    "country_code": "in"
  }
}
```

---

## 4.4 Communication Interfaces

### 4.4.1 HTTP Request-Response Protocol

| Attribute | Specification |
|-----------|---------------|
| **Protocol** | HTTP/1.1 (development), HTTPS/TLS 1.2+ (production via reverse proxy) |
| **Port** | `process.env.PORT` (default 3000 in development; 80/443 in production via Nginx) |
| **Request Methods Used** | `GET` (page rendering, data retrieval), `POST` (form submissions, state mutations) |
| **Note on PUT/DELETE** | The System uses only GET and POST methods for all operations, consistent with standard HTML form capabilities and the EJS/SSR paradigm. Deletion and updates are performed via POST requests with `:id` URL parameters. |

### 4.4.2 AJAX / Fetch API Communication

The System uses client-side `fetch()` API calls (native browser API, no external HTTP library) for the following interactive features:

| Feature | Endpoint | Method | Request Format | Response Format |
|---------|----------|--------|----------------|-----------------|
| Live Search | `/products/search?q=` | GET | URL query string | JSON Array |
| Profile Update | `/users/profile/update` | POST | `application/json` or URL-encoded | JSON Object |
| Geolocation Fetch | `/users/profile/address/fetch-address?lat=&lon=` | GET | URL query string | JSON Object |

**Fetch API Pattern (client-side):**
```javascript
// Example: Live Search
const response = await fetch(`/products/search?q=${encodeURIComponent(searchTerm)}`);
if (!response.ok) throw new Error('Search failed');
const products = await response.json();
// Update DOM with products array
```

### 4.4.3 Session Cookie Communication

| Attribute | Specification |
|-----------|---------------|
| **Cookie Name** | `connect.sid` (default for `express-session`) |
| **HttpOnly Flag** | `true` — cookie is inaccessible to client-side JavaScript, preventing XSS-based session theft |
| **Secure Flag** | `true` in production (requires HTTPS); `false` in development |
| **SameSite Attribute** | `Strict` or `Lax` recommended to mitigate CSRF attacks |
| **MaxAge / Expires** | Configurable via `express-session`; recommended 24 hours for customer sessions |
| **Signing** | Session ID is signed using `SESSION_SECRET` to prevent tampering |

---

---

# 5. Non-Functional Requirements

## 5.1 Performance Requirements

| NFR-ID | Requirement | Target Metric |
|--------|-------------|---------------|
| **NFR-PERF-01** | The homepage (`GET /`) must respond with a fully rendered HTML page, including database query execution, in under **500 milliseconds** (p95) under normal operating load (≤ 50 concurrent users). | ≤ 500ms at p95 |
| **NFR-PERF-02** | The live search AJAX endpoint (`GET /products/search`) must return a JSON response within **200 milliseconds** (p95). The `.limit(6)` constraint and MongoDB index on the `name` field are critical to achieving this. A **text index or regex-optimized index** on the product `name` field is strongly recommended. | ≤ 200ms at p95 |
| **NFR-PERF-03** | The geolocation reverse geocoding endpoint (`GET /users/profile/address/fetch-address`) is bound by the external Nominatim API response time. The System must implement a **request timeout of 5 seconds** on the outbound Nominatim call. If the timeout is exceeded, return HTTP 503 to the client immediately rather than holding the connection open. | 5 second timeout on external call |
| **NFR-PERF-04** | The admin analytics dashboard (`GET /admin/analytics`) performs `.reduce()`, `.filter()`, and `.map()` computations in-memory on potentially large datasets. For stores with more than 10,000 orders, these computations must complete within **2 seconds**. Consider caching the analytics result with a 5-minute TTL (e.g., in-memory or Redis) if computation time exceeds this threshold. | ≤ 2 seconds computation |
| **NFR-PERF-05** | All MongoDB queries that are executed on frequently accessed routes (homepage, product catalog, user orders) **must** leverage appropriate database indexes. At minimum: `email` on the `User` collection (unique index), `userId` on the `Cart` collection, `userId` and `orderedAt` on the `Order` collection. | Index coverage on all hot-path queries |
| **NFR-PERF-06** | Product image files served as static assets must be optimized (compressed JPEG/PNG) and served efficiently. Consider configuring Express `static` middleware with proper cache-control headers (`max-age=86400` for 24-hour browser caching). | Static asset cache TTL ≥ 24 hours |
| **NFR-PERF-07** | The application must support a minimum of **50 simultaneous active user sessions** without performance degradation on standard VPS hardware (2 vCPU, 2 GB RAM). | 50 concurrent users sustained |

---

## 5.2 Security Requirements

| NFR-ID | Requirement | Implementation Mandate |
|--------|-------------|------------------------|
| **NFR-SEC-01** | All customer and admin passwords **must** be stored as bcrypt hashes with a minimum cost factor (salt rounds) of **10**. Plaintext passwords must never be stored or logged. | `bcrypt.hash(password, 10)` minimum |
| **NFR-SEC-02** | The `SESSION_SECRET` environment variable **must** be a cryptographically random string of at least **32 characters**. It **must never** be committed to version control (Git). The `.env` file **must** be listed in `.gitignore`. | `.env` in `.gitignore`; 32+ char secret |
| **NFR-SEC-03** | All session cookies **must** have the `HttpOnly` flag set to `true`. In production environments (HTTPS), the `Secure` flag **must** also be set to `true`. | `httpOnly: true`, `secure: true` (prod) |
| **NFR-SEC-04** | The `isAdmin` middleware **must** independently verify the admin flag from the database-sourced User document (via `res.locals.user` populated by `attachUser`) on every request. Admin status **must not** be stored in the session cookie, as session data on the client side could be manipulated. | Per-request admin verification via DB-sourced user object |
| **NFR-SEC-05** | All admin-protected routes (`/admin/*`, `/products/create`, `/products/edit/:id`, `/products/delete/:id`) **must** be guarded by both `attachUser` and `isAdmin` middleware. Direct URL access by non-admin users **must** result in a redirect, not a 403 error that reveals route existence. | Redirect-based unauthorized handling |
| **NFR-SEC-06** | The password reset token **must** be generated using Node.js `crypto.randomBytes(32)` (256-bit entropy). The token stored in the database **must** be a SHA-256 hash of the raw token. Only the raw token is transmitted via email. This prevents database exfiltration from granting reset access. | Token hashing before DB storage |
| **NFR-SEC-07** | Password reset tokens **must** expire after **1 hour** from generation. The expiry is enforced on both the GET (view form) and POST (process reset) handlers. Expired token submissions must be rejected. | 1-hour token TTL |
| **NFR-SEC-08** | User account enumeration **must** be prevented on both the login endpoint and the forgot-password endpoint. Both must return identical response messages regardless of whether the email exists in the database. | Generic error messages for auth failures |
| **NFR-SEC-09** | Order ownership **must** be verified before rendering an invoice. The order's `userId` field **must** be compared to `req.session.userId` before returning any order data. | Per-request ownership check |
| **NFR-SEC-10** | Address operations (edit, delete, set default) **must** verify that the target address `_id` belongs to the current user's address subdocument array before applying the operation. Cross-user address manipulation **must** be prevented. | Subdocument ownership check |
| **NFR-SEC-11** | All outbound calls to the Nominatim API **must** include a descriptive `User-Agent` header per the OpenStreetMap usage policy. Missing this header may result in IP banning by the Nominatim service. | `User-Agent` header mandatory |
| **NFR-SEC-12** | The Multer file filter **must** validate both the MIME type (`mimetype`) and, where possible, the file extension of uploaded product images. Only `image/jpeg` and `image/png` are accepted. This prevents upload of executable files disguised with image extensions. | Dual validation: MIME type + extension |
| **NFR-SEC-13** | Uploaded image filenames **must** be sanitized and renamed server-side (e.g., using `Date.now() + '-' + originalname` or a UUID). Original filenames from the client **must not** be used directly in filesystem paths to prevent path traversal attacks. | Server-side filename generation |
| **NFR-SEC-14** | Input to the live search `$regex` operator **must** be sanitized or escaped to prevent malicious regex patterns from causing ReDoS (Regular Expression Denial of Service) attacks. Consider wrapping user input with `escapeRegExp()` before passing to MongoDB. | Regex input sanitization |
| **NFR-SEC-15** | The `.env` file containing all secrets **must** never be committed to the repository. A `.env.example` file with placeholder values (but no actual secrets) **should** be committed as documentation for required environment variables. | `.env` never in VCS |

---

## 5.3 Reliability and Availability

| NFR-ID | Requirement | Target |
|--------|-------------|--------|
| **NFR-REL-01** | The application **must** gracefully handle MongoDB connection failures at startup with a descriptive error log and controlled process exit. It **must not** enter a broken state silently. | Clean failure on DB connect error |
| **NFR-REL-02** | In production, the Node.js process **must** be managed by a process manager (PM2 recommended) configured to automatically restart the process on unexpected crashes. | PM2 or equivalent process manager |
| **NFR-REL-03** | SMTP email delivery failures (for OTP and password reset) **must** be caught and handled gracefully. The user **must** receive an appropriate error message. The system **must not** crash or hang indefinitely on email send failure. | Non-blocking SMTP error handling |
| **NFR-REL-04** | Nominatim API failures **must** be handled gracefully. The geolocation feature is considered non-critical; failure **must not** prevent users from manually entering their addresses. | Graceful degradation for geocoding |
| **NFR-REL-05** | All database operations **must** be wrapped in try-catch blocks. Unhandled promise rejections **must** be caught and routed to Express's error-handling middleware. A global Express error handler **must** be defined to return appropriate 500-level responses. | Global error handler; try-catch on all async ops |
| **NFR-REL-06** | The application **should** target **99.5% monthly uptime** (approximately 3.6 hours downtime per month), achievable with automated process restart and a stable cloud VPS provider. | ≥ 99.5% monthly uptime target |

---

## 5.4 Maintainability and Scalability

| NFR-ID | Requirement |
|--------|-------------|
| **NFR-MNT-01** | **MVC Separation:** Business logic **must** remain in controller functions (route handlers). EJS views **must** contain only presentational logic. Mongoose models **must** contain only schema definitions, instance methods, and static helpers. No business logic in views. |
| **NFR-MNT-02** | **Modular Router Structure:** Each router module (`indexRouter`, `userRouter`, `adminRouter`, `productRouter`) **must** be maintained as a separate file in the `routes/` directory. Router files **must not** exceed a reasonable line count; extract controller logic into separate `controllers/` files if routes grow complex. |
| **NFR-MNT-03** | **Environment-Driven Configuration:** All configurable values that differ between environments (development vs. production) — including database URI, session secret, SMTP credentials, port, and base URL — **must** be externalized to environment variables. Hardcoded environment-specific values in source code are prohibited. |
| **NFR-MNT-04** | **EJS Partial Reuse:** Common UI components (navigation bar, footer, flash message display, head/meta tags) **must** be extracted into EJS partial files and included via `<%- include('partials/navbar') %>`. Code duplication across view files is prohibited for shared components. |
| **NFR-MNT-05** | **Code Documentation:** All custom middleware functions (`attachUser`, `isLoggedIn`, `isAdmin`) and non-trivial controller logic **must** be documented with inline JSDoc-style comments describing purpose, parameters, and behavior. |
| **NFR-MNT-06** | **Dependency Management:** All npm dependencies **must** be declared in `package.json` with locked versions in `package-lock.json`. The `node_modules/` directory **must** be listed in `.gitignore`. |
| **NFR-MNT-07** | **Horizontal Scalability Note:** The current monolithic architecture with server-side sessions is not horizontally scalable without introducing a shared session store (e.g., `connect-mongo` to store sessions in MongoDB, or Redis). If future load requires multiple Node.js instances behind a load balancer, the session store **must** be migrated from in-memory to a persistent shared store. |
| **NFR-MNT-08** | **Analytics Caching:** If the analytics computation time (`GET /admin/analytics`) grows beyond 2 seconds due to data volume growth, a caching layer (in-memory or Redis TTL cache) **must** be introduced without requiring structural changes to the analytics controller. |

---

## 5.5 Portability

| NFR-ID | Requirement |
|--------|-------------|
| **NFR-PORT-01** | The application **must** be deployable on any operating system that supports Node.js LTS (Linux, macOS, Windows) without code modifications. OS-specific path separators (e.g., `path.join()` vs. hardcoded `/`) **must** be handled using Node.js `path` module. |
| **NFR-PORT-02** | The application **must** be containerizable using Docker. A `Dockerfile` **should** be provided defining the Node.js base image, dependency installation, and startup command to enable containerized deployment on platforms such as Docker Hub, AWS ECS, Google Cloud Run, or Railway. |
| **NFR-PORT-03** | The MongoDB connection URI abstraction via `MONGODB_URI` environment variable ensures portability between local development MongoDB instances, Docker-hosted MongoDB, and MongoDB Atlas cloud without code changes. |
| **NFR-PORT-04** | Static file serving (Tailwind CSS output, product images) **must** use Express's `express.static()` middleware, which handles relative path resolution correctly across OS environments. |

---

## 5.6 Usability

| NFR-ID | Requirement |
|--------|-------------|
| **NFR-USE-01** | **Mobile Responsiveness:** All customer-facing pages (homepage, product catalog, cart, orders, profile) **must** be fully functional and usable on mobile devices with viewport widths from 320px (iPhone SE) upward. Tailwind CSS responsive classes **must** be used consistently. |
| **NFR-USE-02** | **Feedback on Actions:** Every state-mutating user action (add to cart, place order, update profile, add address, etc.) **must** result in immediate visual feedback via a flash message banner displayed on the subsequent page render. AJAX-based actions must display an inline success or error indicator. |
| **NFR-USE-03** | **Loading Indicators for AJAX:** The live search dropdown **must** display a loading indicator (spinner or "Searching..." text) while the AJAX request to `/products/search` is in flight, to provide feedback during network latency. |
| **NFR-USE-04** | **Form Pre-population:** The product edit form (`GET /products/edit/:id`) **must** pre-populate all form fields with the current product data, allowing the admin to see existing values and modify only the desired fields. |
| **NFR-USE-05** | **Empty States:** The cart page, orders page, and product catalog **must** display informative empty-state messages (e.g., "Your cart is empty — start shopping!", "No orders yet.") rather than blank pages or unformatted empty lists. |
| **NFR-USE-06** | **Order Tracking Clarity:** The 4-step order status progress bar on the orders page **must** visually distinguish between completed states (filled/colored), the current active state (highlighted/animated), and future states (grayed out). |
| **NFR-USE-07** | **Input Accessibility:** All form `<input>` elements **must** have corresponding `<label>` elements. Buttons **must** have descriptive text or `aria-label` attributes. This supports screen readers and assistive technologies. |
| **NFR-USE-08** | **Search Bar Debounce:** The client-side live search `input` event listener **must** be debounced with a delay of at minimum **300 milliseconds** to prevent excessive API requests on every keystroke and to deliver a smooth search experience. |

---

---

## Appendix A: Route Reference Summary

| Method | Route Path | Router | Access | Description |
|--------|------------|--------|--------|-------------|
| GET | `/` | Index | Public | Dynamic homepage with search/category filters |
| GET | `/products/search` | Index | Public | AJAX live search endpoint |
| GET | `/about` | Index | Public | Static about page |
| GET | `/users/register` | User | Public | Registration form |
| POST | `/users/register` | User | Public | Process registration, send OTP |
| GET | `/users/verify-otp` | User | Semi-public | OTP entry form |
| POST | `/users/verify-otp` | User | Semi-public | Verify OTP, create account |
| GET | `/users/login` | User | Public | Login form |
| POST | `/users/login` | User | Public | Process login |
| GET | `/users/logout` | User | `isLoggedIn` | Destroy session, logout |
| GET | `/users/forgot-password` | User | Public | Forgot password form |
| POST | `/users/forgot-password` | User | Public | Send password reset email |
| GET | `/users/reset-password/:token` | User | Public | Password reset form (token-guarded) |
| POST | `/users/reset-password/:token` | User | Public | Process password reset |
| GET | `/users/profile` | User | `isLoggedIn` | View user profile |
| POST | `/users/profile/update` | User | `isLoggedIn` | AJAX update profile name/phone |
| POST | `/users/profile/address/add` | User | `isLoggedIn` | Add new delivery address |
| POST | `/users/profile/address/delete/:addressId` | User | `isLoggedIn` | Delete delivery address |
| POST | `/users/profile/address/edit/:addressId` | User | `isLoggedIn` | Edit delivery address |
| POST | `/users/profile/address/default/:addressId` | User | `isLoggedIn` | Set address as default |
| GET | `/users/profile/address/fetch-address` | User | `isLoggedIn` | Nominatim reverse geocoding |
| POST | `/users/cart/add-to-cart/:productId` | User | `isLoggedIn` | Add product to cart |
| POST | `/users/cart/remove-product/:productId` | User | `isLoggedIn` | Remove product from cart |
| POST | `/users/cart/update/increaseQty/:productId` | User | `isLoggedIn` | Increase cart item quantity |
| POST | `/users/cart/update/descreaseQty/:productId` | User | `isLoggedIn` | Decrease cart item quantity |
| POST | `/users/cart/checkout` | User | `isLoggedIn` | Place order from cart |
| GET | `/users/orders` | User | `isLoggedIn` | View order history with tracking |
| GET | `/users/orders/bill/:orderId` | User | `isLoggedIn` | View order invoice |
| GET | `/products/allProducts` | Product | Public | Full product catalog |
| GET | `/products/view/:id` | Product | Public | Single product detail |
| GET | `/products/create` | Product | `isAdmin` | Product creation form |
| POST | `/products/create` | Product | `isAdmin` | Create new product (Multer) |
| POST | `/products/delete/:id` | Product | `isAdmin` | Delete product |
| GET | `/products/edit/:id` | Product | `isAdmin` | Product edit form |
| POST | `/products/edit/:id` | Product | `isAdmin` | Update product (Multer) |
| GET | `/admin/orders` | Admin | `isAdmin` | Admin order list with population |
| POST | `/admin/orders/update/:id` | Admin | `isAdmin` | Update order fulfillment status |
| GET | `/admin/analytics` | Admin | `isAdmin` | Business analytics dashboard |

---

## Appendix B: Order Status State Machine Diagram (Textual)

```
+-------------+     Admin Action      +-----------+     Admin Action      +------------------+     Admin Action     +-----------+
|   ORDERED   |  ─────────────────>  |  PACKING  |  ─────────────────>  | OUT FOR DELIVERY |  ─────────────────> | DELIVERED |
| (Initial)   |                      |           |                      |                  |                     | (Terminal)|
+-------------+                      +-----------+                      +------------------+                     +-----------+

- Transitions are UNIDIRECTIONAL (forward only)
- Status is stored as a String in Order.status field
- Customer can VIEW current status but cannot trigger transitions
- Admin triggers transitions via POST /admin/orders/update/:id
- Each transition is validated server-side before application
```

---

## Appendix C: Middleware Guard Definitions

### `isLoggedIn` Middleware

```javascript
// Pseudocode specification
function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId && res.locals.user) {
    return next(); // User is authenticated — proceed
  }
  req.flash('error', 'Please log in to continue.');
  return res.redirect('/users/login'); // Redirect unauthenticated users
}
```

| Condition | Outcome |
|-----------|---------|
| `req.session.userId` defined AND `res.locals.user` not null | `next()` — request proceeds to route handler |
| Either condition false | Flash error message; redirect to `GET /users/login` |

### `isAdmin` Middleware

```javascript
// Pseudocode specification
function isAdmin(req, res, next) {
  if (res.locals.user && res.locals.user.isAdmin === true) {
    return next(); // User is admin — proceed
  }
  req.flash('error', 'Access denied.');
  return res.redirect('/'); // Redirect non-admin users to homepage
}
```

| Condition | Outcome |
|-----------|---------|
| `res.locals.user.isAdmin === true` | `next()` — request proceeds |
| `isAdmin` is false or user is null | Flash "Access denied"; redirect to `/` |

**Critical Note:** `isAdmin` relies on `res.locals.user` being populated by `attachUser`. The middleware chain **must** always be `attachUser → isAdmin` in that order. Since `attachUser` runs globally, this dependency is automatically satisfied.

---

## Appendix D: Environment Variable Reference

| Variable | Example Value | Required | Description |
|----------|--------------|----------|-------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/kushmart` | Yes | MongoDB connection URI |
| `SESSION_SECRET` | `a3f7k2m9p1q8r5t6u0v4w7x2y1z8b3c5` | Yes | express-session signing secret |
| `PORT` | `3000` | No (default: 3000) | Application listening port |
| `EMAIL_HOST` | `smtp.gmail.com` | Yes | SMTP server hostname |
| `EMAIL_PORT` | `587` | Yes | SMTP port |
| `EMAIL_USER` | `kushmart@gmail.com` | Yes | SMTP username |
| `EMAIL_PASS` | `app_specific_password` | Yes | SMTP password |
| `BASE_URL` | `https://kushmart.in` | Yes | Public base URL for reset links |
| `NODE_ENV` | `production` | No | Environment flag (`development` / `production`) |

---

*End of Software Requirements Specification — KushMart v1.0.0*

*Document prepared in conformance with IEEE Std 830-1998.*

*All specifications reflect the as-built production system architecture.*