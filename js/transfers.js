/**
 * Apex Private Banking - Wire & Capital Transfer Controller
 * Pixel-Perfect match to Transfers Reference Screenshot
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const payFromCard = document.getElementById('payFromCard');
  const fromAccountText = document.getElementById('fromAccountText');
  const recipientNameInput = document.getElementById('recipientNameInput');
  const bankNameInput = document.getElementById('bankNameInput');
  const accountNumberInput = document.getElementById('accountNumberInput');
  const routingNumberInput = document.getElementById('routingNumberInput');
  const amountInput = document.getElementById('amountInput');
  const memoInput = document.getElementById('memoInput');
  const reviewPaymentBtn = document.getElementById('reviewPaymentBtn');

  const navHomeBtn = document.getElementById('navHomeBtn');
  const navAccountsBtn = document.getElementById('navAccountsBtn');
  const navPayBtn = document.getElementById('navPayBtn');

  const modalBackdrop = document.getElementById('modalBackdrop');
  const sheetTitle = document.getElementById('sheetTitle');
  const sheetBody = document.getElementById('sheetBody');
  const sheetCloseBtn = document.getElementById('sheetCloseBtn');
  const bankingToast = document.getElementById('bankingToast');
  const toastMessage = document.getElementById('toastMessage');

  // State
  let selectedSourceAccount = null;

  // Available user accounts
  const sourceAccounts = [
    {
      id: 'checking',
      name: 'Checking',
      masked: '••••4829',
      balance: '$100,000.00'
    },
    {
      id: 'savings',
      name: 'Savings',
      masked: '••••7731',
      balance: '$4,300.00'
    }
  ];

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

  // --- Pay From: Select Account Dropdown Sheet ---
  if (payFromCard) {
    payFromCard.addEventListener('click', () => {
      openModal('Select Originating Account', `
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${sourceAccounts.map(acc => `
            <div class="account-item-card select-source-row" data-account-id="${acc.id}" style="padding:16px 18px; cursor:pointer;">
              <div class="account-info">
                <span class="account-name">${acc.name}</span>
                <span class="account-masked-number">${acc.masked}</span>
              </div>
              <span class="account-balance-val">${acc.balance}</span>
            </div>
          `).join('')}
        </div>
      `);

      const rows = document.querySelectorAll('.select-source-row');
      rows.forEach(r => {
        r.addEventListener('click', () => {
          const accId = r.dataset.accountId;
          const chosen = sourceAccounts.find(a => a.id === accId);
          if (chosen) {
            selectedSourceAccount = chosen;
            fromAccountText.innerHTML = `
              <span>${chosen.name} ${chosen.masked}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px; stroke:#ffffff; stroke-width:2.2;">
                <polyline points="7 15 12 20 17 15"></polyline>
                <polyline points="7 9 12 4 17 9"></polyline>
              </svg>
            `;
            closeModal();
            showToast(`Debiting from ${chosen.name}`);
          }
        });
      });
    });
  }

  // --- Amount Input Formatting Helper ---
  if (amountInput) {
    amountInput.addEventListener('focus', () => {
      if (!amountInput.value) {
        amountInput.value = '$ ';
      }
    });

    amountInput.addEventListener('blur', () => {
      if (amountInput.value === '$ ' || amountInput.value === '$') {
        amountInput.value = '';
      }
    });
  }

  // --- Form Validation (Only Clickable When Details Filled) ---
  function checkFormValidity() {
    const hasRecipient = recipientNameInput.value.trim().length > 0;
    const hasBank = bankNameInput.value.trim().length > 0;
    const hasAccount = accountNumberInput.value.trim().length > 0;
    const hasRouting = routingNumberInput.value.trim().length > 0;
    const amountClean = amountInput.value.replace(/[^0-9.]/g, '').trim();
    const hasAmount = amountClean.length > 0 && parseFloat(amountClean) > 0;

    const isValid = hasRecipient && hasBank && hasAccount && hasRouting && hasAmount;

    if (isValid) {
      reviewPaymentBtn.classList.remove('disabled');
      reviewPaymentBtn.removeAttribute('disabled');
    } else {
      reviewPaymentBtn.classList.add('disabled');
      reviewPaymentBtn.setAttribute('disabled', 'true');
    }
  }

  // Attach live validation listeners to all inputs
  [recipientNameInput, bankNameInput, accountNumberInput, routingNumberInput, amountInput].forEach(inp => {
    if (inp) {
      inp.addEventListener('input', checkFormValidity);
      inp.addEventListener('change', checkFormValidity);
      inp.addEventListener('keyup', checkFormValidity);
    }
  });

  // Run initial check on load
  checkFormValidity();

  // --- Review Payment Action ---
  if (reviewPaymentBtn) {
    reviewPaymentBtn.addEventListener('click', () => {
      const source = selectedSourceAccount || sourceAccounts[0];
      const recipient = recipientNameInput.value.trim();
      const bank = bankNameInput.value.trim();
      const accountNum = accountNumberInput.value.trim();
      const routingNum = routingNumberInput.value.trim();
      const amountVal = amountInput.value.trim().replace(/[^0-9.]/g, '');
      const memoVal = memoInput.value.trim() || 'Wire transfer settlement';

      const numParsed = parseFloat(amountVal);
      const formattedAmount = isNaN(numParsed) ? `$0.00` : `$${numParsed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      openModal('Review Wire Payment', `
        <div style="display:flex; flex-direction:column; gap:14px;">
          
          <div style="background:#0e1015; border-radius:14px; padding:16px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:12px; color:#9499a6;">Wire Transfer Amount</div>
            <div style="font-size:32px; font-weight:800; color:#fff; margin-top:2px;">${formattedAmount}</div>
            <div style="font-size:12px; color:#10b981; margin-top:4px;">Federal Clearing Route: Fedwire Direct Real-Time</div>
          </div>

          <div class="banking-input-group">
            <label class="banking-label">Debiting Account</label>
            <div class="banking-input">${source.name} (${source.masked}) - Available ${source.balance}</div>
          </div>

          <div class="banking-input-group">
            <label class="banking-label">Beneficiary Recipient</label>
            <div class="banking-input">${recipient}</div>
          </div>

          <div class="banking-input-group">
            <label class="banking-label">Beneficiary Bank & ABA</label>
            <div class="banking-input">${bank} · ABA ${routingNum}</div>
          </div>

          <div class="banking-input-group">
            <label class="banking-label">Beneficiary Account</label>
            <div class="banking-input">${accountNum}</div>
          </div>

          <div class="banking-input-group">
            <label class="banking-label">Transfer Memo</label>
            <div class="banking-input">${memoVal}</div>
          </div>

          <button class="sheet-action-submit" id="confirmWireExecutionBtn" style="margin-top:8px;">
            Authorize Immediate Wire Transfer (${formattedAmount})
          </button>
        </div>
      `);

      document.getElementById('confirmWireExecutionBtn')?.addEventListener('click', () => {
        // Show Failed Notice: User must add a card
        openModal('Transfer Status', `
          <div style="text-align:center; padding:12px 0 16px 0;">
            <div style="width:54px; height:54px; border-radius:50%; background:rgba(239, 68, 68, 0.16); color:#ef4444; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <div style="font-size:24px; font-weight:800; color:#ef4444; letter-spacing:-0.5px; margin-bottom:8px;">Transfer Failed</div>
            <div style="font-size:14px; color:#e5e7eb; line-height:1.55; max-width:320px; margin:0 auto 20px auto;">
              You cannot complete this transfer without adding a card. Please add a new card to your account to verify your identity and authorization.
            </div>
            <button class="sheet-action-submit" id="failedAddCardBtn">Add a New Card</button>
          </div>
        `);

        document.getElementById('failedAddCardBtn')?.addEventListener('click', () => {
          closeModal();
          window.location.href = 'accounts.html';
        });
      });
    });
  }

  // --- Bottom Navigation Interactions ---
  if (navHomeBtn) {
    navHomeBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  if (navAccountsBtn) {
    navAccountsBtn.addEventListener('click', () => {
      window.location.href = 'accounts.html';
    });
  }

  if (navPayBtn) {
    navPayBtn.addEventListener('click', () => {
      openModal('Pay & Merchant Services', `
        <div style="text-align:center; padding:28px 0 20px 0;">
          <div style="font-size:28px; font-weight:700; color:#fff; letter-spacing:-0.5px;">Available Soon</div>
          <div style="font-size:13px; color:#9499a6; margin-top:8px; line-height:1.5;">Direct merchant settlements and automated bill payments will be available soon.</div>
        </div>
      `);
    });
  }
});
