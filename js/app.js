/**
 * Apex Private Banking - Enterprise Web Client Logic
 * Strict Fintech Architecture - No Emojis, Pure Vector Icons
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalSheet = document.getElementById('modalSheet');
  const sheetTitle = document.getElementById('sheetTitle');
  const sheetBody = document.getElementById('sheetBody');
  const sheetCloseBtn = document.getElementById('sheetCloseBtn');
  const bankingToast = document.getElementById('bankingToast');
  const toastMessage = document.getElementById('toastMessage');

  const primaryBalanceDisplay = document.getElementById('primaryBalanceDisplay');
  const totalBalanceDisplay = document.getElementById('totalBalanceDisplay');
  const cardOptionsBtn = document.getElementById('cardOptionsBtn');
  const notificationsBtn = document.getElementById('notificationsBtn');
  const menuBtn = document.getElementById('menuBtn');
  const viewAllAccountsBtn = document.getElementById('viewAllAccountsBtn');

  // State
  let isBalanceMasked = false;
  const rawCheckingBalance = '$100,000<span class="cents">.00</span>';
  const rawTotalBalance = '$104,300<span class="cents">.00</span>';

  // --- Toast Notification Helper ---
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

  if (sheetCloseBtn) {
    sheetCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // --- Privacy / Balance Masking Toggle ---
  function toggleBalancePrivacy() {
    isBalanceMasked = !isBalanceMasked;
    if (isBalanceMasked) {
      primaryBalanceDisplay.innerHTML = '••••••••';
      totalBalanceDisplay.innerHTML = '••••••••';
      showToast('Account balances masked');
    } else {
      primaryBalanceDisplay.innerHTML = rawCheckingBalance;
      totalBalanceDisplay.innerHTML = rawTotalBalance;
      showToast('Account balances revealed');
    }
  }

  if (primaryBalanceDisplay) {
    primaryBalanceDisplay.addEventListener('click', toggleBalancePrivacy);
  }

  // --- Card Options Sheet ---
  if (cardOptionsBtn) {
    cardOptionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal('Checking Account (••••4829)', `
        <div class="banking-input-group">
          <label class="banking-label">Routing Number</label>
          <div class="banking-input" style="display:flex; justify-content:space-between; align-items:center;">
            <span>021000089</span>
            <span style="color:#38bdf8; font-size:12px; cursor:pointer;" id="copyRoutingBtn">COPY</span>
          </div>
        </div>
        <div class="banking-input-group">
          <label class="banking-label">Account Number</label>
          <div class="banking-input" style="display:flex; justify-content:space-between; align-items:center;">
            <span>9840284829</span>
            <span style="color:#38bdf8; font-size:12px; cursor:pointer;" id="copyAccountBtn">COPY</span>
          </div>
        </div>
        <div class="banking-input-group">
          <label class="banking-label">Account Type</label>
          <div class="banking-input">Commercial / Priority Checking</div>
        </div>
        <button class="sheet-action-submit" id="toggleMaskActionBtn">
          ${isBalanceMasked ? 'Reveal Balances' : 'Hide Balances'}
        </button>
      `);

      document.getElementById('copyRoutingBtn')?.addEventListener('click', () => {
        navigator.clipboard?.writeText('021000089');
        showToast('Routing number copied');
      });

      document.getElementById('copyAccountBtn')?.addEventListener('click', () => {
        navigator.clipboard?.writeText('9840284829');
        showToast('Account number copied');
      });

      document.getElementById('toggleMaskActionBtn')?.addEventListener('click', () => {
        toggleBalancePrivacy();
        closeModal();
      });
    });
  }

  // --- Quick Actions Handling ---
  const actionPills = document.querySelectorAll('.action-pill');
  actionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const action = pill.dataset.action;
      handleQuickAction(action);
    });
  });

  function handleQuickAction(action) {
    if (action === 'fastpay') {
      openModal('Send FastPay', `
        <form id="fastPayForm" onsubmit="event.preventDefault();">
          <div class="banking-input-group" style="margin-bottom:14px;">
            <label class="banking-label">Recipient Phone, Email or $Tag</label>
            <input type="text" class="banking-input" placeholder="e.g. sarah.jenkins@corp.com" required>
          </div>
          <div class="banking-input-group" style="margin-bottom:14px;">
            <label class="banking-label">Amount ($ USD)</label>
            <input type="number" step="0.01" min="1" max="10000" class="banking-input" placeholder="0.00" required>
          </div>
          <div class="banking-input-group" style="margin-bottom:20px;">
            <label class="banking-label">Memo (Optional)</label>
            <input type="text" class="banking-input" placeholder="Consulting invoice settlement">
          </div>
          <button type="submit" class="sheet-action-submit" id="submitFastPay">Authorize Transfer</button>
        </form>
      `);

      document.getElementById('fastPayForm')?.addEventListener('submit', () => {
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
            <button class="sheet-action-submit" id="fastPayAddCardBtn">Add a New Card</button>
          </div>
        `);

        document.getElementById('fastPayAddCardBtn')?.addEventListener('click', () => {
          closeModal();
          window.location.href = 'accounts.html';
        });
      });
    } else if (action === 'paybills') {
      openModal('Pay Bills', `
        <div style="text-align:center; padding:28px 0 20px 0;">
          <div style="font-size:28px; font-weight:700; color:#fff; letter-spacing:-0.5px;">Available Soon</div>
          <div style="font-size:13px; color:#9499a6; margin-top:8px; line-height:1.5;">Bill payment and vendor integrations will be available soon.</div>
        </div>
      `);
    } else if (action === 'deposit') {
      openModal('Deposit Funds', `
        <div style="text-align:center; padding:28px 0 20px 0;">
          <div style="font-size:28px; font-weight:700; color:#fff; letter-spacing:-0.5px;">Send us an email</div>
          <div style="font-size:13px; color:#9499a6; margin-top:8px; line-height:1.5;">To initiate a capital deposit or check processing, please send us an email.</div>
        </div>
      `);
    } else if (action === 'accounts') {
      openModal('Account Portfolio Summary', `
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:13px; color:#9499a6; line-height:1.6;">
            All accounts are held at Apex Private Bank NA, Member FDIC. High-yield accounts feature daily compound interest settlements.
          </div>
          <div class="banking-input-group">
            <label class="banking-label">Customer Relationship Tier</label>
            <div class="banking-input" style="color:#38bdf8; font-weight:600;">Private Wealth Preferred</div>
          </div>
          <div class="banking-input-group">
            <label class="banking-label">Primary Account Officer</label>
            <div class="banking-input">Marcus Vance · Apex Capital Private Desk</div>
          </div>
          <button class="sheet-action-submit" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Close</button>
        </div>
      `);
    }
  }

  // --- Dynamic Home Page Card Display (Add Card vs Confirmed Card) ---
  const STORAGE_KEY = 'spotify_apex_cards_v3';
  let savedCards = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) savedCards = JSON.parse(raw);
  } catch (e) {}

  const addCardRow = document.getElementById('addCardRow');
  if (addCardRow && savedCards && savedCards.length > 0) {
    // User has added a card: show the pending card with $10,000.00 balance
    const card = savedCards[0];
    const cardTitle = card.type === 'Credit' ? 'Platinum Card' : (card.type === 'Savings' ? 'Savings Vault Card' : 'Debit Card');
    const cardMasked = `••••${card.last4 || '4829'}`;
    const cardBal = '$10,000<span class="cents">.00</span>';

    addCardRow.innerHTML = `
      <div class="account-info">
        <span class="account-name" style="display:flex; align-items:center; gap:6px;">
          ${cardTitle}
          <span class="card-pending-badge">Pending</span>
        </span>
        <span class="account-masked-number">${cardMasked} · Verification Ongoing</span>
      </div>
      <span class="account-balance-val">${cardBal}</span>
    `;
  }

  // --- Account Cards Click Interaction ---
  const accountCards = document.querySelectorAll('.account-item-card');
  accountCards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.id === 'addCardRow') {
        window.location.href = 'accounts.html';
        return;
      }
      const type = card.dataset.account;
      const title = card.querySelector('.account-name')?.textContent || 'Account';
      const balance = card.querySelector('.account-balance-val')?.textContent || '$0.00';
      const number = card.querySelector('.account-masked-number')?.textContent || '••••';

      openModal(`${title} ${number}`, `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:#0e1015; border-radius:12px; padding:16px; border:1px solid rgba(255,255,255,0.06);">
            <div style="font-size:12px; color:#9499a6;">Current Ledger Balance</div>
            <div style="font-size:28px; font-weight:800; color:#fff; margin-top:4px;">${isBalanceMasked ? '••••••••' : balance}</div>
            <div style="font-size:12px; color:#10b981; margin-top:4px;">In Good Standing · Active</div>
          </div>

          <div style="font-size:14px; font-weight:600; color:#fff;">Recent Transactions</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; font-size:13px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <div>
                <div style="font-weight:600; color:#fff;">Spotify AB Treasury Wire</div>
                <div style="color:#606573; font-size:11px;">Nov 22 · Ref #SPOT-98214 · Direct Fedwire</div>
              </div>
              <span style="color:#10b981; font-weight:600;">+$100,000<span class="cents">.00</span></span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:13px; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <div>
                <div style="font-weight:600; color:#fff;">Spotify Capital Yield Allocation</div>
                <div style="color:#606573; font-size:11px;">Nov 20 · Treasury Sweep #SPOT-1102</div>
              </div>
              <span style="color:#10b981; font-weight:600;">+$4,300<span class="cents">.00</span></span>
            </div>
          </div>

          <button class="sheet-action-submit" onclick="document.getElementById('modalBackdrop').classList.remove('active');">
            Download Monthly Statement (PDF)
          </button>
        </div>
      `);
    });
  });

  // --- View All Accounts Button ---
  if (viewAllAccountsBtn) {
    viewAllAccountsBtn.addEventListener('click', () => {
      showToast('Opening Full Account Portfolio');
      handleQuickAction('accounts');
    });
  }

  // --- Tools & Services Click Interaction ---
  const toolTiles = document.querySelectorAll('.tool-tile');
  toolTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const tool = tile.dataset.tool;
      if (tool === 'credit-score') {
        openModal('Credit Score', `
          <div style="text-align:center; padding:28px 0 20px 0;">
            <div style="font-size:28px; font-weight:700; color:#fff; letter-spacing:-0.5px;">Available Soon</div>
            <div style="font-size:13px; color:#9499a6; margin-top:8px; line-height:1.5;">Credit bureau scoring and score updates will be available soon.</div>
          </div>
        `);
      } else if (tool === 'charts') {
        openModal('Monthly Spending Analytics', `
          <div style="font-size:13px; color:#9499a6; margin-bottom:14px;">Total outgoing expenditures this cycle: <strong>$3,420.80</strong></div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span>Business Operations</span>
                <span>$1,850.00 (54%)</span>
              </div>
              <div style="background:#222530; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#38bdf8; width:54%; height:100%;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span>Travel & Lodging</span>
                <span>$980.50 (28%)</span>
              </div>
              <div style="background:#222530; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#10b981; width:28%; height:100%;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                <span>Dining & Entertainment</span>
                <span>$590.30 (18%)</span>
              </div>
              <div style="background:#222530; height:6px; border-radius:3px; overflow:hidden;">
                <div style="background:#f59e0b; width:18%; height:100%;"></div>
              </div>
            </div>
          </div>
        `);
      } else if (tool === 'savings-cd') {
        openModal('Fixed Certificates of Deposit & Savings', `
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div class="account-item-card" style="padding:14px;">
              <div class="account-info">
                <span class="account-name">12-Month High-Yield CD</span>
                <span class="account-masked-number">Guaranteed Fixed Term</span>
              </div>
              <span style="font-weight:700; color:#10b981; font-size:15px;">5.10% APY</span>
            </div>
            <div class="account-item-card" style="padding:14px;">
              <div class="account-info">
                <span class="account-name">6-Month Treasury Sweep CD</span>
                <span class="account-masked-number">State Tax-Exempt</span>
              </div>
              <span style="font-weight:700; color:#10b981; font-size:15px;">4.95% APY</span>
            </div>
            <button class="sheet-action-submit" onclick="document.getElementById('modalBackdrop').classList.remove('active');">
              Open Fixed Term Certificate
            </button>
          </div>
        `);
      } else if (tool === 'view-all') {
        openModal('All Banking Tools & Services', `
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div class="account-item-card" style="padding:12px 14px;">Wire Transfers & International FX</div>
            <div class="account-item-card" style="padding:12px 14px;">Mortgage & Commercial Lending</div>
            <div class="account-item-card" style="padding:12px 14px;">Tax Documentation (1099-INT)</div>
            <div class="account-item-card" style="padding:12px 14px;">Automated Investment Sweeps</div>
            <div class="account-item-card" style="padding:12px 14px;">Security & Token Authentication</div>
          </div>
        `);
      }
    });
  });

  // --- Offers Section Click Interaction ---
  const offerCards = document.querySelectorAll('.offer-card');
  offerCards.forEach(card => {
    card.addEventListener('click', () => {
      const offerType = card.dataset.offer;
      if (offerType === 'savings') {
        openModal('High-Yield Wealth Account', `
          <div style="font-size:14px; color:#e5e7eb; line-height:1.6; margin-bottom:16px;">
            Elevate your liquid capital with 4.85% APY. Daily compounding interest, unlimited fee-free transfers, and seamless integration with your primary Checking ledger.
          </div>
          <button class="sheet-action-submit" id="enrollSavingsOffer">Open High-Yield Account</button>
        `);
        document.getElementById('enrollSavingsOffer')?.addEventListener('click', () => {
          closeModal();
          showToast('Account setup request sent to your relationship manager');
        });
      } else {
        openModal('Apex Platinum Preferred Card', `
          <div style="font-size:14px; color:#e5e7eb; line-height:1.6; margin-bottom:16px;">
            Engineered for global executives. Unlimited 2.0% cash back across all merchant categories, concierge desk support 24/7, and complimentary travel insurance.
          </div>
          <button class="sheet-action-submit" id="applyCardOffer">Submit Pre-Approved Application</button>
        `);
        document.getElementById('applyCardOffer')?.addEventListener('click', () => {
          closeModal();
          showToast('Application submitted under VIP expedited review');
        });
      }
    });
  });

  // --- Top Navigation Buttons ---
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      openModal('Security & System Menu', `
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div class="account-item-card" style="padding:12px 14px;">Client Profile: Ian Baehr</div>
          <div class="account-item-card" style="padding:12px 14px;">Security & Two-Factor Authentication</div>
          <div class="account-item-card" style="padding:12px 14px;">Direct Banker Communication</div>
          <div class="account-item-card" style="padding:12px 14px;">Regulatory Disclosures & Legal</div>
          <button class="sheet-action-submit" style="background:#ef4444; color:#fff; margin-top:8px;" onclick="location.reload();">
            Sign Out of Session
          </button>
        </div>
      `);
    });
  }

  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', () => {
      openModal('Bank Notifications', `
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div class="account-item-card" style="padding:12px 14px;">
            <div class="account-info">
              <span class="account-name">Scheduled Wire Confirmation</span>
              <span class="account-masked-number">Nov 22, 16:40 · Processed via Fedwire</span>
            </div>
          </div>
          <div class="account-item-card" style="padding:12px 14px;">
            <div class="account-info">
              <span class="account-name">Quarterly Interest Credited</span>
              <span class="account-masked-number">Nov 15, 00:00 · Credited to Savings ••••7731</span>
            </div>
          </div>
          <div class="account-item-card" style="padding:12px 14px;">
            <div class="account-info">
              <span class="account-name">New Device Authorization</span>
              <span class="account-masked-number">Nov 10, 09:12 · Authenticated successfully</span>
            </div>
          </div>
        </div>
      `);
    });
  }

  // --- Bottom Navigation Tab Switching ---
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const tab = item.dataset.tab;

      if (tab === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tab === 'accounts') {
        window.location.href = 'accounts.html';
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
