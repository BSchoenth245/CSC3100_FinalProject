$(document).ready(function() {
    // Hide all tab content except the first one initially
    $('.tab-content:not(:first)').hide();

    // Handle tab clicks for both regular tabs and profile tab
    $('.nav-tabs a, .profile-tab-container a').click(function(e) {
        e.preventDefault();
        
        // Remove active class from all tabs (both containers)
        $('.nav-tabs li, .profile-tab-container li').removeClass('active');
        // Add active class to current tab
        $(this).parent('li').addClass('active');
        
        // Get the target content id from href
        var tabContentId = $(this).attr('href');
        
        // Hide all tab content
        $('.tab-content').hide();
        // Show the selected tab content
        $(tabContentId).fadeIn();
    });

});


// Adding the collapse menu logic
function toggleMembers(button) {
    // Get the parent card first
    const card = button.closest('.group-card');
    
    // Find the member list within this specific card
    const memberList = card.querySelector('.member-list');
    
    // Toggle both the list and the button itself
    memberList.classList.toggle('collapsed');
    button.classList.toggle('active'); // Changed from collapseIcon to button
}


document.querySelector('#btnCreateCourse').addEventListener('click', function() {
    let blnError = false;
    let strMessage = "";

    if (document.querySelector('#txtCourseName').value.trim().length < 1) {
        blnError = true;
        strMessage += '<p class="mb-0 mt-0">Course Name Cannot Be Blank. <br></p>';            
    }
    if (document.querySelector('#txtCourseSection').value.trim().length < 1) {
        blnError = true;
        strMessage += '<p class="mb-0 mt-0">Course Section Cannot Be Blank. <br></p>';
    }
    
    // Validate season and year
    if (document.querySelector('#selCourseSeason').value === "") {
        blnError = true;
        strMessage += '<p class="mb-0 mt-0">Course Season Must Be Selected. <br></p>';
    }
    
    const yearInput = document.querySelector('#txtCourseYear');
    if (!yearInput.value) {
        blnError = true;
        strMessage += '<p class="mb-0 mt-0">Course Year Cannot Be Blank. <br></p>';
    } else {
        const year = parseInt(yearInput.value);
        const currentYear = new Date().getFullYear();
        
        if (isNaN(year) || year < currentYear || year > currentYear + 10) {
            blnError = true;
            strMessage += `<p class="mb-0 mt-0">Course Year Must Be Between ${currentYear} and ${currentYear + 10}. <br></p>`;
        }
    }
    
    if (document.querySelector('#dateEndDate').value === "") {
        blnError = true;
        strMessage += '<p class="mb-0 mt-0">End Date Cannot Be Blank. </p>';
    }
    else if (new Date(document.querySelector('#dateEndDate').value) < new Date()) {
        blnError = true;
        strMessage += '<p class="mb-0 mt-0">End Date Cannot Be In The Past. </p>';
    }

    if (blnError) {
        Swal.fire({
            title: "Oh no, you have an error!",
            html: strMessage,
            icon: "error"
        });
    } else {
        // Get the current date for the start date
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = document.querySelector('#dateEndDate').value;
        
        // Combine season and year for course term
        const courseSeason = document.querySelector('#selCourseSeason').value;
        const courseYear = document.querySelector('#txtCourseYear').value;
        const courseTerm = `${courseSeason} ${courseYear}`;
        const courseName = document.querySelector('#txtCourseName').value;
        const courseNumber = document.querySelector('#txtCourseNumber').value;
        const section = document.querySelector('#txtCourseSection').value;
        const term = `${document.querySelector('#selCourseSeason').value} ${document.querySelector('#txtCourseYear').value}`;
        
        // Fetch request to test the createcourse endpoint
        fetch('http://localhost:8000/createcourse', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            CourseName: courseName,
            CourseNumber: courseNumber,
            CourseSection: section,
            CourseTerm: courseTerm,
            StartDate: startDate,
            EndDate: endDate
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                console.error('Error details:', errorData);
                throw new Error(`HTTP error! Status: ${response.status}`);
            });
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            console.log('Course ID:', data.CourseID);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        // #TODO: delete this when the backend is ready
        Swal.fire({
            title: "Success!",
            text: "Course created successfully.",
            icon: "success"
        });
        
        // Optionally insert card into DOM here
        
        //const endDate = document.querySelector('#dateEndDate').value;
        
        const cardHTML = `
          <div class="group-card">
            <div class="group-header">
              <h3>${courseName}</h3>
              <p>Section: ${section}</p>
              <p>Term: ${term}</p>
              <p>End Date: ${endDate}</p>
            </div>
          </div>
        `;
        
        document.querySelector('#groupsList').insertAdjacentHTML('beforeend', cardHTML);
    }
});

