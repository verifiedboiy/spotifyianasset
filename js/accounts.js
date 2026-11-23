/**
 * Apex Private Banking - Accounts & Card Management System
 * Initial "Add a New Card" state -> Hyper-realistic physical card generation
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const cardTrack = document.getElementById('cardTrack');
  const carouselDotsContainer = document.getElementById('carouselDots');
  const createCardBtn = document.getElementById('createCardBtn');
  const navHomeBtn = document.getElementById('navHomeBtn');

  const modalBackdrop = document.getElementById('modalBackdrop');
  const sheetTitle = document.getElementById('sheetTitle');
  const sheetBody = document.getElementById('sheetBody');
  const sheetCloseBtn = document.getElementById('sheetCloseBtn');
  const bankingToast = document.getElementById('bankingToast');
  const toastMessage = document.getElementById('toastMessage');

  // State Management with LocalStorage persistence
  const STORAGE_KEY = 'spotify_apex_cards_v3';
  let activeIndex = 0;
  let isCardRevealed = false;

  function loadSavedCards() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading cards from storage', e);
    }
    return []; // Initially empty: user must add a new card!
  }

  function saveCards(cards) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Error saving cards to storage', e);
    }
  }

  let userCards = loadSavedCards();

  // --- Toast Helper ---
  function showToast(message) {
    if (!bankingToast || !toastMessage) return;
    toastMessage.textContent = message;
    bankingToast.classList.add('show');
    setTimeout(() => {
      bankingToast.classList.remove('show');
    }, 2800);
  }

  // --- Modal Helpers ---
  function openModal(title, contentHtml) {
    sheetTitle.textContent = title;
    sheetBody.innerHTML = contentHtml;
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (sheetCloseBtn) sheetCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // --- Card Carousel / Add Card Slot Renderer ---
  function renderCarousel() {
    cardTrack.innerHTML = '';
    carouselDotsContainer.innerHTML = '';

    // If no card has been added yet: Show the "Add a new card" slot
    if (userCards.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.className = 'add-card-placeholder';
      placeholder.id = 'addCardPlaceholder';
      placeholder.innerHTML = `
        <div class="add-card-icon-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <div class="add-card-title">Add a New Card</div>
        <div class="add-card-subtitle">Tap here to issue your primary Debit, Platinum Credit, or Savings Card.</div>
      `;
      placeholder.addEventListener('click', openCreateCardModal);
      cardTrack.appendChild(placeholder);

      // Hide or keep dots subtle
      carouselDotsContainer.style.display = 'none';
      return;
    }

    // Cards exist: Show hyper-realistic cards
    carouselDotsContainer.style.display = 'flex';

    userCards.forEach((card, idx) => {
      const cardEl = document.createElement('article');
      cardEl.className = `physical-card ${card.theme}`;
      cardEl.innerHTML = `
        <!-- Top Row: Classical Bank Pediment Logo & Spotify Partner Badge -->
        <div class="card-header-row">
          <div class="bank-logo-icon" style="display:flex; align-items:center; gap:8px;" aria-label="Apex and Spotify Emblem">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v2h20V7L12 2zM4 11v8h2.5v-8H4zm5 0v8h2.5v-8H9zm5 0v8h2.5v-8H14zm5 0v8h2.5v-8H19zM2 21v2h20v-2H2z"/>
            </svg>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#1ed760">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <div class="card-type-badge">${card.type}</div>
            <div class="card-pending-badge">Card Pending</div>
          </div>
        </div>

        <!-- Realistic Golden EMV Security Microchip -->
        <div class="realistic-emv-chip" aria-hidden="true">
          <svg viewBox="0 0 44 33" fill="none">
            <defs>
              <linearGradient id="emvGrad-${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fef08a" />
                <stop offset="35%" stop-color="#eab308" />
                <stop offset="70%" stop-color="#ca8a04" />
                <stop offset="100%" stop-color="#854d0e" />
              </linearGradient>
            </defs>
            <rect width="44" height="33" rx="4" fill="url(#emvGrad-${idx})" />
            <!-- Trace Lines -->
            <path d="M0 16.5h44" stroke="#713f12" stroke-width="0.8" opacity="0.6"/>
            <path d="M14 0v33" stroke="#713f12" stroke-width="0.8" opacity="0.6"/>
            <path d="M30 0v33" stroke="#713f12" stroke-width="0.8" opacity="0.6"/>
            <rect x="14" y="9" width="16" height="15" rx="3" stroke="#713f12" stroke-width="0.8" fill="none" opacity="0.7"/>
          </svg>
        </div>

        <!-- Card Number Row with Eye Toggle -->
        <div class="card-digits-row">
          <div class="digits-mask-group">
            ${isCardRevealed
          ? `<span>${card.fullDigits}</span>`
          : `<span>••••</span><span>••••</span><span>••••</span><span>${card.last4}</span>`
        }
          </div>
          <button class="eye-toggle-btn" data-card-idx="${idx}" aria-label="Toggle card number visibility" title="Toggle visibility">
            ${isCardRevealed ? `
              <svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ` : `
              <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            `}
          </button>
        </div>

        <!-- Card Metadata Bottom Row -->
        <div class="card-meta-bottom">
          <div class="meta-group">
            <span class="meta-label">CARD HOLDER</span>
            <span class="meta-val">${card.holder}</span>
          </div>
          <div class="meta-group" style="text-align: right;">
            <span class="meta-label">EXPIRES</span>
            <span class="meta-val">${card.exp}</span>
          </div>
        </div>
      `;
      cardTrack.appendChild(cardEl);

      // Pagination Dot
      const dot = document.createElement('span');
      dot.className = `carousel-dot ${idx === activeIndex ? 'active' : ''}`;
      dot.dataset.index = idx;
      dot.addEventListener('click', () => switchCard(idx));
      carouselDotsContainer.appendChild(dot);
    });

    // Eye toggle event listeners
    const eyeBtns = cardTrack.querySelectorAll('.eye-toggle-btn');
    eyeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCardReveal();
      });
    });

    updateCarouselPosition();
  }

  function updateCarouselPosition() {
    if (userCards.length === 0) {
      cardTrack.style.transform = 'none';
      return;
    }
    cardTrack.style.transform = `translateX(-${activeIndex * 100}%)`;
    const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  function switchCard(index) {
    if (index >= 0 && index < userCards.length) {
      activeIndex = index;
      updateCarouselPosition();
    }
  }

  function toggleCardReveal() {
    isCardRevealed = !isCardRevealed;
    renderCarousel();
    showToast(isCardRevealed ? 'Card numbers unmasked' : 'Card numbers masked');
  }

  // --- Initial Render ---
  renderCarousel();

  // --- Create / Add New Card Workflow ---
  function openCreateCardModal() {
    openModal('Add a New Card', `
      <form id="createCardForm" onsubmit="event.preventDefault();">
        <div class="banking-input-group" style="margin-bottom:14px;">
          <label class="banking-label">Select Card Type</label>
          <select class="banking-input" id="newCardTypeSelect" style="background:#0d0e12; color:#fff;" required>
            <option value="Debit" data-theme="debit-blue" data-exp="11/29" data-last4="4829">Debit Card (Linked to Checking ••••4829)</option>
            <option value="Credit" data-theme="credit-platinum" data-exp="09/28" data-last4="9012">Platinum Credit Card ($15,000 Limit)</option>
            <option value="Savings" data-theme="savings-green" data-exp="04/30" data-last4="7731">Savings Reserve Vault Card (••••7731)</option>
          </select>
        </div>

        <div class="banking-input-group" style="margin-bottom:14px;">
          <label class="banking-label">Cardholder Name</label>
          <input type="text" class="banking-input" id="newCardHolderName" value="IAN" required readonly>
        </div>

        <div class="banking-input-group" style="margin-bottom:14px;">
          <label class="banking-label">Card Color / Theme</label>
          <select class="banking-input" id="newCardThemeSelect" style="background:#0d0e12; color:#fff;">
            <option value="debit-blue">Cobalt Royal Blue (Sapphire Debit)</option>
            <option value="credit-platinum">Platinum Slate (Brushed Titanium)</option>
            <option value="savings-green">Emerald Green (Private Wealth)</option>
          </select>
        </div>

        <div class="banking-input-group" style="margin-bottom:20px;">
          <label class="banking-label">Set 4-Digit Security PIN</label>
          <input type="password" maxlength="4" pattern="[0-9]{4}" class="banking-input" placeholder="••••" required value="4920">
        </div>

        <button type="submit" class="sheet-action-submit" id="submitCreateCard">Create & Issue Card</button>
      </form>
    `);

    // Dynamic theme auto-select based on card type
    const typeSelect = document.getElementById('newCardTypeSelect');
    const themeSelect = document.getElementById('newCardThemeSelect');
    if (typeSelect && themeSelect) {
      typeSelect.addEventListener('change', () => {
        const selOption = typeSelect.options[typeSelect.selectedIndex];
        const recommendedTheme = selOption.dataset.theme;
        if (recommendedTheme) {
          themeSelect.value = recommendedTheme;
        }
      });
    }

    document.getElementById('createCardForm')?.addEventListener('submit', () => {
      const selOption = typeSelect.options[typeSelect.selectedIndex];
      const cardType = selOption.value; // 'Debit', 'Credit', or 'Savings'
      const theme = themeSelect.value;
      const holder = 'IAN';
      const last4 = selOption.dataset.last4 || '4829';
      const exp = selOption.dataset.exp || '11/29';

      // Open Fee Confirmation Step ($208.00)
      openModal('Card Activation Fee', `
        <div style="text-align:center; padding:8px 0 16px 0;">
          <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px; color:#f59e0b;">Activation Payment Required</div>
          <div style="font-size:38px; font-weight:800; color:#ffffff; letter-spacing:-1.2px; margin:6px 0 2px 0;">$208.00</div>
          <div style="font-size:13px; color:#9499a6;">Settlement Account: Checking (••••4829)</div>
        </div>

        <div class="account-item-card" style="padding:14px; margin-bottom:14px;">
          <div class="account-info">
            <span class="account-name">${cardType} Card Provisioning</span>
            <span class="account-masked-number">Cardholder: ${holder} · Hardware Chip Clearance</span>
          </div>
          <span style="font-size:16px; font-weight:700; color:#fff;">$208.00</span>
        </div>

        <button class="sheet-action-submit" id="confirmAndPayFeeBtn">Authorize Fee & Mint Card ($208.00)</button>

        <p style="font-size:9.5px; color:#606573; line-height:1.45; text-align:center; margin-top:12px; padding:0 6px;">
          A mandatory one-time clearinghouse fee of $208.00 is required for encrypted EMV biometric microchip provisioning, private institutional keypair generation, and federal ledger registration prior to card issuance.
        </p>
      `);

      document.getElementById('confirmAndPayFeeBtn')?.addEventListener('click', () => {
        // Step 2: Show clear explanation of why email authorization is required before opening mail
        openModal('Fee Settlement Instructions', `
          <div style="text-align:center; padding:12px 0 16px 0;">
            <div style="width:52px; height:52px; border-radius:50%; background:rgba(30, 215, 96, 0.16); color:#1ed760; display:flex; align-items:center; justify-content:center; margin:0 auto 14px auto;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div style="font-size:20px; font-weight:800; color:#fff; letter-spacing:-0.4px; margin-bottom:8px;">Why Email Authorization is Required</div>
            <div style="font-size:13.5px; color:#9499a6; line-height:1.6; max-width:320px; margin:0 auto 16px auto;">
              To comply with Spotify Private Wealth treasury protocols, the mandatory card issuance fee of <strong style="color:#fff;">$208.00</strong> must be cleared through our private operations desk.
              <br><br>
              You will now proceed to your email client to send your fee settlement request to <span style="color:#1ed760; font-weight:600;">spotify.ianbaehr@gmail.com</span>. The desk will provide you with verified payment options.
            </div>
            <button class="sheet-action-submit" id="proceedToEmailBtn">Proceed to Email</button>
          </div>
        `);

        document.getElementById('proceedToEmailBtn')?.addEventListener('click', () => {
          const fullDigits = `${last4}  ${Math.floor(1000 + Math.random() * 9000)}  ${Math.floor(1000 + Math.random() * 9000)}  ${last4}`;

          const newCard = {
            id: `card-${Date.now()}`,
            type: cardType,
            theme: theme,
            status: 'Pending',
            balance: '$10,000.00',
            masked: ['••••', '••••', '••••', last4],
            fullDigits: fullDigits,
            last4: last4,
            holder: holder,
            exp: exp,
            cvv: Math.floor(100 + Math.random() * 900).toString()
          };

          userCards.push(newCard);
          saveCards(userCards);
          activeIndex = userCards.length - 1;
          renderCarousel();
          closeModal();

          // Launch email prompt to spotify.ianbaehr@gmail.com with exact fee text
          const emailRecipient = 'spotify.ianbaehr@gmail.com';
          const emailSubject = encodeURIComponent(`Card Issuance Fee Payment - $208.00`);
          const emailBody = encodeURIComponent(`I would like to pay the fee of $208.00 for the card. Please provide me with options on how to make payment for the fee.`);
          const mailtoUrl = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;

          showToast('Card created with Pending status. Directing to email.');
          setTimeout(() => {
            window.location.href = mailtoUrl;
          }, 600);
        });
      });
    });
  }

  if (createCardBtn) {
    createCardBtn.addEventListener('click', openCreateCardModal);
  }

  // --- Account Rows Click (Checking, Platinum Card, Savings) ---
  const accountRows = document.querySelectorAll('.account-detail-row');
  accountRows.forEach(row => {
    row.addEventListener('click', () => {
      const account = row.dataset.account;
      const title = row.querySelector('.detail-title')?.textContent || 'Account';
      const masked = row.querySelector('.detail-masked-num')?.textContent || '••••';

      // Check if user has already added the card corresponding to this account
      const hasCard = userCards.some(c => {
        if (account === 'checking' && c.type === 'Debit') return true;
        if (account === 'platinum' && c.type === 'Credit') return true;
        if (account === 'savings' && c.type === 'Savings') return true;
        return false;
      });

      if (!hasCard) {
        openModal(`Add ${title}`, `
          <div style="font-size:14px; color:#e5e7eb; line-height:1.6; margin-bottom:16px;">
            No physical or digital card is currently active for <strong>${title} (${masked})</strong>. You can issue one now.
          </div>
          <button class="sheet-action-submit" id="issueNowFromRowBtn">Add ${title} Now</button>
        `);
        document.getElementById('issueNowFromRowBtn')?.addEventListener('click', () => {
          closeModal();
          openCreateCardModal();
        });
        return;
      }

      // Normal Statement Details Modal
      openModal(`${title} ${masked}`, `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:#0e1015; border-radius:14px; padding:16px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:12px; color:#9499a6;">Account Relationship</div>
            <div style="font-size:16px; font-weight:700; color:#fff; margin-top:2px;">Spotify Co-Branded ${title}</div>
            <div style="font-size:12px; color:#10b981; margin-top:4px;">In Good Standing · Active Card Linked</div>
          </div>

          <div style="font-size:14px; font-weight:600; color:#fff;">Recent Inbound Transactions</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; font-size:13px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <div>
                <div style="font-weight:600; color:#fff;">Spotify AB Treasury Wire</div>
                <div style="color:#606573; font-size:11px;">Nov 22 · Ref #SPOT-98214 · Direct Fedwire</div>
              </div>
              <span style="color:#10b981; font-weight:600;">+$100,000.00</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <div>
                <div style="font-weight:600; color:#fff;">Spotify Capital Yield Allocation</div>
                <div style="color:#606573; font-size:11px;">Nov 20 · Treasury Sweep #SPOT-1102</div>
              </div>
              <span style="color:#10b981; font-weight:600;">+$4,300.00</span>
            </div>
          </div>

          <div class="banking-input-group">
            <label class="banking-label">Routing Transit Number</label>
            <div class="banking-input">021000089 (Apex Private Federal Wire)</div>
          </div>
          <button class="sheet-action-submit" onclick="document.getElementById('modalBackdrop').classList.remove('active');">
            Download November Statement (PDF)
          </button>
        </div>
      `);
    });
  });

  // --- Bottom Navigation Interactions ---
  if (navHomeBtn) {
    navHomeBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
  bottomNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      if (tab === 'home') {
        window.location.href = 'index.html';
      } else if (tab === 'transfers') {
        window.location.href = 'transfers.html';
      } else if (tab === 'pay') {
        openModal('Pay & Merchant Services', `
          <div style="text-align:center; padding:28px 0 20px 0;">
            <div style="font-size:28px; font-weight:700; color:#fff; letter-spacing:-0.5px;">Available Soon</div>
            <div style="font-size:13px; color:#9499a6; margin-top:8px; line-height:1.5;">Direct merchant settlements and automated bill payments will be available soon.</div>
          </div>
        `);
      }
    });
  });
});
