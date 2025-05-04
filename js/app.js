$("#btnLogin").on('click',function(){
    // Regular expression for emails
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    //const regPass = ~/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

    // Captures necessary Login data
    let strUsername = document.querySelector('#txtLogUser').value
    const strPassword = $('#txtLogPassword').val()
    let blnError = false
    let strMessage = ""

    strUsername = strUsername.toLowerCase()
    // Input validation for login
    if(!regEmail.test(strUsername)){
        blnError = true
        strMessage+='<p class ="mb-0 mt-0">Username must be an email address</p>'
    }
    if(strPassword.length < 8){
        blnError = true
        strMessage+="<p>Password must be at least 8 characters</p>"
    }
    // Error message
    if(blnError == true){
        Swal.fire({
            title: "Oh no, you have an error!",
            html: strMessage,
            icon: "error"
        })
    }
    // Success message
    else{
        // loginUser(strUsername, strPassword).then(data => {
        //     if (data.error) {
        //         Swal.fire({
        //             title: "There's a problem!",
        //             text: data.error,
        //             icon: "error"
        //         })
        //     } else if (!data.error) {
        //         Swal.fire({
        //             title: "Success",
        //             text: data.message,
        //             icon: "success"
        //         })
                 document.querySelector('#Login').style.display = 'none';
                 document.querySelector('#Dashboard').style.display = 'block'
        //     }
        // })

        // Clear password input
    }
    document.querySelector('#txtLogPassword').value = ''
})

$("#btnRegister").on('click',function(){
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    //const regPass = ~/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/

    // Captures necessary Login data
    let strUsername = document.querySelector('#txtRegUsername').value
    let strFirst = document.querySelector('#txtFirstName').value
    let strLast = document.querySelector('#txtLastName').value

    const strPassword = $('#txtRegPassword').val()
    const strConPassword = $('#txtConfirmPassword').val()
    const isFaculty = document.getElementById('commentVisibilityValue');

    let blnError = false
    let strMessage = ""

    strUsername = strUsername.toLowerCase()
    // Input validation for login
    if(strFirst.trim().length < 1){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">First Name Cannot Be Blank. </p>'            
    }
    if(strLast.trim().length < 1){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">First Name Cannot Be Blank. </p>'
    }
    if(!regEmail.test(strUsername)){
        blnError = true
        strMessage+='<p class ="mb-0 mt-0">Username must be an email address. </p>'
    }
    if(strPassword.length < 8){
        blnError = true
        strMessage+="<p>Password cannot be blank. </p>"
    }
    if(strConPassword != strPassword){
        blnError = true
        strMessage+="<p>Passwords must match.</p>"
    }
    // Error message
    if(blnError == true){
        Swal.fire({
            title: "Oh no, you have an error!",
            html: strMessage,
            icon: "error"
        })
    }
    else{
        fetch('http://localhost:8000/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: strFirst,
                lastName: strLast,
                email: strUsername,
                password: strPassword,
                isFaculty: isFaculty
            })
        })
        .then(response => {
            console.log('Status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Registration response:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Clear registration inputs and redirect to login page
    document.querySelector('#txtRegUsername').value = '';
    document.querySelector('#txtFirstName').value = '';
    document.querySelector('#txtLastName').value = '';
    document.querySelector('#txtRegPassword').value = '';
    document.querySelector('#txtConfirmPassword').value = '';
    
    document.querySelector('#Register').style.display = 'none';
    document.querySelector('#Login').style.display = 'block';
}   
})

// function checkEmailExists(strEmail) {
//     return fetch('/checkemail', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({strEmail})
//     }).then(response => response.json());
//   }

// Reveals/hides password on the login page
function ViewLogPass() {
    var x = document.getElementById("txtLogPassword");
    if (x.type === "password") {
        $('#btnViewLogPass').removeClass('bi-eye')
        document.querySelector('#btnViewLogPass').classList.add('bi-eye-slash')
        x.type = "text";
    } else {
        $('#btnViewLogPass').removeClass('bi-eye-slash')
        document.querySelector('#btnViewLogPass').classList.add('bi-eye')
        x.type = "password";
    }
}

