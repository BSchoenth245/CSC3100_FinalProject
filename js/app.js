$("#btnLogin").on('click',function(){
    // Regular expression for emails
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

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
        strMessage+="<p>Password cannot be blank</p>"
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
        Swal.fire({
            title: "Congrats!",
            html:  "You're logged in!",
            icon: "success"
        })
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

document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const logBtn = document.getElementById('btnSwapLogin');
    const contentContainer = document.getElementById('Register');
    
    // Add event listeners to buttons
    logBtn.addEventListener('click', function() {
        fetch('Components/Registration.html');
    });
        fetch(pagePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(html => {
                contentContainer.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading page:', error);
                contentContainer.innerHTML = '<p>Error loading page. Please try again.</p>';
            });
});