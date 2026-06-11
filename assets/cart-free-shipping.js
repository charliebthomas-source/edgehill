(function () {
  'use strict';

  function getThresholdCents() {
    return window.ehFreeShippingThreshold || 3000;
  }

  function updateBar(totalCents) {
    var bar = document.getElementById('cart-free-shipping-bar');
    if (!bar) return;

    var threshold = getThresholdCents();
    var progress = bar.querySelector('.cart-free-shipping__fill');
    var msg = bar.querySelector('.cart-free-shipping__msg');

    if (totalCents >= threshold) {
      if (progress) progress.style.width = '100%';
      if (msg) msg.textContent = "You've unlocked free UK delivery!";
      bar.classList.add('cart-free-shipping--unlocked');
    } else {
      var remaining = ((threshold - totalCents) / 100).toFixed(2);
      var pct = Math.min((totalCents / threshold) * 100, 100).toFixed(1);
      if (progress) progress.style.width = pct + '%';
      if (msg) msg.textContent = "You’re £" + remaining + " away from free UK delivery";
      bar.classList.remove('cart-free-shipping--unlocked');
    }
  }

  function readTotalFromDOM() {
    var el = document.getElementById('CartDrawer-TotalCents');
    return el ? parseInt(el.dataset.cents, 10) || 0 : 0;
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateBar(readTotalFromDOM());
  });

  // Dawn fires this event when the cart is updated via Ajax
  document.addEventListener('cart:updated', function (e) {
    var total = (e.detail && e.detail.total_price != null)
      ? e.detail.total_price
      : readTotalFromDOM();
    updateBar(total);
  });

  // Fallback: watch the hidden cents span for changes (re-rendered on cart update)
  var observer = new MutationObserver(function () {
    updateBar(readTotalFromDOM());
  });

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('CartDrawer-TotalCents');
    if (el) observer.observe(el, { attributes: true, attributeFilter: ['data-cents'] });
  });
})();
