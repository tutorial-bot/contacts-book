import mapValues from 'lodash/mapValues';
import template from './ContactsApp.html';
import AppState from '../../model/AppState';
import ClientStore from '../../model/ClientStore';
import ClientRouter from '../../services/ClientRouter';
import Store from '../../../common/model/Store';
import ServerApi from '../../services/ServerApi';

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
    this.#elements = mapValues(this.#elements, (_, key) => this.shadowRoot.getElementById(key));
  }

  attributeChangedCallback(key, oldValue, newValue) {
    if (!this.#store && key === 'initial-state') {
      this.#store = new ClientStore({
        store: new Store(newValue),
        api: new ServerApi(),
      });

      this.#appState = new AppState(this.#store);
      this.#router = new ClientRouter(this.#appState);

      this.#elements.list.items = this.#store.getContacts();
      this.#addListeners();
    }
  }

  #addListeners = () => {
    this.#elements.create.addEventListener('click', this.#onNewContactClick);
    this.#elements.dialog.addEventListener('cancel', this.#onDialogCancel);
    this.#appState.addEventListener('openNewContactForm', this.#onOpenNewContactForm);
    this.#appState.addEventListener('openEditContactForm', this.#onOpenEditContactForm);
    this.#appState.addEventListener('gotoContactsList', this.#onGotoContactsList);
    this.#appState.addEventListener('selectContact', this.#onSelectContact);
    this.#appState.addEventListener('errorsOverlay', this.#onErrorsOverlay);

    this.#store.addEventListener('change', this.#onContactsChange);
    this.#store.addEventListener('changeDone', this.#onContactsChange);
    this.#store.addEventListener('saveContact', this.#onSaveContact);

    this.addEventListener('contacts-details:save', this.#onContactFormSave);
    this.addEventListener('contacts-details:delete', this.#onContactFormDelete);
    this.addEventListener('contacts-details:discard', this.#onContactFormDiscard);
    this.addEventListener('contacts-item:click', this.#onContactClick);
  };

  connectedCallback() {
    this.#router.listen();
  }

  disconnectedCallback() {
    this.#router.unlisten();
  }

  #onNewContactClick = () => {
    this.#appState.openNewContactForm();
  };

  #onDialogCancel = () => {
    this.#appState.discardEditing();
  };

  #onOpenNewContactForm = () => {
    const contact = this.#appState.getContactDetails();
    this.#showContactDetails(contact, true);
  };

  #onOpenEditContactForm = () => {
    const contact = this.#appState.getContactDetails();
    this.#showContactDetails(contact, false);
  };

  #showContactDetails = (contact, isNew) => {
    const details = document.createElement('contacts-details');
    details.value = this.#appState.getContactDetails();
    details.new = isNew;

    this.#elements.dialog.innerHTML = '';
    this.#elements.dialog.append(details);
    this.#elements.dialog.showModal();
  };

  #onGotoContactsList = () => {
    this.#elements.dialog.close();
  };

  #onContactFormSave = (e) => {
    this.#appState.saveContact(e.detail);
  };

  #onContactFormDelete = () => {
    this.#appState.removeContact();
  };

  #onContactFormDiscard = () => {
    this.#appState.discardEditing();
  };

  #onContactsChange = () => {
    this.#elements.list.items = this.#store.getContacts();
    this.#elements.list.pendingIds = this.#store.pendingIds;
  };

  #onContactClick = (e) => {
    const contact = e.detail;

    this.#appState.selectContact(contact);
    if (!this.#store.pendingIds.has(contact.id)) {
      this.#appState.openEditContactForm(contact.id);
    }
  };

  #onSelectContact = (e) => {
    const contact = e.detail;
    this.#elements.list.selectedValue = contact;
  };

  #onSaveContact = (e) => {
    this.#elements.list.selectedValue = e.detail;
  };

  #onErrorsOverlay = (e) => {
    const error = e.detail;
    this.#elements.errors.textContent = error;
    this.#elements.errors.hidden = !error;

    if (error) {
      setTimeout(() => {
        this.#appState.discardErrors();
      }, 5000);
    }
  };

  static observedAttributes = ['initial-state'];
}
