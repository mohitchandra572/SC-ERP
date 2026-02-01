import { PrismaClient, AttendanceStatus, SubmissionStatus, DocumentType, FeeCategory, FeeStatus, PaymentMethod, NotificationType, SmsStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const PERMISSIONS = [
    // Students
    { slug: 'students.view', description: 'View students' },
    { slug: 'students.create', description: 'Create students' },
    { slug: 'students.edit', description: 'Edit students' },
    { slug: 'students.delete', description: 'Delete students' },
    // Attendance & Messaging
    { slug: 'attendance.view', description: 'View attendance record' },
    { slug: 'attendance.take', description: 'Take attendance' },
    { slug: 'attendance.edit', description: 'Edit attendance' },
    { slug: 'attendance.report', description: 'View attendance reports' },
    { slug: 'sms.send', description: 'Manual SMS trigger' },
    { slug: 'sms.config', description: 'SMS template config' },
    // Fees & Accounting
    { slug: 'fees.view', description: 'View financial records' },
    { slug: 'fees.manage', description: 'Manage fee heads and record transactions' },
    { slug: 'fees.report', description: 'Access financial reports' },
    { slug: 'fees.discount', description: 'Apply discounts/waivers' },
    // Assignments
    { slug: 'assignments.view', description: 'View assignments' },
    { slug: 'assignments.manage', description: 'Create/Edit assignments' },
    { slug: 'assignments.grade', description: 'Grade assignments' },
    { slug: 'assignments.submit', description: 'Submit assignments' },
    // Exams & Results
    { slug: 'exams.manage', description: 'Manage exams' },
    { slug: 'results.view', description: 'View results' },
    { slug: 'results.enter', description: 'Enter marks' },
    { slug: 'results.publish', description: 'Publish results' },
    // Promotions
    { slug: 'promotion.execute', description: 'Execute student promotion' },
    { slug: 'promotion.history', description: 'View promotion history' },
    { slug: 'promotion.bypass', description: 'Bypass promotion gates' },
    // Documents
    { slug: 'docs.view', description: 'View documents' },
    { slug: 'docs.manage', description: 'Manage documents' },
    // Notifications
    { slug: 'notifications.view', description: 'View notification history' },
    { slug: 'notifications.admin', description: 'Manage notification settings' },
    // CMS & Settings
    { slug: 'cms.edit', description: 'Edit CMS content' },
    { slug: 'settings.branding', description: 'Manage school branding' },
    // Users & Roles
    { slug: 'users.manage', description: 'Manage users' },
    { slug: 'roles.manage', description: 'Manage roles' },
    // HRM & Payroll
    { slug: 'hr.manage', description: 'Manage departments, designations and staff profiles' },
    { slug: 'payroll.manage', description: 'Manage salary components and structures' },
    { slug: 'payroll.run', description: 'Trigger monthly payroll runs' },
    { slug: 'payroll.approve', description: 'Approve and lock payroll runs' },
    { slug: 'payroll.export', description: 'Export payslips and payroll reports' },
    // Configuration & Customization
    { slug: 'config.manage', description: 'Manage system configurations and drafts' },
    { slug: 'config.publish', description: 'Publish and archive configurations' },
    { slug: 'config.rollback', description: 'Rollback to previous configuration versions' },
    // Export
    { slug: 'export.csv', description: 'Export data to CSV' },
    { slug: 'export.pdf', description: 'Export data to PDF' },
]

const ROLES = [
    { name: 'SCHOOL_ADMIN', displayName: 'School Administrator', isSystem: true },
    { name: 'TEACHER', displayName: 'Teacher', isSystem: true },
    { name: 'STUDENT', displayName: 'Student', isSystem: true },
    { name: 'GUARDIAN', displayName: 'Guardian', isSystem: true },
    { name: 'ACCOUNTANT', displayName: 'Accountant', isSystem: false },
]

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Upsert Permissions
    console.log('Creating permissions...')
    const permissionMap = new Map<string, string>()
    for (const p of PERMISSIONS) {
        const perm = await prisma.permission.upsert({
            where: { slug: p.slug },
            update: { description: p.description },
            create: p,
        })
        permissionMap.set(p.slug, perm.id)
    }

    // 2. Upsert Roles
    console.log('Creating roles...')
    const roleMap = new Map<string, string>()
    for (const r of ROLES) {
        const role = await prisma.role.upsert({
            where: { name: r.name },
            update: { displayName: r.displayName, isSystem: r.isSystem },
            create: r,
        })
        roleMap.set(r.name, role.id)
    }

    // 3. Assign Permissions
    console.log('Assigning permissions...')
    const assign = async (roleName: string, slugs: string[]) => {
        const roleId = roleMap.get(roleName)
        if (!roleId) return
        const permIds = slugs.map(s => permissionMap.get(s)).filter(Boolean) as string[]
        for (const pid of permIds) {
            await prisma.rolePermission.upsert({
                where: { roleId_permissionId: { roleId, permissionId: pid } },
                update: {},
                create: { roleId, permissionId: pid }
            })
        }
    }

    await assign('SCHOOL_ADMIN', PERMISSIONS.map(p => p.slug))
    await assign('TEACHER', [
        'students.view', 'attendance.view', 'attendance.take', 'attendance.report',
        'assignments.view', 'assignments.manage', 'assignments.grade',
        'exams.manage', 'results.view', 'results.enter', 'results.publish',
        'docs.view', 'export.csv', 'export.pdf'
    ])
    await assign('STUDENT', [
        'attendance.view', 'assignments.view', 'assignments.submit',
        'results.view', 'docs.view', 'fees.view'
    ])
    await assign('GUARDIAN', [
        'attendance.view', 'assignments.view', 'results.view', 'docs.view', 'fees.view'
    ])
    await assign('ACCOUNTANT', ['fees.view', 'fees.manage', 'fees.report', 'fees.discount', 'export.csv', 'export.pdf', 'docs.view'])

    // 4. Create Users
    console.log('Creating users...')
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash('password123', salt)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@school.com' },
        update: {},
        create: {
            email: 'admin@school.com',
            passwordHash: hash,
            fullName: 'System Admin',
            profile: { create: { language: 'en' } }
        }
    })
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: admin.id, roleId: roleMap.get('SCHOOL_ADMIN')! } },
        update: {},
        create: { userId: admin.id, roleId: roleMap.get('SCHOOL_ADMIN')! }
    })

    const teacher = await prisma.user.upsert({
        where: { email: 'teacher@school.com' },
        update: {},
        create: {
            email: 'teacher@school.com',
            passwordHash: hash,
            fullName: 'Rahim Sir',
            profile: { create: { language: 'bn' } }
        }
    })
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: teacher.id, roleId: roleMap.get('TEACHER')! } },
        update: {},
        create: { userId: teacher.id, roleId: roleMap.get('TEACHER')! }
    })

    // 5. Academic Data
    console.log('Creating academic data...')
    const class6 = await prisma.class.upsert({
        where: { code: 'C06' },
        update: {},
        create: { name: 'Class 6', code: 'C06' }
    })
    const class7 = await prisma.class.upsert({
        where: { code: 'C07' },
        update: {},
        create: { name: 'Class 7', code: 'C07' }
    })

    // 5.1 Students
    console.log('Creating sample students...')
    const student1 = await prisma.user.upsert({
        where: { email: 'student1@school.com' },
        update: {},
        create: {
            email: 'student1@school.com',
            passwordHash: hash,
            fullName: 'Kiron Ahmed',
            profile: {
                create: {
                    language: 'bn',
                    rollNo: '101',
                    classId: class6.id,
                    phone: '01711111111'
                }
            }
        }
    })
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: student1.id, roleId: roleMap.get('STUDENT')! } },
        update: {},
        create: { userId: student1.id, roleId: roleMap.get('STUDENT')! }
    })

    const student2 = await prisma.user.upsert({
        where: { email: 'student2@school.com' },
        update: {},
        create: {
            email: 'student2@school.com',
            passwordHash: hash,
            fullName: 'Jaba Akter',
            profile: {
                create: {
                    language: 'bn',
                    rollNo: '102',
                    classId: class6.id,
                    phone: '01722222222'
                }
            }
        }
    })
    await prisma.userRole.upsert({
        where: { userId_roleId: { userId: student2.id, roleId: roleMap.get('STUDENT')! } },
        update: {},
        create: { userId: student2.id, roleId: roleMap.get('STUDENT')! }
    })

    const subjectBangla = await prisma.subject.upsert({
        where: { code: 'BAN1' },
        update: {},
        create: { name: 'Bangla 1st', code: 'BAN1' }
    })
    const subjectEnglish = await prisma.subject.upsert({
        where: { code: 'ENG1' },
        update: {},
        create: { name: 'English 1st', code: 'ENG1' }
    })

    // 6. Accounting Data
    console.log('Creating accounting data...')
    const feeAdmission = await prisma.feeHead.upsert({
        where: { id: 'fee_admission' }, // Static ID for seed
        update: {},
        create: { id: 'fee_admission', name: 'Admission Fee', amount: 5000, category: 'ADMISSION' }
    })
    const feeTuition = await prisma.feeHead.upsert({
        where: { id: 'fee_tuition' },
        update: {},
        create: { id: 'fee_tuition', name: 'Monthly Tuition', amount: 1500, category: 'ACADEMIC' }
    })

    // 7. School Settings
    console.log('Creating School Settings...')
    const settings = await prisma.schoolSettings.findFirst()
    if (!settings) {
        await prisma.schoolSettings.create({
            data: {
                schoolNameBn: 'আদর্শ উচ্চ বিদ্যালয়',
                schoolNameEn: 'Adarsha High School',
                addressBn: 'ঢাকা, বাংলাদেশ',
                addressEn: 'Dhaka, Bangladesh',
                phone: '01700000000',
                email: 'info@school.com',
                footerTextBn: 'সর্বস্বত্ব সংরক্ষিত',
                footerTextEn: 'All rights reserved',
                primaryColor: '#0f172a',
            }
        })
    }

    console.log('✅ Seed completed')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
