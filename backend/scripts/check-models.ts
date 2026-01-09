
import 'dotenv/config';

async function run() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No GEMINI_API_KEY found in environment");
        return;
    }
    console.log("Checking models with key...");

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        if (!res.ok) {
            console.error("Failed to list models:", res.status, await res.text());
        } else {
            const data = await res.json();
            console.log("Available Models:");
            if (data.models) {
                data.models.forEach((m: any) => {
                    if (m.supportedGenerationMethods?.includes("generateContent")) {
                        console.log(` - ${m.name}`);
                    }
                });
            } else {
                console.log("No models return in list.");
                console.log(JSON.stringify(data, null, 2));
            }
        }
    } catch (e) {
        console.error("Fetch error:", e);
    }
}
run();
