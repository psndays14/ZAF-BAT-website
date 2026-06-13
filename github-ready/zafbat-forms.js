/* ════════════════════════════════════════════════════════════
   ZAF BAT — Smart form fields
   • International phone with country flags (+212 default, all countries)
   • First/last name: letters only · last name auto-UPPERCASE
   • Email: required + must contain "@"
   • Project city: dropdown of the cities we operate in
   • Budget: thousands spaced · currency MAD/EUR/USD with live conversion
   No dependencies except intl-tel-input (vendored under assets/vendor).
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function each(list, fn){ Array.prototype.forEach.call(list || [], fn); }

  /* ---------- 1 · International telephone ---------- */
  function fullNumber(iti, input){
    try { var n = iti.getNumber(); if (n) return n; } catch (e) {}
    try {
      var c = iti.getSelectedCountryData();
      var nat = (input.value || '').replace(/\D/g, '');
      if (c && c.dialCode && nat) return '+' + c.dialCode + nat;
    } catch (e) {}
    return input.value;
  }
  function initPhones(){
    if (typeof window.intlTelInput !== 'function') return;
    each(document.querySelectorAll('input[type="tel"]'), function (input){
      if (input.getAttribute('data-iti')) return;
      input.setAttribute('data-iti', '1');
      var iti = window.intlTelInput(input, {
        initialCountry: 'ma',
        preferredCountries: ['ma','fr','be','es','nl','it','de','gb','ca','us','ae','sa','qa'],
        separateDialCode: true,
        autoPlaceholder: 'aggressive',
        nationalMode: false,
        utilsScript: 'assets/vendor/intl-tel-input/js/utils.js'
      });
      var form = input.form || input.closest('form');
      if (form){
        // Capture phase → runs BEFORE the page's own submit handler, so the
        // serialized value is the full international number (e.g. +212717380728)
        form.addEventListener('submit', function (){
          input.value = fullNumber(iti, input);
        }, true);
      }
    });
  }

  /* ---------- 2 · Names: letters only, last name UPPERCASE ---------- */
  var BAD = /[^\p{L}\s'’\-]/gu;          // keep letters (any language), spaces, apostrophes, hyphens
  function bindName(input, upper){
    if (!input || input.getAttribute('data-nm')) return;
    input.setAttribute('data-nm', '1');
    input.setAttribute('autocapitalize', upper ? 'characters' : 'words');
    function clean(){
      var v = input.value.replace(BAD, '');
      if (upper) v = v.toUpperCase();
      if (v !== input.value) input.value = v;     // only touch when changed (keeps caret on forward typing)
    }
    input.addEventListener('input', clean);
    input.addEventListener('blur', clean);
    input.addEventListener('keypress', function (e){
      if (e.ctrlKey || e.metaKey || !e.key || e.key.length !== 1) return;
      if (BAD.test(e.key)) { e.preventDefault(); BAD.lastIndex = 0; }
      BAD.lastIndex = 0;
    });
  }
  function isPrenom(el){ return el.name === 'prenom' || /prenom/i.test(el.id || ''); }
  function isNom(el){ return (el.name === 'nom' || /(^|[-_])nom$/i.test(el.id || '')) && !isPrenom(el); }
  function initNames(){
    each(document.querySelectorAll('input[type="text"], input:not([type])'), function (i){
      if (isPrenom(i)) bindName(i, false);
      else if (isNom(i)) bindName(i, true);
    });
  }

  /* ---------- 3 · Email: required + contains "@" ---------- */
  function initEmails(){
    each(document.querySelectorAll('input[type="email"], input[name="email"], input[id$="email"]'), function (i){
      i.type = 'email';
      i.setAttribute('required', 'required');
      if (!i.getAttribute('inputmode')) i.setAttribute('inputmode', 'email');
      if (!i.getAttribute('autocomplete')) i.setAttribute('autocomplete', 'email');
      // friendly native message if the "@" is missing
      i.addEventListener('invalid', function (){
        if (i.validity.valueMissing) i.setCustomValidity('Merci d’indiquer votre email.');
        else if (i.validity.typeMismatch) i.setCustomValidity('Adresse email invalide — il manque le « @ ».');
        else i.setCustomValidity('');
      });
      i.addEventListener('input', function (){ i.setCustomValidity(''); });
    });
  }

  /* ---------- 4 · Budget: spaced thousands + currency conversion ---------- */
  var RATES = { MAD: 1, EUR: 10.8, USD: 9.9 }; // 1 unit = X MAD (indicative, editable)
  function fmt(n){ if (!isFinite(n) || n <= 0) return ''; return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function parseNum(s){ var d = (s || '').replace(/[^\d]/g, ''); return d ? parseInt(d, 10) : 0; }
  function initBudget(){
    var input = document.getElementById('f-budget');
    if (!input || input.getAttribute('data-bd')) return;
    input.setAttribute('data-bd', '1');
    input.setAttribute('inputmode', 'numeric');
    var sel  = document.getElementById('budget-cur');
    var hint = document.getElementById('budget-hint');
    input.dataset.cur = (sel && sel.value) || 'MAD';

    function refreshHint(){
      if (!hint) return;
      var amt = parseNum(input.value), cur = input.dataset.cur;
      if (!amt){ hint.innerHTML = 'Indicatif — convertible en MAD, EUR ou USD.'; return; }
      var mad = amt * RATES[cur];
      var parts = [];
      ['MAD','EUR','USD'].forEach(function (c){ if (c !== cur) parts.push('<b>' + fmt(mad / RATES[c]) + '</b> ' + c); });
      hint.innerHTML = '≈ ' + parts.join('  ·  ') + ' <span style="opacity:.7">(taux indicatif)</span>';
    }
    input.addEventListener('input', function (){ input.value = fmt(parseNum(input.value)); refreshHint(); });
    input.addEventListener('blur',  function (){ input.value = fmt(parseNum(input.value)); });
    if (sel){
      sel.addEventListener('change', function (){
        var oldc = input.dataset.cur || 'MAD', newc = sel.value, amt = parseNum(input.value);
        if (amt > 0) input.value = fmt((amt * RATES[oldc]) / RATES[newc]);
        input.dataset.cur = newc;
        refreshHint();
      });
    }
    // submit the amount together with its currency
    var form = input.form || input.closest('form');
    if (form){
      form.addEventListener('submit', function (){
        var amt = parseNum(input.value);
        if (amt) input.value = fmt(amt) + ' ' + (input.dataset.cur || 'MAD');
      }, true);
    }
    refreshHint();
  }

  ready(function (){
    initNames();
    initEmails();
    initBudget();
    initPhones();
  });
})();
