import {cloneDeep} from 'lodash';
import Contact from "../../common/model/Contact";
import LocationBuilder from "../../common/model/LocationBuilder";

export default class AppState extends EventTarget {
  /** @type {ClientStore} */
  #store = null;

  #location = LocationBuilder.viewContacts();

  /** @type {Error[]} */
  #errors = [];

  #contactsList = {
    sortBy: 'firstName',
  };

  /** @type {Contact} */
  #contactDetails = null;

  constructor(store) {
    super();

    this.#store = store;
  }

  gotoContactsList = () => {
    this.#location = LocationBuilder.viewContacts();
    this.#contactDetails = null;
    this.#dispatchAppEvent({ type: 'gotoContactsList' });
  };

  openNewContactForm = () => {
    this.#location = LocationBuilder.createContact();
    this.#contactDetails = new Contact();
    this.#dispatchAppEvent({ type: 'openNewContactForm' });
  };

  openEditContactForm = (contactId) => {
    const contact = this.#store.getContact(contactId);

    this.#location = LocationBuilder.editContact(contact);
    this.#contactDetails = cloneDeep(contact);
    this.#dispatchAppEvent({ type: 'openEditContactForm', detail: contact });
  };

  saveContact = async () => {
    const contact = this.#contactDetails;

    this.#store.addEventListener('store:change', this.gotoContactsList, { once: true });
    if (this.#store.hasContact(contact.id)) {
      await this.#store.updateContact(contact);
    } else {
      await this.#store.addContact(contact);
    }
  };

  removeContact = async () => {
    this.#store.addEventListener('store:change', this.gotoContactsList, { once: true });
    await this.#store.removeContact(this.#contactDetails);
  };

  discardEditing = this.gotoContactsList;

  pushError = e => {
    this.#errors.push(e);
    this.#dispatchAppEvent({ type: 'pushError', detail: e });
  };

  discardErrors = () => {
    this.#errors = [];
    this.#dispatchAppEvent({ type: 'discardErrors' });
  };

  #dispatchAppEvent({ type, cancelable = false, detail }) {
    return this.dispatchEvent(new CustomEvent(`app:${type}`, {
      bubbles: true,
      composed: true,
      cancelable,
      detail,
    }));
  }
}
