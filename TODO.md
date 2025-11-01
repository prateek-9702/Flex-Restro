# TODO: Fix Docker Builds for Multi-Service Node.js Project

## Overview
Fix missing package.json/package-lock.json and build scripts in all services to enable successful Docker builds.

## Services Identified
- **Frontend Services** (React assumed):
  - frontend/web-app
  - frontend/admin-panel
  - frontend/qr-page

- **Backend Services** (NestJS):
  - services/qr-service (has build/start)
  - services/restaurant-service (has build/start)
  - services/auth-service (has build/start)
  - services/menu-service (has build/start)
  - services/order-service (has build/start)
  - services/payment-service (has build/start)
  - services/analytics-service (has build/start)
  - services/admin-service (missing build/start)
  - services/notification-service (missing build/start)
  - services/connector-service (missing build/start)

## Plan
1. **Update Frontend Services**:
   - Add "build": "react-scripts build" and "start": "react-scripts start" to package.json
   - Add react-scripts as devDependency
   - Run npm install to generate package-lock.json

2. **Update Backend Services**:
   - Ensure "build": "nest build" and "start": "nest start" exist
   - Run npm install to ensure package-lock.json

3. **Fix Incomplete Backend Services**:
   - Create proper NestJS package.json for admin-service, notification-service, connector-service
   - Add build and start scripts
   - Run npm install

4. **Verify Builds**:
   - Run npm run build in each service folder
   - Ensure no errors

5. **Docker Operations**:
   - docker-compose build --no-cache
   - docker-compose up -d
   - Confirm containers running and services accessible

## Progress
- [x] Plan approved and proceeding
- [x] Update frontend/web-app
- [x] Update frontend/admin-panel
- [x] Update frontend/qr-page
- [ ] Verify backend services (qr, restaurant, auth, menu, order, payment, analytics)
- [x] Fix services/admin-service (already has proper package.json)
- [x] Fix services/notification-service (already has proper package.json)
- [x] Fix services/connector-service (already has proper package.json)
- [x] Run npm install in all services
- [ ] Run npm run build in all services
- [ ] docker-compose build --no-cache
- [ ] docker-compose up -d
- [ ] Verify all containers running
