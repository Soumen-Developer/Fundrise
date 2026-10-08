# FundRise Comprehensive Testing Plan

## Test Strategy
This testing plan covers all aspects of the FundRise crowdfunding platform, including functionality, usability, security, and performance. Testing follows senior-level standards with comprehensive test case coverage.

## Test Levels

### 1. Unit Testing
Test individual components and functions in isolation.

**Backend Routes:**
- `POST /api/auth/register` - valid data, existing email, missing fields
- `POST /api/auth/login` - valid credentials, invalid credentials, missing password
- `GET /api/auth/me` - authenticated user, unauthenticated user
- `POST /api/auth/logout` - authenticated user

**Backend API:**
- `POST /api/campaigns` - valid data, missing fields, unauthorized
- `GET /api/campaigns` - with filters, without filters
- `GET /api/campaigns/:id` - existing ID, non-existing ID
- `PUT /api/campaigns/:id` - creator, non-creator, after donations
- `DELETE /api/campaigns/:id` - creator, non-creator, after donations

**Database Models:**
- User creation with password hashing
- Campaign creation with status flow
- Donation creation with payment tracking

### 2. Integration Testing
Test interactions between components and systems.

**Authentication Flow:**
- Register → Login → Access protected routes → Logout

**Campaign & Donation Flow:**
- Create campaign → Authenticate → Donate → Verify payment → Update campaign status

**Comment & Update Flow:**
- Add comment → View comments → Add update → View updates

### 3. End-to-End (E2E) Testing
Test complete user flows from start to finish.

**User Registration & Onboarding:**
1. Navigate to /register
2. Fill in name, email, password
3. Submit form
4. Verify account created success message
5. Navigate to /login
6. Enter credentials
7. Verify login success and redirect to dashboard

**Campaign Creation Flow:**
1. Navigate to /create-campaign (requires auth)
2. Step 1: Enter title and description → Next
3. Step 2: Enter story → Upload image → Next
4. Step 3: Enter goal amount and deadline → Submit
5. Verify campaign submitted for review message
6. Check campaign appears in /explore with Pending status

**Donation Flow:**
1. Navigate to /explore
2. Click on a campaign
3. Click Donate Now
4. Select preset amount (₹100, ₹500, ₹1000) or custom amount
5. Enter payment details (test card: 4242 4242 4242 4242, any future expiry, 123 CVV)
6. Verify payment success celebration screen
7. Verify donation receipt can be downloaded
8. Check campaign progress bar updated
9. Check backer count incremented

**User Dashboard:**
1. Login as user
2. Verify summary cards (total donated, campaigns created, total raised)
3. Check My Campaigns section
4. Check My Donations section
5. Update profile
6. Logout

**Admin Dashboard:**
1. Login as admin (admin@fundrise.com / admin123)
2. Verify KPI cards (total users, campaigns, funds raised, pending approvals)
3. Check pending approvals list
4. Approve a campaign
5. Reject a campaign with reason
6. Block/unblock a user
7. View charts and statistics

### 4. Security Testing
- **Authentication Tests:**
  - Register with existing email → should show error
  - Login with wrong password → should show error
  - Access protected routes without token → should show 401
  - Token expiration → should require re-login
  - JWT signature tampering → should fail verification

- **Authorization Tests:**
  - Non-creator trying to edit/delete campaign → should show 403
  - Regular user trying to access admin routes → should show 403
  - Non-owner trying to view another user's donations → should show 403

- **Input Validation Tests:**
  - SQL injection attempts → should be sanitized
  - XSS attempts in campaign title/description → should be escaped
  - Buffer overflow attempts → should be handled
  - Large payload exceeding 10kb limit → should be rejected

- **Data Privacy Tests:**
  - Anonymous donation should not expose user identity
  - User data should not be leaked in API responses
  - Password hashing verification → plain text never in response

### 5. Usability Testing
- **Responsive Design Tests:**
  - 320px (mobile phones) - no horizontal scroll, touch-friendly
  - 768px (tablets) - layout adjusts, sidebar toggles
  - 1024px (small laptops) - full layout, readable text
  - 1440px (desktops) - maximum width, proper spacing

- **Dark Mode Tests:**
  - Toggle moon/sun icon in navbar
  - Verify color scheme switches between light/dark
  - Check all components have dark mode styles
  - Verify no visual regressions

- **Browser Compatibility:**
  - Chrome (latest) - full functionality
  - Firefox (latest) - core functionality
  - Safari (latest) - core functionality
  - Edge (latest) - core functionality

### 6. Error Handling Tests
- **Server Errors:**
  - Database connection failure → graceful error message
  - Network timeout → retry logic or user-friendly message
  - Server 500 errors → generic error page, not stack trace

- **Validation Errors:**
  - Missing required fields → specific error messages
  - Invalid email format → specific error messages
  - Password too short → specific error messages
  - Form submission with validation errors → errors highlighted

- **Edge Cases:**
  - Empty string fields → handled gracefully
  - Special characters in inputs → handled safely
  - Very long inputs → truncated or rejected
  - Rapid button clicks → debounced or disabled

