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

  async addContact(contact) {
    await this.#withinTransaction(async () => {
      this.#optimistic.addContact(contact);
      await this.#api.putContact(contact);
    });

    this.#dispatchEvent({
      type: 'contacts.addContact',
      detail: contact,
    });
  }

  async updateContact(contact) {
    await this.#withinTransaction(async () => {
      this.#optimistic.updateContact(contact);
      await this.#api.patchContact(contact);
    });

    this.#dispatchEvent({
      type: 'contacts.updateContact',
      detail: contact,
    });
  }

  async removeContact(contact) {
    await this.#withinTransaction(async () => {
      this.#optimistic.removeContact(contact);
      await this.#api.deleteContact(contact);
    });

    this.#dispatchEvent({
      type: 'contacts.removeContact',
      detail: contact,
    });
  }

  #isInTransaction = false;

  async #withinTransaction(callback) {
    if (this.#isInTransaction) {
      throw new Error('Cannot execute multiple operations within the same transaction');
    }

    try {
      this.#isInTransaction = true;
      this.#optimistic = this.#confirmed.clone();
      await callback();
      this.#confirmed = this.#optimistic;
    } catch (e) {
      this.#optimistic = this.#confirmed;
      this.#dispatchEvent({
        type: 'contacts-error',
        detail: e,
      });
      throw e;
    } finally {
      this.#isInTransaction = false;
    }
  }

  #dispatchEvent({ type, detail }) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail,
    }));
  }
}
