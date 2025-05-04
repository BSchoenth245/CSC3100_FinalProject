// Copy and paste this into your browser's console to test the socials endpoint

fetch('http://localhost:8000/socials', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => {
    console.log('Socials response:', data);
    
    // Display socials in a more readable format if there are any
    if (data.socials && data.socials.length > 0) {
        console.log('\nSocial media accounts:');
        data.socials.forEach((social, index) => {
            console.log(`\n--- Social ${index + 1} ---`);
            console.log(`Type: ${social.SocialType}`);
            console.log(`Username: ${social.Username}`);
            console.log(`ID: ${social.SocialID}`);
        });
    }
})
.catch(error => {
    console.error('Error:', error);
});

/* 
Example usage with async/await:

async function getSocials() {
    try {
        const response = await fetch('http://localhost:8000/socials', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch social media accounts');
        }
        
        const data = await response.json();
        console.log('Socials retrieved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching socials:', error);
        throw error;
    }
}

// Call the function
// getSocials()
//   .then(data => {
//     console.log(`Found ${data.count} social media accounts`);
//     data.socials.forEach(social => console.log(`${social.SocialType}: ${social.Username}`));
//   })
//   .catch(error => console.error('Error:', error));
*/