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