// Sign-up page: validation + saves the account in this browser (localStorage)
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");
  const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    terms: document.getElementById("terms"),
  };
  const message = document.getElementById("signup-message");
  const meter = document.getElementById("password-meter");
  const strengthText = document.getElementById("password-strength");

  function wireToggle(btnId, input) {
    const btn = document.getElementById(btnId);
    btn.innerHTML = App.icon("eye");
    btn.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = App.icon(show ? "eyeOff" : "eye");
    });
  }
  wireToggle("togglePassword", fields.password);
  wireToggle("toggleConfirmPassword", fields.confirmPassword);

  function strength(pw) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }
  fields.password.addEventListener("input", () => {
    const s = strength(fields.password.value);
    const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["#dc2626", "#dc2626", "#d97706", "#0284c7", "#16a34a"];
    meter.style.width = (fields.password.value ? Math.max(1, s) * 25 : 0) + "%";
    meter.style.background = colors[s];
    strengthText.textContent = fields.password.value ? "Password strength: " + labels[s] : "Use 8+ characters with a number and a symbol.";
  });

  function setError(name, text) {
    const input = fields[name];
    document.getElementById(name + "-error").textContent = text;
    if (input.type !== "checkbox") input.classList.toggle("is-invalid", Boolean(text));
  }
  Object.keys(fields).forEach((name) =>
    fields[name].addEventListener(fields[name].type === "checkbox" ? "change" : "input", () => setError(name, ""))
  );

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    message.textContent = "";
    message.className = "success-message";
    const v = {
      fullName: fields.fullName.value.trim(),
      email: fields.email.value.trim(),
      password: fields.password.value,
      confirmPassword: fields.confirmPassword.value,
    };
    let ok = true;
    const err = (n, t) => { setError(n, t); ok = false; };

    if (!v.fullName) err("fullName", "Full name is required");
    else if (v.fullName.length < 3) err("fullName", "Full name must be at least 3 characters");
    if (!v.email) err("email", "Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) err("email", "Please enter a valid email address");
    if (!v.password) err("password", "Password is required");
    else if (v.password.length < 8) err("password", "Password must be at least 8 characters");
    if (!v.confirmPassword) err("confirmPassword", "Please re-enter your password");
    else if (v.password && v.password !== v.confirmPassword) err("confirmPassword", "Passwords do not match");
    if (!fields.terms.checked) err("terms", "You must accept the terms to continue");
    if (!ok) return;

    App.registerUser({ name: v.fullName, email: v.email, password: v.password, createdAt: new Date().toISOString() });
    form.reset();
    meter.style.width = "0";
    message.innerHTML = `Account created successfully! You can now <a href="/index.html?registered=1" id="goToLogin">log in</a> with ${App.escapeHtml(v.email)}.`;
  });
});
