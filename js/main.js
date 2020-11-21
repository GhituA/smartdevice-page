'use strict';

(function () {

  var footer = document.querySelector('.page-footer');
  var footerNav = footer.querySelector('.footer-nav');
  var footerNavBar = footer.querySelector('.footer-nav__bar');
  var footerNavLinks = footerNav.querySelector('.footer-nav__links');
  var footerNavBtn = footerNav.querySelector('.footer-nav__toggle');
  var footerContacts = footer.querySelector('.footer-contacts');
  var footerContactsBar = footer.querySelector('.footer-contacts__bar');
  var footerContactsInfo = footerContacts.querySelector('.footer-contacts__info');
  var footerContactsBtn = footerContacts.querySelector('.footer-contacts__toggle');


  if (footerNavBar && footerNav && footerNavBtn) {
    footerNavLinks.classList.add('footer-nav__links--closed');
    footerNavBtn.classList.remove('footer-nav__toggle--hidden');

    footerNavBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      footerNavBtn.classList.toggle('footer-nav__toggle--open');
      footerNavLinks.classList.toggle('footer-nav__links--closed');
    });
  }

  if (footerContactsBar && footerContactsInfo && footerContactsBtn) {
    footerContactsInfo.classList.add('footer-contacts__info--closed');
    footerContactsBtn.classList.remove('footer-contacts__toggle--hidden');

    footerContactsBtn.addEventListener('click', function (evt) {
      evt.preventDefault();
      footerContactsBtn.classList.toggle('footer-contacts__toggle--open');
      footerContactsInfo.classList.toggle('footer-contacts__info--closed');
    });
  }
})();

'use strict';

(function () {
  var MIN_NAME_LENGTH = 4;
  var MAX_NAME_LENGTH = 30;
  var cbPhoneMask = {
    mask: '+{7}(000)000-00-00'
  };

  var cbForm = document.querySelector('form');
  var cbPhone = cbForm.querySelector('#phone');
  var cbName = cbForm.querySelector('#username');

  var onPhoneFocus = function (evt) {
    if (evt.target.value === '') {
      evt.target.value = '+7 (';
    }
  };

  var onPhoneInput = function (evt) {
    var newMask = new window.IMask(evt.target, cbPhoneMask);

    if (evt.target.validity.patternMismatch) {
      evt.target.setCustomValidity('Пример ввода:  +7 (000) 000-00-00');
    } else {
      evt.target.setCustomValidity('');
    }
    return newMask;
  };

  var onNameInput = function (evt) {
    var valueLength = evt.target.value.length;
    if (valueLength < 1) {
      evt.target.setCustomValidity('Это поле обязательно для заполнения');
    } else if (valueLength < MIN_NAME_LENGTH) {
      evt.target.setCustomValidity('Минимальная длина ввода: 4 символов. Введите ещё ' + (MIN_NAME_LENGTH - valueLength) + ' симв.');
    } else if (valueLength > MAX_NAME_LENGTH) {
      evt.target.setCustomValidity('Максимальная длина ввода: 30 символов. Удалите лишние ' + (valueLength - MAX_NAME_LENGTH) + ' симв.');
    } else {
      evt.target.setCustomValidity('');
    }
  };

  if (cbForm) {
    cbPhone.addEventListener('focus', onPhoneFocus);
    cbPhone.addEventListener('input', onPhoneInput);
    cbName.addEventListener('input', onNameInput);
  }

  window.form = {
    cbPhoneMask: cbPhoneMask,
    onPhoneFocus: onPhoneFocus,
    onPhoneInput: onPhoneInput,
    onNameInput: onNameInput
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

  var isStorageSupport = true;
  var nameStored = '';
  var phoneStored = '';
  var commentStored = '';

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
    nameField.value = nameStored;
    phoneField.value = phoneStored;
    commentField.value = commentStored;
  };

  var onFormSubmit = function () {
    if (isStorageSupport) {
      localStorage.setItem('name', nameField.value);
      localStorage.setItem('phone', phoneField.value);
      localStorage.setItem('comment', commentField.value);
    }
  };

  if (popup) {
    try {
      nameStored = localStorage.getItem('name');
      phoneStored = localStorage.getItem('phone');
      commentStored = localStorage.getItem('comment');
    } catch (err) {
      isStorageSupport = false;
    }
  }

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
      phoneField.addEventListener('input', window.form.onPhoneInput);
      nameField.addEventListener('input', window.form.onNameInput);
      popupForm.addEventListener('submit', onFormSubmit);
    });
  }
})();
