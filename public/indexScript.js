// Login page
document.addEventListener("DOMContentLoaded", function () {
  const ACCOUNTS = {
    admin: { password: "admin@1234" },
    student: { password: "student@1234" },
    locked_user: { password: "admin@1234", locked: true },
  };

  const form = document.getElementById("loginForm");
  const userInput = document.getElementById("user");
  const passInput = document.getElementById("pass");
  const toggle = document.getElementById("togglePassword");
  const errorMessage = document.getElementById("error-message");
  const banner = document.getElementById("info-banner");

  toggle.innerHTML = App.icon("eye");
  toggle.addEventListener("click", function () {
    const show = passInput.type === "password";
    passInput.type = show ? "text" : "password";
    toggle.innerHTML = App.icon(show ? "eyeOff" : "eye");
    toggle.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });

  const params = new URLSearchParams(location.search);
  if (params.get("registered")) {
    banner.textContent = "Account created successfully. Please log in.";
    banner.classList.remove("hidden");
  } else if (params.get("logout")) {
    banner.textContent = "You have been logged out.";
    banner.classList.remove("hidden");
  } else if (params.get("redirect")) {
    banner.className = "alert alert-warning";
    banner.textContent = "Please log in to view that page.";
  }

  [userInput, passInput].forEach((el) =>
    el.addEventListener("input", () => {
      el.classList.remove("is-invalid");
      errorMessage.textContent = "";
    })
  );

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = userInput.value.trim();
    const password = passInput.value;
    errorMessage.textContent = "";

    if (!username && !password) return fail("Username and password are required!", [userInput, passInput]);
    if (!username) return fail("Username is required!", [userInput]);
    if (!password) return fail("Password is required!", [passInput]);

    const account = ACCOUNTS[username];
    const registered = App.registeredUsers().find((u) => u.email.toLowerCase() === username.toLowerCase());
    let ok = false;
    if (account && account.password === password) {
      if (account.locked) return fail("Sorry, this user has been locked out.", []);
      ok = true;
    } else if (registered && registered.password === password) {
      ok = true;
    }
    if (!ok) return fail("Invalid username or password!", [userInput, passInput]);

    const role = document.querySelector('input[name="userType"]:checked').value;
    App.login(username, role, document.getElementById("rememberMe").checked);
    const target = params.get("redirect");
    window.location.href = target && target.startsWith("/") ? target : "/dashboard/dashboard.html";
  });

  function fail(message, fields) {
    errorMessage.textContent = message;
    fields.forEach((f) => f.classList.add("is-invalid"));
  }

  userInput.value = "";
  passInput.value = "";
});
