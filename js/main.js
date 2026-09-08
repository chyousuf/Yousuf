/* ===== Yousuf Javaid Portfolio - Main JS ===== */
(function () {
  'use strict';

  /* ===== Utility: Throttle ===== */
  function throttle(fn, wait) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

  /* ===== Utility: lerp ===== */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ===== Cursor Glow Effect (smooth lerp follow) ===== */
  var cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);
  var glowActive = false;
  var mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
  document.addEventListener('mousemove', function (e) {
    if (!glowActive) { cursorGlow.classList.add('active'); glowActive = true; }
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  document.addEventListener('mouseleave', function () {
    cursorGlow.classList.remove('active'); glowActive = false;
  });
  function updateCursorGlow() {
    glowX = lerp(glowX, mouseX, 0.12);
    glowY = lerp(glowY, mouseY, 0.12);
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(updateCursorGlow);
  }
  requestAnimationFrame(updateCursorGlow);

  /* ===== Scroll Progress Bar ===== */
  var progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress);

  /* ===== Back to Top Button ===== */
  var backToTop = document.getElementById('back-to-top');
  function toggleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', toggleBackToTop);
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== Header scroll effect ===== */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ===== Mobile menu ===== */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
    });
  });

  /* ===== Active nav link on scroll ===== */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');
  function updateActiveNav() {
    var scrollY = window.scrollY + 100;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  /* ===== Smooth scroll for all anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = header.offsetHeight;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ===== SPLIT TEXT REVEAL - Hero Name & Greeting (word-based) ===== */
  function splitTextToWords(el, baseDelay) {
    var html = el.innerHTML;
    // Preserve inner HTML (e.g. <span class="text-accent">)
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    var wordIndex = 0;
    function processNode(node) {
      var out = '';
      node.childNodes.forEach(function (child) {
        if (child.nodeType === 3) {
          var words = child.textContent.split(/(\s+)/);
          words.forEach(function (w) {
            if (/^\s+$/.test(w)) {
              out += w;
            } else if (w.length > 0) {
              out += '<span class="split-word" style="animation-delay:' + (baseDelay + wordIndex * 0.12) + 's">' + w + '</span>';
              wordIndex++;
            }
          });
        } else if (child.nodeType === 1) {
          // Preserve element wrapper (e.g. <span class="text-accent">)
          out += '<' + child.tagName.toLowerCase();
          if (child.className) out += ' class="' + child.className + ' split-word" style="animation-delay:' + (baseDelay + wordIndex * 0.12) + 's"';
          out += '>';
          // Process inner text of the element
          var innerWords = child.textContent.split(/(\s+)/);
          innerWords.forEach(function (w) {
            if (/^\s+$/.test(w)) {
              out += w;
            } else if (w.length > 0) {
              out += w;
              wordIndex++;
            }
          });
          out += '</' + child.tagName.toLowerCase() + '>';
        }
      });
      return out;
    }
    el.innerHTML = processNode(tempDiv);
  }

  document.querySelectorAll('.hero-name.split-reveal').forEach(function (el) {
    splitTextToWords(el, 0.2);
  });
  document.querySelectorAll('.hero-greeting.split-reveal').forEach(function (el) {
    splitTextToWords(el, 0);
  });

  /* ===== SUBTITLE WORD-BY-WORD BLUR IN ===== */
  var subtitleWords = document.querySelectorAll('.subtitle-word');
  subtitleWords.forEach(function (word, i) {
    word.style.animationDelay = (0.9 + i * 0.18) + 's';
  });

  /* ===== CLIP-PATH REVEAL for Section Titles ===== */
  var clipReveals = document.querySelectorAll('.clip-reveal');
  var sectionLines = document.querySelectorAll('.section-line');
  if ('IntersectionObserver' in window) {
    var clipObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          var parent = entry.target.closest('.section-header');
          if (parent) {
            var line = parent.querySelector('.section-line');
            if (line) line.classList.add('revealed');
          }
          clipObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    clipReveals.forEach(function (el) { clipObserver.observe(el); });
  } else {
    clipReveals.forEach(function (el) { el.classList.add('revealed'); });
    sectionLines.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ===== Scroll Reveal (Intersection Observer) ===== */
  var revealElements = document.querySelectorAll('.scroll-reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ===== STAGGER WAVE EFFECT on Skill Tags ===== */
  var skillSections = document.querySelectorAll('.skill-card, .timeline-card');
  if ('IntersectionObserver' in window) {
    var tagObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var tags = entry.target.querySelectorAll('.skill-tag.wave-tag');
          tags.forEach(function (tag, i) {
            tag.style.transitionDelay = (i * 0.05) + 's';
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                tag.classList.add('wave-revealed');
              });
            });
          });
          tagObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillSections.forEach(function (card) { tagObserver.observe(card); });
  } else {
    document.querySelectorAll('.skill-tag.wave-tag').forEach(function (tag) {
      tag.classList.add('wave-revealed');
    });
  }

  /* ===== Skill bars animate on scroll ===== */
  var progressBars = document.querySelectorAll('.progress-fill');
  if ('IntersectionObserver' in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var width = entry.target.getAttribute('data-width');
          entry.target.style.width = width + '%';
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    progressBars.forEach(function (bar) { barObserver.observe(bar); });
  } else {
    progressBars.forEach(function (bar) {
      bar.style.width = bar.getAttribute('data-width') + '%';
    });
  }

  /* ===== Project Filter ===== */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      projectCards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ===== GLITCH TEXT - Set data-text attribute ===== */
  document.querySelectorAll('.glitch-text').forEach(function (el) {
    el.setAttribute('data-text', el.textContent);
  });

  /* ===== Contact Form ===== */
  var form = document.getElementById('contact-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var inputs = form.querySelectorAll('[required]');
    var valid = true;
    inputs.forEach(function (input) {
      if (!input.value.trim()) {
        valid = false;
        input.classList.add('form-shake');
        setTimeout(function () { input.classList.remove('form-shake'); }, 500);
      }
    });
    if (!valid) return;
    var btn = form.querySelector('.btn-primary');
    var originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
    btn.style.background = 'var(--accent-400)';
    btn.style.borderColor = 'var(--accent-400)';
    setTimeout(function () {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.borderColor = '';
      form.reset();
    }, 2500);
  });

  /* ===== Newsletter Form ===== */
  var newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = newsletterForm.querySelector('.footer-newsletter-input');
      var btn = newsletterForm.querySelector('.footer-newsletter-btn');
      if (!input.value.trim()) {
        input.classList.add('form-shake');
        setTimeout(function () { input.classList.remove('form-shake'); }, 500);
        return;
      }
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      input.value = '';
      setTimeout(function () {
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
      }, 2000);
    });
  }

  /* ===== Staggered scroll-reveal delays ===== */
  document.querySelectorAll('.skills-grid .scroll-reveal, .projects-grid .scroll-reveal, .timeline .scroll-reveal, .education-grid .scroll-reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.08) + 's';
  });

  /* ===== SCROLL-LINKED ANIMATIONS (hero parallax + section title offset) ===== */
  var heroSection = document.querySelector('.hero');
  var heroContent = document.querySelector('.hero-content');
  var heroImageWrapper = document.querySelector('.hero-image-wrapper');
  var sectionTitles = document.querySelectorAll('.section-title');

  function onScrollLinked() {
    var scrollY = window.scrollY;
    var winH = window.innerHeight;

    if (heroSection) {
      var heroRect = heroSection.getBoundingClientRect();
      if (heroRect.bottom > 0) {
        var progress = Math.min(Math.max(scrollY / (winH * 0.6), 0), 1);
        var fadeOut = 1 - progress;
        var scaleDown = 1 - progress * 0.12;
        var translateY = progress * -40;
        if (heroContent) {
          heroContent.style.transform = 'translateY(' + translateY + 'px) scale(' + scaleDown + ')';
          heroContent.style.opacity = fadeOut;
        }
        if (heroImageWrapper) {
          heroImageWrapper.style.transform = 'translateY(' + (translateY * 0.6) + 'px) scale(' + (1 - progress * 0.08) + ')';
          heroImageWrapper.style.opacity = fadeOut;
        }
      }
    }

    sectionTitles.forEach(function (title) {
      var rect = title.getBoundingClientRect();
      if (rect.top < winH && rect.bottom > 0) {
        var offset = (rect.top - winH / 2) * 0.04;
        title.style.transform = 'translateY(' + offset + 'px)';
      }
    });
  }
  window.addEventListener('scroll', throttle(onScrollLinked, 16));

  /* ===== MAGNETIC CURSOR INTERACTION ===== */
  var magneticEls = document.querySelectorAll('.magnetic-el, .btn-primary, .btn-outline, .social-link, .filter-btn');
  magneticEls.forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      var strength = 0.25;
      el.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
      el.style.transition = 'transform .15s ease-out';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transform = '';
      el.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
    });
  });

  /* ===== Button Ripple Effect on Click ===== */
  document.querySelectorAll('.btn, .btn-small, .filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  /* ===== Card 3D Tilt on Hover ===== */
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg) translateY(-5px)';
      card.style.transition = 'transform .1s ease-out';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1)';
    });
  });

  /* ===== SLOT MACHINE COUNTER for "7+ Years" ===== */
  var badgeEl = document.getElementById('badge-counter');
  if (badgeEl) {
    var targetNum = 7;
    var slotStarted = false;

    function buildSlotReel() {
      var numbers = [];
      for (var cycle = 0; cycle < 3; cycle++) {
        for (var n = 0; n <= 9; n++) numbers.push(n);
      }
      numbers.push(0, 1, 2, 3, 4, 5, 6, targetNum);
      return numbers;
    }

    function startSlotMachine() {
      if (slotStarted) return;
      slotStarted = true;
      var reel = buildSlotReel();
      var html = '<span class="slot-digit reel" style="display:inline-block">';
      reel.forEach(function (num) {
        html += '<span style="display:block;height:1.5rem;line-height:1.5rem">' + num + '</span>';
      });
      html += '</span>';
      badgeEl.innerHTML = html;
      setTimeout(function () {
        badgeEl.innerHTML = targetNum + '+';
      }, 2200);
    }

    var badgeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startSlotMachine();
          badgeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    badgeObserver.observe(badgeEl);
  }

  /* ===== FLOATING PARTICLES around Profile Image ===== */
  var particleContainer = document.getElementById('profile-particles');
  if (particleContainer) {
    var particleCount = 12;
    for (var p = 0; p < particleCount; p++) {
      var dot = document.createElement('div');
      dot.className = 'profile-particle';
      var size = 3 + Math.random() * 4;
      var radius = 170 + Math.random() * 30;
      var dur = 6 + Math.random() * 8;
      var delay = Math.random() * dur;
      var hue = Math.random() > 0.5 ? 'var(--accent-400)' : 'rgba(168,85,247,.8)';
      dot.style.cssText = 'width:' + size + 'px;height:' + size + 'px;top:50%;left:50%;margin-top:-' + (size / 2) + 'px;margin-left:-' + (size / 2) + 'px;background:' + hue + ';--radius:' + radius + 'px;--dur:' + dur + 's;--delay:-' + delay + 's;box-shadow:0 0 ' + (size * 2) + 'px ' + hue;
      particleContainer.appendChild(dot);
    }
  }

  /* ===== Particle Canvas Animation (background) ===== */
  var canvas = document.getElementById('particle-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var bgParticleCount = 45;
    var mouse = { x: null, y: null };

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function Particle() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.8 + 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.hue = Math.random() > 0.7 ? '168,85,247' : '56,178,172';
    }
    Particle.prototype.update = function () {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mouse.x !== null) {
        var dx = this.x - mouse.x;
        var dy = this.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          this.x += dx * 0.008;
          this.y += dy * 0.008;
        }
      }
    };
    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.hue + ',' + this.opacity + ')';
      ctx.fill();
    };

    for (var i = 0; i < bgParticleCount; i++) {
      particles.push(new Particle());
    }

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            var alpha = (1 - dist / 130) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(56,178,172,' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.update();
        p.draw();
      });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ===== HERO BLOB mouse interaction ===== */
  var blobContainers = document.querySelectorAll('.hero-blob-container');
  if (heroSection && blobContainers.length) {
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      blobContainers.forEach(function (blob, i) {
        var factor = (i === 0) ? 25 : -18;
        var baseTransform = i === 0 ? 'translate(-50%,-50%)' : 'translate(-30%,-60%)';
        blob.style.transform = baseTransform.replace(')', ' ' + (x * factor) + 'px, ' + (y * factor) + 'px)').replace('translate(', 'translate(calc(').replace(',', '), calc(').replace(')', '))');
        blob.style.transition = 'transform .3s ease-out';
      });
    });
    heroSection.addEventListener('mouseleave', function () {
      blobContainers.forEach(function (blob, i) {
        blob.style.transform = i === 0 ? 'translate(-50%,-50%)' : 'translate(-30%,-60%)';
        blob.style.transition = 'transform .8s cubic-bezier(.34,1.56,.64,1)';
      });
    });
  }

})();
