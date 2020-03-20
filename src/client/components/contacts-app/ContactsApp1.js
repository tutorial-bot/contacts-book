// import appTemplate from './ContactsApp.html';
// import reducer from '../../model/contacts.js';
// import {ServerApi} from "../../services/ServerApi.js";
// import ClientRouter from "../../services/ClientRouter";
//
// class ContactApp extends HTMLElement {
//   _isInPopState = false;
//   _shouldReplaceState = false;
//   _initialState = undefined;
//   _state = undefined;
//   _api = new ServerApi();
//
//   constructor() {
//     super();
//
//     this.addEventListener('contact-selected', this._onContactSelected);
//     this.addEventListener('contact-submitted', this._onContactSubmitted);
//     this.attachShadow({ mode: 'open' });
//     this.shadowRoot.innerHTML = appTemplate;
//
//     this._list = this.shadowRoot.getElementById('list');
//     this._dialog = this.shadowRoot.getElementById('dialog');
//     this._errors = this.shadowRoot.getElementById('errors');
//     this._createContact = this.shadowRoot.getElementById('create');
//     this._createContact.addEventListener('click', this._onCreateContact);
//     this._dialog.addEventListener('cancel', this._onCancelDialog);
//     this._router = new ClientRouter(this);
//   }
//
//   _render(oldState = {}) {
//     const { meta, errors, contactForm, contactsList } = this.state;
//
//     if (contactForm !== oldState.contactForm) {
//       this._renderForm(contactForm);
//     }
//
//     if (contactsList !== oldState.contactsList) {
//       this._populateList(contactsList);
//     }
//
//     if (errors !== oldState.errors) {
//       this._populateErrors(errors);
//     }
//
//     if (!this._isInPopState && meta !== oldState.meta) {
//       if (this._shouldReplaceState) {
//         this._shouldReplaceState = false;
//         history.replaceState(this.state.meta, meta.title, meta.location);
//       } else {
//         history.pushState(this.state.meta, meta.title, meta.location);
//       }
//     }
//
//     document.title = meta.title;
//   }
//
//   _renderForm(data) {
//     const hasData = Boolean(data);
//     const isOpen = this._dialog.open;
//
//     this._dialog.innerHTML = '';
//     if (hasData) {
//       const contact = this._renderContact(data);
//       this._dialog.appendChild(contact)
//     }
//
//     if (hasData > isOpen) {
//       this._dialog.showModal();
//     }
//
//     if (hasData < isOpen) {
//       this._dialog.close();
//     }
//   }
//
//   _populateErrors(errors) {
//     this._errors.innerHTML = '';
//
//     for (const error of errors) {
//       const item = document.createElement('li');
//       item.textContent = error;
//       this._errors.appendChild(item);
//     }
//   }
//
//   _actionsPromise = Promise.resolve();
//   _dispatchAction(actionCreator) {
//     this._actionsPromise = this._actionsPromise
//       .then(actionCreator)
//       .then(action => {
//         this.state = reducer(this.state, action);
//       });
//   }
//
//   _onCreateContact = async () => {
//     this._dispatchAction(() => ({
//       type: 'openNewContactForm',
//     }));
//   };
//
//   _onContactSelected = async (e) => {
//     const contact = e.detail;
//
//     this._dispatchAction(() => ({
//       type: 'openEditContactForm',
//       contactId: contact.id,
//     }));
//   };
//
//   _onContactSubmitted = async (e) => {
//     const contact = e.detail;
//
//     this._shouldReplaceState = true;
//     this._dispatchAction(async () => {
//       await this._api.saveContact(contact);
//
//       return {
//         type: 'saveContact',
//         contact,
//       };
//     });
//   };
//
//   _onCancelDialog = async (e) => {
//     this._shouldReplaceState = true;
//     this._dispatchAction(() => {
//       return ({
//         type: 'discardEditing',
//       });
//     });
//   };
// }
//
// ContactApp.observedAttributes = ['initial-state'];
//
// customElements.define('contacts-app', ContactApp);
//
// export default ContactApp;
