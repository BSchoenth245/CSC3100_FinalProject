$("#btnLogin").on('click', function () {
	// Debug: Triggered login button
	console.log('[Login] Login button clicked');

	const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

	let strUsername = document.querySelector('#txtLogUser').value;
	const strPassword = $('#txtLogPassword').val();
	let blnError = false;
	let strMessage = '';

	strUsername = strUsername.toLowerCase();

	if (!regEmail.test(strUsername)) {
		blnError = true;
		strMessage += '<p class="mb-0 mt-0">Username must be an email address</p>';
	}

	if (strPassword.length < 8) {
		blnError = true;
		strMessage += "<p>Password must be at least 8 characters</p>";
	}

	if (blnError) {
		Swal.fire({
			title: "Oh no, you have an error!",
			html: strMessage,
			icon: "error"
		});
		console.warn('[Login] Validation failed:', strMessage);
	} else {
		console.log('[Login] Passed validation, sending fetch request...');

		const loadingSwal = Swal.fire({
			title: 'Logging in...',
			didOpen: () => Swal.showLoading(),
			allowOutsideClick: false,
			allowEscapeKey: false,
			showConfirmButton: false
		});

		fetch('http://localhost:8000/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: strUsername,
				password: strPassword
			})
		})
			.then(response => {
				console.log('[Login] Fetch response status:', response.status);

				const contentType = response.headers.get('content-type');

				if (!response.ok) {
					if (contentType && contentType.includes('application/json')) {
						return response.json().then(data => {
							console.error('[Login] Backend returned JSON error:', data);
							throw new Error(data.error || `Login failed: ${response.status}`);
						});
					} else {
						throw new Error(`Login failed: ${response.status} ${response.statusText}`);
					}
				}

				if (contentType && contentType.includes('application/json')) {
					return response.json();
				} else {
					throw new Error('Server returned non-JSON response');
				}
			})
			.then(data => {
				console.log('[Login] Login success response:', data);

				Swal.fire({
					title: 'Success!',
					text: 'Login successful',
					icon: 'success',
					showConfirmButton: false,
					timer: 1500
			 }).then(() => {
					console.log("[Login] Success dialog confirmed");

					const loginDiv = document.querySelector('#Login');
					const dashboardDiv = document.querySelector('#Dashboard');

					if (loginDiv) loginDiv.style.display = 'none';
					if (dashboardDiv) dashboardDiv.style.display = 'block';

					console.log("[Login] Toggled to dashboard");

					try {
						loadCourses();
						loadGroups();
						loadUserProfile();
					} catch (e) {
						console.error("[Login] Error loading post-login data:", e);
					}
				});
			})
			.catch(error => {
				console.error('[Login] Fetch error:', error);

				Swal.fire({
					title: 'Error',
					text: error.message,
					icon: 'error'
				});
			})
			.finally(() => {
				console.log("[Login] Cleaning up login form...");
				document.querySelector('#txtLogPassword').value = '';
			});
	}
});

function loadUserProfile() {
	console.log('[loadUserProfile] called');

	const userId = sessionStorage.getItem('userId');

	if (!userId) {
		console.warn('[loadUserProfile] No userId found in sessionStorage.');
		return;
	}

	console.log(`[loadUserProfile] Fetching profile for userId: ${userId}`);

	fetch(`http://localhost:8000/UserInfo?userId=${userId}`)
		.then(response => {
			if (!response.ok) {
				throw new Error(`Failed to fetch user profile. Status: ${response.status}`);
			}
			return response.json();
		})
		.then(userData => {
			console.log('[loadUserProfile] Received user data:', userData);

			// Example DOM updates
			if (userData.name) {
				document.querySelector('#lblUserName').textContent = userData.name;
			}
			if (userData.email) {
				document.querySelector('#lblUserEmail').textContent = userData.email;
			}
			// Add more fields as needed
		})
		.catch(err => {
			console.error('[loadUserProfile] Error:', err);
			Swal.fire({
				title: 'Error',
				text: 'Failed to load user profile.',
				icon: 'error'
			});
		});
}




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
    

// function to create user by sending a fetch to the server.js file sending the username and password in the body
// ensuring the correct content type and catching errors
function createUser(strUsername, strPassword) {

    fetch('http://localhost:8000/login', {
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


function loginUser(strUsername, strPassword) {
    return fetch('http://localhost:8000/login', { // Add 'return' here
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

// Student/Staff Toggle JavaScript registration 
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