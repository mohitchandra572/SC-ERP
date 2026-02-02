# API Documentation

## Overview

The School Management System provides a RESTful API for managing academic operations, student information, and administrative tasks. All API endpoints require authentication unless otherwise specified.

## Base URL

```
Development: http://localhost:3000
Production: https://yourdomain.com
```

## Authentication

All protected endpoints require a valid session cookie obtained through the authentication flow.

### Authentication Flow

1. User submits credentials to `/api/auth/signin`
2. Server validates credentials and creates session
3. Session cookie is set in response
4. Subsequent requests include session cookie automatically

## Common Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 500 | Internal Server Error |

## Error Response Format

```json
{
  "error": "Error message description",
  "details": "Additional error details (optional)"
}
```

## API Endpoints

### Health & Monitoring

#### GET /api/health

Check application health status.

**Authentication:** Not required

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-02T12:00:00.000Z",
  "uptime": 3600,
  "responseTime": 15,
  "checks": {
    "database": {
      "status": "healthy",
      "latency": 12
    },
    "environment": {
      "status": "healthy",
      "message": "All required environment variables are set"
    }
  },
  "version": "0.1.0",
  "environment": "production"
}
```

---

#### GET /api/metrics

Get application metrics (protected).

**Authentication:** Required  
**Permission:** `view:analytics`

**Response:**
```json
{
  "timestamp": "2026-02-02T12:00:00.000Z",
  "responseTime": 45,
  "database": {
    "totalUsers": 150,
    "activeUsers": 145,
    "totalStudents": 120,
    "totalTeachers": 25,
    "totalClasses": 15
  },
  "errors": {
    "last24Hours": 3
  },
  "system": {
    "uptime": 3600,
    "memoryUsage": {
      "rss": 123456789,
      "heapTotal": 98765432,
      "heapUsed": 87654321,
      "external": 1234567
    },
    "nodeVersion": "v20.x.x",
    "platform": "linux"
  }
}
```

---

### Authentication

See [authentication.md](./authentication.md) for detailed authentication endpoints.

### Admin APIs

See [admin.md](./admin.md) for admin-specific endpoints including:
- User management
- Academic setup
- Reports and analytics

### Student APIs

See [student.md](./student.md) for student portal endpoints including:
- Dashboard data
- Assignments
- Attendance records

### Teacher APIs

See [teacher.md](./teacher.md) for teacher portal endpoints including:
- Class management
- Assignment grading
- Attendance recording

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Default:** 100 requests per minute per IP
- **Authenticated:** 200 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643723400
```

## Pagination

List endpoints support pagination using query parameters:

```
GET /api/students?page=1&limit=20
```

**Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Filtering & Sorting

Many list endpoints support filtering and sorting:

```
GET /api/students?status=active&sort=name&order=asc
```

**Common Parameters:**
- `sort` (string): Field to sort by
- `order` (string): `asc` or `desc`
- Additional filters vary by endpoint

## Best Practices

1. **Always handle errors** - Check response status codes
2. **Use pagination** - Don't fetch all records at once
3. **Cache responses** - Where appropriate
4. **Respect rate limits** - Implement exponential backoff
5. **Validate input** - On client side before sending
6. **Use HTTPS** - In production environments

## Support

For API support or questions:
- Check the specific endpoint documentation
- Review error messages for details
- Contact: api-support@yourschool.com
