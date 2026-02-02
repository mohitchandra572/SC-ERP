# Monitoring & Logging Guide

## Overview

The School Management System includes comprehensive monitoring and logging capabilities to ensure reliability and facilitate debugging in production environments.

## Logging System

### Log Levels

The application supports four log levels (in order of severity):

1. **DEBUG** - Detailed diagnostic information
2. **INFO** - General informational messages
3. **WARN** - Warning messages for potentially harmful situations
4. **ERROR** - Error events that might still allow the application to continue

### Configuration

Set the log level via environment variable:

```bash
LOG_LEVEL=info  # Options: debug | info | warn | error
```

### Log Format

#### Development (Human-Readable)
```
[2026-02-02T12:00:00.000Z] INFO: User logged in | {"userId":"123","ip":"192.168.1.1"}
```

#### Production (JSON)
```json
{
  "timestamp": "2026-02-02T12:00:00.000Z",
  "level": "INFO",
  "message": "User logged in",
  "environment": "production",
  "metadata": {
    "userId": "123",
    "ip": "192.168.1.1"
  }
}
```

Enable JSON logging:
```bash
LOG_JSON=true
```

## Health Monitoring

### Health Check Endpoint

**Endpoint:** `GET /api/health`

Use this endpoint for:
- Load balancer health checks
- Uptime monitoring
- Automated alerts

**Example with curl:**
```bash
curl https://yourschool.com/api/health
```

**Monitoring Setup:**
- Configure your monitoring service to check `/api/health` every 60 seconds
- Alert if status is "unhealthy" or response time > 1000ms
- Alert if endpoint returns 503 status code

### Metrics Endpoint

**Endpoint:** `GET /api/metrics` (Protected)

Provides detailed application metrics for monitoring dashboards.

**Requires:** Admin authentication with `view:analytics` permission

## Error Tracking with Sentry

### Setup

1. **Create Sentry Account**
   - Sign up at https://sentry.io
   - Create a new project for Next.js

2. **Configure Environment Variables**
   ```bash
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   SENTRY_ENABLED=true
   SENTRY_ORG=your-org
   SENTRY_PROJECT=your-project
   ```

3. **Install Sentry (Optional)**
   ```bash
   npm install @sentry/nextjs
   ```

4. **Initialize Sentry**
   
   The application is pre-configured to send errors to Sentry when `SENTRY_ENABLED=true`.

### What Gets Tracked

- **Server Errors:** All unhandled exceptions
- **Client Errors:** JavaScript errors in the browser
- **API Failures:** Failed API requests
- **Performance:** Slow database queries and API calls

### Sentry Dashboard

Access your Sentry dashboard to:
- View error trends
- Track error frequency
- See stack traces
- Monitor performance
- Set up alerts

## Request Logging

All HTTP requests are automatically logged with:
- Method (GET, POST, etc.)
- Path
- Status code
- Response time
- User agent

**Example log:**
```
[2026-02-02T12:00:00.000Z] INFO: GET /admin/dashboard 200 | {"statusCode":200,"duration":45,"userAgent":"Mozilla/5.0..."}
```

## Performance Monitoring

### Automatic Performance Tracking

The logger automatically tracks:
- **Slow Actions:** Server actions taking > 3000ms
- **Slow Operations:** Database queries > 1000ms

**Example:**
```
[2026-02-02T12:00:00.000Z] WARN: Slow Action: createStudent took 3500ms
```

### Manual Performance Tracking

Use `measurePerformance` utility:

```typescript
import { measurePerformance } from '@/lib/logger';

const result = await measurePerformance('complex-calculation', async () => {
  // Your code here
  return await complexOperation();
});
```

## Production Monitoring Checklist

- [ ] Set `LOG_LEVEL=warn` or `LOG_LEVEL=error` in production
- [ ] Enable JSON logging (`LOG_JSON=true`)
- [ ] Configure Sentry with valid DSN
- [ ] Set up health check monitoring (every 60s)
- [ ] Configure alerts for:
  - Application down (health check fails)
  - High error rate (> 10 errors/minute)
  - Slow response times (> 1000ms average)
  - Database connection failures
- [ ] Set up log aggregation (optional: Datadog, LogRocket)
- [ ] Review logs daily for warnings and errors
- [ ] Set up automated reports for weekly metrics

## Recommended Monitoring Tools

### Free/Open Source
- **Uptime Monitoring:** UptimeRobot, Pingdom Free Tier
- **Error Tracking:** Sentry Free Tier
- **Logs:** Self-hosted ELK Stack

### Paid Solutions
- **All-in-One:** Datadog, New Relic
- **Error Tracking:** Sentry Pro
- **Logs:** Loggly, Papertrail
- **APM:** Datadog APM, New Relic APM

## Troubleshooting

### Logs Not Appearing

1. Check `LOG_LEVEL` is set correctly
2. Verify console output in your hosting environment
3. Ensure `LOG_JSON` matches your log aggregation setup

### Health Check Failing

1. Check database connectivity
2. Verify environment variables are set
3. Review recent error logs
4. Check system resources (CPU, memory)

### Sentry Not Receiving Errors

1. Verify `SENTRY_ENABLED=true`
2. Check `SENTRY_DSN` is correct
3. Ensure errors are actually occurring
4. Check Sentry project settings

## Support

For monitoring and logging support:
- Review application logs first
- Check Sentry dashboard for errors
- Contact: ops@yourschool.com
