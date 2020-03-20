import { mapValues } from 'lodash';
import template from './ContactsApp.html';
import AppState from '../../model/AppState';
import ClientStore from '../../services/ClientStore';
import ClientRouter from '../../services/ClientRouter';

export default class ContactsApp extends HTMLElement {
  /** @type {ClientStore} */
  #store = null;

  get store() {
    if (!this.#store) {
      throw new Error('Store is not initialized');
    }

    return this.#store;
  }

  /** @type {AppState} */
  #appState = null;

  get appState() {
    if (!this.#appState) {
      throw new Error('App state is not initialized');
    }

    return this.#appState;
  }

  /** @type {ClientRouter} */
  #router = null;

  #elements = {
    create: null,
    list: null,
    dialog: null,
    errors: null,
  };

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
    this.#elements = mapValues((_, key) => this.shadowRoot.getElementById(key));
  }

  attributeChangedCallback(key, oldValue, newValue) {
    if (!this.#store && key === 'initial-state') {
      this.#store = new ClientStore(newValue);
      this.#appState = new AppState(this.#store);
      this.#router = new ClientRouter(this.#appState);

      this.#elements.list.value = this.#store.getContacts();
      this.#addListeners();
    }
  }

  #addListeners = () => {
  };

  connectedCallback() {
    this.#router.listen();
  }

  disconnectedCallback() {
    this.#router.unlisten();
  }

  static observedAttributes = ['initial-state'];
}
