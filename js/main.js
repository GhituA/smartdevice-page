'use strict';

(function () {

  var footer = document.querySelector('.page-footer');
  var footerNav = footer.querySelector('.footer-nav');
  var footerNavBar = footer.querySelector('.footer-nav__bar');
  var footerNavLinks = footerNav.querySelector('.footer-nav__links');
  var footerContacts = footer.querySelector('.footer-contacts');
  var footerContactsBar = footer.querySelector('.footer-contacts__bar');
  var footerContactsInfo = footerContacts.querySelector('.footer-contacts__info');

  var onNavClick = function () {
    if (footerContactsBar && footerContacts.classList.contains('footer-contacts--open')) {
      footerContacts.classList.remove('footer-contacts--open');
    }
    footerNav.classList.toggle('footer-nav--open');
  };

  var onContactsClick = function () {
    if (footerNavBar && footerNav.classList.contains('footer-nav--open')) {
      footerNav.classList.remove('footer-nav--open');
    }
    footerContacts.classList.toggle('footer-contacts--open');
  };

  if (footerNavBar && footerNavLinks) {
    footerNavBar.classList.add('footer-nav__bar--js');
    footerNav.classList.remove('footer-nav--open');

    footerNavBar.addEventListener('click', function () {
      onNavClick();
    });
  }

  if (footerContactsBar && footerContactsInfo) {
    footerContactsBar.classList.add('footer-contacts__bar--js');
    footerContacts.classList.remove('footer-contacts--open');

    footerContactsBar.addEventListener('click', function () {
      onContactsClick();
    });
  }
})();

'use strict';

(function () {
  var MIN_NAME_LENGTH = 4;
  var MAX_NAME_LENGTH = 30;
  var phoneFocusMask = '+7 (';
  var cbPhoneMask = {
    mask: '+{7} (000) 000-00-00'
  };

  var phoneErrorMessage = 'Пример ввода:  +7 (000) 000-00-00';
  var requiredMessage = 'Это поле обязательно для заполнения';
  var minLengthMessage = 'Минимальная длина ввода: 4 символа. Введите ещё ';
  var maxLengthMessage = 'Максимальная длина ввода: 30 символов. Удалите лишние ';

  var cbForm = document.querySelector('form');
  var cbPhone = cbForm.querySelector('#phone');
  var cbName = cbForm.querySelector('#username');

  var onPhoneFocus = function (evt) {
    if (evt.target.value === '') {
      evt.target.value = phoneFocusMask;
    }
  };

  var onPhoneInput = function (evt) {
    var newMask = new window.IMask(evt.target, cbPhoneMask);
    return newMask;
  };

  var onPhoneValidityCheck = function (evt) {
    if (evt.target.validity.valueMissing) {
      evt.target.setCustomValidity(requiredMessage);
      return false;
    }
    else if (evt.target.validity.patternMismatch) {
      evt.target.setCustomValidity(phoneErrorMessage);
      return false;
    }
    else {
      evt.target.setCustomValidity('');
      return true;
    }
  }

  var onNameInput = function (evt) {
    var valueLength = evt.target.value.length;
    if (valueLength < 1) {
      evt.target.setCustomValidity(requiredMessage);
    } else if (valueLength < MIN_NAME_LENGTH) {
      evt.target.setCustomValidity(minLengthMessage + (MIN_NAME_LENGTH - valueLength) + ' симв.');
    } else if (valueLength > MAX_NAME_LENGTH) {
      evt.target.setCustomValidity(maxLengthMessage + (valueLength - MAX_NAME_LENGTH) + ' симв.');
    } else {
      evt.target.setCustomValidity('');
    }
  };

  if (cbForm) {
    cbPhone.addEventListener('focus', onPhoneFocus);
    cbPhone.addEventListener('keydown', onPhoneInput);
    cbPhone.addEventListener('keyup', onPhoneValidityCheck);
    cbName.addEventListener('input', onNameInput);
  }

  window.form = {
    cbPhoneMask: cbPhoneMask,
    onPhoneFocus: onPhoneFocus,
    onPhoneInput: onPhoneInput,
    onNameInput: onNameInput,
    onPhoneValidityCheck: onPhoneValidityCheck
  };

})();

'use strict';

(function () {
  var EVT_KEY_ESCAPE = 'Escape';
  var page = document.querySelector('.page');
  var navCbBtn = page.querySelector('.head-contacts__button');
  var popup = page.querySelector('.popup');
  var popupForm = popup.querySelector('form');
  var closeBtn = popup.querySelector('.popup__esc');
  var nameField = popup.querySelector('#popup-username');
  var phoneField = popup.querySelector('#popup-phone');
  var commentField = popup.querySelector('#popup-comment');

  var storageSupport = true;
  var nameStored = '';
  var phoneStored = '';
  var commentStored = '';

  if (popup) {
    try {
      nameStored = localStorage.getItem('name');
      phoneStored = localStorage.getItem('phone');
      commentStored = localStorage.getItem('comment');
    } catch (err) {
      storageSupport = false;
    }
  }

  var onPopupClose = function () {
    popup.classList.add('popup--hidden');
    page.classList.remove('page--lock');
    closeBtn.removeEventListener('click', onPopupClose);
    document.removeEventListener('keydown', onEscPress);
    popup.removeEventListener('click', onPopupClose);
    phoneField.removeEventListener('focus', window.form.onPhoneFocus);
    phoneField.removeEventListener('input', window.form.onPhoneInput);
    nameField.removeEventListener('input', window.form.onNameInput);
    popupForm.removeEventListener('submit', onFormSubmit);
    popupForm.reset();
  };

  var onEscPress = function (evt) {
    if (evt.key === EVT_KEY_ESCAPE) {
      onPopupClose();
    }
  };

  var onOverlayClick = function (evt) {
    if (evt.target === popup) {
      onPopupClose();
    }
  };

  var openPopup = function () {
    if (storageSupport) {
      if (nameStored) {
        nameField.value = nameStored;
      }

      if (phoneStored) {
        phoneField.value = phoneStored;
      }

      if (commentStored) {
        commentField.value = commentStored;
      }
    }
  };

  var onFormSubmit = function () {
    if (storageSupport) {
      localStorage.setItem('name', nameField.value);
      localStorage.setItem('phone', phoneField.value);
      localStorage.setItem('comment', commentField.value);
    }
  };

  if (navCbBtn) {
    navCbBtn.addEventListener('click', function (evt) {

      evt.preventDefault();
      popup.classList.remove('popup--hidden');
      page.classList.add('page--lock');
      closeBtn.addEventListener('click', onPopupClose);
      document.addEventListener('keydown', onEscPress);
      popup.addEventListener('click', onOverlayClick);
      nameField.focus();
      openPopup();
      phoneField.addEventListener('focus', window.form.onPhoneFocus);
      phoneField.addEventListener('keydown', window.form.onPhoneInput);
      phoneField.addEventListener('keyup', window.form.onPhoneValidityCheck);
      nameField.addEventListener('input', window.form.onNameInput);
      popupForm.addEventListener('submit', onFormSubmit);
    });
  }
})();
