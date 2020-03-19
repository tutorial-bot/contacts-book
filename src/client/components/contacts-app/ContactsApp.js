import template from './ContactsApp.html';
import Store from '../../../common/model/Store';
import ClientRouter from '../../services/ClientRouter';

export default class ContactsApp extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
  }

  #store = null;

  get store() {
    if (!this.#store) {
      throw new Error('Store is not initialized');
    }

    return this.#store;
  }

  set store(value) {
    if (value) {
      this.#store = value;
    }
  }

  #router = new ClientRouter(this);

  get location() {
    return this.#router.location;
  }

  set location(value) {
    if (value && typeof value === 'string') {
      this.#router.location = JSON.parse(value);
    } else {
      this.#router.location = value;
    }
  }

  attributeChangedCallback(key, oldValue, newValue) {
    if (!this.#store && key === 'initial-state') {
      this.#store = new Store(newValue);
    }

    if (key === 'meta') {
      this.location = newValue;
    }
  }

  static observedAttributes = ['initial-state', 'meta'];
}
