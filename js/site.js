(function () {
  var reduce = document.documentElement.classList.contains("reduce");

  var loader = document.getElementById("loader");
  var loadCount = document.getElementById("load-count");
  var loadFill = document.getElementById("load-fill");

  function finishLoader() {
    document.documentElement.classList.remove("loading");
    if (loader) {
      loader.classList.add("is-done");
      loader.setAttribute("aria-hidden", "true");
      window.setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, reduce ? 0 : 700);
    }
    startParticles();
    initReveal();
    initCounters();
    initMarquees();
  }

  function runLoader() {
    if (!loader || !loadCount || reduce) {
      finishLoader();
      return;
    }
    var start = performance.now();
    var duration = 1700;
    function tick(now) {
      var p = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = Math.round(eased * 100);
      loadCount.textContent = String(value);
      if (loadFill) loadFill.style.transform = "scaleX(" + eased + ")";
      if (p < 1) requestAnimationFrame(tick);
      else finishLoader();
    }
    requestAnimationFrame(tick);
  }

  var particleState = { running: false, parts: [], w: 0, h: 0, dpr: 1 };

  function startParticles() {
    var canvas = document.getElementById("particles");
    if (!canvas || reduce) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      particleState.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      particleState.w = window.innerWidth;
      particleState.h = window.innerHeight;
      canvas.width = Math.floor(particleState.w * particleState.dpr);
      canvas.height = Math.floor(particleState.h * particleState.dpr);
      canvas.style.width = particleState.w + "px";
      canvas.style.height = particleState.h + "px";
      ctx.setTransform(particleState.dpr, 0, 0, particleState.dpr, 0, 0);
    }

    function spawn(initial) {
      var warm = Math.random() < 0.82;
      return {
        x: Math.random() * particleState.w,
        y: initial ? Math.random() * particleState.h : particleState.h + 8,
        r: Math.random() * 1.7 + 0.35,
        s: Math.random() * 0.32 + 0.06,
        drift: (Math.random() - 0.5) * 0.22,
        a: Math.random() * 0.5 + 0.12,
        color: warm ? "255, 42, 48" : "255, 186, 170"
      };
    }

    resize();
    var count = particleState.w < 720 ? 34 : 72;
    particleState.parts = [];
    for (var i = 0; i < count; i += 1) particleState.parts.push(spawn(true));
    particleState.running = true;

    window.addEventListener("resize", resize);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        particleState.running = false;
      } else if (!particleState.running) {
        particleState.running = true;
        requestAnimationFrame(frame);
      }
    });

    function frame() {
      if (!particleState.running) return;
      ctx.clearRect(0, 0, particleState.w, particleState.h);
      var parts = particleState.parts;
      for (var n = 0; n < parts.length; n += 1) {
        var p = parts[n];
        p.y -= p.s;
        p.x += p.drift;
        if (p.y < -12) {
          var next = spawn(false);
          p.x = next.x;
          p.y = next.y;
          p.r = next.r;
          p.s = next.s;
          p.drift = next.drift;
          p.a = next.a;
          p.color = next.color;
        }
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + p.color + "," + p.a + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.r > 1.25) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(" + p.color + "," + (p.a * 0.25) + ")";
          ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var panel = document.getElementById("nav-panel");

  function setMenu(open) {
    if (!burger || !panel) return;
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burger) {
    burger.addEventListener("click", function () {
      setMenu(burger.getAttribute("aria-expanded") !== "true");
    });
  }

  if (panel) {
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }

  window.addEventListener("scroll", function () {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);
  }, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });

  var heroStage = document.querySelector(".hero-stage");
  if (heroStage && !reduce && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var hero = document.getElementById("hero");
    hero.addEventListener("mousemove", function (event) {
      var x = (event.clientX / window.innerWidth - 0.5) * 14;
      var y = (event.clientY / window.innerHeight - 0.5) * 10;
      heroStage.style.transform = "translate(" + x.toFixed(2) + "px," + y.toFixed(2) + "px)";
    });
    hero.addEventListener("mouseleave", function () {
      heroStage.style.transform = "translate(0,0)";
    });
  }

  function initReveal() {
    var nodes = document.querySelectorAll(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      nodes.forEach(function (node) { node.classList.add("in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var parent = entry.target.parentElement;
        var siblings = parent ? parent.querySelectorAll(":scope > .reveal") : [];
        var index = Array.prototype.indexOf.call(siblings, entry.target);
        entry.target.style.transitionDelay = (Math.max(index, 0) * 70) + "ms";
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    function play(el) {
      var target = Number(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduce || !target) {
        el.textContent = String(target) + suffix;
        return;
      }
      var start = performance.now();
      var duration = 1400;
      function tick(now) {
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if (reduce || !("IntersectionObserver" in window)) {
      nums.forEach(play);
      return;
    }
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        play(entry.target);
        seen.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { seen.observe(el); });
  }

  document.querySelectorAll(".acc-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var acc = btn.closest(".acc");
      var open = acc.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  function initMarquees() {
    if (reduce || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-paused", !entry.isIntersecting);
      });
    });
    document.querySelectorAll(".marquee").forEach(function (band) { observer.observe(band); });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  var langColors = {
    Python: "#3776AB",
    HTML: "#E44D26",
    JavaScript: "#F7DF1E",
    TypeScript: "#3178C6",
    "Jupyter Notebook": "#DA5B0B",
    "C#": "#68217A",
    CSS: "#563D7C",
    Java: "#B07219"
  };

  function repoCard(repo, pinned) {
    var color = langColors[repo.language] || "#ff2d2d";
    var desc = repo.description || "Machine learning, AI, and robotics.";
    if (desc.length > 110) desc = desc.slice(0, 107) + "…";
    return (
      '<a class="repo" href="' + escapeHtml(repo.html_url) + '" target="_blank" rel="noopener noreferrer">' +
        "<strong>" + escapeHtml(repo.name) + "</strong>" +
        "<p>" + escapeHtml(desc) + "</p>" +
        '<div class="repo-meta">' +
          (repo.language ? '<span><b style="background:' + color + '"></b>' + escapeHtml(repo.language) + "</span>" : "") +
          (repo.stargazers_count ? "<span>★ " + repo.stargazers_count + "</span>" : "") +
          (pinned ? "<span>Pinned</span>" : "") +
        "</div>" +
      "</a>"
    );
  }

  function loadRepos() {
    var grid = document.getElementById("repo-grid");
    if (!grid) return;
    var pinned = [
      "phone-to-panda",
      "shadowhand-dexterity-ppo",
      "llm-evaluation-workflows",
      "slm-document-intelligence",
      "vision-defect-inspection-api",
      "tony",
      "CareerOS",
      "Autonomous-Robotic-Navigation-System-in-Unity"
    ];
    var fallback = pinned.map(function (name) {
      return repoCard({
        name: name,
        html_url: "https://github.com/br23aay/" + name,
        description: "Machine learning, AI, and robotics.",
        language: "",
        stargazers_count: 0
      }, true);
    }).join("");

    fetch("https://api.github.com/users/br23aay/repos?per_page=100&sort=updated", {
      headers: { Accept: "application/vnd.github+json" }
    }).then(function (response) {
      if (!response.ok) throw new Error("github");
      return response.json();
    }).then(function (repos) {
      if (!Array.isArray(repos)) throw new Error("github");
      var byName = {};
      repos.forEach(function (repo) { byName[repo.name] = repo; });
      var chosen = [];
      pinned.forEach(function (name) {
        if (byName[name]) chosen.push(byName[name]);
      });
      repos.forEach(function (repo) {
        if (chosen.length >= 6) return;
        if (repo.fork || pinned.indexOf(repo.name) !== -1) return;
        chosen.push(repo);
      });
      if (!chosen.length) throw new Error("github");
      grid.innerHTML = chosen.slice(0, 6).map(function (repo) {
        return repoCard(repo, pinned.indexOf(repo.name) !== -1);
      }).join("");
    }).catch(function () {
      grid.innerHTML = fallback;
    });
  }

  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var button = document.getElementById("contact-submit");
      var ok = document.getElementById("form-ok");
      var err = document.getElementById("form-err");
      if (ok) ok.classList.remove("ok");
      if (err) err.classList.remove("err");
      if (button) {
        button.disabled = true;
        button.textContent = "Sending";
      }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (response) {
        if (!response.ok) throw new Error("form");
        if (ok) ok.classList.add("ok");
        form.reset();
        if (button) button.hidden = true;
        if (typeof window.gtag === "function") {
          window.gtag("event", "form_submit", { event_category: "Contact", event_label: "Success" });
        }
      }).catch(function () {
        if (err) err.classList.add("err");
        if (button) {
          button.disabled = false;
          button.textContent = "Submit message";
        }
      });
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  loadRepos();
  runLoader();
})();
