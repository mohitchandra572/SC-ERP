import { prisma } from "../src/lib/db"

async function checkData() {
    const counts = {
        users: await prisma.user.count(),
        roles: await prisma.role.count(),
        classes: await prisma.class.count(),
        subjects: await prisma.subject.count(),
        permissions: await prisma.permission.count(),
    }
    console.log("📊 Database Counts:", counts)

    const teacherRole = await prisma.role.findFirst({ where: { name: 'TEACHER' } })
    const studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT' } })

    const teachers = await prisma.user.count({
        where: { roles: { some: { role: { name: 'TEACHER' } } } }
    })
    const students = await prisma.user.count({
        where: { roles: { some: { role: { name: 'STUDENT' } } } }
    })

    console.log(`👨‍🏫 Teachers: ${teachers}, 👨‍🎓 Students: ${students}`)
}

checkData()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
