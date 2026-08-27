// Pronto Code Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // Tab Switcher Functionality with Smooth Sliding Pill Indicator
  const tabMenus = document.querySelectorAll('.tabs-menu, .w-tab-menu');

  function updateTabIndicator(menu, activeLink, animate = true) {
    if (!menu || !activeLink) return;
    let indicator = menu.querySelector('.tab-sliding-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'tab-sliding-indicator';
      menu.prepend(indicator);
    }

    const leftOffset = activeLink.offsetLeft;
    const width = activeLink.offsetWidth;

    if (animate) {
      indicator.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1), width 0.35s cubic-bezier(0.2, 0.9, 0.3, 1)';
    } else {
      indicator.style.transition = 'none';
    }
    indicator.style.transform = `translateX(${leftOffset}px)`;
    indicator.style.width = `${width}px`;
  }

  tabMenus.forEach(menu => {
    const links = menu.querySelectorAll('.feature-tab-link, .tab-link, .w-tab-link');
    let activeLink = menu.querySelector('.feature-tab-link.w--current, .feature-tab-link.active, .w-tab-link.w--current') || links[0];
    
    if (activeLink) {
      setTimeout(() => updateTabIndicator(menu, activeLink, false), 50);
    }

    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute('data-tab');
        const tabParentSection = link.closest('.tabs, .w-tabs') || document;
        const sectionLinks = tabParentSection.querySelectorAll('.feature-tab-link, .tab-link, .w-tab-link');
        const sectionPanes = tabParentSection.querySelectorAll('.tab-pane, .w-tab-pane');

        sectionLinks.forEach(l => {
          l.classList.remove('active', 'w--current');
        });
        sectionPanes.forEach(p => {
          p.classList.remove('active');
          p.style.display = 'none';
        });

        link.classList.add('active', 'w--current');
        updateTabIndicator(menu, link, true);
        
        let activePane = null;
        if (targetTab) {
          activePane = tabParentSection.querySelector('#' + targetTab);
        }
        
        if (!activePane && link.getAttribute('data-w-tab')) {
          const wTab = link.getAttribute('data-w-tab');
          if (wTab === 'Tab 1') activePane = tabParentSection.querySelector('#tab-reporting');
          if (wTab === 'Tab 2') activePane = tabParentSection.querySelector('#tab-operations');
          if (wTab === 'Tab 3') activePane = tabParentSection.querySelector('#tab-proposals');
          if (wTab === 'Tab 4') activePane = tabParentSection.querySelector('#tab-crm');
        }

        if (activePane) {
          activePane.classList.add('active');
          activePane.style.display = activePane.classList.contains('client-builds-card') ? 'grid' : 'block';
        }
      });
    });
  });

  window.addEventListener('resize', () => {
    tabMenus.forEach(menu => {
      const activeLink = menu.querySelector('.feature-tab-link.w--current, .feature-tab-link.active, .w-tab-link.w--current');
      if (activeLink) {
        updateTabIndicator(menu, activeLink, false);
      }
    });
  });

  // Modal Booking Popup
  const modal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Counter Number Animation
  const animateCounter = (el, target, duration = 2000) => {
    let start = 0;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start);
      }
    }, stepTime);
  };

  const counterEls = document.querySelectorAll('[data-counter], [counter-element="number"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-counter') || entry.target.textContent, 10);
        if (!isNaN(target)) {
          animateCounter(entry.target, target);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => observer.observe(el));

  // Contact Form Submission Mock
  const contactForms = document.querySelectorAll('form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
      const originalText = submitBtn ? (submitBtn.value || submitBtn.textContent) : '';
      
      if (submitBtn) {
        if (submitBtn.tagName === 'INPUT') submitBtn.value = 'Sending...';
        else submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        alert('Thank you! Your message has been received by Pronto Code. We will be in touch shortly.');
        form.reset();
        if (submitBtn) {
          if (submitBtn.tagName === 'INPUT') submitBtn.value = originalText;
          else submitBtn.textContent = originalText;
        }
      }, 1000);
    });
  });

  // ==========================================
  // Interactive Slide Toggle Buttons (Hero & Footer)
  // ==========================================
  const slideToggles = document.querySelectorAll('.slide-toggle-btn');
  slideToggles.forEach(slideToggle => {
    const track = slideToggle.querySelector('.slide-toggle-track');
    const handle = slideToggle.querySelector('.slide-toggle-handle');
    const targetSelector = slideToggle.getAttribute('data-target') || '#learn-more';
    if (!track || !handle) return;

    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let maxSlide = 0;

    function calcMaxSlide() {
      maxSlide = Math.max(0, track.clientWidth - handle.offsetWidth - 8);
    }
    calcMaxSlide();
    window.addEventListener('resize', calcMaxSlide);

    function setHandleX(x, animate = false) {
      if (animate) {
        handle.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)';
      } else {
        handle.style.transition = 'none';
      }
      handle.style.transform = `translateX(${x}px)`;
    }

    function triggerSlideAction() {
      calcMaxSlide();
      setHandleX(maxSlide, true);
      setTimeout(() => {
        if (targetSelector.startsWith('#')) {
          const targetEl = document.querySelector(targetSelector);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.location.href = targetSelector;
        }
        setTimeout(() => {
          setHandleX(0, true);
        }, 800);
      }, 150);
    }

    handle.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      currentX = 0;
      handle.setPointerCapture(e.pointerId);
      calcMaxSlide();
      e.preventDefault();
    });

    handle.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      currentX = Math.max(0, Math.min(deltaX, maxSlide));
      setHandleX(currentX, false);
    });

    function handlePointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      if (currentX >= maxSlide * 0.35) {
        triggerSlideAction();
      } else if (currentX <= 4) {
        triggerSlideAction();
      } else {
        setHandleX(0, true);
      }
    }

    handle.addEventListener('pointerup', handlePointerUp);
    handle.addEventListener('pointercancel', handlePointerUp);

    track.addEventListener('click', (e) => {
      if (!isDragging) {
        triggerSlideAction();
      }
    });
  });

  // ==========================================
  // Interactive 3D Dotted Spinning Globe (Desktop)
  // ==========================================
  initInteractiveGlobe();
});

function initInteractiveGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const container = canvas.parentElement;
  if (!container) return;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
  camera.position.z = 520;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);

  const globeGroup = new THREE.Group();
  // Tilt globe slightly for dynamic perspective
  globeGroup.rotation.x = 0.25;
  globeGroup.rotation.z = -0.05;
  scene.add(globeGroup);

  // Helper: Create circular dot sprite texture
  function createCircleTexture() {
    const size = 64;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }
  const dotTexture = createCircleTexture();

  // Hub marker coordinates
  const radius = 175;
  function latLonToVector3(lat, lon, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(r * Math.sin(phi) * Math.cos(theta));
    const z = r * Math.sin(phi) * Math.sin(theta);
    const y = r * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  // Load Dot Points
  fetch('globe-dots.json')
    .then(res => res.json())
    .then(data => {
      const scaleFactor = radius / 200;
      const allLand = data.land || data;

      const blackCoords = [];
      const yellowCoords = [];

      // Partition dots into solid black continent structure + vibrant yellow accent dots
      allLand.forEach((pt, i) => {
        const x = pt[0] * scaleFactor;
        const y = pt[1] * scaleFactor;
        const z = pt[2] * scaleFactor;

        // ~18% of land dots are vibrant yellow accents
        if (i % 5 === 0 || (i % 7 === 0)) {
          yellowCoords.push(x, y, z);
        } else {
          blackCoords.push(x, y, z);
        }
      });

      // 1. Black Land Points
      const landGeo = new THREE.BufferGeometry();
      landGeo.setAttribute('position', new THREE.Float32BufferAttribute(blackCoords, 3));
      const landMat = new THREE.PointsMaterial({
        color: 0x111111,
        size: 3.2,
        map: dotTexture,
        transparent: true,
        opacity: 0.95,
        depthWrite: false
      });
      const landPoints = new THREE.Points(landGeo, landMat);
      globeGroup.add(landPoints);

      // 2. Vibrant Yellow Accent Land Points
      const yellowGeo = new THREE.BufferGeometry();
      yellowGeo.setAttribute('position', new THREE.Float32BufferAttribute(yellowCoords, 3));
      const yellowMat = new THREE.PointsMaterial({
        color: 0xFBC112,
        size: 4.2,
        map: dotTexture,
        transparent: true,
        opacity: 1.0,
        depthWrite: false
      });
      const yellowPoints = new THREE.Points(yellowGeo, yellowMat);
      globeGroup.add(yellowPoints);

      // 3. Major Global Client Hubs (Glowing Yellow Nodes)
      const hubs = [
        { name: 'New York', lat: 40.7128, lon: -74.0060 },
        { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
        { name: 'London', lat: 51.5074, lon: -0.1278 },
        { name: 'Paris', lat: 48.8566, lon: 2.3522 },
        { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
        { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
        { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
        { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
        { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
        { name: 'Cape Town', lat: -33.9249, lon: 18.4241 },
        { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
        { name: 'Seoul', lat: 37.5665, lon: 126.9780 },
        { name: 'Zurich', lat: 47.3769, lon: 8.5417 },
        { name: 'Austin', lat: 30.2672, lon: -97.7431 },
        { name: 'Stockholm', lat: 59.3293, lon: 18.0686 },
        { name: 'Melbourne', lat: -37.8136, lon: 144.9631 }
      ];

      const hubCoords = [];
      hubs.forEach(h => {
        const v = latLonToVector3(h.lat, h.lon, radius * 1.015);
        hubCoords.push(v.x, v.y, v.z);
      });

      const hubGeo = new THREE.BufferGeometry();
      hubGeo.setAttribute('position', new THREE.Float32BufferAttribute(hubCoords, 3));
      const hubMat = new THREE.PointsMaterial({
        color: 0xFBC112,
        size: 8.0,
        map: dotTexture,
        transparent: true,
        opacity: 1.0,
        depthWrite: false
      });
      const hubPoints = new THREE.Points(hubGeo, hubMat);
      globeGroup.add(hubPoints);

      // 4. Sparse Ocean Matrix Dots
      if (data.ocean && data.ocean.length > 0) {
        const oceanGeo = new THREE.BufferGeometry();
        const oceanCoords = [];
        data.ocean.forEach(pt => {
          oceanCoords.push(pt[0] * scaleFactor, pt[1] * scaleFactor, pt[2] * scaleFactor);
        });
        oceanGeo.setAttribute('position', new THREE.Float32BufferAttribute(oceanCoords, 3));

        const oceanMat = new THREE.PointsMaterial({
          color: 0x888888,
          size: 1.8,
          map: dotTexture,
          transparent: true,
          opacity: 0.18,
          depthWrite: false
        });
        const oceanPoints = new THREE.Points(oceanGeo, oceanMat);
        globeGroup.add(oceanPoints);
      }
    })
    .catch(err => {
      console.warn('Could not load globe dots:', err);
    });

  // Drag & Spin Physics
  let isPointerDown = false;
  let prevPointerX = 0;
  let prevPointerY = 0;
  let velocityX = 0.0025;
  let velocityY = 0;
  const damping = 0.94;

  canvas.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isPointerDown) return;
    const deltaX = e.clientX - prevPointerX;
    const deltaY = e.clientY - prevPointerY;
    prevPointerX = e.clientX;
    prevPointerY = e.clientY;

    globeGroup.rotation.y += deltaX * 0.006;
    globeGroup.rotation.x += deltaY * 0.006;
    // Clamp x rotation so globe doesn't flip
    globeGroup.rotation.x = Math.max(-0.8, Math.min(0.8, globeGroup.rotation.x));

    velocityX = deltaX * 0.005;
    velocityY = deltaY * 0.005;
  });

  function stopDrag(e) {
    if (isPointerDown) {
      isPointerDown = false;
    }
  }
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);

  // Resize Handler
  function onResize() {
    if (!container || !canvas) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  // Performance Observer (Run ONLY when in viewport)
  let isVisible = true;
  let animationFrameId = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationFrameId) {
        animate();
      }
    });
  }, { threshold: 0.05 });

  observer.observe(container);

  // Animation Loop
  function animate() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }
    animationFrameId = requestAnimationFrame(animate);

    if (!isPointerDown) {
      // Gentle natural auto-spin + momentum damping
      velocityX = velocityX * damping + 0.0022 * (1 - damping);
      velocityY = velocityY * damping;
      globeGroup.rotation.y += velocityX;
      globeGroup.rotation.x += velocityY;
      globeGroup.rotation.x = Math.max(-0.8, Math.min(0.8, globeGroup.rotation.x));
    }

    renderer.render(scene, camera);
  }

  animate();
}

