/* MyPresence landing page — small, dependency-free interactions */
(function () {
  "use strict";

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (menuToggle && mobileNav) {
    var setMenu = function (open) {
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobileNav.classList.toggle("is-open", open);
    };

    menuToggle.addEventListener("click", function () {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        menuToggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (menuToggle.getAttribute("aria-expanded") !== "true") return;
      if (header && header.contains(event.target)) return;
      setMenu(false);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) setMenu(false);
    });
  }

  /* ---------- Android version tabs ---------- */
  var versionButtons = Array.prototype.slice.call(
    document.querySelectorAll(".version-toggle [role='tab']")
  );

  var selectVersion = function (version, moveFocus) {
    versionButtons.forEach(function (button) {
      var selected = button.getAttribute("data-version") === version;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) button.focus();
    });

    document.querySelectorAll("[data-path]").forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-path") !== version;
    });
  };

  versionButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      selectVersion(button.getAttribute("data-version"), false);
    });

    button.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      var direction = event.key === "ArrowRight" ? 1 : -1;
      var next = (index + direction + versionButtons.length) % versionButtons.length;
      selectVersion(versionButtons[next].getAttribute("data-version"), true);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reducedMotion) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    revealItems.forEach(function (item) {
      item.classList.add("is-reveal-ready");
      revealObserver.observe(item);
    });
  }

  /* ---------- Live APK size ---------- */
  // Keeps the displayed file size accurate if the APK is replaced later.
  var sizeEls = document.querySelectorAll("[data-apk-size]");
  if (sizeEls.length && window.fetch) {
    fetch("downloads/MyPresence.apk", { method: "HEAD" })
      .then(function (response) {
        if (!response.ok) return;
        var bytes = Number(response.headers.get("content-length"));
        if (!bytes) return;
        var mb = (bytes / 1000000).toFixed(1) + " MB";
        sizeEls.forEach(function (el) {
          el.textContent = mb;
        });
      })
      .catch(function () {
        /* Keep the size written in the HTML. */
      });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
