// Copy and paste this into your browser's console to test the AddAssessment endpoint

fetch('http://localhost:8000/AddAssessment', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        CourseName: "Web Development",
        CourseNumber: "CSC3100",
        CourseSection: "001",
        StartDate: "2024-05-01",
        EndDate: "2024-05-15",
        Name: "Final Project"
    })
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => {
    console.log('Add Assessment response:', data);
})
.catch(error => {
    console.error('Error:', error);
});

/* 
Example usage with async/await:

async function addAssessment() {
    try {
        const response = await fetch('http://localhost:8000/AddAssessment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CourseName: "Web Development",
                CourseNumber: "CSC3100",
                CourseSection: "001",
                StartDate: "2024-05-01",
                EndDate: "2024-05-15",
                Name: "Final Project"
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add assessment');
        }
        
        const data = await response.json();
        console.log('Assessment added successfully:', data);
        return data;
    } catch (error) {
        console.error('Error adding assessment:', error);
        throw error;
    }
}

// Call the function
// addAssessment()
//   .then(data => console.log('Success:', data))
//   .catch(error => console.error('Error:', error));
*/