// Contact Form AJAX Submission (Direct to malique@prontocode.net without leaving the site)
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success-msg');
  const submitBtn = document.getElementById('submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');
  const resetBtn = document.getElementById('form-reset-btn');

  if (contactForm && !contactForm.dataset.formInitialized) {
    contactForm.dataset.formInitialized = 'true';
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name')?.value || '';
      const email = document.getElementById('form-email')?.value || '';
      const agency = document.getElementById('form-agency')?.value || '';
      const message = document.getElementById('form-message')?.value || '';

      if (submitBtnText) submitBtnText.textContent = 'Sending...';
      if (submitBtn) submitBtn.disabled = true;

      const payload = {
        name: name,
        email: email,
        agency: agency,
        message: message,
        _subject: `New Inquiry from ${name} (${agency || 'Website'})`,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        const response = await fetch('https://formsubmit.co/ajax/malique@prontocode.net', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          contactForm.style.display = 'none';
          if (successMsg) successMsg.style.display = 'block';
          contactForm.reset();
        } else {
          window.location.href = `mailto:malique@prontocode.net?subject=${encodeURIComponent(payload._subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nAgency: ${agency}\n\nMessage:\n${message}`)}`;
          contactForm.style.display = 'none';
          if (successMsg) successMsg.style.display = 'block';
        }
      } catch (err) {
        window.location.href = `mailto:malique@prontocode.net?subject=${encodeURIComponent(payload._subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nAgency: ${agency}\n\nMessage:\n${message}`)}`;
        contactForm.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';
      } finally {
        if (submitBtnText) submitBtnText.textContent = 'Send Message';
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  if (resetBtn && contactForm && successMsg && !resetBtn.dataset.resetInitialized) {
    resetBtn.dataset.resetInitialized = 'true';
    resetBtn.addEventListener('click', () => {
      successMsg.style.display = 'none';
      contactForm.style.display = 'block';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

// Mobile Navigation Menu Toggle Handler
function initMobileMenu() {
  const navButtons = document.querySelectorAll('.w-nav-button');
  const navMenus = document.querySelectorAll('.w-nav-menu');

  navButtons.forEach((navButton) => {
    if (navButton.dataset.menuInitialized) return;
    navButton.dataset.menuInitialized = 'true';

    navButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const navbar = navButton.closest('.navbar') || document.querySelector('.navbar');
      const navMenu = navbar ? navbar.querySelector('.w-nav-menu') : document.querySelector('.w-nav-menu');

      if (!navMenu) return;

      const isOpen = navButton.classList.contains('w--open');

      if (isOpen) {
        navButton.classList.remove('w--open');
        navMenu.classList.remove('w--open');
        navMenu.removeAttribute('data-nav-menu-open');
        document.body.classList.remove('menu-open');
      } else {
        navButton.classList.add('w--open');
        navMenu.classList.add('w--open');
        navMenu.setAttribute('data-nav-menu-open', '');
        document.body.classList.add('menu-open');
      }
    });
  });

  // Close menu when clicking on any nav link or CTA inside menu
  document.querySelectorAll('.w-nav-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      navButtons.forEach(btn => btn.classList.remove('w--open'));
      navMenus.forEach(menu => {
        menu.classList.remove('w--open');
        menu.removeAttribute('data-nav-menu-open');
      });
      document.body.classList.remove('menu-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
      navButtons.forEach(btn => btn.classList.remove('w--open'));
      navMenus.forEach(menu => {
        menu.classList.remove('w--open');
        menu.removeAttribute('data-nav-menu-open');
      });
      document.body.classList.remove('menu-open');
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navButtons.forEach(btn => btn.classList.remove('w--open'));
      navMenus.forEach(menu => {
        menu.classList.remove('w--open');
        menu.removeAttribute('data-nav-menu-open');
      });
      document.body.classList.remove('menu-open');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileMenu);
} else {
  initMobileMenu();
}




