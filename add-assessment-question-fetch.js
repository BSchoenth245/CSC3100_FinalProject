// Copy and paste this into your browser's console to test the addAssessmentQuestion endpoint

fetch('http://localhost:8000/addAssessmentQuestion', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        AssessmentName: "Final Project",
        QType: "multiple-choice",
        Options: JSON.stringify(["Option A", "Option B", "Option C", "Option D"]),
        Narrative: "What is the correct answer to this question?"
    })
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => {
    console.log('Add Assessment Question response:', data);
})
.catch(error => {
    console.error('Error:', error);
});

/* 
Example usage with async/await:

async function addAssessmentQuestion() {
    try {
        const response = await fetch('http://localhost:8000/addAssessmentQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                AssessmentName: "Final Project",
                QType: "multiple-choice",
                Options: JSON.stringify(["Option A", "Option B", "Option C", "Option D"]),
                Narrative: "What is the correct answer to this question?"
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add assessment question');
        }
        
        const data = await response.json();
        console.log('Assessment question added successfully:', data);
        return data;
    } catch (error) {
        console.error('Error adding assessment question:', error);
        throw error;
    }
}

// Call the function
// addAssessmentQuestion()
//   .then(data => console.log('Success:', data))
//   .catch(error => console.error('Error:', error));

NOTE: There's a potential issue in the server endpoint. The SQL query looks for "owner" in the AssessmentIDsql query:
SELECT AssessmentID FROM tblAssessments WHERE Name = ? AND owner = ?

But the tblAssessments table structure shown in the AddAssessment endpoint doesn't seem to have an "owner" column.
This might cause the query to fail. If you encounter an error, you may need to modify the server code.
*/