$(document).on('keypress', function(e) {
    if (e.which === 13) { // Enter key code
        if (Swal.isVisible()) {
            // If SweetAlert is open, let the default SweetAlert Enter key handling work
            return;
        } else if ($('#Login').is(':visible')) {
            // Only trigger login button if SweetAlert is not open
            $('#btnLogin').click();
        } else if ($('#Register').is(':visible')) {
            // Only trigger register button if SweetAlert is not open
            $('#btnRegister').click();
        }
    }
});

    // Add event listeners to buttons
   document.querySelector('#btnSwapLogin').addEventListener('click', function() {
            document.querySelector('#Login').style.display = 'none';
            document.querySelector('#Register').style.display = 'block';
        })

    document.querySelector('#btnSwapRegister').addEventListener('click', function() {
        document.querySelector('#Register').style.display = 'none';
        document.querySelector('#Login').style.display = 'block';
    });
    
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

// function to create user by sending a fetch to the server.js file sending the username and password in the body
// ensuring the correct content type and catching errors
function createUser(strUsername, strPassword) {

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ strUsername, strPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        Swal.fire({
            title: "Success",
            text: data.message,
            icon: "success"
        });
    })
    .catch(error => {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
    });
}

// function registerUser(strUsername, strPassword, strFirst, strLast) {

//     fetch('/registration', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ strUsername, strPassword, strFirst, strLast })
//     })
//     .catch(error => {
//         Swal.fire({
//             title: "Error",
//             text: error.message,
//             icon: "error"
//         });
//     });
// }

function loginUser(strUsername, strPassword) {
    return fetch('/login', { // Add 'return' here
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: strUsername, password: strPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Parse and return JSON data
    })
    .catch(error => {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
        throw error; // Re-throw the error so the caller can handle it
    });
}

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
// Add this to your app.js file
document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('commentVisibilityToggle');
    const hiddenInput = document.getElementById('commentVisibilityValue');
    
    if (toggleSwitch && hiddenInput) {
        toggleSwitch.addEventListener('change', function() {
            hiddenInput.value = this.checked ? 'public' : 'private';
        });
    }
});
// Student/Staff Toggle JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const userTypeToggle = document.getElementById('userTypeToggle');
    const userTypeValue = document.getElementById('userTypeValue');
    
    if (userTypeToggle && userTypeValue) {
        // Set initial value based on the checkbox state
        userTypeValue.value = userTypeToggle.checked ? 'Student' : 'Staff';
        
        // Add event listener for changes
        userTypeToggle.addEventListener('change', function() {
            userTypeValue.value = this.checked ? 'Student' : 'Staff';
            console.log('User type set to:', userTypeValue.value);
        });
    }
});


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
        
        // Create course with the collected data
        // createCourse(
        //     document.querySelector('#txtCourseName').value,
        //     document.querySelector('#txtCourseSection').value,
        //     courseTerm,
        //     startDate,
        //     endDate
        // );

        // #TODO: delete this when the backend is ready
        Swal.fire({
            title: "Success!",
            text: "Course created successfully.",
            icon: "success"
        });
        
        // Optionally insert card into DOM here
        const courseName = document.querySelector('#txtCourseName').value;
        const section = document.querySelector('#txtCourseSection').value;
        const term = `${document.querySelector('#selCourseSeason').value} ${document.querySelector('#txtCourseYear').value}`;
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


