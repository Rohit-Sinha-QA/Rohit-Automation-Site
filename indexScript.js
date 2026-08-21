document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('pass');
    const togglePasswordIcon = document.getElementById('togglePassword');
    const errorMessage = document.getElementById('error-message');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink'); // Get the link

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const validUsername = "admin";
        const validPassword = "admin@1234";

        const username = document.getElementById('user').value;
        const password = passwordInput.value;

        if (username === validUsername && password === validPassword) {
            window.location.href = "./dashboard/dashboard.html"; // Go up one level, then into dashboard;
        } else {
            errorMessage.textContent = "Invalid username or password!";
        }
    });

    togglePasswordIcon.addEventListener('click', function() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordIcon.innerHTML = "&#128064;";
        } else {
            passwordInput.type = "password";
            togglePasswordIcon.innerHTML = "&#128065;";
        }
    });

    document.getElementById('user').value = "";
    passwordInput.value = "";

    // Add event listener for the forgot password link
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        window.location.href = "./forgotPassword/forgotPassword.html"; // Redirect to forgot password page
    });
});