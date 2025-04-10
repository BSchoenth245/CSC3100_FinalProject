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
        window.addEventListener("load", function() {
            window.location.href = this.getAttribute("data-href");
        })
    //     document.querySelector('#Login').style.display = 'none';
    //     document.querySelector('#dashboard').style.display = 'block';
    }
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
        strMessage += '<p class="mb-0 mt-0">First Name Cannot Be Blank</p>'            
    }
    if(strLast.trim().length < 1){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">First Name Cannot Be Blank</p>'            
    }
    if(!regEmail.test(strUsername)){
        blnError = true
        strMessage+='<p class ="mb-0 mt-0">Username must be an email address</p>'
    }
    if(strPassword.length < 8){
        blnError = true
        strMessage+="<p>Password cannot be blank</p>"
    }
    if(strConPassword != strPassword){
        blnError = true
        strMessage+="<p>Passwords must match</p>"
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

// document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    
    // Add event listeners to buttons
//    document.querySelector('#btnSwapLogin').addEventListener('click', function() {
//             document.querySelector('#Login').style.display = 'none';
//             document.querySelector('#Register').style.display = 'block';
//         })

//     document.querySelector('#btnSwapRegister').addEventListener('click', function() {
//         document.querySelector('#Register').style.display = 'none';
//         document.querySelector('#Login').style.display = 'block';
//     });
// });