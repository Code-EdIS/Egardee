
document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // CONFIGURATION
  // ==============================

  const CONTACT_EMAIL = "info@egardee.com";

  // ==============================
  // HEADER SCROLL EFFECT
  // ==============================

  const header = document.querySelector(".site-header");

  function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 30);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  // ==============================
  // MOBILE NAVIGATION
  // ==============================

  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");

  menuToggle?.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navigation?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      navigation?.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });

  // ==============================
  // REVEAL ANIMATIONS
  // ==============================

  const revealElements = document.querySelectorAll(".reveal");

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px"
    });

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("visible"));
  }

  // ==============================
  // DYNAMIC YEAR
  // ==============================

  document.querySelectorAll(".current-year").forEach(element => {
    element.textContent = new Date().getFullYear();
  });

  // ==============================
  // CONTACT FORM
  // ==============================

  const form = document.getElementById("contactForm");
  const gmailButton = document.getElementById("gmailButton");

  if (!form) return;

  // Automatically select product when arriving
  // from a specific solution page.

  const params = new URLSearchParams(window.location.search);
  const interestFromURL = params.get("interest");
  const interestSelect = document.getElementById("interest");

  if (
    interestSelect &&
    ["image", "usb", "partnership", "general"].includes(interestFromURL)
  ) {
    interestSelect.value = interestFromURL;
  }

  function buildEmail() {
    if (!form.reportValidity()) return null;

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const company = document.getElementById("company").value.trim();
    const interest = interestSelect.value;
    const interestLabel = interestSelect.selectedOptions[0].textContent;
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !interest || !message) return null;

    const subject = `EGARDEE Enquiry - ${interestLabel}`;

    const body = [
      "EGARDEE - Website Enquiry",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "Not specified"}`,
      `Area of interest: ${interestLabel}`,
      "",
      "Message:",
      message,
      "",
      "---",
      "Sent using the EGARDEE website contact form."
    ].join("\n");

    return { subject, body };
  }

  // Default email application

  form.addEventListener("submit", event => {
    event.preventDefault();

    const data = buildEmail();
    if (!data) return;

    const mailto =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(data.subject)}` +
      `&body=${encodeURIComponent(data.body)}`;

    window.location.href = mailto;
  });

  // Explicit Gmail fallback

  gmailButton?.addEventListener("click", () => {
    const data = buildEmail();
    if (!data) return;

    const gmailURL = new URL("https://mail.google.com/mail/");

    gmailURL.searchParams.set("view", "cm");
    gmailURL.searchParams.set("fs", "1");
    gmailURL.searchParams.set("to", CONTACT_EMAIL);
    gmailURL.searchParams.set("su", data.subject);
    gmailURL.searchParams.set("body", data.body);

    const opened = window.open(
      gmailURL.toString(),
      "_blank",
      "noopener,noreferrer"
    );

    // If the browser blocks the new tab,
    // navigate directly to Gmail.

    if (!opened) {
      window.location.assign(gmailURL.toString());
    }
  });

});
