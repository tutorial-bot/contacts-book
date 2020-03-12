import template from './ContactsApp.html';
import Store from '../../../common/Store';

export default class ContactsApp extends HTMLElement {
    #store = null;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = template;
    }

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

    attributeChangedCallback(key, oldValue, newValue) {
      if (!this.#store && key === 'initial-state') {
        this.#store = new Store(newValue);
      }
    }

    static observedAttributes = ['initial-state'];
}
