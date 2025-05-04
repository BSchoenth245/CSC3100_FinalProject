// Copy and paste this into your browser's console to test the addAssessmentResponse endpoint

fetch('http://localhost:8000/addAssessmentResponse', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        AssessmentName: "Final Project",
        QNumber: 1,
        Response: "Option A"
    })
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => {
    console.log('Add Assessment Response result:', data);
})
.catch(error => {
    console.error('Error:', error);
});

/* 
Example usage with async/await:

async function addAssessmentResponse() {
    try {
        const response = await fetch('http://localhost:8000/addAssessmentResponse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                AssessmentName: "Final Project",
                QNumber: 1,
                Response: "Option A"
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add assessment response');
        }
        
        const data = await response.json();
        console.log('Assessment response added successfully:', data);
        return data;
    } catch (error) {
        console.error('Error adding assessment response:', error);
        throw error;
    }
}

// Call the function
// addAssessmentResponse()
//   .then(data => console.log('Success:', data))
//   .catch(error => console.error('Error:', error));

NOTE: There are several issues in the server endpoint that might cause errors:

1. SQL Query Typo: The query uses "tblAssesments" (missing an 's') instead of "tblAssessments"
   Correct: SELECT AssessmentID FROM tblAssessments WHERE...
   Current: SELECT AssessmentID FROM tblAssesments WHERE...

2. Column Name Mismatch: The query uses "AssessmentName" but based on the AddAssessment endpoint, 
   the column is likely called "Name"
   Correct: SELECT AssessmentID FROM tblAssessments WHERE Name = ?...
   Current: SELECT AssessmentID FROM tblAssessments WHERE AssessmentName = ?...

3. Owner Column: Similar to the addAssessmentQuestion endpoint, there's a reference to an "owner" 
   column that doesn't appear to exist in the tblAssessments table structure.

A corrected version of the SQL query might be:
SELECT QuestionID FROM tblAssessmentQuestions WHERE AssessmentID = 
  (SELECT AssessmentID FROM tblAssessments WHERE Name = ?) AND QNumber = ?

With parameters: [AssessmentName, QNumber]
*/