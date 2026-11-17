(function () {
  // ---------- RSVP ----------
  const URL_ = (window.RSVP_URL || "").trim();
  const DEMO_KEY = "rsvp-demo-v2";

  const form = document.getElementById("rsvp");
  const namesEl = document.getElementById("names");
  const addBtn = document.getElementById("add-name");
  const statusEl = document.getElementById("status");
  const submitButtons = form.querySelectorAll("button[type=submit]");

  addBtn.addEventListener("click", () => {
    const row = document.createElement("div");
    row.className = "name-row";
    const input = document.createElement("input");
    input.type = "text";
    input.className = "name-input";
    input.maxLength = 60;
    input.placeholder = "Дагы бир адамдын аты";
    input.setAttribute("aria-label", "Дагы бир адамдын аты");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-name";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Өчүрүү");
    remove.addEventListener("click", () => row.remove());
    row.append(input, remove);
    namesEl.appendChild(row);
    input.focus();
  });

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = "status" + (kind ? " " + kind : "");
  }

  function demoSave(names, answer) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(DEMO_KEY)) || []; } catch (e) {}
    const lower = names.map(n => n.toLowerCase());
    list = list.filter(g => !lower.includes(g.name.toLowerCase()));
    names.forEach(name => list.push({ name, answer }));
    try { localStorage.setItem(DEMO_KEY, JSON.stringify(list)); } catch (e) {}
  }

  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const answer = ev.submitter ? ev.submitter.value : "yes";
    const seen = new Set();
    const names = [...form.querySelectorAll(".name-input")]
      .map(i => i.value.trim().replace(/\s+/g, " "))
      .filter(n => n && !seen.has(n.toLowerCase()) && seen.add(n.toLowerCase()));

    if (!names.length) {
      document.getElementById("name-0").focus();
      return setStatus("Сураныч, атыңызды жазыңыз.", "err");
    }

    submitButtons.forEach(b => (b.disabled = true));
    setStatus("Жөнөтүлүүдө…");

    try {
      if (!URL_) {
        demoSave(names, answer);
      } else {
        // no-cors + text/plain: Apps Script receives the data (the list itself is private, see guests.html)
        await fetch(URL_, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ names, answer }),
        });
      }
      setStatus(answer === "yes" ? "Рахмат! Сиздерди күтөбүз 🎉" : "Өкүнүчтүү! Кабарлаганыңызга рахмат.", "ok");
      namesEl.querySelectorAll(".name-row").forEach(r => r.remove());
      document.getElementById("name-0").value = "";
    } catch (e) {
      setStatus("Жөнөтүүдө ката кетти. Кайра аракет кылыңыз.", "err");
    } finally {
      submitButtons.forEach(b => (b.disabled = false));
    }
  });
})();
