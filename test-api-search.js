
async function testSearch(query) {
    const url = `http://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/en.sahih`;
    console.log(`Testing query: "${query}"`);
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === 'OK') {
            console.log(`Count: ${data.data.count}`);
            if (data.data.count > 0) {
                console.log(`First match: ${data.data.matches[0].text}`);
            }
        } else {
            console.log('Status:', data.status);
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
    console.log('---');
}

async function run() {
    await testSearch('patience'); // Baseline
    await testSearch('patience OR endurance'); // Test OR
    await testSearch('patience endurance'); // Test AND (implied)
}

run();
