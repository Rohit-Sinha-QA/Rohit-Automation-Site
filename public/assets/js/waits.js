// Waits & Dynamic Elements page
document.addEventListener("DOMContentLoaded", function () {
  const $ = (id) => document.getElementById(id);

  // 1. hidden element
  $("startHidden").addEventListener("click", () => {
    $("finish1").style.display = "none";
    $("loading1").classList.remove("hidden");
    $("startHidden").disabled = true;
    setTimeout(() => {
      $("loading1").classList.add("hidden");
      $("finish1").style.display = "block";
      $("startHidden").disabled = false;
    }, 3000);
  });

  // 2. rendered element
  $("startRender").addEventListener("click", () => {
    $("finish2Container").innerHTML = "";
    $("loading2").classList.remove("hidden");
    $("startRender").disabled = true;
    setTimeout(() => {
      $("loading2").classList.add("hidden");
      $("finish2Container").innerHTML = '<h4 id="finish2" class="result-text mt-1">Hello World!</h4>';
      $("startRender").disabled = false;
    }, 3000);
  });

  // 3. enable / disable input
  $("toggleInputBtn").addEventListener("click", () => {
    const input = $("dynamicInput");
    const btn = $("toggleInputBtn");
    const enabling = input.disabled;
    btn.disabled = true;
    $("inputMessage").textContent = "Please wait...";
    setTimeout(() => {
      input.disabled = !enabling;
      input.placeholder = enabling ? "Now you can type" : "Disabled until enabled";
      btn.textContent = enabling ? "Disable" : "Enable";
      btn.disabled = false;
      $("inputMessage").textContent = enabling ? "It's enabled!" : "It's disabled!";
    }, 2000);
  });

  // 3. remove / add checkbox
  $("toggleCheckboxBtn").addEventListener("click", () => {
    const btn = $("toggleCheckboxBtn");
    const exists = Boolean($("dynamicCheckbox"));
    btn.disabled = true;
    $("checkboxMessage").textContent = "Please wait...";
    setTimeout(() => {
      if (exists) {
        $("dynamicCheckboxLabel").remove();
        btn.textContent = "Add";
        $("checkboxMessage").textContent = "It's gone!";
      } else {
        const label = document.createElement("label");
        label.className = "check";
        label.id = "dynamicCheckboxLabel";
        label.htmlFor = "dynamicCheckbox";
        label.innerHTML = '<input type="checkbox" id="dynamicCheckbox"> A checkbox';
        $("checkboxArea").prepend(label);
        btn.textContent = "Remove";
        $("checkboxMessage").textContent = "It's back!";
      }
      btn.disabled = false;
    }, 2000);
  });

  // 4. text change
  $("processBtn").addEventListener("click", () => {
    const s = $("processStatus");
    $("processBtn").disabled = true;
    s.className = "badge badge-warning";
    s.textContent = "Processing...";
    s.dataset.status = "processing";
    setTimeout(() => {
      s.className = "badge badge-success";
      s.textContent = "Completed";
      s.dataset.status = "completed";
      $("processBtn").disabled = false;
    }, 3000);
  });
  $("colorBtn").addEventListener("click", () => {
    const t = $("colorText");
    t.className = "badge";
    t.textContent = "I will turn red";
    setTimeout(() => { t.className = "badge badge-danger text-danger"; t.textContent = "I am red now"; }, 3000);
  });
  let cd = null;
  $("countdownBtn").addEventListener("click", () => {
    clearInterval(cd);
    let n = 5;
    $("countdown").textContent = n;
    $("countdownDone").textContent = "";
    cd = setInterval(() => {
      n--;
      $("countdown").textContent = n;
      if (n <= 0) { clearInterval(cd); $("countdownDone").textContent = "Time's up!"; }
    }, 1000);
  });
  $("delayedAlertBtn").addEventListener("click", () => {
    $("delayedAlertResult").textContent = "Waiting for alert...";
    setTimeout(() => {
      alert("I appeared after 3 seconds");
      $("delayedAlertResult").textContent = "Alert was closed";
    }, 3000);
  });

  // 5. AJAX
  $("loadUsersBtn").addEventListener("click", async () => {
    $("ajaxStatus").textContent = "Loading users...";
    $("userList").innerHTML = "";
    try {
      const res = await fetch("/api/users?limit=5");
      if (!res.ok) throw new Error("HTTP " + res.status);
      const body = await res.json();
      body.data.forEach((u) => {
        const li = document.createElement("li");
        li.className = "user-item";
        li.dataset.userId = u.id;
        li.textContent = `${u.name} - ${u.email}`;
        $("userList").appendChild(li);
      });
      $("ajaxStatus").textContent = `Loaded ${body.data.length} users`;
    } catch (e) {
      $("ajaxStatus").textContent = "Could not load users. Is the API server running? (node server.js)";
    }
  });
  $("slowApiBtn").addEventListener("click", async () => {
    $("ajaxStatus").textContent = "Waiting for slow API...";
    $("slowApiBtn").disabled = true;
    try {
      const res = await fetch("/api/delay/2");
      const body = await res.json();
      $("ajaxStatus").textContent = body.message;
    } catch {
      $("ajaxStatus").textContent = "Slow API failed. Is the API server running? (node server.js)";
    } finally {
      $("slowApiBtn").disabled = false;
    }
  });

  // 6. add / remove elements
  let added = 0;
  const refreshCount = () => ($("elementCount").textContent = $("elements").children.length);
  $("addElementBtn").addEventListener("click", () => {
    added++;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn-secondary btn-sm added-manually";
    b.id = "delete-" + added;
    b.textContent = "Delete";
    b.addEventListener("click", () => { b.remove(); refreshCount(); });
    $("elements").appendChild(b);
    refreshCount();
  });

  // 7. infinite scroll
  const list = $("infiniteList");
  let count = 0;
  let loading = false;
  function loadMore() {
    if (loading || count >= 100) return;
    loading = true;
    $("infiniteLoading").classList.remove("hidden");
    setTimeout(() => {
      for (let i = 0; i < 10 && count < 100; i++) {
        count++;
        const row = document.createElement("div");
        row.className = "infinite-item";
        row.textContent = "Item " + count;
        list.appendChild(row);
      }
      $("loadedCount").textContent = count;
      $("infiniteLoading").classList.add("hidden");
      loading = false;
    }, count === 0 ? 0 : 500);
  }
  list.addEventListener("scroll", () => {
    if (list.scrollTop + list.clientHeight >= list.scrollHeight - 5) loadMore();
  });
  loadMore();

  // 8. stale elements
  let refreshes = 0;
  function buildList() {
    $("staleList").innerHTML = ["Apple", "Banana", "Cherry", "Mango"].map((f) => `<li class="fruit">${f} <span class="small muted">(render ${refreshes})</span></li>`).join("");
    $("refreshCount").textContent = refreshes;
  }
  $("refreshListBtn").addEventListener("click", () => { refreshes++; buildList(); });
  buildList();
});
