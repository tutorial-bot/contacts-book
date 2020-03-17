import ContactList from '../ContactList/index.js';

const listTemplate = `
  <li>
    <a id="link">
    </a>
  </li>
`;

const editTemplate = `
  <style>
    label { display: block; }
  </style>
  <form id="form" method="dialog">
    <input type="hidden" name="id" id="id">
    <label id="firstNameSection">
      First name:
      <input id="firstName" name="firstName">
    </label>
    <label id="lastNameSection">
      Last name:
      <input id="lastName" name="lastName">
    </label>
    <label id="emailSection">
      E-mail:
      <input id="email" type="email" name="email">
    </label>
    <label id="dateOfBirthSection">
      Date of birth:
      <input id="dateOfBirth" type="date" name="dateOfBirth">
    </label>
    <button>
      Save
    </button>
  </form>
`;

class ContactItem extends HTMLElement {
  constructor() {
    super();

    this._mode = 'none';
    this._value = {};
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if (this.parentElement instanceof ContactList) {
      this.shadowRoot.innerHTML = listTemplate;
      this._mode = 'list';
    } else {
      this.shadowRoot.innerHTML = editTemplate;
      this._mode = 'edit';
    }

    this._populateTemplate();
  }

  disconnectedCallback() {
    this._mode = 'none';
    this.shadowRoot.innerHTML = '';
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this._populateTemplate();
  }

  _populateTemplate() {
    if (this._mode === 'list') {
      return this._populateListTemplate();
    }

    if (this._mode === 'edit') {
      return this._populateEditTemplate();
    }
  }

  _populateListTemplate() {
    const { id = 'new', firstName = '', lastName = '' } = this.value || {};

    const link = this.shadowRoot.getElementById('link');
    link.href = '#';
    link.textContent = `${firstName} ${lastName}`;
    link.addEventListener('click', this._onLinkClick);
  }

  _populateEditTemplate() {
    const {
      id = '',
      firstName = '',
      lastName = '',
      email = '',
      dateOfBirth = '',
    } = this.value || {};

    this.shadowRoot.getElementById('id').value = id;
    this.shadowRoot.getElementById('firstName').value = firstName;
    this.shadowRoot.getElementById('lastName').value = lastName;
    this.shadowRoot.getElementById('email').value = email;
    this.shadowRoot.getElementById('dateOfBirth').value = dateOfBirth;
    this.shadowRoot.getElementById('form').onsubmit = this._onFormSubmit;
  }

  _onFormSubmit = (e) => {
    e.preventDefault();

    this.dispatchEvent(new CustomEvent('contact-submitted', {
      bubbles: true,
      composed: true,
      detail: Object.fromEntries([...new FormData(e.target).entries()])
    }));
  };

  _onLinkClick = (e) => {
    e.preventDefault();

    this.dispatchEvent(new CustomEvent('contact-selected', {
      bubbles: true,
      composed: true,
      detail: this.value,
    }));
  };
}

customElements.define('contact-item', ContactItem);

export default ContactItem;
