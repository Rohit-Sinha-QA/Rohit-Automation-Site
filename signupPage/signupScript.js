document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordIcon = document.getElementById('togglePassword');
    const toggleConfirmPasswordIcon = document.getElementById('toggleConfirmPassword');

    togglePasswordIcon.addEventListener('click', function() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordIcon.innerHTML = "&#128064;";
        } else {
            passwordInput.type = "password";
            togglePasswordIcon.innerHTML = "&#128065;";
        }
    });

    toggleConfirmPasswordIcon.addEventListener('click', function() {
        if (confirmPasswordInput.type === "password") {
            confirmPasswordInput.type = "text";
            toggleConfirmPasswordIcon.innerHTML = "&#128064;";
        } else {
            confirmPasswordInput.type = "password";
            toggleConfirmPasswordIcon.innerHTML = "&#128065;";
        }
    });
});