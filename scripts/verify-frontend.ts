import fs from 'fs'
import path from 'path'

const SRC_DIR = path.join(process.cwd(), 'src')

function scanFiles(dir: string): string[] {
    let results: string[] = []
    const list = fs.readdirSync(dir)
    list.forEach((file) => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        if (stat && stat.isDirectory()) {
            results = results.concat(scanFiles(filePath))
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(filePath)
        }
    })
    return results
}

console.log('🔍 Starting Frontend Quality Audit...')
const files = scanFiles(SRC_DIR)
let issuesFound = 0

files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8')
    const relPath = path.relative(process.cwd(), file)
    const isClient = content.includes("'use client'") || content.includes('"use client"')
    const isTsx = file.endsWith('.tsx')

    // 1. Check for Prisma in Client Components
    if (isClient) {
        if (content.includes('@prisma/client') || content.includes('@/lib/db') || content.includes('prisma.')) {
            // Check if it's actually an import or usage
            if (content.match(/import.*(prisma|@prisma\/client)/) || content.match(/prisma\.[a-z]/)) {
                console.error(`❌ [${relPath}] Client Component imports or uses Prisma directly. Use Server Actions instead.`)
                issuesFound++
            }
        }
    }

    // 2. Check for Hardcoded Strings in TSX (User-facing)
    // This is a naive check for text nodes in TSX tags
    if (isTsx) {
        // Match text between tags: >Some Text< or > Some Text <
        // Exclude tags, attributes, and script/style content
        // We look for patterns like <div>Some Text</div> or <p>Some Text</p>
        // and check if the text is not a variable {var} or a translation t('key')

        const textNodeRegex = />\s*([A-Z][^<>{}\s][^<>{}]*)\s*</g
        let match
        while ((match = textNodeRegex.exec(content)) !== null) {
            const text = match[1].trim()

            // Allow capital letters that are likely codes or icons or short abbreviations
            if (text.length <= 3 && /^[A-Z0-9]+$/.test(text)) continue

            // Allow if it contains a translation function call (though the regex usually excludes it)
            if (text.includes('t(')) continue

            // Allow common exceptions
            const exceptions = ['Select...', 'Loading...', 'OK', 'Cancel']
            if (exceptions.includes(text)) continue

            console.warn(`⚠️ [${relPath}] Potential hardcoded string: "${text}". Use t() for localization.`)
            // We count this as a warning for now, but in a strict PR it should be an issue
            // For the sake of this task, let's treat it as a warning that doesn't fail build immediately unless strict
        }
    }
})

if (issuesFound === 0) {
    console.log('✅ Frontend Quality Audit Passed.')
} else {
    console.log(`\n❌ Found ${issuesFound} critical frontend architecture issues.`)
    process.exit(1)
}