function createCourse(courseName, courseSection, courseTerm, startDate, endDate) {
    fetch('/createcourse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            CourseName: courseName,
            CourseNumber: courseName, // You might want to separate course number and name
            CourseSection: courseSection,
            CourseTerm: courseTerm,
            StartDate: startDate,
            EndDate: endDate
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        Swal.fire({
            title: "Success",
            text: "Course created successfully",
            icon: "success"
        });

        //// #TODO: delete this when the backend is ready Create a new group card UI element dynamically (demo only) need to change all of this to get it talking with the backend
    const groupCard = document.createElement('div');
    groupCard.className = 'group-card';
    groupCard.innerHTML = `
        <div class="group-header">
            <h3>${courseName}</h3>
            <span class="group-code">Code: TBD</span>
        </div>
        <div class="group-info">
            <p><strong>Course:</strong> <span class="courseName">${courseName}</span></p>
            <p><strong>Section:</strong> <span class="courseSection">${courseSection}</span></p>
            <div class="members-section">
                <button class="collapse-btn" onclick="toggleMembers(this)">
                    <strong>Members</strong>
                    <span class="collapse-icon">▼</span>
                </button>
                <ul class="member-list collapsed">
                    <li>You (creator)</li>
                </ul>
            </div>
            <div class="card-actions">
                <button type="button">Take Survey</button>
                <button type="button">Leave Group</button>
            </div>
        </div>
    `;
    document.querySelector('#Groups .dashboard-stats').appendChild(groupCard);

        // Reset form fields
        document.querySelector('#txtCourseName').value = '';
        document.querySelector('#txtCourseSection').value = '';
        document.querySelector('#selCourseSeason').value = '';
        document.querySelector('#txtCourseYear').value = '';
        document.querySelector('#dateEndDate').value = '';
    })

    .catch(error => {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
    });
}



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
    fetch('/getUserRole')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateUIForUserRole(data.userRole);
        })
        .catch(error => {
            console.error('Error fetching user role:', error);
            // Fallback to showing everything if there's an error
            document.querySelectorAll('.student-only, .faculty-only').forEach(element => {
                element.style.display = '';
            });
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
document.querySelector('#btnSubmitFeedback').addEventListener('click', function () {
    const group = document.querySelector('#selGroup').value;
    const feedback = document.querySelector('#txtFeedback').value.trim();
    const visibility = document.querySelector('#commentVisibilityValue').value;
    const commentsTab = document.querySelector('#Comments');

    let blnError = false;
    let strMessage = "";

    // if (!group) {
    //     blnError = true;
    //     strMessage += "<p>Please select a group.</p>";
    // }
    if (!feedback) {
        blnError = true;
        strMessage += "<p>Feedback cannot be empty.</p>";
    }

    if (blnError) {
        Swal.fire({
            title: "Error",
            html: strMessage,
            icon: "error"
        });
        return;
    }

    // Get current date and time
    const now = new Date();
    const formattedDate = now.toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short"
    });

    // Create comment element
    const commentHTML = `
        <div class="group card">
            <div class="group-header">
                <h3><strong>Brock The Rock</strong></h3>
                <span class="group-code"> Submitted on: ${formattedDate} </span>
            </div>
            <p>"${feedback}"</p>
        </div>
    `;

    // Insert comment into View Comments tab
    commentsTab.insertAdjacentHTML('beforeend', commentHTML);

    // Clear form
    document.querySelector('#selGroup').value = '';
    document.querySelector('#txtFeedback').value = '';
    document.querySelector('#commentVisibilityToggle').checked = true;
    document.querySelector('#commentVisibilityValue').value = 'public';

    Swal.fire({
        title: "Success!",
        text: "Your feedback has been added.",
        icon: "success"
    });
});

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

            // Build group card HTML
            const groupHTML = `
                <div class="group-card">
                    <div class="group-header">
                        <h3>${groupName}</h3>
                        <span class="group-code">Code: ${generateGroupCode()}</span>
                    </div>
                    <div class="group-info">
                        <p><strong>Course:</strong> <span class="courseName">${courseCode}</span></p>
                        <p><strong>Section:</strong> <span class="courseSection">${courseSection}</span></p>
                        <div class="members-section">
                            <button class="collapse-btn" onclick="toggleMembers(this)">
                                <strong>Members</strong>
                                <span class="collapse-icon">▼</span>
                            </button>
                            <ul class="member-list collapsed">
                                <li>Group creator placeholder</li>
                            </ul>
                        </div>
                        <div class="card-actions">
                            <button type="button">Take Survey</button>
                            <button type="button">Leave Group</button>
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
    fetch('/courses') // ⬅️ adjust this if your endpoint is different
    .then(response => {
        if (!response.ok) {
        throw new Error('Failed to fetch courses');
        }
        return response.json();
    })
    .then(courses => {
        const container = document.querySelector('#groupsList');
        container.innerHTML = ''; // clear any existing cards
        
        courses.forEach(course => {
        const cardHTML = `
            <div class="group-card">
            <div class="group-header">
                <h3>${course.name}</h3>
                <p>Section: ${course.section}</p>
                <p>Term: ${course.term}</p>
                <p>End Date: ${course.endDate}</p>
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

document.addEventListener('DOMContentLoaded', () => {
	// Handle Take Survey button clicks
	document.querySelectorAll('.group-card .card-actions button').forEach(button => {
		button.addEventListener('click', (e) => {
			const btn = e.target;
			const card = btn.closest('.group-card');

			if (btn.textContent === 'Take Survey') {
				const groupName = card.querySelector('.group-header h3').textContent;

				Swal.fire({
					title: 'Survey Started',
					text: `You clicked "Take Survey" for ${groupName}.`,
					icon: 'info'
				});
			}

			if (btn.textContent === 'Leave Group') {
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
});

// document.addEventListener('DOMContentLoaded', () => {
//     loadCourses();
//   });




