// Forms page
document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);
  const form = $("studentForm");

  // password toggle
  $("toggleUserPassword").innerHTML = App.icon("eye");
  $("toggleUserPassword").addEventListener("click", () => {
    const show = $("userPassword").type === "password";
    $("userPassword").type = show ? "text" : "password";
    $("toggleUserPassword").innerHTML = App.icon(show ? "eyeOff" : "eye");
  });

  // range output
  const exp = $("experience");
  exp.addEventListener("input", () => ($("experienceValue").textContent = exp.value));

  // auto-generated student id
  $("studentId").value = "STU-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random() * 9000) + 1000);

  // cascading country -> region dropdown
  const REGIONS = {
    IN: ["Andhra Pradesh", "Karnataka", "Maharashtra", "Tamil Nadu", "Telangana"],
    US: ["California", "New York", "Texas", "Washington"],
    UK: ["England", "Scotland", "Wales", "Northern Ireland"],
    AU: ["New South Wales", "Queensland", "Victoria"],
  };
  $("country").addEventListener("change", (e) => {
    const list = REGIONS[e.target.value] || [];
    const region = $("region");
    region.innerHTML = list.length
      ? `<option value="">Select state / region</option>` + list.map((r) => `<option value="${r}">${r}</option>`).join("")
      : `<option value="">Select country first</option>`;
    region.disabled = list.length === 0;
  });

  $("resume").addEventListener("change", (e) => {
    const f = e.target.files[0];
    $("resumeName").textContent = f ? `${f.name} (${Math.ceil(f.size / 1024)} KB)` : "No file selected";
  });

  // ---------- validation ----------
  const errorIds = ["firstName", "lastName", "userEmail", "userPhone", "userPassword", "age", "gender", "textDate", "course", "country", "region", "skills", "website", "resume", "captcha", "terms"];
  function clearErrors() {
    errorIds.forEach((id) => {
      const el = $(id + "-error");
      if (el) el.textContent = "";
      const input = $(id);
      if (input) input.classList.remove("is-invalid");
    });
    $("formErrors").classList.add("hidden");
  }
  form.addEventListener("input", (e) => {
    const id = e.target.id;
    if ($(id + "-error")) { $(id + "-error").textContent = ""; e.target.classList.remove("is-invalid"); }
    if (e.target.name === "gender") $("gender-error").textContent = "";
    if (e.target.name === "skills") $("skills-error").textContent = "";
  });

  function validate() {
    const errors = [];
    const err = (id, msg) => {
      errors.push(msg);
      $(id + "-error").textContent = msg;
      if ($(id)) $(id).classList.add("is-invalid");
    };
    const v = (id) => $(id).value.trim();
    if (!v("firstName")) err("firstName", "First name is required");
    else if (!/^[A-Za-z ]{2,30}$/.test(v("firstName"))) err("firstName", "First name must be 2-30 letters");
    if (!v("lastName")) err("lastName", "Last name is required");
    if (!v("userEmail")) err("userEmail", "Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("userEmail"))) err("userEmail", "Enter a valid email address");
    if (!v("userPhone")) err("userPhone", "Mobile number is required");
    else if (!/^[6-9]\d{9}$/.test(v("userPhone"))) err("userPhone", "Enter a valid 10-digit mobile number starting with 6-9");
    if (!$("userPassword").value) err("userPassword", "Password is required");
    else if ($("userPassword").value.length < 8) err("userPassword", "Password must be at least 8 characters");
    const age = Number(v("age"));
    if (!v("age")) err("age", "Age is required");
    else if (!Number.isInteger(age) || age < 18 || age > 60) err("age", "Age must be between 18 and 60");
    if (!form.querySelector('input[name="gender"]:checked')) err("gender", "Please select a gender");
    if (v("textDate") && !/^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(v("textDate"))) err("textDate", "Use the format DD/MM/YYYY");
    if (!v("course")) err("course", "Please select a course");
    if (!v("country")) err("country", "Please select a country");
    else if (!v("region")) err("region", "Please select a state / region");
    if (!form.querySelector('input[name="skills"]:checked')) err("skills", "Select at least one skill");
    if (v("website") && !/^https?:\/\/[^\s.]+\.[^\s]+$/.test(v("website"))) err("website", "Enter a valid URL starting with http:// or https://");
    const file = $("resume").files[0];
    if (file && file.size > 2 * 1024 * 1024) err("resume", "File must be 2 MB or smaller");
    if (file && !/\.(pdf|docx?)$/i.test(file.name)) err("resume", "Only PDF or Word files are allowed");
    if (v("captcha") !== "12") err("captcha", "Incorrect answer, please try again");
    if (!$("terms").checked) err("terms", "You must accept the terms and conditions");
    return errors;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    $("submissionResult").classList.add("hidden");
    const errors = validate();
    if (errors.length) {
      $("formErrors").textContent = `Please fix ${errors.length} error${errors.length > 1 ? "s" : ""} before submitting.`;
      $("formErrors").classList.remove("hidden");
      const first = form.querySelector(".is-invalid");
      if (first) first.focus();
      return;
    }
    const val = (id) => $(id).value.trim();
    const rows = [
      ["Name", `${val("firstName")} ${val("lastName")}`],
      ["Email", val("userEmail")],
      ["Mobile", "+91 " + val("userPhone")],
      ["Age", val("age")],
      ["Gender", form.querySelector('input[name="gender"]:checked').value],
      ["Date of birth", val("dob")],
      ["Class time", val("classTime")],
      ["Demo session", val("demoSlot")],
      ["Joining month", val("joinMonth")],
      ["Joining week", val("joinWeek")],
      ["Course", $("course").selectedOptions[0].textContent],
      ["Batch", $("batch").selectedOptions[0].textContent],
      ["Country", $("country").selectedOptions[0].textContent],
      ["State / Region", val("region")],
      ["City", val("city")],
      ["Languages", Array.from($("languages").selectedOptions).map((o) => o.value).join(", ")],
      ["Skills", Array.from(form.querySelectorAll('input[name="skills"]:checked')).map((c) => c.value).join(", ")],
      ["Experience", exp.value + " years"],
      ["Favourite colour", $("favColor").value],
      ["Website", val("website")],
      ["Address", val("address")],
      ["Resume", $("resume").files[0] ? $("resume").files[0].name : ""],
      ["Student ID", $("studentId").value],
      ["Newsletter", $("newsletter").checked ? "Yes" : "No"],
    ];
    $("submittedData").tBodies[0].innerHTML = rows
      .map(([k, v]) => `<tr><td>${k}</td><td data-field="${k}">${App.escapeHtml(v || "-")}</td></tr>`)
      .join("");
    $("successMessage").textContent = `Registration successful! Welcome, ${val("firstName")} ${val("lastName")}.`;
    $("submissionResult").classList.remove("hidden");
    $("submissionResult").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("reset", () => {
    clearErrors();
    $("submissionResult").classList.add("hidden");
    setTimeout(() => {
      $("experienceValue").textContent = exp.value;
      $("region").innerHTML = `<option value="">Select country first</option>`;
      $("region").disabled = true;
      $("resumeName").textContent = "No file selected";
    });
  });

  // ---------- wizard ----------
  let step = 1;
  function showStep(n) {
    step = n;
    for (let i = 1; i <= 3; i++) {
      $("wizard-step-" + i).classList.toggle("hidden", i !== n);
      $("step-indicator-" + i).className = "step" + (i === n ? " active" : i < n ? " done" : "");
    }
    $("wizardBack").disabled = n === 1;
    $("wizardNext").textContent = n === 3 ? "Confirm" : "Next";
    $("wizardError").textContent = "";
    if (n === 3) {
      const data = [
        ["Username", $("wizUsername").value.trim()],
        ["Email", $("wizEmail").value.trim()],
        ["Street", $("wizStreet").value.trim()],
        ["City", $("wizCity").value.trim()],
        ["PIN code", $("wizZip").value.trim()],
      ];
      $("wizardReview").tBodies[0].innerHTML = data.map(([k, v]) => `<tr><th style="width:160px">${k}</th><td>${App.escapeHtml(v)}</td></tr>`).join("");
    }
  }
  $("wizardNext").addEventListener("click", () => {
    if (step === 1) {
      if (!$("wizUsername").value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("wizEmail").value.trim())) {
        $("wizardError").textContent = "Enter a username and a valid email to continue";
        return;
      }
      showStep(2);
    } else if (step === 2) {
      if (!$("wizStreet").value.trim() || !$("wizCity").value.trim() || !/^\d{6}$/.test($("wizZip").value.trim())) {
        $("wizardError").textContent = "Enter street, city and a 6-digit PIN code to continue";
        return;
      }
      showStep(3);
    } else {
      $("wizardDone").textContent = `Account for ${$("wizUsername").value.trim()} created successfully!`;
      $("wizardDone").classList.remove("hidden");
      $("wizardNext").disabled = true;
      $("wizardBack").disabled = true;
      $("step-indicator-3").className = "step done";
    }
  });
  $("wizardBack").addEventListener("click", () => showStep(Math.max(1, step - 1)));
});
