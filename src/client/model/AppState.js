import cloneDeep from 'lodash/cloneDeep';
import Contact from '../../common/model/Contact';
import LocationBuilder from '../../common/model/LocationBuilder';

export default class AppState extends EventTarget {
  /** @type {ClientStore} */
  #store = null;

  #location = LocationBuilder.viewContacts();

  /** @type {Error[]} */
  #errors = [];

  /** @type {Contact} */
  #contactDetails = null;

  constructor(store) {
    super();

    this.#store = store;
  }

  getContactDetails = () => this.#contactDetails;

  selectContact = (contact) => {
    this.#contactDetails = contact;
    this.#dispatchAppEvent({
      type: 'selectContact',
      detail: contact,
    });
  };

  gotoContactsList = () => {
    this.#location = LocationBuilder.viewContacts();
    this.#contactDetails = null;
    this.#dispatchAppEvent({
      type: 'gotoContactsList',
      detail: { location: this.#location },
    });
  };

  openNewContactForm = () => {
    this.#location = LocationBuilder.createContact();
    this.#contactDetails = new Contact();
    this.#dispatchAppEvent({
      type: 'openNewContactForm',
      detail: { location: this.#location },
    });
  };

  openEditContactForm = (contactId = this.#contactDetails?.id) => {
    const contact = this.#store.getContact(contactId);

    this.#location = LocationBuilder.editContact(contact);
    this.#contactDetails = cloneDeep(contact);
    this.#dispatchAppEvent({
      type: 'openEditContactForm',
      detail: {
        location: this.#location,
        contact,
      },
    });
  };

  saveContact = async (contact) => {
    this.#store.addEventListener('change', this.gotoContactsList, { once: true });
    await this.#store.saveContact(contact);
  };

  removeContact = async () => {
    this.#store.addEventListener('change', this.gotoContactsList, { once: true });
    await this.#store.removeContact(this.#contactDetails);
  };

  discardEditing = this.gotoContactsList;

  pushError = (e) => {
    this.#errors.push(e);
    this.#dispatchAppEvent({ type: 'pushError', detail: e });
  };

  discardErrors = () => {
    this.#errors = [];
    this.#dispatchAppEvent({ type: 'discardErrors' });
  };

  #dispatchAppEvent = ({ type, cancelable = false, detail }) => {
    const result = this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      cancelable,
      detail,
    }));

    return result;
  };
}
