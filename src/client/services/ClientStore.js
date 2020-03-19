import {capitalize} from 'lodash';

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
    const dispatch = this.#prepareEventDispatches('addContact');

    if (dispatch.before(contact)) {
      await this.#withinTransaction(async () => {
        this.#optimistic.addContact(contact);
        dispatch.optimistic(contact);
        await this.#api.putContact(contact);
      });

      dispatch.confirmed(contact);
    }
  }

  async updateContact(contact) {
    const dispatch = this.#prepareEventDispatches('updateContact');

    if (dispatch.before(contact)) {
      await this.#withinTransaction(async () => {
        this.#optimistic.updateContact(contact);
        dispatch.optimistic(contact);
        await this.#api.patchContact(contact);
      });

      dispatch.confirmed(contact);
    }
  }

  async removeContact(contact) {
    const dispatch = this.#prepareEventDispatches('removeContact');

    if (dispatch.before(contact)) {
      await this.#withinTransaction(async () => {
        this.#optimistic.removeContact(contact);
        dispatch.optimistic(contact);
        await this.#api.deleteContact(contact);
      });

      dispatch.confirmed(contact);
    }
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
      this.#revert();
      this.#dispatchStoreEvent({
        type: 'error',
        detail: e,
      });

      throw e;
    } finally {
      this.#isInTransaction = false;
    }
  }

  #revert() {
    this.#optimistic = this.#confirmed;
    this.#dispatchStoreEvent({
      type: 'reset',
    });
  }

  #prepareEventDispatches(type) {
    return {
      before: (detail) => {
        return this.#dispatchStoreEvent({
          type: `before${capitalize(type)}`,
          cancelable: true,
          detail,
        });
      },
      optimistic: (detail) => {
        return this.#dispatchStoreEvent({ type, detail });
      },
      confirmed: (detail) => {
        return this.#dispatchStoreEvent({
          type: `${type}Done`,
          detail,
        });
      },
    };
  }

  #dispatchStoreEvent({ type, cancelable = false, detail }) {
    return this.dispatchEvent(new CustomEvent(`store:${type}`, {
      bubbles: true,
      composed: true,
      cancelable,
      detail,
    }));
  }
}
