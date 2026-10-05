document.addEventListener('DOMContentLoaded', function () {

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle
  var header = document.querySelector('.site-header');
  var menuToggle = document.querySelector('.menu-toggle');
  if (menuToggle && header) {
    menuToggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.querySelectorAll('.mobile-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Swatch rail: click to scroll
  var swatches = document.querySelectorAll('.swatch');
  var scrollCue = document.querySelector('.scroll-cue');
  var sections = [];
  swatches.forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute('data-target'));
    if (target) sections.push({ btn: btn, el: target });
    btn.addEventListener('click', function () {
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  if (scrollCue) {
    scrollCue.addEventListener('click', function () {
      var target = document.getElementById(scrollCue.getAttribute('data-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Swatch rail: highlight active section + progress fill
  var progressFill = document.querySelector('.rail-progress-fill');
  if (sections.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = sections.find(function (s) { return s.el === entry.target; });
        if (!match) return;
        if (entry.isIntersecting) {
          swatches.forEach(function (s) { s.classList.remove('is-active'); });
          match.btn.classList.add('is-active');
          var idx = sections.indexOf(match);
          if (progressFill) {
            var pct = ((idx + 1) / sections.length) * 100;
            progressFill.style.height = pct + '%';
          }
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  // Hero slideshow: crossfade + zoom-out, one new image every 5s
  var heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    var current = 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setInterval(function () {
      var next = (current + 1) % heroSlides.length;
      heroSlides[current].classList.remove('is-active');
      if (!reduceMotion) {
        // restart the zoom animation cleanly on the incoming slide
        heroSlides[next].style.animation = 'none';
        void heroSlides[next].offsetWidth; // force reflow
        heroSlides[next].style.animation = '';
      }
      heroSlides[next].classList.add('is-active');
      current = next;
    }, 5000);
  }

  // Contact form (front-end only demo handling — wire to real backend/email service before launch)
  var form = document.getElementById('estimate-form');
  var note = document.getElementById('form-note');
  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name');
      var phone = document.getElementById('phone');
      var service = document.getElementById('service');

      if (!name.value.trim() || !phone.value.trim() || !service.value) {
        note.textContent = 'Please fill in your name, phone, and project type.';
        note.classList.remove('is-success');
        return;
      }

      note.textContent = 'Thanks, ' + name.value.trim().split(' ')[0] + '! We got your request and will call you at ' + phone.value.trim() + ' shortly.';
      note.classList.add('is-success');
      form.reset();
    });
  }
});
