import template from './ContactsDetails.html';

export default class ContactsDetails extends HTMLElement {
  #value = {};

  #form = null;
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
    this.#inputEmail = this.shadowRoot.getElementById('eMail');
    this.#inputDateOfBirth = this.shadowRoot.getElementById('dateOfBirth');

    this.#form = this.shadowRoot.getElementById('form');
    this.#form.onsubmit = this._onFormSubmit;

    this.#render();
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value || {};
    this.#render();
  }

  #render() {
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
  }

  _onFormSubmit = (e) => {
    e.preventDefault();

    this.dispatchEvent(new CustomEvent('contact-submitted', {
      bubbles: true,
      composed: true,
      detail: Object.fromEntries([...new FormData(e.target).entries()])
    }));
  };
}
