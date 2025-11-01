# TODO: Complete Order and Payment Services Implementation

## Phase 1: Add Auth Integration
- [ ] Create JWT auth guards in Order Service (similar to menu-service)
- [ ] Apply JWT guards to Order controller endpoints
- [ ] Create JWT auth guards in Payment Service
- [ ] Apply JWT guards to Payment controller endpoints

## Phase 2: Enhance Order Service
- [ ] Add RabbitMQ integration for order events (order created, status updated)
- [ ] Create RabbitMQ module in Order Service
- [ ] Update Order service to publish events
- [ ] Add validation and error handling improvements

## Phase 3: Enhance Payment Service
- [ ] Add webhook signature verification for Stripe
- [ ] Add support for Razorpay as alternative payment gateway
- [ ] Add RabbitMQ integration for payment events
- [ ] Create RabbitMQ module in Payment Service
- [ ] Update Payment service to publish events

## Phase 4: Add Unit Tests
- [ ] Create unit tests for Order service
- [ ] Create unit tests for Order controller
- [ ] Create unit tests for Payment service
- [ ] Create unit tests for Payment controller
- [ ] Mock dependencies (TypeORM, Stripe, RabbitMQ)

## Phase 5: Update Configurations and Dependencies
- [ ] Update Order Service docker-compose.yml to include RabbitMQ
- [ ] Update Payment Service docker-compose.yml if needed
- [ ] Ensure environment variables for Stripe/Razorpay keys
- [ ] Install dependencies (npm install) in both services

## Phase 6: Integration and Testing
- [ ] Run unit tests and verify coverage
- [ ] Test RabbitMQ integration
- [ ] Test cross-service communication (order -> payment)
- [ ] Update OpenAPI spec with new endpoints
- [ ] Update main TODO.md to mark services as completed
