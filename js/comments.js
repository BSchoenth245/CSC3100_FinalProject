// Add comments toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('commentVisibilityToggle');
    const hiddenInput = document.getElementById('commentVisibilityValue');
    
    if (toggleSwitch && hiddenInput) {
        toggleSwitch.addEventListener('change', function() {
            hiddenInput.value = this.checked ? 'public' : 'private';
        });
    }
});
document.querySelector('#btnSubmitFeedback').addEventListener('click', function () {
    const group = document.querySelector('#selGroup').value;
    const feedback = document.querySelector('#txtFeedback').value.trim();
    const visibility = document.querySelector('#commentVisibilityValue').value;

    let blnError = false;
    let strMessage = "";

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

    // Create comment element with proper classes for sent comments
    const commentHTML = `
        <div class="comment-card sent-comment">
            <div class="comment-header">
                <div class="comment-sender">Brock The Rock</div>
                <div class="comment-timestamp">${formattedDate}</div>
            </div>
            <div class="comment-group">To: ${group || 'All Groups'}</div>
            <div class="comment-text">${feedback}</div>
        </div>
    `;

    // Remove empty state message if it exists
    const emptyMessage = document.querySelector('#sentComments .empty-comments');
    if (emptyMessage) {
        emptyMessage.remove();
    }

    // Insert comment into Sent Comments column
    document.querySelector('#sentComments').insertAdjacentHTML('afterbegin', commentHTML);

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

document.addEventListener('DOMContentLoaded', function() {
    // Add sample received comments
    const sampleReceivedComments = [
        {
            sender: "Jane Smith",
            timestamp: "April 19, 2025 at 2:30 PM",
            group: "Team Awesome",
            text: "Great job on the presentation yesterday! Your explanation of the database schema was very clear."
        },
        {
            sender: "Professor Johnson",
            timestamp: "April 18, 2025 at 10:15 AM",
            group: "CSC3100-001",
            text: "Please remember to submit your final project by next Friday. Let me know if you have any questions."
        }
    ];

    // Remove empty state message if adding sample comments
    if (sampleReceivedComments.length > 0) {
        const emptyMessage = document.querySelector('#receivedComments .empty-comments');
        if (emptyMessage) {
            emptyMessage.remove();
        }
    }

    // Add sample received comments to the received column
    sampleReceivedComments.forEach(comment => {
        const commentHTML = `
            <div class="comment-card received-comment">
                <div class="comment-header">
                    <div class="comment-sender">${comment.sender}</div>
                    <div class="comment-timestamp">${comment.timestamp}</div>
                </div>
                <div class="comment-group">From: ${comment.group}</div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
        document.querySelector('#receivedComments').insertAdjacentHTML('afterbegin', commentHTML);
    });
});