// Copy and paste this into your browser's console to test the deleteGroup endpoint

fetch('http://localhost:8000/deleteGroup', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        GroupName: "Study Group A",
        CourseName: "Web Development",
        CourseNumber: "CSC3100",
        CourseSection: "001"
    })
})
.then(response => {
    console.log('Status:', response.status);
    return response.json();
})
.then(data => {
    console.log('Delete Group response:', data);
})
.catch(error => {
    console.error('Error:', error);
});

/* 
Example usage with async/await:

async function deleteGroup(groupName, courseName, courseNumber, courseSection) {
    try {
        const response = await fetch('http://localhost:8000/deleteGroup', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                GroupName: groupName,
                CourseName: courseName,
                CourseNumber: courseNumber,
                CourseSection: courseSection
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete group');
        }
        
        const data = await response.json();
        console.log('Group deleted successfully:', data);
        return data;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
    }
}

// Call the function with valid group and course details
// deleteGroup("Study Group A", "Web Development", "CSC3100", "001")
//   .then(data => console.log('Success:', data))
//   .catch(error => console.error('Error:', error));

NOTE: This endpoint performs a cascading delete operation:
1. First it finds the GroupID based on the provided group and course details
2. Then it deletes all members from the group (from tblGroupMembers)
3. Finally it deletes the group itself (from tblCourseGroups)

Be careful when using this endpoint as it will permanently delete the group and all its members.
*/