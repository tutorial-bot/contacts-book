import template from './ContactsDetails.html';

export default class ContactsDetails extends HTMLElement {
  #value = {};

  #form = null;

  #buttonDelete = null;

  #buttonDiscard = null;

  #inputId = null;

  #inputFirstName = null;

  #inputLastName = null;

  #inputEmail = null;

  #inputDateOfBirth = null;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;

    this.#inputId = this.shadowRoot.getElementById('id');
    this.#inputFirstName = this.shadowRoot.getElementById('firstName');
    this.#inputLastName = this.shadowRoot.getElementById('lastName');
    this.#inputEmail = this.shadowRoot.getElementById('email');
    this.#inputDateOfBirth = this.shadowRoot.getElementById('dateOfBirth');

    this.#form = this.shadowRoot.getElementById('form');
    this.#form.onsubmit = this.#onFormSubmit;

    this.#buttonDelete = this.shadowRoot.getElementById('delete');
    this.#buttonDelete.onclick = this.#onDeleteClick;

    this.#buttonDiscard = this.shadowRoot.getElementById('discard');
    this.#buttonDiscard.onclick = this.#onDiscardClick;

    this.#render();
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value || {};
    this.#render();
  }

  #new = undefined;

  get new() {
    return this.#new;
  }

  set new(rawValue) {
    const value = Boolean(rawValue);

    if (this.#new !== value) {
      this.#new = value;
      this.#buttonDelete.hidden = this.#new;
      this.#buttonDiscard.hidden = !this.#new;
    }
  }

  #render = () => {
    const {
      id = '',
      firstName = '',
      lastName = '',
      email = '',
      dateOfBirth = '',
    } = this.value;

    this.#inputId.value = id;
    this.#inputFirstName.value = firstName;
    this.#inputLastName.value = lastName;
    this.#inputEmail.value = email;
    this.#inputDateOfBirth.value = dateOfBirth;
  };

  #onFormSubmit = (e) => {
    e.preventDefault();
    this.#dispatchFormData('contacts-details:save');
  };

  #onDeleteClick = (e) => {
    e.preventDefault();
    this.#dispatchFormData('contacts-details:delete');
  };

  #onDiscardClick = (e) => {
    e.preventDefault();
    this.#dispatchFormData('contacts-details:discard');
  };

  #dispatchFormData = (eventName) => {
    this.dispatchEvent(new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: Object.fromEntries([...new FormData(this.#form).entries()]),
    }));
  };
}
