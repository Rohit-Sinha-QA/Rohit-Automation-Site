// Forgot password: validates the email, shows a short loading state, then a success message.
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("forgotPasswordForm");
  const email = document.getElementById("email");
  const error = document.getElementById("email-error");
  const message = document.getElementById("reset-message");
  const button = document.getElementById("reset-button");

  email.addEventListener("input", () => { error.textContent = ""; email.classList.remove("is-invalid"); });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    message.textContent = "";
    const value = email.value.trim();
    if (!value) return invalid("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return invalid("Please enter a valid email address");

    button.disabled = true;
    button.textContent = "Sending...";
    setTimeout(() => {
      button.disabled = false;
      button.textContent = "Reset Password";
      message.textContent = `Password reset link sent to ${value}`;
      form.reset();
    }, 1000);
  });

  function invalid(text) {
    error.textContent = text;
    email.classList.add("is-invalid");
  }
});
