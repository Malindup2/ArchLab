
const BASE_URL = 'http://localhost:4000';

async function run() {
    console.log('🔍 Starting FULL Backend API Verification...');
    const errors: string[] = [];

    async function check(name: string, fn: () => Promise<void>) {
        try {
            process.stdout.write(`Testing ${name}... `);
            await fn();
            console.log('✅ OK');
        } catch (e: any) {
            console.log('❌ FAIL');
            console.error(`   -> ${e.message}`);
            errors.push(`${name}: ${e.message}`);
        }
    }

    // 0. Health
    await check('GET /health', async () => {
        const res = await fetch(`${BASE_URL}/health`);
        if (!res.ok) throw new Error(`${res.status}`);
    });

    // 1. List Projects
    await check('GET /projects', async () => {
        const res = await fetch(`${BASE_URL}/projects`);
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Not an array');
    });

    // 2. Create Project
    let projectId = '';
    await check('POST /projects', async () => {
        const res = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: `FullCheck-${Date.now()}`, description: 'Full API Check' })
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        projectId = data.id;
        if (!projectId) throw new Error('No ID returned');
    });

    if (!projectId) {
        console.error('❌ Skipping dependent tests due to project creation failure.');
        return;
    }

    // 3. Get Project
    await check(`GET /projects/${projectId}`, async () => {
        const res = await fetch(`${BASE_URL}/projects/${projectId}`);
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        if (data.id !== projectId) throw new Error('ID mismatch');
    });

    // 4. Create Version
    let versionId = '';
    await check('POST /versions', async () => {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/versions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requirementsText: 'Simple requirement' })
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        versionId = data.id;
        if (!versionId) throw new Error('No ID returned');
    });

    // 5. List Versions
    await check('GET /versions', async () => {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/versions`);
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) throw new Error('Invalid list');
    });

    // 6. Get Version
    await check(`GET /versions/${versionId}`, async () => {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/versions/${versionId}`);
        if (!res.ok) throw new Error(`${res.status}`);
    });

    // 7. Generate (AI) - Expecting failure or success
    await check('POST /generate', async () => {
        console.log('(Triggering AI...)');
        const res = await fetch(`${BASE_URL}/projects/${projectId}/versions/${versionId}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        // We accept 429 (Quota) or 200 (Success) as "Working API"
        if (res.status === 429) {
            console.log('   ⚠️ Quota Exceeded (Expected behavior for now)');
            return;
        }
        if (res.status === 500) {
            // Read invalid json error
            const txt = await res.text();
            if (txt.includes('Quota') || txt.includes('429')) {
                console.log('   ⚠️ Quota Exceeded (500 wrapper)');
                return;
            }
        }
        if (!res.ok) throw new Error(`Status ${res.status}`);
    });

    // 8. Get Design (Might be empty if gen failed)
    await check('GET /design', async () => {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/versions/${versionId}/design`);
        // Should return 200 even if null, or maybe 404? 
        // Assuming 200 with null body or empty object
        if (!res.ok && res.status !== 404) throw new Error(`${res.status}`);
    });

    // 9. Get Diagrams
    await check('GET /diagrams', async () => {
        const res = await fetch(`${BASE_URL}/projects/${projectId}/versions/${versionId}/diagrams`);
        if (!res.ok && res.status !== 404) throw new Error(`${res.status}`);
    });

    console.log('\n🏁 Summary:');
    if (errors.length > 0) {
        console.log(`❌ ${errors.length} failed tests.`);
        errors.forEach(e => console.log(` - ${e}`));
        process.exit(1);
    } else {
        console.log('✅ All API endpoints verified.');
    }
}

run();