// Function to update UI based on user type
function updateUIForUserRole(userRole) {
    // Hide all role-specific elements first
    document.querySelectorAll('.student-only, .faculty-only').forEach(element => {
        element.style.display = 'none';
    });
    
    // Show elements specific to the current user role
    if (userRole === 'Student') {
        document.querySelectorAll('.student-only').forEach(element => {
            element.style.display = '';
        });
        
        // Hide the Create Group section within the addNewGroup tab
        if (document.querySelector('#createGroupSection')) {
            document.querySelector('#createGroupSection').style.display = 'none';
        }
    } else if (userRole === 'Staff') {
        document.querySelectorAll('.faculty-only').forEach(element => {
            element.style.display = '';
        });
        
        // Hide the Join Group section within the addNewGroup tab
        if (document.querySelector('#joinGroupSection')) {
            document.querySelector('#joinGroupSection').style.display = 'none';
        }
    }
}

// Fetch the user's role from the server when the page loads
function fetchUserRole() {
    console.log('Fetching user role...');
    return fetch('http://localhost:8000/getUserRole') // Return the fetch call
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('User role fetched:', data.userRole);
            updateUIForUserRole(data.userRole); // Update the UI based on the role
            return data.userRole; // Return the user role for further use
        })
        .catch(error => {
            console.error('Error fetching user role:', error);
            // Fallback to showing everything if there's an error
            document.querySelectorAll('.student-only, .faculty-only').forEach(element => {
                element.style.display = '';
            });
            return null; // Return null if an error occurs
        });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    fetchUserRole();

    // The toggle switch in the registration form should still work for new users
    const userTypeToggle = document.getElementById('userTypeToggle');
    const userTypeValue = document.getElementById('userTypeValue');

    if (userTypeToggle && userTypeValue) {
        userTypeToggle.addEventListener('change', function() {
            userTypeValue.value = this.checked ? 'Student' : 'Staff';
            console.log('Registration user type set to:', userTypeValue.value);
        });
    }
});

$(document).on('click', '.btn-add-contact', function () {
    const currentRow = $(this).closest('.contact-row');

    const contactType = currentRow.find('.contact-type').val();
    const contactValue = currentRow.find('.contact-input').val().trim();

    // Validation
    if (!contactType || !contactValue) {
        Swal.fire({
            title: "Missing Info",
            text: "Select a contact type and enter a value.",
            icon: "warning"
        });
        return;
    }

    // Generate a styled static row
    const staticRow = `
        <div class="contact-row static-contact ${contactType}">
            <div class="contact-display">
                <span class="contact-label">${contactType}</span>
                <span class="contact-value">${contactValue}</span>
            </div>
            <button type="button" class="btn-delete-contact">🗑️</button>
        </div>
    `;

    // Add above the input row
    $('#additionalContacts').append(staticRow);

    // Clear input row fields
    currentRow.find('.contact-type').val('discord'); // default reset
    currentRow.find('.contact-input').val('');
});

$(document).on('click', '.btn-delete-contact', function () {
    $(this).closest('.contact-row').remove();
});

// Add comments and comment tab functionality
// document.querySelector('#btnSubmitFeedback').addEventListener('click', function () {
//     const group = document.querySelector('#selGroup').value;
//     const feedback = document.querySelector('#txtFeedback').value.trim();
//     const visibility = document.querySelector('#commentVisibilityValue').value;

//     let blnError = false;
//     let strMessage = "";

//     if (!feedback) {
//         blnError = true;
//         strMessage += "<p>Feedback cannot be empty.</p>";
//     }

//     if (blnError) {
//         Swal.fire({
//             title: "Error",
//             html: strMessage,
//             icon: "error"
//         });
//         return;
//     }

//     // Get current date and time
//     const now = new Date();
//     const formattedDate = now.toLocaleString("en-US", {
//         dateStyle: "long",
//         timeStyle: "short"
//     });

//     // Create comment element with proper classes for sent comments
//     const commentHTML = `
//         <div class="comment-card sent-comment">
//             <div class="comment-header">
//                 <div class="comment-sender">Brock The Rock</div>
//                 <div class="comment-timestamp">${formattedDate}</div>
//             </div>
//             <div class="comment-group">To: ${group || 'All Groups'}</div>
//             <div class="comment-text">${feedback}</div>
//         </div>
//     `;

