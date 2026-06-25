(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    selectedService: null,
    quotation: null,
    booking: null,
    bookingId: null,
    paymentMethod: null,
    tracking: null,
    hero: { index: 0, timer: null, autoMs: 5200 }
  };

  const SERVICES = [
    {
      id: 'home-cleaning',
      name: 'Home Cleaning',
      glyph: '🧼',
      category: 'Cleaning',
      startingPrice: 299,
      duration: '2 hours',
      desc: 'Professional cleaning for a fresh home.',
      features: ['Kitchen & living cleaning', 'Sanitization included', 'Basic stain removal']
    },
    {
      id: 'deep-cleaning',
      name: 'Deep Cleaning',
      glyph: '🧽',
      category: 'Cleaning',
      startingPrice: 499,
      duration: '4 hours',
      desc: 'Thorough cleaning for deeper freshness.',
      features: ['Deep scrubbing', 'Bathroom + kitchen deep clean', 'Premium disinfectants']
    },
    {
      id: 'sofa-cleaning',
      name: 'Sofa Cleaning',
      glyph: '🛋️',
      category: 'Cleaning',
      startingPrice: 499,
      duration: '2-3 hours',
      desc: 'Remove dust, stains, and odors from sofas.',
      features: ['Steam & stain treatment', 'Fabric-safe methods', 'Drying assistance']
    },
    {
      id: 'bathroom-cleaning',
      name: 'Bathroom Cleaning',
      glyph: '🚿',
      category: 'Cleaning',
      startingPrice: 399,
      duration: '2 hours',
      desc: 'Sparkling clean with hygiene-focused sanitization.',
      features: ['Soap scum removal', 'Tile & sink cleaning', 'Odor control']
    },
    {
      id: 'kitchen-cleaning',
      name: 'Kitchen Cleaning',
      glyph: '🍳',
      category: 'Cleaning',
      startingPrice: 499,
      duration: '2-3 hours',
      desc: 'Kitchen deep clean for grease-free surfaces.',
      features: ['Grease removal', 'Counter & cabinet cleaning', 'Hygiene check']
    },
    {
      id: 'plumbing',
      name: 'Plumbing',
      glyph: '🚰',
      category: 'Maintenance',
      startingPrice: 199,
      duration: '1-2 hours',
      desc: 'Fix leaks, clogs, and plumbing issues quickly.',
      features: ['Leak inspection', 'Basic repairs', 'Water flow check']
    },
    {
      id: 'electrical',
      name: 'Electrical',
      glyph: '💡',
      category: 'Maintenance',
      startingPrice: 249,
      duration: '1-2 hours',
      desc: 'Wiring, fittings, and electrical assistance.',
      features: ['Safety check', 'Switch & socket help', 'Basic troubleshooting']
    },
    {
      id: 'painting',
      name: 'Painting',
      glyph: '🎨',
      category: 'Maintenance',
      startingPrice: 349,
      duration: '3-4 hours',
      desc: 'Fresh paint for rooms and interiors.',
      features: ['Surface prep', 'Primer included', 'Clean finish']
    },
    {
      id: 'carpentry',
      name: 'Carpentry',
      glyph: '🪚',
      category: 'Maintenance',
      startingPrice: 299,
      duration: '2-3 hours',
      desc: 'Repairs and small carpentry tasks with precision.',
      features: ['Door/hinge adjustments', 'Furniture fixes', 'Finishing touch-up']
    },
    {
      id: 'appliance-repair',
      name: 'Appliance Repair',
      glyph: '🧰',
      category: 'Repair',
      startingPrice: 349,
      duration: '1-3 hours',
      desc: 'Quick diagnosis and repair for home appliances.',
      features: ['Troubleshooting', 'Replacement check', 'Function testing']
    },
    {
      id: 'pest-control',
      name: 'Pest Control',
      glyph: '🪲',
      category: 'Repair',
      startingPrice: 499,
      duration: '2-4 hours',
      desc: 'Safe treatment for pest-free living.',
      features: ['Targeted treatment', 'Preventive guidance', 'Safety compliance']
    }
  ];

  const CATEGORIES = [
    'Home Cleaning',
    'Deep Cleaning',
    'Sofa Cleaning',
    'Bathroom Cleaning',
    'Kitchen Cleaning',
    'Plumbing',
    'Electrical',
    'Painting',
    'Carpentry',
    'Appliance Repair',
    'Pest Control'
  ];

  const POPULAR = ['Sofa Cleaning', 'Home Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning'];

  const PAYMENT_METHODS = [
    { id: 'upi', name: 'UPI', glyph: '📱' },
    { id: 'gpay', name: 'Google Pay', glyph: 'G' },
    { id: 'phonepe', name: 'PhonePe', glyph: 'P' },
    { id: 'paytm', name: 'Paytm', glyph: '⚡' },
    { id: 'debit', name: 'Debit Card', glyph: '💳' },
    { id: 'credit', name: 'Credit Card', glyph: '💳' },
    { id: 'netbanking', name: 'Net Banking', glyph: '🏦' }
  ];

  const REVIEWS = [
    { name: 'Anita S.', rating: 5, text: 'Professional arrived on time and cleaning quality was excellent. Highly recommended!' },
    { name: 'Vikram K.', rating: 4, text: 'Good service experience. Pricing was transparent and booking was smooth.' },
    { name: 'Meera P.', rating: 5, text: 'Deep cleaning made our home feel brand new. Friendly and skilled team.' },
    { name: 'Rahul T.', rating: 4, text: 'Sofa cleaning removed stains effectively. Great care taken with fabric.' },
    { name: 'Sonal R.', rating: 5, text: 'Bathroom cleaning was spotless. Support team was helpful throughout.' }
  ];

  const LOCATIONS = ['Bangalore', 'Hyderabad', 'Chennai', 'Delhi', 'Mumbai', 'Pune'];

  const formatINR = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function openModal(modalEl) {
    modalEl.hidden = false;
    modalEl.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalEl) {
    modalEl.hidden = true;
    modalEl.classList.remove('show');
    document.body.style.overflow = '';
  }

  function toast(message) {
    let el = $('#toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add('toast-show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('toast-show'), 2000);
  }

  // Toast styles (quick inject so we don't touch CSS file further)
  const style = document.createElement('style');
  style.textContent = `
    .toast{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:#0f172a;color:#fff;padding:10px 14px;border-radius:14px;box-shadow:0 16px 40px rgba(0,0,0,.25);opacity:0;pointer-events:none;transition:opacity .2s, transform .2s;z-index:5000}
    .toast.toast-show{opacity:1;transform:translateX(-50%) translateY(-4px)}
  `;
  document.head.appendChild(style);

  function renderCategories() {
    const grid = $('#categoriesGrid');
    grid.innerHTML = '';

    CATEGORIES.forEach((name) => {
      const svc = SERVICES.find((s) => s.name === name);
      if (!svc) return;

      const card = document.createElement('div');
      card.className = 'card cat-card';
      card.setAttribute('role', 'listitem');
      card.tabIndex = 0;
      card.setAttribute('aria-label', `${name} starting price ${formatINR(svc.startingPrice)}`);

      card.innerHTML = `
        <div class="cat-top">
          <div class="cat-icon" aria-hidden="true">${svc.glyph}</div>
          <div class="cat-price">Starting at ${formatINR(svc.startingPrice)}</div>
        </div>
        <div class="cat-img" aria-hidden="true">
          <div style="font-weight:900;color:#0f172a;position:relative;z-index:2;">${svc.category}</div>
        </div>
        <div class="cat-name">${svc.name}</div>
      `;

      const openDetails = () => openServiceModal(svc);
      card.addEventListener('click', openDetails);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetails();
        }
      });

      grid.appendChild(card);
    });
  }

  function renderPopular() {
    const grid = $('#popularGrid');
    grid.innerHTML = '';

    const popularCards = POPULAR.map((name) => SERVICES.find((s) => s.name === name)).filter(Boolean);
    const ratingMap = {
      'Sofa Cleaning': 4.7,
      'Home Cleaning': 4.5,
      'Bathroom Cleaning': 4.6,
      'Kitchen Cleaning': 4.6
    };

    popularCards.forEach((svc) => {
      const card = document.createElement('div');
      card.className = 'card service-card';
      card.setAttribute('role', 'listitem');

      const r = ratingMap[svc.name] ?? 4.6;

      card.innerHTML = `
        <div class="service-img" aria-hidden="true">
          <div class="tag">Top Rated</div>
          <div class="glyph">${svc.glyph}</div>
        </div>
        <div class="service-meta">
          <div class="rating-row">
            <span>${svc.name}</span>
            <span class="stars" aria-hidden="true">★★★★★</span>
          </div>
          <div class="price-row">
            <span class="start">From</span>
            <span class="amt">${formatINR(svc.startingPrice)}</span>
          </div>
        </div>
        <div class="btn-row">
          <button class="secondary" type="button" data-view-details>View Details</button>
          <button class="primary" type="button" data-book-now>Book Now</button>
        </div>
      `;

      card.querySelector('[data-view-details]').addEventListener('click', () => openServiceModal(svc));
      card.querySelector('[data-book-now]').addEventListener('click', () => {
        setSelectedService(svc);
        jumpTo('#bookings');
      });

      grid.appendChild(card);
    });
  }

  function openServiceModal(svc) {
    state.selectedService = svc;

    const modal = $('#serviceModal');
    $('#serviceModalTitle').textContent = svc.name;
    $('#serviceModalPrice').textContent = formatINR(svc.startingPrice);
    $('#serviceModalDuration').textContent = `Duration: ${svc.duration}`;
    $('#serviceModalDesc').textContent = svc.desc;

    const features = $('#serviceModalFeatures');
    features.innerHTML = '';
    svc.features.forEach((f) => {
      const li = document.createElement('li');
      li.textContent = f;
      features.appendChild(li);
    });

    const media = $('#serviceModalImage');
    media.innerHTML = `
      <div class="glyph" style="font-size:84px;display:flex;align-items:center;justify-content:center;width:100%;height:100%">${svc.glyph}</div>
    `;

    openModal(modal);
  }

  function setupServiceModal() {
    const modal = $('#serviceModal');
    const closeBtn = $('#serviceModalClose');
    const cancelBtn = $('#serviceModalCancel');
    const bookBtn = $('#serviceModalBook');

    closeBtn.addEventListener('click', () => closeModal(modal));
    cancelBtn.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    bookBtn.addEventListener('click', () => {
      if (!state.selectedService) return;
      setSelectedService(state.selectedService);
      closeModal(modal);
      jumpTo('#bookings');
      toast('Service selected. Fill booking details to continue.');
    });

    document.addEventListener('keydown', (e) => {
      const open = !modal.hidden;
      if (open && e.key === 'Escape') closeModal(modal);
    });
  }

  function setSelectedService(svc) {
    state.selectedService = svc;

    $('#selectedServiceName').textContent = svc.name;
    $('#selectedServicePrice').textContent = formatINR(svc.startingPrice);
    $('#selectedServiceDuration').textContent = `Duration: ${svc.duration}`;
    $('#selectedServiceDesc').textContent = svc.desc;

    const featuresWrap = $('#selectedServiceFeatures');
    featuresWrap.innerHTML = '';
    const shown = svc.features.slice(0, 4);
    const items = [
      { a: 'Features', b: shown[0] ?? '' },
      { a: 'Included', b: shown[1] ?? '' },
      { a: 'Method', b: shown[2] ?? '' },
      { a: 'Quality', b: shown[3] ?? '' }
    ];
    items.forEach((kv) => {
      const el = document.createElement('div');
      el.className = 'kv';
      el.innerHTML = `<strong>${kv.a}</strong><span>${kv.b}</span>`;
      featuresWrap.appendChild(el);
    });

    $('#bookingSubtitle').textContent = `${svc.name} selected. Choose date and time to continue.`;
    $('#viewQuotationBtn').disabled = true;
    $('#viewQuotationBtn').setAttribute('aria-disabled', 'true');
  }

  function setupBookingForm() {
    const form = $('#bookingForm');
    const date = $('#datePicker');
    const minDate = new Date();
    minDate.setDate(minDate.getDate());

    // Set minimum date to tomorrow-ish to avoid past bookings in demo
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = minDate.getFullYear();
    const mm = pad(minDate.getMonth() + 1);
    const dd = pad(minDate.getDate());
    const min = `${yyyy}-${mm}-${dd}`;
    date.min = min;

    // Default selection
    if (!state.selectedService) {
      const def = SERVICES.find((s) => s.id === 'home-cleaning') || SERVICES[0];
      setSelectedService(def);
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const errors = validateBooking(form);
      if (Object.keys(errors).length) {
        toast('Please fix the highlighted fields.');
        return;
      }

      state.booking = getBookingFromForm(form);
      generateQuotation();
      goToPayment();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    $('#backToFormBtn').addEventListener('click', () => {
      goToForm();
      window.scrollTo({ top: $('#bookings').offsetTop - 70, behavior: 'smooth' });
    });

    $('#changeServiceBtn').addEventListener('click', () => {
      jumpTo('#categories');
      toast('Select a service card to update your booking details.');
    });

    $('#viewQuotationBtn').addEventListener('click', () => {
      if (!state.quotation) return;
      goToPayment();
    });

    // Quick booking open from hero
    $$('[data-open-quick-book]').forEach((btn) => {
      btn.addEventListener('click', () => {
        jumpTo('#popular');
        toast('Pick a popular service, or view categories for more options.');
      });
    });

    // Jump links
    $$('[data-jump-to]').forEach((el) => {
      el.addEventListener('click', () => jumpTo(el.getAttribute('data-jump-to')));
    });

    // Validation clear on input
    ['fullName', 'mobileNumber', 'address', 'datePicker', 'timeSlot'].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('input', () => {
        setError(id, '');
      });
    });
  }

  function validateBooking(form) {
    const get = (id) => document.getElementById(id);
    const errors = {};

    const fullName = get('fullName').value.trim();
    if (fullName.length < 2) errors.fullName = 'Please enter your full name.';

    const mobileNumber = get('mobileNumber').value.trim();
    if (!/^[0-9]{10}$/.test(mobileNumber)) errors.mobileNumber = 'Enter a valid 10-digit mobile number.';

    const address = get('address').value.trim();
    if (address.length < 10) errors.address = 'Please enter a complete address (min 10 characters).';

    const datePicker = get('datePicker').value;
    if (!datePicker) errors.datePicker = 'Please select a date.';

    const timeSlot = get('timeSlot').value;
    if (!timeSlot) errors.timeSlot = 'Please choose a time slot.';

    // Show errors
    Object.keys(errors).forEach((field) => setError(field, errors[field]));
    // Clear errors for other fields
    ['fullName', 'mobileNumber', 'address', 'datePicker', 'timeSlot'].forEach((field) => {
      if (!errors[field]) setError(field, '');
    });

    return errors;
  }

  function setError(field, msg) {
    const el = document.querySelector(`[data-error-for="${field}"]`);
    if (!el) return;
    el.textContent = msg || '';
  }

  function getBookingFromForm(form) {
    const data = new FormData(form);
    return {
      fullName: String(data.get('fullName') || '').trim(),
      mobileNumber: String(data.get('mobileNumber') || '').trim(),
      address: String(data.get('address') || '').trim(),
      serviceType: String(data.get('serviceType') || ''),
      date: String(data.get('datePicker') || ''),
      timeSlot: String(data.get('timeSlot') || ''),
      instructions: String(data.get('instructions') || '').trim(),
      selectedServiceId: state.selectedService?.id || null,
      selectedServiceName: state.selectedService?.name || null,
      selectedServiceStartPrice: state.selectedService?.startingPrice || 0
    };
  }

  function computeQuote(baseCost) {
    // Simple demo pricing model
    const gstRate = 0.18;
    const platformFeeRate = 0.06;
    const gst = baseCost * gstRate;
    const platformFee = baseCost * platformFeeRate;
    const total = baseCost + gst + platformFee;
    return { baseCost, gst, platformFee, total, gstRate, platformFeeRate };
  }

  function generateQuotation() {
    const svc = state.selectedService;
    const booking = state.booking;

    const typeFactor = booking?.serviceType === 'premium' ? 1.2 : booking?.serviceType === 'express' ? 1.15 : 1.0;
    const baseCost = (svc?.startingPrice || 0) * typeFactor;

    state.quotation = computeQuote(baseCost);

    // Enable quotation view button (not strictly used in flow)
    $('#viewQuotationBtn').disabled = false;
    $('#viewQuotationBtn').setAttribute('aria-disabled', 'false');
  }

  function goToPayment() {
    if (!state.booking || !state.quotation) return;

    const paymentView = $('#paymentView');
    const bookingView = $('#bookings');
    const confirmView = $('#confirmationView');
    const trackView = $('#trackView');

    bookingView.style.display = '';

    paymentView.hidden = false;
    confirmView.hidden = true;
    trackView.hidden = true;

    // scroll to payment
    paymentView.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // render quote
    const q = state.quotation;
    const lines = $('#quoteLines');
    lines.innerHTML = `
      <div class="quote-line"><span>Service Cost</span><strong>${formatINR(q.baseCost)}</strong></div>
      <div class="quote-line"><span>GST (18%)</span><strong>${formatINR(q.gst)}</strong></div>
      <div class="quote-line"><span>Platform Fee (6%)</span><strong>${formatINR(q.platformFee)}</strong></div>
    `;
    $('#quoteTotal').textContent = formatINR(q.total);

    $('#paymentGrid').dataset.ready = 'true';
    // select default method if none
    if (!state.paymentMethod) state.paymentMethod = PAYMENT_METHODS[0].id;
    paintPaymentSelection();

    $('#payNowBtn').onclick = () => {
      const selected = state.paymentMethod;
      const pm = PAYMENT_METHODS.find((m) => m.id === selected);
      state.paymentMethod = selected;
      createConfirmation(pm?.name || 'Payment Method');
      goToConfirmation();
      startTrackingMock();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }

  function goToForm() {
    $('#paymentView').hidden = true;
    $('#confirmationView').hidden = true;
    $('#trackView').hidden = true;
  }

  function goToConfirmation() {
    $('#confirmationView').hidden = false;
    $('#paymentView').hidden = true;
    $('#trackView').hidden = true;
  }

  function createConfirmation(paymentName) {
    state.bookingId = `AST-${Math.floor(100000 + Math.random() * 900000)}`;

    const booking = state.booking;
    const svc = SERVICES.find((s) => s.id === booking.selectedServiceId) || state.selectedService;
    const q = state.quotation;

    const grid = $('#confirmationGrid');
    grid.innerHTML = `
      <div class="kv"><strong>Booking ID</strong><span>${state.bookingId}</span></div>
      <div class="kv"><strong>Service</strong><span>${svc?.name || booking.selectedServiceName}</span></div>
      <div class="kv"><strong>Date</strong><span>${booking.date}</span></div>
      <div class="kv"><strong>Time</strong><span>${booking.timeSlot}</span></div>
      <div class="kv"><strong>Address</strong><span>${escapeHtml(booking.address)}</span></div>
      <div class="kv"><strong>Total Paid</strong><span>${formatINR(q.total)}</span></div>
      <div class="kv"><strong>Payment</strong><span>${escapeHtml(paymentName)}</span></div>
    `;

    $('#goTrackBtn').onclick = () => {
      goToTrack();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    $('#bookAnotherBtn').onclick = () => {
      resetToHome();
    };
  }

  function goToTrack() {
    $('#confirmationView').hidden = true;
    $('#paymentView').hidden = true;
    $('#trackView').hidden = false;
    $('#trackView').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetToHome() {
    $('#paymentView').hidden = true;
    $('#confirmationView').hidden = true;
    $('#trackView').hidden = true;
    $('#bookings').scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Keep selected service; clear booking+quote
    state.booking = null;
    state.quotation = null;
    state.bookingId = null;
    $('#bookingForm').reset();
    // Restore min date constraints
    const date = $('#datePicker');
    const minDate = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const min = `${minDate.getFullYear()}-${pad(minDate.getMonth() + 1)}-${pad(minDate.getDate())}`;
    date.min = min;
    $('#viewQuotationBtn').disabled = true;
    $('#viewQuotationBtn').setAttribute('aria-disabled', 'true');
  }

  function renderPaymentGrid() {
    const grid = $('#paymentGrid');
    grid.innerHTML = '';

    PAYMENT_METHODS.forEach((m) => {
      const item = document.createElement('div');
      item.className = 'payment-item';
      item.setAttribute('role', 'listitem');
      item.tabIndex = 0;
      item.setAttribute('aria-label', `Pay with ${m.name}`);

      item.innerHTML = `
        <div class="payment-left">
          <div class="pay-icon" aria-hidden="true">${m.glyph}</div>
          <div class="pay-name">${m.name}</div>
        </div>
        <span aria-hidden="true">Select</span>
      `;

      const select = () => {
        state.paymentMethod = m.id;
        paintPaymentSelection();
      };

      item.addEventListener('click', select);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
      });

      grid.appendChild(item);
    });

    paintPaymentSelection();
  }

  function paintPaymentSelection() {
    const grid = $('#paymentGrid');
    if (!grid) return;
    const items = $$('.payment-item', grid);
    items.forEach((node, idx) => {
      const m = PAYMENT_METHODS[idx];
      const selected = state.paymentMethod === m.id;
      node.classList.toggle('is-selected', selected);
    });
  }

  function setupPaymentNav() {
    // Payment view might be hidden; keep handlers anyway.
    renderPaymentGrid();

    $('#payNowBtn').addEventListener('click', () => {
      // handler replaced by goToPayment to ensure quotation exists
      if (!state.quotation || !state.booking) {
        toast('Please book a service first.');
        return;
      }
      const pm = PAYMENT_METHODS.find((m) => m.id === state.paymentMethod);
      createConfirmation(pm?.name || 'Payment Method');
      goToConfirmation();
      startTrackingMock();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function setupConfirmationButtons() {
    $('#goTrackBtn').addEventListener('click', () => {
      goToTrack();
    });
    $('#bookAnotherBtn').addEventListener('click', resetToHome);
  }

  function setupTrackView() {
    $('#trackRefreshBtn').addEventListener('click', () => {
      toast('Tracking refreshed (mock).');
      startTrackingMock(true);
    });

    $('#trackBackBtn').addEventListener('click', () => {
      resetToHome();
      $('#bookings').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function createStatusTimeline() {
    return [
      { key: 'confirmed', label: 'Booking Confirmed', done: true },
      { key: 'assigned', label: 'Worker Assigned', done: false },
      { key: 'onway', label: 'Worker On the Way', done: false },
      { key: 'arrived', label: 'Arrived at Location', done: false },
      { key: 'completed', label: 'Service Completed', done: false }
    ];
  }

  function startTrackingMock(force = false) {
    if (!force && state.tracking && state.tracking.running) return;

    state.tracking = {
      running: true,
      stepIndex: 0,
      statuses: createStatusTimeline(),
      etaSeconds: 14 * 60,
      markerX: 22,
      markerY: 56
    };

    const statusList = $('#statusList');
    statusList.innerHTML = '';

    const statuses = state.tracking.statuses;

    statuses.forEach((s, i) => {
      const el = document.createElement('div');
      el.className = 'status-item';
      el.dataset.key = s.key;
      el.innerHTML = `
        <span class="status-dot" aria-hidden="true"></span>
        <span style="font-weight:800">${s.label}</span>
        <span class="muted" style="margin-left:auto">${i === 0 ? 'Now' : ''}</span>
      `;
      statusList.appendChild(el);
    });

    const workerAssigned = $('#assignedWorker');
    workerAssigned.textContent = 'Pending...';
    $('#etaText').textContent = 'Pending...';
    $('#workerLocation').textContent = 'Searching nearby professionals...';

    const marker = $('#workerMarker');
    marker.style.transform = 'translate(0,0)';
    marker.style.left = '60%';

    // Simulate step updates
    const steps = [
      () => {
        // assign
        workerAssigned.textContent = 'Ravi Kumar';
        $('#etaText').textContent = 'ETA ~ 14 min';
        $('#workerLocation').textContent = 'Worker assigned. Preparing tools...';
        setStepDone('assigned');
        state.tracking.stepIndex = 1;
      },
      () => {
        $('#etaText').textContent = 'ETA ~ 10 min';
        $('#workerLocation').textContent = 'Worker on the way. Navigating to your address...';
        moveMarker(38, -10);
        setStepDone('onway');
        state.tracking.stepIndex = 2;
      },
      () => {
        $('#etaText').textContent = 'ETA ~ 4 min';
        $('#workerLocation').textContent = 'Arriving soon. Please keep access ready.';
        moveMarker(52, -22);
        setStepDone('arrived');
        state.tracking.stepIndex = 3;
      },
      () => {
        $('#etaText').textContent = 'On-site';
        $('#workerLocation').textContent = 'Service in progress...';
        moveMarker(68, -34);
        setStepDone('completed');
        state.tracking.stepIndex = 4;
        state.tracking.running = false;
      }
    ];

    // Ensure first status done (confirmed)
    setStepDone('confirmed');

    // timeouts
    const base = 900;
    steps.forEach((fn, idx) => {
      setTimeout(fn, base + idx * 1600);
    });
  }

  function setStepDone(key) {
    const item = $(`.status-item[data-key="${key}"]`);
    if (!item) return;
    item.classList.add('is-done');
    const dot = item.querySelector('.status-dot');
    if (dot) dot.style.background = 'var(--brand)';
  }

  function moveMarker(xPct, yShift) {
    const marker = $('#workerMarker');
    // Use left with percent-like feel
    marker.style.left = `${clamp(xPct, 10, 90)}%`;
    marker.style.top = `${-220 + yShift}px`;
    $('#workerLocation').textContent = $('#workerLocation').textContent;
  }

  function setupStatusButtons() {
    // If profile menu track button clicked
    $('#goTrack')?.addEventListener('click', () => goToTrack());
  }

  function setupProfileMenu() {
    const btn = $('#profileBtn');
    const menu = $('#profileMenu');

    const hide = () => {
      menu.classList.remove('show');
      btn.setAttribute('aria-expanded', 'false');
    };

    const show = () => {
      menu.classList.add('show');
      btn.setAttribute('aria-expanded', 'true');
    };

    btn.addEventListener('click', () => {
      const willShow = !menu.classList.contains('show');
      if (willShow) show(); else hide();
    });

    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== btn) hide();
    });

    $('#profileMenu').addEventListener('keydown', (e) => {
      if (e.key === 'Escape') hide();
    });

    $('#goTrack').addEventListener('click', () => {
      hide();
      goToTrack();
    });
  }

  function setupLocationDialog() {
    const dialog = $('#locationDialog');
    const chips = $('#locationChips');
    const locationText = $('#locationText');
    const close = $('#locationClose');
    const cancel = $('#locationCancel');
    const done = $('#locationDone');

    let selected = locationText.textContent.trim() || LOCATIONS[0];

    chips.innerHTML = '';
    LOCATIONS.forEach((city) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = city;
      chip.setAttribute('role', 'listitem');
      chip.addEventListener('click', () => {
        selected = city;
        $$('.chip', chips).forEach((c) => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
      });
      chips.appendChild(chip);
    });

    // select current
    const initialChip = $(`.chip:nth-child(${LOCATIONS.indexOf(selected) + 1})`, chips);
    if (initialChip) initialChip.classList.add('is-selected');

    function open() { dialog.hidden = false; dialog.classList.add('show'); document.body.style.overflow = 'hidden'; }
    function closeDialog() { closeModal(dialog); }

    $('#locationBtn').addEventListener('click', () => open());
    close.addEventListener('click', closeDialog);
    cancel.addEventListener('click', closeDialog);

    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) closeDialog();
    });

    done.addEventListener('click', () => {
      locationText.textContent = selected;
      closeDialog();
      toast(`Location set to ${selected}.`);
    });

    document.addEventListener('keydown', (e) => {
      if (!dialog.hidden && e.key === 'Escape') closeDialog();
    });
  }

  function setupHeroSlider() {
    const slider = $('[data-slider]');
    const slidesWrap = $('#heroSlides');
    const slides = $$('.hero-slide', slidesWrap);
    const dotsWrap = $('#heroDots');
    const bar = $('[data-progress-bar]');
    const prevBtn = $('[data-prev]');
    const nextBtn = $('[data-next]');

    dotsWrap.innerHTML = '';

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function update() {
      slides.forEach((s, i) => s.classList.toggle('is-active', i === state.hero.index));
      $$('.dot', dotsWrap).forEach((d, i) => d.classList.toggle('is-active', i === state.hero.index));

      // progress bar
      bar.style.transition = 'none';
      bar.style.width = '0%';
      // force reflow
      bar.getBoundingClientRect();
      bar.style.transition = `width ${state.hero.autoMs}ms linear`;
      bar.style.width = '100%';
    }

    function goTo(i) {
      state.hero.index = (i + slides.length) % slides.length;
      update();
    }

    prevBtn.addEventListener('click', () => { goTo(state.hero.index - 1); resetTimer(); });
    nextBtn.addEventListener('click', () => { goTo(state.hero.index + 1); resetTimer(); });

    // auto
    function resetTimer() {
      clearInterval(state.hero.timer);
      bar.style.transition = 'none';
      bar.style.width = '0%';
      state.hero.timer = setInterval(() => {
        goTo(state.hero.index + 1);
      }, state.hero.autoMs);
    }

    update();
    resetTimer();

    // stop on visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearInterval(state.hero.timer);
      else resetTimer();
    });

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(state.hero.timer));
    slider.addEventListener('mouseleave', () => resetTimer());
  }

  function setupCategorySearch() {
    const input = $('#searchInput');
    const btn = $('#searchBtn');
    if (!input) return;

    const doSearch = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        renderCategories();
        renderPopular();
        return;
      }

      const matches = SERVICES.filter((s) => {
        return [s.name, s.category, s.desc].some((x) => String(x).toLowerCase().includes(q));
      });

      // categories
      const grid = $('#categoriesGrid');
      grid.innerHTML = '';
      matches.forEach((svc) => {
        const card = document.createElement('div');
        card.className = 'card cat-card';
        card.tabIndex = 0;
        card.innerHTML = `
          <div class="cat-top">
            <div class="cat-icon" aria-hidden="true">${svc.glyph}</div>
            <div class="cat-price">Starting at ${formatINR(svc.startingPrice)}</div>
          </div>
          <div class="cat-img" aria-hidden="true"><div style="font-weight:900;color:#0f172a;position:relative;z-index:2;">${svc.category}</div></div>
          <div class="cat-name">${svc.name}</div>
        `;
        const open = () => openServiceModal(svc);
        card.addEventListener('click', open);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });
        grid.appendChild(card);
      });

      // popular
      const popularGrid = $('#popularGrid');
      popularGrid.innerHTML = '';
      matches.slice(0, 4).forEach((svc) => {
        const card = document.createElement('div');
        card.className = 'card service-card';
        card.innerHTML = `
          <div class="service-img" aria-hidden="true">
            <div class="tag">Match</div>
            <div class="glyph">${svc.glyph}</div>
          </div>
          <div class="service-meta">
            <div class="rating-row"><span>${svc.name}</span><span class="stars" aria-hidden="true">★★★★★</span></div>
            <div class="price-row"><span class="start">From</span><span class="amt">${formatINR(svc.startingPrice)}</span></div>
          </div>
          <div class="btn-row">
            <button class="secondary" type="button" data-view-details>View Details</button>
            <button class="primary" type="button" data-book-now>Book Now</button>
          </div>
        `;
        card.querySelector('[data-view-details]').addEventListener('click', () => openServiceModal(svc));
        card.querySelector('[data-book-now]').addEventListener('click', () => { setSelectedService(svc); jumpTo('#bookings'); });
        popularGrid.appendChild(card);
      });

      toast(matches.length ? `Found ${matches.length} matching services.` : 'No matching services found.');
    };

    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
  }

  function setupAccordion() {
    const acc = $('#faqAccordion');
    if (!acc) return;

    $$('.acc-btn', acc).forEach((btn) => {
      btn.addEventListener('click', () => {
        const panel = btn.nextElementSibling;
        const expanded = btn.getAttribute('aria-expanded') === 'true';

        // close others
        $$('.acc-btn', acc).forEach((b) => {
          if (b === btn) return;
          b.setAttribute('aria-expanded', 'false');
          const p = b.nextElementSibling;
          if (p) p.hidden = true;
        });

        btn.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  }

  function setupReviews() {
    const track = $('#reviewsTrack');
    const dotsWrap = $('#reviewsDots');
    const prev = $('[data-rev-prev]');
    const next = $('[data-rev-next]');

    let index = 0;
    const cards = [];

    track.innerHTML = '';
    dotsWrap.innerHTML = '';

    REVIEWS.forEach((r, i) => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-grid">
          <div class="rev-avatar" aria-hidden="true">${i % 2 === 0 ? '😊' : '⭐'}</div>
          <div>
            <h3>${escapeHtml(r.name)}</h3>
            <div class="rating"><span class="stars" aria-hidden="true">${'★★★★★'.slice(0, r.rating)}${'★'.repeat(5 - r.rating)}</span><span class="rating-value"><strong>${r.rating}</strong> / 5</span></div>
            <p style="margin-top:6px">${escapeHtml(r.text)}</p>
          </div>
        </div>
      `;
      cards.push(card);
      track.appendChild(card);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => go(i));
      dotsWrap.appendChild(dot);
    });

    function go(i) {
      index = (i + REVIEWS.length) % REVIEWS.length;
      const w = track.parentElement.getBoundingClientRect().width;
      track.style.transform = `translateX(${-index * w}px)`;
      $$('.dot', dotsWrap).forEach((d, di) => d.classList.toggle('is-active', di === index));
    }

    prev.addEventListener('click', () => go(index - 1));
    next.addEventListener('click', () => go(index + 1));

    window.addEventListener('resize', () => go(index));

    // auto
    setInterval(() => go(index + 1), 4800);
  }

  function setupPageRouting() {
    // Buttons in header are mock
    $('#loginBtn')?.addEventListener('click', () => toast('Login is a UI mock in this demo.'));
    $('#registerBtn')?.addEventListener('click', () => toast('Register is a UI mock in this demo.'));
    $('#bookingsBtn')?.addEventListener('click', () => jumpTo('#bookings'));

    $('#worker')?.addEventListener('click', () => {});

    $('#callWorker')?.addEventListener('click', () => toast('Calling worker (mock)...'));
    $('#chatWorker')?.addEventListener('click', () => toast('Chat opened (mock)...'));

    $('#searchBtn')?.addEventListener('click', () => {});

    $('#locationBtn')?.addEventListener('click', () => {});

    $('#goTrack')?.addEventListener('click', () => goToTrack());

    $('#trackBackBtn')?.addEventListener('click', () => resetToHome());

    // Smooth fade in on scroll
    const els = $$('.card, .section-head');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.style.opacity = 1;
          en.target.style.transform = 'translateY(0)';
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.14 });

    els.forEach((el) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      io.observe(el);
    });
  }

  function jumpTo(sel) {
    const target = $(sel);
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '<')
      .replaceAll('>', '>')
      .replaceAll('"', '"')
      .replaceAll("'", '&#039;');
  }

  function initDataload() {
    // Profile/locations/home components
    $('#year').textContent = new Date().getFullYear();

    renderCategories();
    renderPopular();

    setupServiceModal();
    setupLocationDialog();
    setupProfileMenu();

    setupHeroSlider();
    setupCategorySearch();
    setupAccordion();
    setupReviews();

    setupBookingForm();
    setupPaymentNav();
    setupTrackView();

    // Default view states
    goToForm();

    // Footer/CTA mock
    $('#searchInput').setAttribute('aria-label', 'Search services');

    // Change service from booking selection button scrolls
    $('#changeServiceBtn').addEventListener('click', () => jumpTo('#categories'));

    // Track view buttons
    $('#goTrackBtn')?.addEventListener('click', () => goToTrack());

    // If user wants track directly from menu when no booking exists
    $('#goTrack')?.addEventListener('click', () => {
      if (!state.bookingId) {
        toast('No active booking yet. Create one to start tracking.');
        jumpTo('#bookings');
      }
    });

    // ensure profile menu close after selection
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const menu = $('#profileMenu');
        const btn = $('#profileBtn');
        if (menu && menu.classList.contains('show')) {
          menu.classList.remove('show');
          btn?.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // search-btn type is button; keep accessible
    $('#searchBtn')?.addEventListener('click', () => {
      // handled by setupCategorySearch
      const evt = new Event('click');
    });
  }

  document.addEventListener('DOMContentLoaded', initDataload);
})();

