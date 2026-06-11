(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.sticky-atc').forEach(function (bar) {
      var sectionId = bar.dataset.section;
      var mainBtn = document.getElementById('ProductSubmitButton-' + sectionId);
      if (!mainBtn) return;

      var stickyBtn = bar.querySelector('.sticky-atc__btn');
      var stickyPrice = bar.querySelector('.sticky-atc__price');

      // Show/hide bar when main button leaves viewport
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          bar.classList.toggle('sticky-atc--visible', !entry.isIntersecting);
        });
      }, { threshold: 0.1 });
      observer.observe(mainBtn);

      // Mirror button disabled state
      function syncState() {
        if (stickyBtn) stickyBtn.disabled = mainBtn.disabled;
      }
      syncState();

      var stateObserver = new MutationObserver(syncState);
      stateObserver.observe(mainBtn, { attributes: true, attributeFilter: ['disabled'] });

      // Mirror variant price from the live price element
      function syncPrice() {
        if (!stickyPrice) return;
        var priceEl = document.querySelector('#price-' + sectionId + ' .price-item--regular');
        var compareEl = document.querySelector('#price-' + sectionId + ' .price-item--regular ~ s');
        if (!priceEl) return;

        var html = '';
        if (compareEl) html += '<s>' + compareEl.textContent.trim() + '</s> ';
        html += priceEl.textContent.trim();
        stickyPrice.innerHTML = html;
      }
      syncPrice();

      var priceContainer = document.getElementById('price-' + sectionId);
      if (priceContainer) {
        new MutationObserver(syncPrice).observe(priceContainer, { childList: true, subtree: true });
      }

      // Clicking sticky btn delegates to the main button
      if (stickyBtn) {
        stickyBtn.addEventListener('click', function () {
          mainBtn.click();
        });
      }
    });
  });
})();
