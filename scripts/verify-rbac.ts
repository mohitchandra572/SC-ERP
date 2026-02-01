import fs from 'fs'
import path from 'path'

const ACTIONS_DIR = path.join(process.cwd(), 'src', 'lib', 'actions')

function scanFiles(dir: string): string[] {
    let results: string[] = []
    const list = fs.readdirSync(dir)
    list.forEach((file) => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat && stat.isDirectory()) {
            results = results.concat(scanFiles(filePath))
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(filePath)
        }
    })
    return results
}

console.log('🛡️ Starting RBAC & Security Audit for Server Actions...')
const files = scanFiles(ACTIONS_DIR)
let issuesFound = 0

files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8')
    const relPath = path.relative(process.cwd(), file)

    // Check for 'use server'
    if (!content.includes("'use server'") && !content.includes('"use server"')) {
        return // Not a server action file
    }

    const exportedFunctions = content.match(/export async function (\w+)/g) || []

    exportedFunctions.forEach((funcMatch) => {
        const funcName = funcMatch.split(' ').pop()

        // Find the body of the function (more robust approach)
        const funcStartIndex = content.indexOf(funcMatch)
        let nextExportIndex = content.indexOf('export async function', funcStartIndex + 1)
        if (nextExportIndex === -1) nextExportIndex = content.length

        const funcBody = content.substring(funcStartIndex, nextExportIndex)

        const hasAuth = funcBody.includes('auth()')
        const hasPermission = funcBody.includes('hasPermission(') || funcBody.includes('hasPermission (')

        if (!hasAuth && !funcName?.toLowerCase().includes('get')) {
            console.warn(`⚠️ [${relPath}] Function '${funcName}' is missing 'auth()' check.`)
            issuesFound++
        }

        if (!hasPermission && (funcName?.toLowerCase().includes('create') || funcName?.toLowerCase().includes('update') || funcName?.toLowerCase().includes('delete') || funcName?.toLowerCase().includes('remove') || funcName?.toLowerCase().includes('assign'))) {
            console.warn(`🔴 [${relPath}] Mutative function '${funcName}' might be missing 'hasPermission()' check.`)
            issuesFound++
        }
    })
})

if (issuesFound === 0) {
    console.log('✅ RBAC Audit Passed: All mutation actions have basic security checks.')
} else {
    console.log(`\n❌ Found ${issuesFound} potential security issues in server actions.`)
}
