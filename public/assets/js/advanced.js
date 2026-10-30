// Advanced Elements page
document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);

  // ---------- nested shadow DOM ----------
  const outer = $("outer-host").attachShadow({ mode: "open" });
  outer.innerHTML = `
    <style>
      .box { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px; font: 14px system-ui, sans-serif; }
      input { height: 36px; padding: 0 10px; border: 1px solid #cbd5e1; border-radius: 8px; width: 220px; }
      button { height: 36px; padding: 0 12px; border: 0; border-radius: 8px; background: #059669; color: #fff; font-weight: 600; cursor: pointer; }
    </style>
    <div class="box">
      <p id="outer-text">Outer shadow root</p>
      <input id="outer-input" placeholder="Outer shadow input" aria-label="Outer shadow input">
      <div id="inner-host" style="margin-top:10px"></div>
    </div>`;
  const inner = outer.getElementById("inner-host").attachShadow({ mode: "open" });
  inner.innerHTML = `
    <style>
      .box { border: 1px dashed #4f46e5; border-radius: 10px; padding: 12px; font: 14px system-ui, sans-serif; }
      input { height: 36px; padding: 0 10px; border: 1px solid #cbd5e1; border-radius: 8px; width: 200px; }
      button { height: 36px; padding: 0 12px; border: 0; border-radius: 8px; background: #4f46e5; color: #fff; font-weight: 600; cursor: pointer; }
    </style>
    <div class="box">
      <p id="inner-text">Inner (nested) shadow root</p>
      <input id="inner-input" placeholder="Inner shadow input" aria-label="Inner shadow input">
      <button id="inner-button" type="button">Submit</button>
    </div>`;
  inner.getElementById("inner-button").addEventListener("click", () => {
    const o = outer.getElementById("outer-input").value;
    const i = inner.getElementById("inner-input").value;
    $("shadowResult").textContent = `Outer: ${o || "-"} | Inner: ${i || "-"}`;
  });

  // ---------- keyboard ----------
  $("keyInput").addEventListener("keydown", (e) => {
    const parts = [];
    if (e.ctrlKey && e.key !== "Control") parts.push("CONTROL");
    if (e.shiftKey && e.key !== "Shift") parts.push("SHIFT");
    if (e.altKey && e.key !== "Alt") parts.push("ALT");
    if (e.metaKey && e.key !== "Meta") parts.push("META");
    const name = e.key === " " ? "SPACE" : e.key.length === 1 ? e.key.toUpperCase() : e.key.toUpperCase();
    parts.push(name);
    $("keyResult").textContent = "You entered: " + parts.join(" + ");
    if (e.key === "Tab") return; // allow normal tabbing
  });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      $("shortcutResult").textContent = "Ctrl+K pressed!";
    }
  });

  // ---------- SVG ----------
  document.querySelectorAll("#svgChart .bar").forEach((bar) =>
    bar.addEventListener("click", () => {
      document.querySelectorAll("#svgChart .bar").forEach((b) => b.setAttribute("fill", "#059669"));
      bar.setAttribute("fill", "#d97706");
      $("svgResult").textContent = `${bar.dataset.day}: ${bar.dataset.value} test runs`;
    })
  );
  $("svgCircle").addEventListener("click", () => ($("svgResult").textContent = "Circle clicked"));

  // ---------- canvas ----------
  const canvas = $("drawCanvas");
  const ctx = canvas.getContext("2d");
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#4f46e5";
  let drawing = false;
  let strokes = 0;
  const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  canvas.addEventListener("mousedown", (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(...pos(e)); });
  canvas.addEventListener("mousemove", (e) => { if (drawing) { ctx.lineTo(...pos(e)); ctx.stroke(); } });
  window.addEventListener("mouseup", () => { if (drawing) { drawing = false; strokes++; $("strokeCount").textContent = strokes; } });
  $("clearCanvas").addEventListener("click", () => { ctx.clearRect(0, 0, canvas.width, canvas.height); strokes = 0; $("strokeCount").textContent = 0; });

  // ---------- generated download ----------
  $("generateFileBtn").addEventListener("click", () => {
    const blob = new Blob([$("generatedText").value], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "notes.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });

  // ---------- covered button ----------
  $("coveredBtn").addEventListener("click", () => ($("coveredResult").textContent = "Covered button clicked"));
  $("blocker").addEventListener("click", () => ($("coveredResult").textContent = "You clicked the overlay, not the button"));
  $("removeOverlayBtn").addEventListener("click", () => { const b = $("blocker"); if (b) b.remove(); });
  $("farRightBtn").addEventListener("click", () => ($("farRightResult").textContent = "Far right button clicked"));

  // ---------- rich text ----------
  const editor = $("richEditor");
  const countEditor = () => ($("editorCount").textContent = editor.innerText.trim().length);
  editor.addEventListener("input", countEditor);
  countEditor();
  document.querySelectorAll("[data-cmd]").forEach((b) =>
    b.addEventListener("mousedown", (e) => { e.preventDefault(); document.execCommand(b.dataset.cmd); countEditor(); })
  );

  // ---------- custom context menu ----------
  const menu = $("contextMenu");
  $("contextZone").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    menu.style.left = e.clientX + "px";
    menu.style.top = e.clientY + "px";
    menu.classList.add("open");
  });
  document.addEventListener("click", () => menu.classList.remove("open"));
  menu.querySelectorAll("[data-item]").forEach((b) =>
    b.addEventListener("click", () => ($("contextResult").textContent = `Context menu: ${b.dataset.item}`))
  );

  // ---------- cookies / storage / geolocation ----------
  const showCookies = () => ($("cookieView").textContent = document.cookie || "(no cookies)");
  $("setCookieBtn").addEventListener("click", () => {
    const n = $("cookieName").value.trim();
    if (n) App.setCookie(n, $("cookieValue").value);
    showCookies();
  });
  $("clearCookiesBtn").addEventListener("click", () => {
    document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter(Boolean).forEach(App.deleteCookie);
    showCookies();
  });
  showCookies();
  $("storageView").textContent = App.store.get("visits", 0);
  $("setStorageBtn").addEventListener("click", () => {
    const v = App.store.get("visits", 0) + 1;
    App.store.set("visits", v);
    $("storageView").textContent = v;
  });
  $("geoBtn").addEventListener("click", () => {
    if (!navigator.geolocation) { $("geoResult").textContent = "Geolocation is not supported"; return; }
    $("geoResult").textContent = "Requesting location...";
    navigator.geolocation.getCurrentPosition(
      (p) => ($("geoResult").textContent = `Latitude: ${p.coords.latitude.toFixed(4)}, Longitude: ${p.coords.longitude.toFixed(4)}`),
      (err) => ($("geoResult").textContent = `Location error: ${err.message}`)
    );
  });

  // ---------- scrolling ----------
  const showY = () => ($("scrollY").textContent = Math.round(window.scrollY));
  window.addEventListener("scroll", showY, { passive: true });
  $("scrollBottomBtn").addEventListener("click", () => window.scrollTo(0, document.body.scrollHeight));
  $("bottomButton").addEventListener("click", () => ($("bottomResult").textContent = "Bottom button clicked"));
});
