// Practice Elements page
document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);

  // ---------- inputs ----------
  $("idtextarea1").addEventListener("input", (e) => ($("textareaCount").textContent = e.target.value.length));
  let clicks = 0;
  $("clickMeBtn").addEventListener("click", () => {
    clicks++;
    $("clickResult").textContent = `Button clicked ${clicks} time${clicks === 1 ? "" : "s"}`;
  });

  // ---------- radio / checkbox / toggle ----------
  document.querySelectorAll('input[name="gender"]').forEach((r) =>
    r.addEventListener("change", () => ($("radioResult").textContent = `Selected: ${r.value}`))
  );
  document.querySelectorAll('input[name="hobbies"]').forEach((c) =>
    c.addEventListener("change", () => {
      const checked = [...document.querySelectorAll('input[name="hobbies"]:checked')].map((x) => x.value);
      $("checkboxResult").textContent = checked.length ? `Checked: ${checked.join(", ")}` : "";
    })
  );
  $("idtoggle").addEventListener("change", (e) => ($("toggleState").textContent = `Notifications are ${e.target.checked ? "ON" : "OFF"}`));

  // ---------- static dropdown ----------
  $("state").addEventListener("change", (e) => {
    const opt = e.target.selectedOptions[0];
    $("stateResult").textContent = e.target.value ? `You selected: ${opt.textContent}` : "";
  });

  // ---------- span (custom) dropdown ----------
  const dropdown = $("spanDropdown");
  const selected = $("spanDropdownSelected");
  const options = $("spanDropdownOptions");
  const openClose = (open) => {
    options.classList.toggle("show", open);
    dropdown.classList.toggle("open", open);
  };
  selected.addEventListener("click", (e) => { e.stopPropagation(); openClose(!options.classList.contains("show")); });
  selected.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openClose(true); } });
  options.querySelectorAll("li").forEach((li) =>
    li.addEventListener("click", (e) => {
      e.stopPropagation();
      selected.textContent = li.textContent;
      selected.setAttribute("data-value", li.dataset.value);
      openClose(false);
    })
  );
  document.addEventListener("click", (e) => { if (!dropdown.contains(e.target)) openClose(false); });

  // ---------- dynamic (auto-suggest) dropdown ----------
  const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Lakshadweep",
    "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh"];
  const searchBox = $("searchBox");
  const list = $("suggestionsList");
  const hideList = () => { list.classList.remove("show"); searchBox.setAttribute("aria-expanded", "false"); };
  searchBox.addEventListener("input", function () {
    const q = this.value.toLowerCase().trim();
    list.innerHTML = "";
    if (!q) return hideList();
    const matches = STATES.filter((s) => s.toLowerCase().startsWith(q));
    matches.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.className = "suggestion-item";
      li.setAttribute("role", "option");
      li.addEventListener("click", () => { searchBox.value = item; hideList(); });
      list.appendChild(li);
    });
    list.classList.toggle("show", matches.length > 0);
    searchBox.setAttribute("aria-expanded", String(matches.length > 0));
  });
  searchBox.addEventListener("keydown", (e) => {
    const items = [...list.querySelectorAll("li")];
    if (!items.length) return;
    let i = items.findIndex((x) => x.classList.contains("active"));
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      items.forEach((x) => x.classList.remove("active"));
      i = e.key === "ArrowDown" ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1);
      items[i].classList.add("active");
    } else if (e.key === "Enter" && i >= 0) {
      e.preventDefault();
      items[i].click();
    } else if (e.key === "Escape") hideList();
  });
  document.addEventListener("click", (e) => { if (!searchBox.contains(e.target) && !list.contains(e.target)) hideList(); });

  // ---------- date ----------
  $("datePicker").addEventListener("change", (e) => ($("dateResult").textContent = e.target.value ? `Selected date: ${e.target.value}` : ""));
  $("datePicker").addEventListener("click", function () { try { this.showPicker && this.showPicker(); } catch { /* not allowed in some browsers */ } });

  // ---------- uploads ----------
  $("idfileupload").addEventListener("change", (e) => {
    const f = e.target.files[0];
    $("fileUploadResult").textContent = f ? `Uploaded: ${f.name}` : "";
  });
  $("uploadBtn").addEventListener("click", () => $("fileInput").click());
  $("fileInput").addEventListener("change", () => {
    const files = Array.from($("fileInput").files);
    $("fileList").innerHTML = "";
    files.forEach((file) => {
      const li = document.createElement("li");
      li.textContent = file.name;
      li.className = "list-group-item";
      $("fileList").appendChild(li);
    });
    $("fileCount").textContent = files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "No files chosen";
  });

  // ---------- mouse ----------
  const hoverBtn = $("hoverBtn");
  const hoverText = $("text");
  hoverBtn.addEventListener("mouseover", () => { hoverText.style.display = "block"; hoverText.textContent = "✅ You hovered using mouse"; });
  hoverBtn.addEventListener("mouseout", () => (hoverText.style.display = "none"));

  $("dblClick").addEventListener("dblclick", () => {
    $("dclick").style.display = "block";
    $("dclick").textContent = "✅ You double-clicked the button!";
  });
  $("rightClick").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    $("rclick").style.display = "block";
    $("rclick").textContent = "✅ You right-clicked the button!";
  });

  const slider = $("slider");
  const showSlider = () => ($("sliderValue").textContent = `Value: ${slider.value}`);
  slider.addEventListener("input", showSlider);
  slider.addEventListener("change", showSlider);

  // resizable: mouse based, so Selenium Actions / Cypress triggers / Playwright mouse all work
  const box = $("resizableBox");
  const handle = $("resizeHandle");
  let resizing = false;
  handle.addEventListener("mousedown", (e) => { e.preventDefault(); resizing = true; });
  document.addEventListener("mousemove", (e) => {
    if (!resizing) return;
    const r = box.getBoundingClientRect();
    box.style.width = Math.max(120, e.clientX - r.left) + "px";
    box.style.height = Math.max(60, e.clientY - r.top) + "px";
    $("resizeResult").textContent = `Size: ${Math.round(box.offsetWidth)} x ${Math.round(box.offsetHeight)}`;
  });
  document.addEventListener("mouseup", () => (resizing = false));

  // drag & drop
  const drag = $("draggable");
  const drop = $("droppable");
  App.enableDragDrop(drag, drop, () => {
    drop.classList.add("dropped");
    drop.textContent = "Dropped!";
  });
  $("resetDrag").addEventListener("click", () => {
    drop.classList.remove("dropped");
    drop.textContent = "Drop Here";
  });

  // ---------- alerts ----------
  const msg = $("message");
  const setMsg = (html, ok) => { msg.innerHTML = html; msg.classList.toggle("error", !ok); };
  $("idalert").addEventListener("click", () => {
    alert("This is an OK alert!");
    setMsg("✅ You accepted the alert!", true);
  });
  $("idconfirm").addEventListener("click", () => {
    const ok = confirm("Do you accept this alert?");
    setMsg(ok ? "✅ You accepted the alert!" : "❌ You dismissed the alert!", ok);
  });
  $("idprompt").addEventListener("click", () => {
    const value = prompt("Enter some text:");
    if (value === null || value === "") setMsg("❌ You dismissed the alert!", false);
    else setMsg(`✅ You entered: <strong>${App.escapeHtml(value)}</strong>`, true);
  });

  // HTML modal
  const pm = $("practiceModal");
  const po = $("practiceOverlay");
  const openPM = (open) => { pm.classList.toggle("open", open); po.classList.toggle("open", open); };
  $("practiceModalX").innerHTML = App.icon("x");
  $("openModalBtn").addEventListener("click", () => { $("modalResult").textContent = ""; openPM(true); $("modalEmail").focus(); });
  [$("practiceModalX"), $("modalCancel"), po].forEach((el) =>
    el.addEventListener("click", () => { openPM(false); $("modalResult").textContent = "Modal closed without subscribing"; })
  );
  $("modalSubmit").addEventListener("click", () => {
    const email = $("modalEmail").value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $("modalEmail").classList.add("is-invalid"); return; }
    $("modalEmail").classList.remove("is-invalid");
    openPM(false);
    $("modalResult").textContent = `Subscribed with ${email}`;
    $("modalEmail").value = "";
  });

  // ---------- windows ----------
  $("idnewwindow").addEventListener("click", (e) => {
    e.preventDefault();
    window.open("/frames/new-window.html", "_blank", "width=800,height=600");
  });

  // ---------- hide / show ----------
  $("show-textbox").addEventListener("click", () => ($("displayed-text").style.display = "block"));
  $("hide-textbox").addEventListener("click", () => ($("displayed-text").style.display = "none"));

  // ---------- waits ----------
  $("WaitVisible").addEventListener("click", () => {
    $("textContainer").innerHTML = "";
    setTimeout(() => {
      const p = document.createElement("p");
      p.id = "delayText";
      p.className = "result-text";
      p.textContent = "Sorry, I am late !!!!!";
      $("textContainer").appendChild(p);
    }, 4000);
  });
  $("enableRadioBtn").addEventListener("click", () => {
    const r = $("delayedRadio");
    r.disabled = true;
    r.checked = false;
    $("delayedRadioLabel").textContent = "Disabled";
    setTimeout(() => {
      r.disabled = false;
      $("delayedRadioLabel").textContent = "Enabled - click me";
    }, 7000);
  });
  $("delayedRadio").addEventListener("change", () => ($("delayedRadioLabel").textContent = "Selected"));

  // ---------- shadow DOM ----------
  const host = $("shadow-host");
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `
    <style>
      input { height: 38px; padding: 0 12px; border: 1px solid #cbd5e1; border-radius: 8px; font: 14px system-ui, sans-serif; width: 260px; }
      input:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 3px #d1fae5; }
      p { margin: 6px 0 0; font: 600 13px system-ui, sans-serif; color: #16a34a; }
    </style>
    <input type="text" id="shadow-input" placeholder="Enter text here..." aria-label="Shadow input">
    <p id="shadow-output"></p>`;
  shadow.getElementById("shadow-input").addEventListener("input", (e) => {
    shadow.getElementById("shadow-output").textContent = e.target.value ? `You typed: ${e.target.value}` : "";
  });

  // ---------- dynamic id / name ----------
  const dyn = document.querySelector('input[data-role="dynamic"]');
  const rnd = Math.floor(1000 + Math.random() * 9000);
  dyn.id = `dynamic_${rnd}`;
  dyn.name = `dynamic_name_${rnd}`;

  // ---------- code snippets popup ----------
  const overlay = $("overlay");
  const popup = $("popup");
  let current = null;
  let lang = "java";
  $("closePopupBtn").innerHTML = App.icon("x");
  function render() {
    const s = window.SNIPPETS[current];
    $("popup-title").textContent = s.title;
    $("popup-text").textContent = s[lang] || "// Coming soon";
    document.querySelectorAll("#snippet-tabs .tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.lang === lang)));
  }
  window.showPopup = () => { popup.classList.add("open"); overlay.classList.add("open"); };
  window.closePopup = () => { popup.classList.remove("open"); overlay.classList.remove("open"); };
  document.querySelectorAll(".info-icon").forEach((btn) => {
    btn.innerHTML = App.icon("info");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!window.SNIPPETS || !window.SNIPPETS[btn.dataset.snippet]) return;
      current = btn.dataset.snippet;
      render();
      showPopup();
    });
  });
  document.querySelectorAll("#snippet-tabs .tab").forEach((t) => t.addEventListener("click", () => { lang = t.dataset.lang; render(); }));
  [overlay, $("closeBtn"), $("closePopupBtn")].forEach((el) => el.addEventListener("click", closePopup));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closePopup(); openPM(false); } });
  $("copyBtn").addEventListener("click", async () => {
    const ok = await App.copyText($("popup-text").textContent);
    App.toast(ok ? "Copied to clipboard!" : "Could not copy - select the text and press Ctrl+C", ok ? "success" : "error");
  });
});
