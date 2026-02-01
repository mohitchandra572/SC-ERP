import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

async function verifyI18n() {
    console.log('🔍 Verifying i18n keys...');
    const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/lib/i18n/locales/en.json'), 'utf8'));
    const bn = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/lib/i18n/locales/bn.json'), 'utf8'));

    const criticalKeys = [
        'common.login',
        'common.logout',
        'nav.home',
        'nav.about',
        'nav.contact',
        'admin.portalName',
        'admin.systemName'
    ];

    let missing = 0;
    for (const key of criticalKeys) {
        const parts = key.split('.');
        let enVal = en;
        let bnVal = bn;
        for (const part of parts) {
            enVal = enVal?.[part];
            bnVal = bnVal?.[part];
        }

        if (!enVal) {
            console.error(`❌ Missing critical key in en.json: ${key}`);
            missing++;
        }
        if (!bnVal) {
            console.error(`❌ Missing critical key in bn.json: ${key}`);
            missing++;
        }
    }

    if (missing > 0) {
        throw new Error(`i18n verification failed with ${missing} missing keys.`);
    }
    console.log('✅ i18n keys verified.');
}

async function verifySEO() {
    console.log('🔍 Verifying SEO consistency...');

    // In a real script we might parse the TS files, but for CI we can do a simple check
    // by reading the strings since they are static in our case.
    const robotsContent = fs.readFileSync(path.join(ROOT, 'src/app/robots.ts'), 'utf8');
    const sitemapContent = fs.readFileSync(path.join(ROOT, 'src/app/sitemap.ts'), 'utf8');

    const disallowed = robotsContent.match(/disallow: \[\s*([\s\S]*?)\s*\]/)?.[1]
        .split('\n')
        .map(line => line.trim().replace(/['",]/g, ''))
        .filter(route => route && route.startsWith('/')) || [];

    const allowed = sitemapContent.match(/url: `\$\{APP_URL\}(.*?)`/g)
        ?.map(match => match.match(/url: `\$\{APP_URL\}(.*?)`/)?.[1])
        .filter(route => route !== undefined) || [];

    let conflicts = 0;
    for (const route of allowed) {
        // If sitemap has '/', check if robots disallows '/'
        const checkRoute = route === '' ? '/' : route;
        if (disallowed.includes(checkRoute)) {
            console.error(`❌ SEO Conflict: Route "${checkRoute}" is in sitemap but disallowed in robots.ts`);
            conflicts++;
        }
    }

    if (conflicts > 0) {
        throw new Error(`SEO verification failed with ${conflicts} conflicts.`);
    }
    console.log('✅ SEO consistency verified.');
}

async function main() {
    try {
        await verifyI18n();
        await verifySEO();
        console.log('\n🚀 Quality Gate: ALL CHECKS PASSED');
    } catch (error) {
        console.error(`\n💥 Quality Gate FAILED: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
    }
}

main();
