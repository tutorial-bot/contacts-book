import template from './ContactsItem.html';
import LocationBuilder from '../../../common/model/LocationBuilder';

const EMPTY = Object.freeze({});

export default class ContactsItem extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
    this.addEventListener('click', this.#onClick);

    this.#render();
  }

  #value = EMPTY;

  get value() {
    return this.#value;
  }

  set value(rawValue) {
    const value = rawValue || EMPTY;

    if (this.#value !== value) {
      this.#value = value;
      this.#render();
    }
  }

  #disabled = false;

  get disabled() {
    return this.#disabled;
  }

  set disabled(rawValue) {
    const value = Boolean(rawValue);

    if (this.#disabled !== value) {
      this.#disabled = value;
      this.toggleAttribute('disabled', this.#disabled);
      this.#render();
    }
  }

  #render = () => {
    const { firstName = '', lastName = '', deleted = false } = this.value;

    const link = this.shadowRoot.getElementById('link');
    if (this.disabled) {
      link.removeAttribute('href');
    } else {
      link.href = LocationBuilder.editContact(this.value).path;
    }

    link.textContent = `${firstName} ${lastName}`;
    this.toggleAttribute('deleted', deleted);
  };

  #onClick = (e) => {
    e.preventDefault();

    this.dispatchEvent(new CustomEvent('contacts-item:click', {
      bubbles: true,
      composed: true,
      detail: this.value,
    }));
  };
}
