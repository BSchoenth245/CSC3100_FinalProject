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