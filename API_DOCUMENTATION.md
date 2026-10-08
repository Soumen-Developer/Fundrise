# FundRise API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require a JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <token>
```

Or via cookie: `jwt=<token>` (set during login)

## Error Handling
All errors return JSON with structure:
```json
{
  "success": false,
  "message": "Error description"
}
```

In development mode, error responses include a `stack` field.

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

### 1. Authentication

#### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token"
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token"
}
```

#### Get Current User
```http
GET /api/auth/me
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Logout
```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. Campaigns

#### Create Campaign
```http
POST /api/campaigns
```

**Authentication:** Private (user role required)

**Request Body:**
```json
{
  "title": "Education for All",
  "description": "Providing school supplies to 100 children",
  "story": "Full story about the campaign...",
  "category": "education",
  "goalAmount": 50000,
  "deadline": "2024-12-15"
}
```

**Response (201):**
```json
{
  "success": true,
  "campaign": {
    "_id": "campaign_id",
    "title": "Education for All",
    "description": "Providing school supplies to 100 children",
    "story": "Full story about the campaign...",
    "category": "education",
    "goalAmount": 50000,
    "raisedAmount": 0,
    "deadline": "2024-12-15",
    "status": "Pending",
    "backersCount": 0,
    "creator": "user_id",
    "isVerified": false,
    "createdAt": "2024-10-29T...",
    "image": "",
    "videoUrl": ""
  }
}
```

#### List Campaigns
```http
GET /api/campaigns
```

**Query Parameters:**
- `category` - Filter by category (education, medical, startup, creative, social, environment, other)
- `status` - Filter by status (Pending, Approved, Active, Successful, Expired)
- `sort` - Sort by (newest, most_funded, ending_soon)
- `limit` - Limit results (default: 20)

**Response (200):**
```json
{
  "success": true,
  "count": 25,
  "campaigns": [ ... array of campaign objects ... ]
}
```

#### Get Single Campaign
```http
GET /api/campaigns/:id
```

**Response (200):**
```json
{
  "success": true,
  "campaign": {
    "_id": "campaign_id",
    "title": "Education for All",
    "description": "Providing school supplies to 100 children",
    "story": "Full story about the campaign...",
    "category": "education",
    "goalAmount": 50000,
    "raisedAmount": 35200,
    "backersCount": 47,
    "deadline": "2024-12-15",
    "status": "Approved",
    "creator": {
      "name": "Priya Sharma",
      "avatar": "/avatar-url"
    },
    "isVerified": true,
    "createdAt": "2024-10-29T...",
    "image": "/campaign-image-url",
    "videoUrl": ""
  }
}
```

#### Edit Campaign
```http
PUT /api/campaigns/:id
```

**Authentication:** Private (creator only)

**Request Body:** (optional fields)
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "campaign": { ... updated campaign ... }
}
```

#### Delete Campaign
```http
DELETE /api/campaigns/:id
```

**Authentication:** Private (creator only)

**Response (200):**
```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

---

### 3. Donations

#### Create Order (Razorpay)
```http
POST /api/donations/create-order
```

**Authentication:** Private

**Request Body:**
```json
{
  "amount": 500  // in ₹ (will be converted to paise for Razorpay)
}
```

**Response (200):**
```json
{
  "success": true,
  "orderId": "order_abc123",
  "amount": 50000,  // in paise
  "currency": "INR"
}
```

#### Verify Payment & Save Donation
```http
POST /api/donations/verify
```

**Authentication:** Private

**Request Body:**
```json
{
  "razorpay_order_id": "order_abc123",
  "razorpay_payment_id": "pay_pay123",
  "razorpay_signature": "signature_hash",
  "campaignId": "campaign_id",
  "amount": 500,
  "isAnonymous": false
}
```

**Response (201):**
```json
{
  "success": true,
  "donation": {
    "_id": "donation_id",
    "user": "user_id",
    "campaign": "campaign_id",
    "amount": 500,
    "isAnonymous": false,
    "paymentId": "pay_pay123",
    "orderId": "order_abc123",
    "status": "succeeded",
    "createdAt": "2024-10-29T..."
  },
  "campaign": {
    "raisedAmount": 35700,
    "backersCount": 48
  }
}
```

#### Get User Donations
```http
GET /api/donations/user/:userId
```

**Authentication:** Private (owner or admin)

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "donations": [ ... array of donation objects ... ]
}
```

#### Get Campaign Donations
```http
GET /api/donations/campaign/:campaignId
```

**Authentication:** Public

**Response (200):**
```json
{
  "success": true,
  "count": 12,
  "donations": [
    {
      "user": {
        "name": "Amit Patel",
        "avatar": "/avatar-url"
      },
      "amount": 1000,
      "createdAt": "2024-10-28T..."
    }
    // ... more donors (limited to recent 10)
  ]
}
```

---

### 4. Comments

#### Add Comment
```http
POST /api/comments
```

**Authentication:** Private

**Request Body:**
```json
{
  "campaignId": "campaign_id",
  "text": "Great initiative! Keep up the good work."
}
```

**Response (201):**
```json
{
  "success": true,
  "comment": {
    "_id": "comment_id",
    "user": {
      "name": "Your Name",
      "avatar": "/avatar-url"
    },
    "campaign": "campaign_id",
    "text": "Great initiative! Keep up the good work.",
    "createdAt": "2024-10-29T..."
  }
}
```

---

### 5. Updates

#### Create Update
```http
POST /api/updates
```

**Authentication:** Private (campaign creator only)

**Request Body:**
```json
{
  "campaignId": "campaign_id",
  "title": "We reached 50%!",
  "content": "Thank you to all our supporters!"
}
```

**Response (201):**
```json
{
  "success": true,
  "update": {
    "_id": "update_id",
    "campaign": "campaign_id",
    "title": "We reached 50%!",
    "content": "Thank you to all our supporters!",
    "createdAt": "2024-10-29T..."
  }
}
```

## 📊 Sample Data Sets

### Test Campaign Data

| Field | Example |
|-------|---------|
| title | "Education for All" |
| description | "Providing school supplies..." |
| story | "We are educators..." |
| category | "education" |
| goalAmount | 50000 |
| deadline | "2024-12-15" |
| status | "Active" |
| raisedAmount | 35200 |
| backersCount | 47 |

### Test Donation Data

| Field | Example |
|-------|---------|
| amount | 500 |
| isAnonymous | false |
| paymentId | "pay_abc123" |
| orderId | "order_xyz789" |
| status | "succeeded" |

### Test Comment Data

| Field | Example |
|-------|---------|
| text | "Wonderful cause!" |
| user name | "Priya Sharma" |
| createdAt | "2024-10-29T10:30:00.000Z" |

## 🔒 Role Permissions

| Role | Permissions |
|------|-------------|
| `visitor` | Browse campaigns, view details |
| `user` | Create campaigns, donate, comment, dashboard |
| `admin` | All user permissions + manage campaigns/users, approve/reject |

## ⚠️ Known Limitations (TEST MODE)

- No real money transactions
- Payment signatures must be verified server-side
- Campaign status flow: Pending → Approved → Active → Successful/Expired
- ₹499 call price not implemented (books 60 min, not credited)
- Sprint program features limited (TK-23, TK-25)