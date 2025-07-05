// Elements
const openBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelModalBtn');
const form = document.getElementById('characterForm');
const charactersList = document.getElementById('charactersList');

let lastFocusedElement = null;
let characters = [];

// Open modal function
function openModal() {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  requestAnimationFrame(() => {
    modal.classList.add('show');
  });
  modal.setAttribute('aria-hidden', 'false');
  openBtn.setAttribute('aria-expanded', 'true');

  // Reset form on open
  form.reset();
  form.charClass.selectedIndex = 0;

  // Focus the first input for accessibility
  form.charName.focus();

  // Add keyboard trap and ESC listener
  document.addEventListener('keydown', trapTabKey);
  document.addEventListener('keydown', onEscPress);
}

// Close modal function
function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  openBtn.setAttribute('aria-expanded', 'false');
  modal.addEventListener('transitionend', onTransitionEnd);
  document.removeEventListener('keydown', trapTabKey);
  document.removeEventListener('keydown', onEscPress);

  // Return focus
  if (lastFocusedElement) lastFocusedElement.focus();
}

// After fade-out hide modal
function onTransitionEnd(event) {
  if (event.propertyName === 'opacity' && !modal.classList.contains('show')) {
    modal.hidden = true;
    modal.removeEventListener('transitionend', onTransitionEnd);
  }
}

// Trap tab inside modal
function trapTabKey(e) {
  if (e.key !== 'Tab') return;

  const focusableElements = modal.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstElem = focusableElements[0];
  const lastElem = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElem) {
      e.preventDefault();
      lastElem.focus();
    }
  } else {
    if (document.activeElement === lastElem) {
      e.preventDefault();
      firstElem.focus();
    }
  }
}

// ESC key closes modal
function onEscPress(e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    closeModal();
  }
}

// Add character to list and update UI
function addCharacter(character) {
  characters.push(character);
  renderCharacters();
}

// Render character cards or no characters message
function renderCharacters() {
  if (characters.length === 0) {
    charactersList.innerHTML = `<p>No characters yet. Create one!</p>`;
    return;
  }

  charactersList.innerHTML = characters.map((char, idx) => `
    <article class="character-card" tabindex="0" aria-label="Character ${char.name}, class ${char.class}, level ${char.level}">
      <strong>${char.name}</strong> — <em>${char.class}</em> (Level ${char.level})
      ${char.background ? `<p>${char.background}</p>` : ''}
    </article>
  `).join('');
}

// Handle form submission
form.addEventListener('submit', e => {
  e.preventDefault();

  const character = {
    name: form.charName.value.trim(),
    class: form.charClass.value,
    level: form.charLevel.value,
    background: form.charBackground.value.trim(),
  };

  addCharacter(character);
  closeModal();
});

// Event listeners for modal open/close
openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal on clicking outside modal content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Prevent modal content clicks from closing modal
modal.querySelector('.modal-content').addEventListener('click', e => {
  e.stopPropagation();
});
