# Flex-Restro Project TODO

## Implementation Plan for Full Flex-Restro Platform

### Phase 1: Complete Core Microservices Implementation
- [x] Implement Menu Service (NestJS, PostgreSQL, S3)
  - [x] Create package.json, tsconfig.json, Dockerfile, docker-compose.yml
  - [x] Set up src/ structure: main.ts, app.module.ts
  - [x] Create menu entity (multi-tenant with tenant_id)
  - [x] Implement menu module, controller, service with CRUD operations
  - [x] Add auth integration (JWT guards)
  - [ ] Implement image upload to S3
  - [x] Add unit tests (Jest)
- [ ] Implement Order Service (NestJS, PostgreSQL, RabbitMQ)
  - [ ] Create package.json, tsconfig.json, Dockerfile, docker-compose.yml
  - [ ] Set up src/ structure: main.ts, app.module.ts
  - [ ] Create order entity (multi-tenant)
  - [ ] Implement order module, controller, service with CRUD and status updates
  - [ ] Integrate RabbitMQ for events
  - [ ] Add auth integration
  - [ ] Add unit tests
- [ ] Implement Payment Service (NestJS, Stripe/Razorpay)
  - [ ] Create package.json, tsconfig.json, Dockerfile, docker-compose.yml
  - [ ] Set up src/ structure
  - [ ] Create payment entity
  - [ ] Implement payment processing and webhooks
  - [ ] Add unit tests
- [x] Implement Analytics Service (NestJS, PostgreSQL, Redis)
  - [x] Create package.json, tsconfig.json, Dockerfile, docker-compose.yml
  - [x] Set up src/ structure
  - [x] Create analytics entity and aggregates
  - [x] Implement metrics calculation (revenue, orders, etc.)
  - [x] Add caching with Redis
  - [ ] Add unit tests
- [ ] Implement QR Service (NestJS, S3)
  - [ ] Create package.json, tsconfig.json, Dockerfile, docker-compose.yml
  - [ ] Set up src/ structure
  - [ ] Implement QR generation and storage
  - [ ] Add short URL logic
  - [ ] Add unit tests
- [ ] Implement Notification Service (NestJS, RabbitMQ)
  - [ ] Create package.json, tsconfig.json, Dockerfile, docker-compose.yml
  - [ ] Set up src/ structure
  - [ ] Implement email/SMS notifications
  - [ ] Integrate with external services (SendGrid, Twilio)
  - [ ] Add unit tests
- [ ] Implement Connector Service (NestJS, RabbitMQ)
  - [ ] Create package.json, tsconfig.json, Dockerfile, docker-compose.yml
  - [ ] Set up src/ structure
  - [ ] Implement adapters for Swiggy/Zomato
  - [ ] Add webhook handling
  - [ ] Add simulated test harness
  - [ ] Add unit tests
- [ ] Implement Admin Service (NestJS, PostgreSQL)
  - [ ] Create package.json, tsconfig.json, Dockerfile, docker-compose.yml
  - [ ] Set up src/ structure
  - [ ] Implement platform management features
  - [ ] Add unit tests

### Phase 2: Comprehensive Testing
- [ ] Add integration tests for API flows across services
- [ ] Implement E2E tests for end-to-end ordering/payment flows
- [ ] Run full test suites and verify coverage (>80%)

### Phase 3: Frontend Scaffolding
- [ ] Scaffold Next.js web-app for restaurant dashboard and public menu
- [ ] Scaffold Next.js admin-panel for platform management
- [ ] Scaffold Next.js qr-page for QR-based ordering
- [ ] Integrate with backend APIs

### Phase 4: Deployment and Infrastructure
- [ ] Update root docker-compose.yml for all services
- [ ] Implement Helm charts for K8s deployment
- [ ] Set up monitoring with Prometheus, Grafana, ELK
- [ ] Implement CI/CD with GitHub Actions (build, test, deploy)
- [ ] Deploy to staging environment
- [ ] API Gateway setup (Kong/Nginx)

### Phase 5: End-to-End Verification and Documentation
- [ ] Perform full end-to-end testing (register, menu CRUD, QR order, payment)
- [ ] Update README.md and openapi.yaml
- [ ] Security audits and performance optimizations

## Original Milestones (for reference)
## Milestone 1: Core services + basic UI (registration, menu CRUD, QR page, direct ordering)
- [x] Set up project structure (mono-repo with services/, frontend/, infra/)
- [x] Implement Auth Service (NestJS, PostgreSQL, JWT)
- [x] Implement Restaurant Service (NestJS, PostgreSQL)
- [ ] Implement Menu Service (NestJS, PostgreSQL, S3)
- [ ] Implement QR Service (NestJS, QR generation)
- [ ] Implement Order Service (NestJS, PostgreSQL, RabbitMQ)
- [ ] Frontend: Next.js app for restaurant dashboard, public menu page
- [ ] API Gateway setup (Kong or Nginx)
- [ ] Dockerfiles for all services
- [ ] Basic CI/CD with GitHub Actions
- [ ] Unit tests for core services
- [ ] Integration tests for API flows
- [ ] Deploy to staging (K8s manifests)

## Milestone 2: Payments, order dashboard, kitchen print flow
- [ ] Implement Payment Service (Stripe, Razorpay integration)
- [ ] Add payment webhooks handling
- [ ] Enhance Order Service with real-time status updates
- [ ] Frontend: Order dashboard with status management
- [ ] Kitchen receipt printing feature
- [ ] Notification Service (email, SMS for orders)
- [ ] Update analytics for basic metrics
- [ ] E2E tests for ordering flow

## Milestone 3: Marketplace connector skeleton + simulated webhook tests
- [ ] Implement Connector Service (Swiggy, Zomato adapters)
- [ ] Simulated webhook test harness
- [ ] Admin UI for mapping marketplace fields
- [ ] Integration tests for webhook payloads
- [ ] Update Order Service to handle marketplace orders

## Milestone 4: Analytics, admin panel, monitoring, and deployment setup
- [ ] Implement Analytics Service (revenue, orders, etc.)
- [ ] Admin Service for platform management
- [ ] Monitoring: Prometheus, Grafana, ELK
- [ ] Full CI/CD pipeline
- [ ] Helm charts for K8s deployment
- [ ] Security audits, GDPR compliance basics
- [ ] Performance optimizations
- [ ] Documentation updates

## Extra Features (Nice-to-have)
- [ ] Offline menu editing with sync
- [ ] Menu import from CSV/Google Sheets
- [ ] POS tablet-friendly UI
- [ ] Coupons & loyalty points module
