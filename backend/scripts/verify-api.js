
const BASE_URL = 'http://localhost:4000';

// Simple fetch wrapper if needed, but Node 18+ has native fetch
async function run() {
    console.log('🔍 Starting Backend API Verification (JS Mode)...');

    try {
        // 1. Health/Projects Check
        console.log('\n1. Checking Projects List...');
        const projectsRes = await fetch(`${BASE_URL}/projects`);
        if (!projectsRes.ok) throw new Error(`Failed to list projects: ${projectsRes.status} ${projectsRes.statusText}`);
        const projects = await projectsRes.json();
        console.log(`✅ APIs reachable. Found ${projects.length} projects.`);

        // 2. Create Project
        const projectName = `Verify-JS-${Date.now()}`;
        console.log(`\n2. Creating Project "${projectName}"...`);
        const createRes = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: projectName, description: 'API Verification Test JS' })
        });
        if (!createRes.ok) {
            const txt = await createRes.text();
            throw new Error(`Failed to create project: ${createRes.status} - ${txt}`);
        }
        const project = await createRes.json();
        console.log(`✅ Project created: ${project.id}`);

        // 3. Create Version
        console.log('\n3. Creating Version with Requirements...');
        const reqs = "A simple Todo list application with a React frontend and Node.js backend using MongoDB.";
        const versionRes = await fetch(`${BASE_URL}/projects/${project.id}/versions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requirementsText: reqs })
        });
        if (!versionRes.ok) {
            const txt = await versionRes.text();
            throw new Error(`Failed to create version: ${versionRes.status} - ${txt}`);
        }
        const version = await versionRes.json();
        console.log(`✅ Version created: v${version.versionNumber} (${version.id})`);

        // 4. Trigger AI Generation
        console.log('\n4. Triggering AI Design Generation (This may take ~10-20s)...');
        const genRes = await fetch(`${BASE_URL}/projects/${project.id}/versions/${version.id}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (!genRes.ok) {
            const err = await genRes.text();
            console.error(`❌ Generation Failed: ${genRes.status}`);
            console.error(`   Error API Response: ${err}`);
            if (genRes.status === 429) {
                console.log('⚠️  RESULT: Backend is working, but AI API Quota is Exceeded (429).');
                console.log('   Action: Use a different API key or wait for quota reset.');
            } else {
                console.log('⚠️  RESULT: Backend error during generation.');
            }
        } else {
            const genData = await genRes.json();
            console.log('✅ Generation Successful!');

            let pattern = 'Unknown';
            if (genData.designJson && genData.designJson.architecture) {
                pattern = genData.designJson.architecture.pattern;
            }

            console.log(`   Architecture: ${pattern}`);
            console.log('🎉 Backend Verification Passed (AI is working).');
        }

    } catch (err) {
        console.error('\n❌ Verification Failed Exception:', err);
    }
}

// Execute
run();
