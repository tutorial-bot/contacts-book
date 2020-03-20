import template from './ContactsItem.html';
import LocationBuilder from '../../../common/model/LocationBuilder';

export default class ContactsItem extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
    this.#render();
  }

  #value = {};

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value || {};
    this.#render();
  }

  #render = () => {
    const { firstName = '', lastName = '' } = this.value;

    const link = this.shadowRoot.getElementById('link');
    link.href = LocationBuilder.editContact(this.value);
    link.textContent = `${firstName} ${lastName}`;
    link.addEventListener('click', this.#onLinkClick);
  };

  #onLinkClick = (e) => {
    e.preventDefault();

    this.dispatchEvent(new CustomEvent('contact-selected', {
      bubbles: true,
      composed: true,
      detail: this.value,
    }));
  };
}
