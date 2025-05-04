// Copy and paste this into your browser's console to test the deletecourse endpoint

fetch('http://localhost:8000/deletecourse', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        CourseID: "course-uuid-here" // Replace with an actual course ID from your database
    })
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => {
    console.log('Delete Course response:', data);
})
.catch(error => {
    console.error('Error:', error);
});

/* 
Example usage with async/await:

async function deleteCourse(courseId) {
    try {
        const response = await fetch('http://localhost:8000/deletecourse', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CourseID: courseId
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete course');
        }
        
        const data = await response.json();
        console.log('Course deleted successfully:', data);
        return data;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
}

// Call the function with a valid course ID
// deleteCourse("your-course-id-here")
//   .then(data => console.log('Success:', data))
//   .catch(error => console.error('Error:', error));

NOTE: Deleting a course might have cascading effects on related data like enrollments, 
groups, and assessments. Make sure you understand the implications before deleting a course.
*/