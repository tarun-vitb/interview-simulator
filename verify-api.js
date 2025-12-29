
async function testApi() {
    try {
        // Native fetch is available in Node 18+
        const response = await fetch('http://localhost:3000/api/generate-test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ experienceLevel: 'Entry Level' }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('SUCCESS: API working correctly.');
            // print first question to prove it
            if (data.aptitude && data.aptitude.length > 0) {
                console.log('First Question:', data.aptitude[0].question);
            }
        } else {
            console.log('FAILURE: API returned error.');
            console.log('Status:', response.status);
            console.log('Error:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('ERROR: Network or Script error');
        console.error(error);
    }
}

testApi();