//     // Remove empty state message if it exists
//     const emptyMessage = document.querySelector('#sentComments .empty-comments');
//     if (emptyMessage) {
//         emptyMessage.remove();
//     }

//     // Insert comment into Sent Comments column
//     document.querySelector('#sentComments').insertAdjacentHTML('afterbegin', commentHTML);

//     // Clear form
//     document.querySelector('#selGroup').value = '';
//     document.querySelector('#txtFeedback').value = '';
//     document.querySelector('#commentVisibilityToggle').checked = true;
//     document.querySelector('#commentVisibilityValue').value = 'public';

//     Swal.fire({
//         title: "Success!",
//         text: "Your feedback has been added.",
//         icon: "success"
//     });
// });

// Functionality to the "Add Group" and group tabs
document.addEventListener('DOMContentLoaded', function () {
    const createGroupBtn = document.querySelector('#createGroupSection button');

    if (createGroupBtn) {
        createGroupBtn.addEventListener('click', function () {
            const groupName = document.querySelector('#txtGroupName').value.trim();
            const courseOption = document.querySelector('#selCourseName');
            const selectedCourse = courseOption.options[courseOption.selectedIndex];
            const courseText = selectedCourse.text;
            const courseValue = selectedCourse.value;

            let blnError = false;
            let strMessage = '';

            if (groupName === '') {
                blnError = true;
                strMessage += '<p class="mb-0 mt-0">Group Name cannot be blank.</p>';
            }

            if (courseValue === '') {
                blnError = true;
                strMessage += '<p class="mb-0 mt-0">Please select a course.</p>';
            }

            if (blnError) {
                Swal.fire({
                    title: 'Oops!',
                    html: strMessage,
                    icon: 'error'
                });
                return;
            }

            // Extract course and section from courseText (e.g., "CSC3100-001 - Web Development")
            const [courseCode, courseSection] = courseText.split(' - ')[0].split('-');
            let groupCode = generateGroupCode()

            fetch('http://localhost:8000/creategroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({groupName, courseValue, courseSection, groupCode})
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })


            // Build group card HTML
            const groupHTML = `
                <div class="group-card">
                    <div class="group-header">
                        <h3>${groupName}</h3>
                        <span class="group-code">Code: ${groupCode}</span>
                    </div>
                    <div class="group-info">
                        <p><strong>Course:</strong> <span class="courseName">${courseName}</span></p>
                        <p><strong>Section:</strong> <span class="courseSection">${courseSection}</span></p>
                        <div class="members-section">
                            <button class="collapse-btn" onclick="toggleMembers(this)">
                                <strong>Members (${members.length || 1})</strong>
                                <span class="collapse-icon">▼</span>
                            </button>
                            <ul class="member-list collapsed">
                                ${membersHTML}
                            </ul>
                        </div>
                        <div class="card-actions">
                            <button type="button" class="btn-leave-group" data-group-id="${groupCode}">Delete Group</button>
                        </div>
                    </div>
                </div>
            `;

            // Insert into the Groups section
            document.querySelector('#Groups .dashboard-stats').insertAdjacentHTML('beforeend', groupHTML);

            // Clear form fields
            document.querySelector('#txtGroupName').value = '';
            document.querySelector('#selCourseName').value = '';
        });
    }
});

// function createGroup(groupName, courseName, courseSection, groupCode) {
    
// }

// Utility function to generate a random group code (like ABC123)
function generateGroupCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';
    for (let i = 0; i < 3; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }
    for (let i = 0; i < 3; i++) {
        code += numbers[Math.floor(Math.random() * numbers.length)];
    }
    return code;
}