### 7. Performance Testing
- **Page Load Times:**
  - Home page < 3 seconds
  - Campaign detail < 2 seconds
  - Explore page < 2 seconds
  - API responses < 500ms

- **Concurrent Users:**
  - 10 simultaneous users → no crashes
  - 50 simultaneous users → degraded but functional
  - Database connection pool handling

### 8. Regression Testing
- After any code change, re-run:
  - Authentication flow
  - Campaign creation
  - Donation process
  - Dashboard views
  - Dark mode toggle
  - Responsive layout breakpoints

## Test Data Scenarios

| Test Case | Input | Expected Output | Priority |
|-----------|-------|----------------|----------|
| TC-01 | Register with valid data | Account created, JWT token, redirect to dashboard | High |
| TC-02 | Register with existing email | Error: "User already exists" | High |
| TC-03 | Login with correct credentials | JWT token, dashboard access | High |
| TC-04 | Login with wrong credentials | Error: "Invalid email or password" | High |
| TC-05 | Create campaign with valid data | Campaign created, Pending status | High |
| TC-06 | Create campaign with missing fields | Validation errors displayed | High |
| TC-07 | Donate with valid Razorpay test card | Payment verified, donation recorded | High |
| TC-08 | Donate with invalid signature | Error: "Invalid payment signature" | High |
| TC-09 | Edit own campaign before donations | Campaign updated successfully | Medium |
| TC-10 | Edit campaign after donations | Error: "Cannot edit campaign after receiving donations" | Medium |
| TC-11 | Admin approves pending campaign | Status changes to Active | Medium |
| TC-12 | Admin rejects pending campaign | Status remains Pending, reason shown | Medium |
| TC-13 | User views own dashboard | Summary cards, campaigns, donations displayed | High |
| TC-14 | User searches campaigns by title | Filtered results matching query | Medium |
| TC-15 | Filter campaigns by category | Only campaigns in selected category | Medium |
| TC-16 | Dark mode toggle | Theme switches between light/dark | Medium |
| TC-17 | Responsive at 360px | No horizontal scroll, layout adjusts | High |
| TC-18 | Responsive at 1440px | All content visible, proper spacing | High |
| TC-19 | Forgot password flow | OTP sent (mock: console.log) | Low |
| TC-20 | Share campaign link | Link copied, share options available | Low |

## Bug Tracking & Reporting

### Bug Report Template
| Field | Description |
|-------|-------------|
| **Bug ID** | Unique identifier (e.g., BUG-001) |
| **Title** | Brief description of the issue |
| **Severity** | Critical, High, Medium, Low |
| **Module** | Which part of the system (Auth, Campaign, Donation, etc.) |
| **Steps to Reproduce** | Exact steps to reproduce the bug |
| **Expected Result** | What should happen |
| **Actual Result** | What actually happens |
| **Environment** | Browser, OS, Device |
| **Screenshots** | Visual evidence of the bug |

### Severity Levels
- **Critical**: System crash, data loss, security vulnerability - blocks release
- **High**: Major functionality broken, workarounds required - blocks release
- **Medium**: Minor functionality broken, workarounds available - fix in next sprint
- **Low**: Cosmetic issues, minor improvements - fix as time permits

## Test Environment Checklist

### Server-Side:
- [ ] Node.js server starts without errors
- [ ] PostgreSQL connection successful
- [ ] All API endpoints respond correctly
- [ ] Error handling works for all scenarios
- [ ] Authentication middleware functions properly
- [ ] Input validation works on all routes
- [ ] CORS configuration correct
- [ ] Helmet security headers present
- [ ] Cookie handling correct (JWT, logout)

### Client-Side:
- [ ] Vite development server starts
- [ ] All 10 pages load without errors
- [ ] Navigation between pages works
- [ ] Router redirects work (404 page)
- [ ] Form validations display correctly
- [ ] Toast notifications appear for actions
- [ ] Skeletons load while data fetches
- [ ] Empty states show appropriately

### Docker/Render:
- [ ] Docker image builds successfully
- [ ] docker-compose up works
- [ ] PostgreSQL container starts
- [ ] Web service starts and responds
- [ ] Health check passes at /api/health
- [ ] Environment variables configured
- [ ] Ports mapped correctly (5000, 5432)

---

## Priority Matrix

| Priority | Focus | When to Fix |
|----------|-------|-------------|
| **Critical** | Security vulnerabilities, data loss, login/register, payment flow | Fix immediately before deployment |
| **High** | Core functionality broken, 404s on key pages, API errors | Fix before user testing |
| **Medium** | UI issues, minor bugs, responsive glitches | Fix before client demo |
| **Low** | Cosmetic issues, minor improvements, documentation | Fix post-launch or as time permits |

---
*Testing Plan created by Senior Tester (14 years experience)*
*Test coverage ensures all critical user journeys are validated*
*All code reviewed by Senior Full-Stack Developer (16 years experience)*