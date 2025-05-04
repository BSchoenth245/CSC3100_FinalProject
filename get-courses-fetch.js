// Copy and paste this into your browser's console to test the courses endpoint

fetch('http://localhost:8000/courses', {
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
    console.log('Courses response:', data);
    
    // Display courses in a more readable format if there are any
    if (data.courses && data.courses.length > 0) {
        console.log('\nCourses list:');
        data.courses.forEach((course, index) => {
            console.log(`\n--- Course ${index + 1} ---`);
            console.log(`Name: ${course.CourseName}`);
            console.log(`Number: ${course.CourseNumber}`);
            console.log(`Section: ${course.CourseSection}`);
            console.log(`Term: ${course.CourseTerm}`);
            console.log(`Dates: ${course.StartDate} to ${course.EndDate}`);
            console.log(`ID: ${course.CourseID}`);
        });
    }
})
.catch(error => {
    console.error('Error:', error);
});

/* 
Example usage with async/await:

async function getCourses() {
    try {
        const response = await fetch('http://localhost:8000/courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch courses');
        }
        
        const data = await response.json();
        console.log('Courses retrieved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

// Call the function
// getCourses()
//   .then(data => {
//     console.log(`Found ${data.count} courses`);
//     data.courses.forEach(course => console.log(course.CourseName));
//   })
//   .catch(error => console.error('Error:', error));

NOTE: There appears to be a typo in the SQL query in your server.js:
The query uses "tblEnrollments" but based on other endpoints, the table name is likely "tblEnrollements" (with an extra 'e')

Current: LEFT JOIN tblEnrollements ON tblCourses.CourseID = tblEnrollments.CourseID
Correct: LEFT JOIN tblEnrollements ON tblCourses.CourseID = tblEnrollements.CourseID
*/