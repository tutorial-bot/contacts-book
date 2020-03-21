import capitalize from 'lodash/capitalize';

export default class ClientStore extends EventTarget {
  /**
   * @type {Store}
   */
  #confirmed = null;

  /**
   * @type {Store}
   */
  #optimistic = null;

  /**
   * @type {ServerApi}
   */
  #api = null;

  constructor({ store, api }) {
    super();

    this.#confirmed = store;
    this.#optimistic = store;
    this.#api = api;
  }

  pendingIds = new Set();

  hasContact(contactId) {
    return this.#optimistic.hasContact(contactId);
  }

  getContact(contactId) {
    return this.#optimistic.getContact(contactId);
  }

  getContacts() {
    return this.#optimistic.getContacts();
  }

  async saveContact(contact) {
    const dispatch = this.#prepareEventDispatches('saveContact');

    if (dispatch.before(contact)) {
      await this.#withinTransaction(async () => {
        this.#optimistic.saveContact(contact);
        this.pendingIds.add(contact.id);
        dispatch.optimistic(contact);
        await this.#api.putContact(contact);
      });

      dispatch.confirmed(contact);
    }
  }

  async removeContact(contact) {
    const dispatch = this.#prepareEventDispatches('removeContact');

    if (dispatch.before(contact)) {
      await this.#withinTransaction(async () => {
        this.#optimistic.patchContact({ id: contact.id, deleted: true });
        this.pendingIds.add(contact.id);
        dispatch.optimistic(contact);
        await this.#api.deleteContact(contact);
        this.#optimistic.removeContact(contact);
      });

      dispatch.confirmed(contact);
    }
  }

  #isInTransaction = false;

  #withinTransaction = async (callback) => {
    if (this.#isInTransaction) {
      throw new Error('Cannot execute multiple operations within the same transaction');
    }

    try {
      this.#isInTransaction = true;
      this.#optimistic = this.#confirmed.clone();
      await callback();
      this.#confirmed = this.#optimistic;
    } catch (e) {
      this.#revert();
      this.#dispatchStoreEvent({
        type: 'error',
        detail: e,
      });

      throw e;
    } finally {
      this.#isInTransaction = false;
      this.pendingIds.clear();
    }
  };

  #revert = () => {
    if (!this.#optimistic.equals(this.#confirmed)) {
      this.#optimistic = this.#confirmed;

      this.#dispatchStoreEvent({ type: 'change' });
      this.#dispatchStoreEvent({ type: 'changeDone' });
    }
  };

  #prepareEventDispatches = (type) => ({
    before: (detail) => this.#dispatchStoreEvent({
      type: `before${capitalize(type)}`,
      cancelable: true,
      detail,
    }),
    optimistic: (detail) => {
      this.#dispatchStoreEvent({ type: 'change' });
      this.#dispatchStoreEvent({ type, detail });
    },
    confirmed: (detail) => {
      this.#dispatchStoreEvent({ type: 'changeDone' });
      this.#dispatchStoreEvent({
        type: `${type}Done`,
        detail,
      });
    },
  });

  #dispatchStoreEvent = ({ type, cancelable = false, detail }) => {
    const result = this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      cancelable,
      detail,
    }));

    return result;
  };
}
