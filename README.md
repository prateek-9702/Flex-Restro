# Flex-Restro: Global Restaurant SaaS + QR Menu + Multi-channel Order Aggregator

A production-ready multi-tenant SaaS platform for restaurants worldwide, enabling seamless menu management, QR-based ordering, multi-channel order aggregation, payments, analytics, and more.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Web App       │  │   Mobile Web    │  │   Admin Panel   │  │   QR Page   │ │
│  │   (Next.js)     │  │   (Responsive)  │  │   (Platform)    │  │   (Public)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTP/HTTPS
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API Gateway Layer                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Kong/Nginx   │  │   Rate Limiting │  │   Auth/JWT      │  │   Routing   │ │
│  │   Gateway       │  │                 │  │                 │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ REST/gRPC
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Microservices Layer                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Auth Service  │  │   Restaurant    │  │   Menu Service  │  │   Order     │ │
│  │                 │  │   Service       │  │                 │  │   Service   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Payment       │  │   Analytics     │  │   Notification  │  │   Connector │ │
│  │   Service       │  │   Service       │  │   Service       │  │   Service   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐                                      │
│  │   QR Service    │  │   Admin Service │                                      │
│  │                 │  │                 │                                      │
│  └─────────────────┘  └─────────────────┘                                      │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Data & Infrastructure Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   PostgreSQL    │  │   Redis         │  │   RabbitMQ      │  │   S3        │ │
│  │   (Relational)  │  │   (Cache/RT)    │  │   (Message Q)   │  │   (Storage) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Prometheus    │  │   Grafana       │  │   ELK Stack     │                  │
│  │   (Metrics)     │  │   (Dashboards)  │  │   (Logs)        │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ Kubernetes / Docker
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Infrastructure                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   CI/CD         │  │   GitHub Actions│  │   Helm Charts   │  │   K8s       │ │
│  │   Pipeline      │  │                 │  │                 │  │   Cluster   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## List of Microservices

### 1. Auth Service
- **Responsibilities**: User authentication, authorization, JWT token management, OAuth2 for third-party integrations, role-based access control (owner, staff, admin), multi-tenant user isolation.
- **Tech**: NestJS (TypeScript), PostgreSQL for user data, Redis for session caching.

### 2. Restaurant Service
- **Responsibilities**: Restaurant registration, onboarding, KYC (optional), profile management, multi-tenant data isolation, region-specific settings (currency, taxes).
- **Tech**: NestJS, PostgreSQL.

### 3. Menu Service
- **Responsibilities**: CRUD operations for menu items, categories, variants, images, availability, offers, import from CSV/Google Sheets.
- **Tech**: NestJS, PostgreSQL, S3 for image storage.

### 4. Order Service
- **Responsibilities**: Order creation, management, status updates, kitchen receipts, real-time notifications, multi-channel aggregation.
- **Tech**: NestJS, PostgreSQL, RabbitMQ for events, Redis for real-time updates.

### 5. Payment Service
- **Responsibilities**: Payment processing (Stripe, Razorpay), webhooks handling, reconciliation, multi-currency support.
- **Tech**: NestJS, PostgreSQL, external payment gateways.

### 6. Analytics Service
- **Responsibilities**: Revenue, orders, item-wise sales, peak hours, repeat customers analytics, dashboards.
- **Tech**: NestJS, PostgreSQL, Redis for caching aggregates.

### 7. Notification Service
- **Responsibilities**: Email, SMS, push notifications for orders, status updates.
- **Tech**: NestJS, RabbitMQ, external services (SendGrid, Twilio).

### 8. Connector Service
- **Responsibilities**: Integration with third-party marketplaces (Swiggy, Zomato), webhook adapters, simulated test harness for orders.
- **Tech**: NestJS, RabbitMQ, pluggable modules for different marketplaces.

### 9. QR Service
- **Responsibilities**: Generate unique QR codes per restaurant/table, short URLs, dynamic QR images, persistent landing pages.
- **Tech**: NestJS, S3 for QR storage, URL shortener logic.

### 10. Admin Service
- **Responsibilities**: Platform admin panel, onboarding flows, system monitoring, user management.
- **Tech**: NestJS, PostgreSQL.

## Database Schema Overview

### PostgreSQL Tables (Multi-tenant with tenant_id)
- users (id, tenant_id, email, password_hash, role, created_at)
- restaurants (id, tenant_id, name, address, currency, tax_rate, qr_code_url, created_at)
- menus (id, restaurant_id, name, description, image_url, available, created_at)
- menu_items (id, menu_id, name, price, variants, category, image_url, available, created_at)
- orders (id, restaurant_id, customer_id, items, total, status, payment_id, created_at)
- payments (id, order_id, amount, currency, gateway, status, created_at)
- analytics (id, restaurant_id, date, revenue, orders_count, top_items, created_at)

### Redis Keys
- session:{user_id}
- order_status:{order_id}
- cache:analytics:{restaurant_id}:{period}

## Deployment
- Dockerized services with Dockerfiles.
- Kubernetes manifests/Helm charts for deployment.
- CI/CD with GitHub Actions for build, test, deploy.

## Getting Started
1. Clone the repo.
2. Set up local environment (Docker, K8s).
3. Run `docker-compose up` for development.
4. Access frontend at http://localhost:3000, API docs at http://localhost:8000/docs.

## API Documentation
See `openapi.yaml` for full OpenAPI specification.

## Milestones
- M1: Core services + basic UI (registration, menu CRUD, QR page, direct ordering).
- M2: Payments, order dashboard, kitchen print flow.
- M3: Marketplace connector + simulated webhook tests.
- M4: Analytics, admin panel, monitoring, deployment.
