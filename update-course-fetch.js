// Copy and paste this into your browser's console to test the updatecourse endpoint

fetch('http://localhost:8000/updatecourse', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        CourseID: "course-uuid-here", // Replace with an actual course ID from your database
        CourseName: "Updated Web Development",
        CourseNumber: "CSC3100",
        CourseSection: "002",
        CourseTerm: "Spring 2024",
        StartDate: "2024-01-15",
        EndDate: "2024-05-15"
    })
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => {
    console.log('Update Course response:', data);
})
.catch(error => {
    console.error('Error:', error);
});

/* 
Example usage with async/await:

async function updateCourse(courseId) {
    try {
        const response = await fetch('http://localhost:8000/updatecourse', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CourseID: courseId,
                CourseName: "Updated Web Development",
                CourseNumber: "CSC3100",
                CourseSection: "002",
                CourseTerm: "Spring 2024",
                StartDate: "2024-01-15",
                EndDate: "2024-05-15"
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update course');
        }
        
        const data = await response.json();
        console.log('Course updated successfully:', data);
        return data;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
}

// Call the function with a valid course ID
// updateCourse("your-course-id-here")
//   .then(data => console.log('Success:', data))
//   .catch(error => console.error('Error:', error));
*/