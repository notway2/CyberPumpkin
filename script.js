// Get elements
const openBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelModalBtn');
const confirmBtn = document.getElementById('confirmModalBtn');

let lastFocusedElement = null;

// Function to open modal
function openModal() {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  // Small timeout to trigger transition
  requestAnimationFrame(() => {
    modal.classList.add('show');
  });
  modal.setAttribute('aria-hidden', 'false');
  openBtn.setAttribute('aria-expanded', 'true');

  // Focus modal content for accessibility
  modal.querySelector('.modal-content').focus();

  // Trap focus inside modal
  document.addEventListener('keydown', trapTabKey);
  // Close modal on ESC key
  document.addEventListener('keydown', onEscPress);
}

// Function to close modal
function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  openBtn.setAttribute('aria-expanded', 'false');
  // Wait for transition to finish then hide
  modal.addEventListener('transitionend', onTransitionEnd);
  // Remove event listeners
  document.removeEventListener('keydown', trapTabKey);
  document.removeEventListener('keydown', onEscPress);

  // Return focus to last focused element
  if (lastFocusedElement) lastFocusedElement.focus();
}

// Hide modal after fade-out transition
function onTransitionEnd(event) {
  if (event.propertyName === 'opacity' && !modal.classList.contains('show')) {
    modal.hidden = true;
    modal.removeEventListener('transitionend', onTransitionEnd);
  }
}

// Trap tab key inside modal for accessibility
function trapTabKey(e) {
  if (e.key !== 'Tab') return;

  const focusableElements = modal.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstElem = focusableElements[0];
  const lastElem = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElem) {
      e.preventDefault();
      lastElem.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElem) {
      e.preventDefault();
      firstElem.focus();
    }
  }
}

// Close modal on ESC key press
function onEscPress(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeModal();
  }
}

// Click handlers
openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Clicking outside modal-content closes modal
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Prevent clicks inside modal content from bubbling to modal overlay
modal.querySelector('.modal-content').addEventListener('click', (e) => {
  e.stopPropagation();
});
