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
        checkEmailExists(email).then(data => {
            if (data.exists) {
                Swal.fire({
                    title: "There's a problem!",
                    text: "Email already exists!",
                    icon: "error"
                })
            } else if (!data.exists) {
                // If email does not exist in the database already, proceed with registration
                registerUser(strUsername, strPassword, strFirst, strLast)
                //success message
                Swal.fire({
                    title: "Success",
                    html: "Registration complete",
                    icon: "success"
                })
            }
        })

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

function checkEmailExists(strEmail) {
    return fetch('/checkemail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({strEmail})
    }).then(response => response.json());
  }

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

function registerUser(strUsername, strPassword, strFirst, strLast) {

    fetch('/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ strUsername, strPassword, strFirst, strLast })
    })
    .catch(error => {
        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error"
        });
    });
}

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


document.querySelector('#btnCreateGroup').addEventListener('click', function() {
    let blnError = false
    let strMessage = ""

    // Add null checks before accessing value property
    const groupNameInput = document.querySelector('#txtGroupName')
    const courseNameInput = document.querySelector('#txtCourseName') 
    const courseSectionInput = document.querySelector('#txtCourseSection')

    if (!groupNameInput || groupNameInput.value.trim().length < 1) {
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Group Name Cannot Be Blank. <br></p>'
    }
    if (!courseNameInput || courseNameInput.value.trim().length < 1) {
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Course Name Cannot Be Blank. <br></p>'
    }
    if (!courseSectionInput || courseSectionInput.value.trim().length < 1) {
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Course Section Cannot Be Blank. </p>'
    }

    if (blnError) {
        Swal.fire({
            title: "Oh no, you have an error!",
            html: strMessage,
            icon: "error"
        })
    }
})



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
    const newRow = $(this).closest('.contact-row').clone();

    // Clear input value and show delete button
    newRow.find('.contact-input').val('');
    newRow.find('.btn-delete-contact').show();

    // Append new row to the additional contacts container
    $('#additionalContacts').append(newRow);
});


$(document).on('click', '.btn-delete-contact', function () {
    $(this).closest('.contact-row').remove();
});



