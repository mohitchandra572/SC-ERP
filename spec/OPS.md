# Operations Specification (OPS)

This document outlines the operational procedures for maintaining the School Management System in a production environment.

## 1. Database Backups (PostgreSQL)

### Automation Strategy
Use `cron` or a task scheduler to run daily backups.

### Backup Commands
To create a full backup:
```bash
pg_dump -U [user] -h [host] -d [db_name] > backup_[timestamp].sql
```

### Restore Commands
To restore from a backup:
1. Drop and recreate the database:
   ```bash
   dropdb -U [user] [db_name]
   createdb -U [user] [db_name]
   ```
2. Restore the data:
   ```bash
   psql -U [user] -d [db_name] < [backup_file].sql
   ```

## 2. File Storage Backups
Since the system uses Cloudinary for dynamic media:
- **Cloudinary Backups**: Cloudinary provides its own backup/replication features.
- **Local Cache**: If performing local file storage, use `rsync` to mirror the storage directory to a separate volume.

## 3. Disaster Recovery (DR)

### Recovery Time Objective (RTO): 4 hours
### Recovery Point Objective (RPO): 24 hours (last daily backup)

### DR Checklist
1. Identify the point of failure (Database, App Server, Storage).
2. Provision a new environment if necessary.
3. Deploy the latest stable release from CI/CD.
4. Restore the latest database backup.
5. Verify application connectivity and role-based access.

## 4. Monitoring & Alerts
- **Uptime**: Monitor `NEXT_PUBLIC_APP_URL` for 200 OK responses.
- **Errors**: Sentry will alert on 500 errors and exception spikes.
- **Logs**: Structured logs available via stdout/collector for request tracing.

# Storage Policies & DR

## 1. Data Classification
| Category | Storage Provider | Access Type | Backend Source |
|----------|------------------|-------------|----------------|
| Institutional Branding | Cloudinary | Public | SchoolSettings |
| Student/Staff Photos | Cloudinary | Restricted | Storage Abstraction |
| Certificates/Notices | Cloudinary | Public | Document Module |
| Payroll/Financials | Private | Signed URL | Document Module |
| Sensitive Documents | Private | Signed URL | Document Module |

## 2. Backup & Retention
- **Cloudinary**: Use Cloudinary backup service for media assets.
- **Private Storage**: Hourly rsync to secondary object storage.
- **Retention**: Financial documents preserved for 7 years; academic records for 10 years.

## 3. Disaster Recovery (Storage)
- **RTO (Recovery Time Objective)**: 4 hours for media assets.
- **RPO (Recovery Point Objective)**: 1 hour for private documents.
- In case of provider failure, toggle `STORAGE_PROVIDER` in settings to fallback local/S3.