// this function will load the courses from the server and display them in the dashboard
// it will be called when the page loads and when the user clicks on the "Load Courses" button
// TODO:
function loadCourses() {
    fetch('http://localhost:8000/courses') // ⬅️ adjust this if your endpoint is different
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed to fetch courses');
        }
        return response.json();
    })
    .then(courses => {
        const container = document.querySelector('#courseList');
        container.innerHTML = ''; // clear any existing cards
        let strSection = ''
        
        
        courses.courses.forEach(course => {
            if (course.CourseSection < 10) {
                strSection = '00' + course.CourseSection;
            }
            if (course.CourseSection >= 10 && course.CourseSection < 100) {
                strSection = '0' + course.CourseSection;
            }
        const cardHTML = `
            <div class="group-card">
            <div class="group-header">
                <h3>${course.CourseName}<br></h3>
                <p>Section: ${strSection}<br></p>
                <p>Term: ${course.CourseTerm}<br></p>
                <p>End Date: ${course.EndDate}<br></p>
            </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
        });
    })
    .catch(error => {
        console.error('Error loading courses:', error);
        Swal.fire('Error', 'Could not load courses', 'error');
    });
}
// document.addEventListener('DOMContentLoaded', () => {
//     // Use event delegation for dynamically added buttons
//     document.querySelector('#Groups').addEventListener('click', function(e) {
//         // Check if the clicked element is a Take Survey button
//         if (e.target.classList.contains('btn-take-survey') || 
//             (e.target.parentElement && e.target.parentElement.classList.contains('btn-take-survey'))) {
            
//             const btn = e.target.classList.contains('btn-take-survey') ? e.target : e.target.parentElement;
//             const card = btn.closest('.group-card');
//             const groupName = card.querySelector('.group-header h3').textContent;
            
//             // Call the survey function
//             getSurveyQuestions(groupName);
//         }
        
//         // Check if the clicked element is a Leave Group button
//         if (e.target.classList.contains('btn-leave-group') || 
//             (e.target.parentElement && e.target.parentElement.classList.contains('btn-leave-group'))) {
            
//             const btn = e.target.classList.contains('btn-leave-group') ? e.target : e.target.parentElement;
//             const card = btn.closest('.group-card');

document.addEventListener('DOMContentLoaded', () => {
    // Use event delegation for dynamically added buttons
    document.querySelector('#Groups').addEventListener('click', function(e) {
        // Check if the clicked element is a Take Survey button
        if (e.target.classList.contains('btn-take-survey') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('btn-take-survey'))) {
            
            const btn = e.target.classList.contains('btn-take-survey') ? e.target : e.target.parentElement;
            const card = btn.closest('.group-card');
            const groupName = card.querySelector('.group-header h3').textContent;
            
            // Call the survey function
            getSurveyQuestions(groupName);
        }
        
        // Check if the clicked element is a Leave Group button
        if (e.target.classList.contains('btn-leave-group') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('btn-leave-group'))) {
            
            const btn = e.target.classList.contains('btn-leave-group') ? e.target : e.target.parentElement;
            const card = btn.closest('.group-card');
            const groupName = card.querySelector('.group-header h3').textContent;
            
            Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to leave "${groupName}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, leave group',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    card.remove();
                    
                    Swal.fire({
                        title: 'Left Group',
                        text: `You have left "${groupName}".`,
                        icon: 'success'
                    });
                }
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    fetchUserRole().then(result => {
    console.log('User role:', result); // Debugging line to check the user role
    // Call loadCourses() only if the user role is 'Staff'
    if (result === 'Staff') {
        loadCourses();
    }
    }).catch(error => {
        console.error('Error fetching user role:', error);
    });
})

// Survey fully created, now we need to add the functionality to the button
// Mock group members for demonstration
const mockGroupMembers = [
    { name: "John Smith" },
    { name: "Sarah Johnson" },
    { name: "Mike Wilson" },
    { name: "Emily Davis" }
];
function loadGroups() {
    fetch('http://localhost:8000/groups') // Adjust the endpoint if necessary
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user groups');
            }
            return response.json();
        })
        .then(groups => {
            console.log(groups); // Debugging line to check the structure of the response
            const container = document.querySelector('#groupsList');
            container.innerHTML = ''; // Clear any existing cards

            groups.groups.forEach(group => {
                const cardHTML = `
                    <div class="group-card">
                        <div class="group-header">
                            <h3>${group.GroupName}</h3>
                            <span class="group-code">Code: ${group.GroupCode}</span>
                        </div>
                        <div class="group-info">
                            <p><strong>Course:</strong> ${group.CourseName}</p>
                            <p><strong>Section:</strong> ${group.CourseSection}</p>
                            <div class="members-section">
                                <button class="collapse-btn" onclick="toggleMembers(this)">
                                    <strong>Members</strong>
                                    <span class="collapse-icon">▼</span>
                                </button>

                            </div>
                            <div class="card-actions">
                                <button type="button" class="btn-take-survey" data-group-id="${group.GroupID}">Take Survey</button>
                                <button type="button" class="btn-leave-group" data-group-id="${group.GroupID}">Leave Group</button>
                            </div>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', cardHTML);
            });
        })
        .catch(error => {
            console.error('Error loading user groups:', error);
            Swal.fire('Error', 'Could not load user groups', 'error');
        });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadGroups();
});