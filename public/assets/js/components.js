// UI Components page
document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);

  // tabs
  const tabs = document.querySelectorAll('#tabs-section [role="tab"]');
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.setAttribute("aria-selected", String(t === tab));
        $(t.getAttribute("aria-controls")).hidden = t !== tab;
      });
    })
  );

  // accordion (one open at a time)
  const accButtons = document.querySelectorAll("#faqAccordion .accordion-button");
  accButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      accButtons.forEach((b) => { b.setAttribute("aria-expanded", "false"); $(b.getAttribute("aria-controls")).hidden = true; });
      btn.setAttribute("aria-expanded", String(open));
      $(btn.getAttribute("aria-controls")).hidden = !open;
    })
  );

  // confirm modal
  const modal = $("confirmModal");
  const overlay = $("confirmOverlay");
  const openModal = (open) => { modal.classList.toggle("open", open); overlay.classList.toggle("open", open); };
  $("deleteAccountBtn").addEventListener("click", () => { $("confirmInput").value = ""; $("confirmDelete").disabled = true; openModal(true); $("confirmInput").focus(); });
  $("confirmInput").addEventListener("input", (e) => ($("confirmDelete").disabled = e.target.value !== "DELETE"));
  $("confirmCancel").addEventListener("click", () => { openModal(false); $("modalStatus").textContent = "Deletion cancelled"; });
  overlay.addEventListener("click", () => { openModal(false); $("modalStatus").textContent = "Deletion cancelled"; });
  $("confirmDelete").addEventListener("click", () => { openModal(false); $("modalStatus").textContent = "Account deleted"; App.toast("Account deleted", "error"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) { openModal(false); $("modalStatus").textContent = "Deletion cancelled"; } });

  // toasts + tooltip
  $("successToastBtn").addEventListener("click", () => App.toast("Changes saved successfully", "success"));
  $("errorToastBtn").addEventListener("click", () => App.toast("Something went wrong", "error"));
  App.enableHover($("tooltipWrap"));

  // actions menu (click)
  const amBtn = $("actionsMenuBtn");
  const am = $("actionsMenu");
  amBtn.addEventListener("click", (e) => { e.stopPropagation(); const o = am.classList.toggle("open"); amBtn.setAttribute("aria-expanded", String(o)); });
  document.addEventListener("click", (e) => { if (!am.contains(e.target)) { am.classList.remove("open"); amBtn.setAttribute("aria-expanded", "false"); } });
  am.querySelectorAll("[data-action]").forEach((b) =>
    b.addEventListener("click", () => { $("menuResult").textContent = `Action selected: ${b.dataset.action}`; am.classList.remove("open"); })
  );

  // hover menu (multi level)
  document.querySelectorAll("#hoverMenuBar .menu-item").forEach((el) => App.enableHover(el));
  document.querySelectorAll("#hoverMenuBar a").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (a.dataset.course) {
        $("menuResult").textContent = `Course selected: ${a.dataset.course}`;
        document.querySelectorAll("#hoverMenuBar .menu-item").forEach((m) => m.classList.remove("hovered"));
      }
    })
  );

  // progress bar
  let timer = null;
  let pct = 0;
  const setPct = (n) => {
    pct = n;
    $("progressFill").style.width = n + "%";
    $("progressLabel").textContent = n + "%";
    $("progressBar").setAttribute("aria-valuenow", String(n));
  };
  $("startProgress").addEventListener("click", () => {
    if (timer) return;
    $("progressDone").textContent = "";
    $("startProgress").disabled = true;
    timer = setInterval(() => {
      setPct(Math.min(100, pct + 5));
      if (pct >= 100) {
        clearInterval(timer);
        timer = null;
        $("startProgress").disabled = false;
        $("progressDone").textContent = "Download complete!";
      }
    }, 150);
  });
  $("resetProgress").addEventListener("click", () => { clearInterval(timer); timer = null; $("startProgress").disabled = false; setPct(0); $("progressDone").textContent = ""; });

  // spinner
  $("spinnerBtn").addEventListener("click", () => {
    $("spinnerResult").textContent = "";
    $("spinner").classList.remove("hidden");
    $("spinnerBtn").disabled = true;
    setTimeout(() => {
      $("spinner").classList.add("hidden");
      $("spinnerBtn").disabled = false;
      $("spinnerResult").textContent = "Saved!";
    }, 2000);
  });

  // carousel
  const slides = document.querySelectorAll("#carouselTrack .carousel-slide");
  let index = 0;
  $("carouselDots").innerHTML = Array.from(slides).map((_, i) => `<button type="button" aria-label="Go to slide ${i + 1}" data-index="${i}" id="dot-${i + 1}"></button>`).join("");
  function go(i) {
    index = (i + slides.length) % slides.length;
    $("carouselTrack").style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll("#carouselDots button").forEach((d, n) => d.classList.toggle("active", n === index));
    slides.forEach((s, n) => s.setAttribute("aria-hidden", String(n !== index)));
    $("currentSlide").textContent = slides[index].textContent;
  }
  $("carouselNext").addEventListener("click", () => go(index + 1));
  $("carouselPrev").addEventListener("click", () => go(index - 1));
  $("carouselDots").addEventListener("click", (e) => { if (e.target.dataset.index) go(Number(e.target.dataset.index)); });
  go(0);

  // rating
  const stars = document.querySelectorAll("#starRating button");
  const paint = (n) => stars.forEach((s) => s.classList.toggle("on", Number(s.dataset.value) <= n));
  let rating = 0;
  stars.forEach((s) => {
    s.addEventListener("mouseenter", () => paint(Number(s.dataset.value)));
    s.addEventListener("click", () => {
      rating = Number(s.dataset.value);
      paint(rating);
      stars.forEach((x) => x.setAttribute("aria-pressed", String(Number(x.dataset.value) === rating)));
      $("ratingResult").textContent = `You rated ${rating} out of 5`;
    });
  });
  $("starRating").addEventListener("mouseleave", () => paint(rating));

  // tags input
  const tags = [];
  function renderTags() {
    $("tagsBox").querySelectorAll(".chip").forEach((c) => c.remove());
    tags.forEach((t, i) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.dataset.tag = t;
      chip.innerHTML = `<span>${App.escapeHtml(t)}</span><button type="button" aria-label="Remove ${App.escapeHtml(t)}">×</button>`;
      chip.querySelector("button").addEventListener("click", () => { tags.splice(i, 1); renderTags(); });
      $("tagsBox").insertBefore(chip, $("tagInput"));
    });
    $("tagsValue").textContent = tags.length ? tags.join(", ") : "none";
  }
  $("tagInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const v = e.target.value.trim().replace(/,$/, "");
      if (v && !tags.includes(v)) tags.push(v);
      e.target.value = "";
      renderTags();
    } else if (e.key === "Backspace" && !e.target.value && tags.length) {
      tags.pop();
      renderTags();
    }
  });

  // quantity stepper
  const q = $("qtyValue");
  const clamp = (n) => Math.min(10, Math.max(1, Number.isFinite(n) ? n : 1));
  $("qtyMinus").addEventListener("click", () => (q.value = clamp(Number(q.value) - 1)));
  $("qtyPlus").addEventListener("click", () => (q.value = clamp(Number(q.value) + 1)));
  q.addEventListener("change", () => (q.value = clamp(parseInt(q.value, 10))));

  // clipboard
  $("copyCouponBtn").addEventListener("click", async () => {
    const ok = await App.copyText($("couponCode").value);
    $("copyResult").textContent = ok ? "Coupon copied to clipboard" : "Copy failed";
    $("copyCouponBtn").textContent = ok ? "Copied!" : "Copy";
    setTimeout(() => ($("copyCouponBtn").textContent = "Copy"), 2000);
  });

  $("clearNotifications").addEventListener("click", () => ($("notificationCount").textContent = "0"));
});
