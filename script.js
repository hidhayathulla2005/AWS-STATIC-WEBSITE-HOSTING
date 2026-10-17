document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollSpy();
  initDestinationFilters();
  initPackageFilters();
  initSaveButtons();
  initPackageEnquiryButtons();
  initGalleryLightbox();
  initContactForm();
  initScrollReveal();
  initDynamicYear();
});

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navAnchors = document.querySelectorAll('.nav-links a');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    const isCurrentlyOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    const nextState = !isCurrentlyOpen;

    menuToggle.setAttribute('aria-expanded', String(nextState));
    menuToggle.setAttribute('aria-label', nextState ? 'Close menu' : 'Open menu');
    menuToggle.textContent = nextState ? '×' : '☰';
    navLinks.classList.toggle('open', nextState);
  });

  navAnchors.forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
      menuToggle.textContent = '☰';
    });
  });
}

function initScrollSpy() {
  if (!('IntersectionObserver' in window)) return;

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links > a[href^="#"]');

  const observerOptions = {
    root: null,
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${currentId}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    navObserver.observe(section);
  });
}

function initDestinationFilters() {
  const filterButtons = document.querySelectorAll('[data-destination-filter]');
  const destinationCards = document.querySelectorAll('.dest-card');
  const emptyStateNotice = document.getElementById('destinationEmpty');

  if (!filterButtons.length || !destinationCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedCategory = button.getAttribute('data-destination-filter');

      filterButtons.forEach((btn) => {
        btn.classList.toggle('active', btn === button);
      });

      let visibleCount = 0;

      destinationCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const matchesCategory = selectedCategory === 'All' || cardCategory === selectedCategory;

        card.hidden = !matchesCategory;
        if (matchesCategory) {
          visibleCount++;
        }
      });

      if (emptyStateNotice) {
        emptyStateNotice.hidden = visibleCount > 0;
      }
    });
  });
}

function initPackageFilters() {
  const packageSelect = document.getElementById('packageFilter');
  const packageCards = document.querySelectorAll('.package-card');

  if (!packageSelect || !packageCards.length) return;

  packageSelect.addEventListener('change', (event) => {
    const selectedType = event.target.value;

    packageCards.forEach((card) => {
      const cardType = card.getAttribute('data-package-type');
      const isVisible = selectedType === 'All' || cardType === selectedType;
      card.hidden = !isVisible;
    });
  });
}

function initSaveButtons() {
  const saveButtons = document.querySelectorAll('.save-btn');
  const toastElement = document.getElementById('toast');
  let toastTimer = null;

  function showToastMessage(message) {
    if (!toastElement) return;

    toastElement.textContent = message;
    toastElement.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastElement.classList.remove('show');
    }, 2800);
  }

  saveButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const isCurrentlySaved = button.classList.contains('saved');
      const nextSavedState = !isCurrentlySaved;

      button.classList.toggle('saved', nextSavedState);
      button.textContent = nextSavedState ? '♥' : '♡';
      button.setAttribute('aria-pressed', String(nextSavedState));

      const feedback = nextSavedState
        ? 'Package saved to your wishlist.'
        : 'Package removed from saved items.';
      showToastMessage(feedback);
    });
  });
}

function initPackageEnquiryButtons() {
  const enquiryButtons = document.querySelectorAll('[data-book]');
  const destinationSelect = document.getElementById('destination');
  const messageInput = document.getElementById('message');
  const contactSection = document.getElementById('contact');
  const nameInput = document.getElementById('name');

  if (!enquiryButtons.length) return;

  const knownDestinations = ['Ooty', 'Goa', 'Manali', 'Kerala', 'Jaipur', 'Bali'];

  enquiryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const packageName = button.getAttribute('data-book');

      if (destinationSelect) {
        const matched = knownDestinations.find((place) =>
          packageName.toLowerCase().includes(place.toLowerCase())
        );
        if (matched) {
          destinationSelect.value = matched;
        }
      }

      if (messageInput) {
        messageInput.value = `I'm interested in the "${packageName}" package. Please share itinerary details and seasonal availability.`;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      if (nameInput) {
        nameInput.focus({ preventScroll: true });
      }
    });
  });
}

function initGalleryLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightboxModal = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeButton = document.getElementById('lightboxClose');
  const prevButton = document.getElementById('lightboxPrev');
  const nextButton = document.getElementById('lightboxNext');

  if (!lightboxModal || !galleryItems.length) return;

  let activePhotoIndex = 0;

  function displayPhoto(index) {
    activePhotoIndex = (index + galleryItems.length) % galleryItems.length;
    const currentItem = galleryItems[activePhotoIndex];

    const fullSrc = currentItem.getAttribute('data-full');
    const thumbImg = currentItem.querySelector('img');
    const labelSpan = currentItem.querySelector('span');

    lightboxImage.src = fullSrc;
    lightboxImage.alt = thumbImg ? thumbImg.alt : 'Travel preview image';
    lightboxCaption.textContent = labelSpan ? labelSpan.textContent : '';
  }

  function openLightbox(index) {
    displayPhoto(index);
    lightboxModal.classList.add('open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeLightbox() {
    lightboxModal.classList.remove('open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (closeButton) closeButton.addEventListener('click', closeLightbox);
  if (prevButton) prevButton.addEventListener('click', () => displayPhoto(activePhotoIndex - 1));
  if (nextButton) nextButton.addEventListener('click', () => displayPhoto(activePhotoIndex + 1));

  lightboxModal.addEventListener('click', (event) => {
    if (event.target === lightboxModal) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightboxModal.classList.contains('open')) return;

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      displayPhoto(activePhotoIndex - 1);
    } else if (event.key === 'ArrowRight') {
      displayPhoto(activePhotoIndex + 1);
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusMessage = document.getElementById('formStatus');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const destSelect = document.getElementById('destination');
  const msgTextarea = document.getElementById('message');

  if (!form) return;

  const formFields = [nameInput, emailInput, destSelect, msgTextarea].filter(Boolean);

  function validateField(field) {
    const value = field.value.trim();
    let isValid = value.length > 0;

    if (field.id === 'name') {
      isValid = value.length >= 2;
    } else if (field.id === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailPattern.test(value);
    } else if (field.id === 'destination') {
      isValid = value.length > 0;
    } else if (field.id === 'message') {
      isValid = value.length >= 10;
    }

    field.classList.toggle('invalid', !isValid);
    field.setAttribute('aria-invalid', String(!isValid));
    return isValid;
  }

  formFields.forEach((field) => {
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) {
        validateField(field);
      }
      if (statusMessage) {
        statusMessage.textContent = '';
        statusMessage.classList.remove('error');
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const validationResults = formFields.map(validateField);
    const hasErrors = validationResults.some((result) => !result);

    if (hasErrors) {
      const firstInvalidIndex = validationResults.indexOf(false);
      if (statusMessage) {
        statusMessage.textContent = 'Please fill out all required fields correctly.';
        statusMessage.classList.add('error');
      }
      if (formFields[firstInvalidIndex]) {
        formFields[firstInvalidIndex].focus();
      }
      return;
    }

    const senderName = nameInput ? nameInput.value.trim() : 'Traveler';
    if (statusMessage) {
      statusMessage.classList.remove('error');
      statusMessage.textContent = `Thank you, ${senderName}! Your enquiry has been received. Our team will contact you shortly.`;
    }

    form.reset();

    formFields.forEach((field) => {
      field.classList.remove('invalid');
      field.removeAttribute('aria-invalid');
    });
  });
}

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add('visible');
    });
  }
}

function initDynamicYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
