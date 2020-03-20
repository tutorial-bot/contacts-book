import find from 'lodash/find';
import template from './ContactsList.html';
import areSetsEqual from '../../../common/utils/areSetsEqual';

export default class ContactsList extends HTMLElement {
  /** @type {Contact[]} */
  #items = [];

  /** @type {HTMLOListElement} */
  #list = null;

  /** @type {HTMLElement} */
  #noItems = null;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
    this.#list = this.shadowRoot.getElementById('list');
    this.#noItems = this.shadowRoot.getElementById('noItems');
  }

  get items() {
    return this.#items;
  }

  set items(value) {
    this.#render(value);
    this.#items = value;
    this.#noItems.hidden = this.#items.length > 0;
  }

  /** @type {string} */
  #selectedId = '';

  get selectedValue() {
    return find(this.items, { id: this.#selectedId });
  }

  set selectedValue(value) {
    let newId;

    if (!value || !value.id) {
      newId = '';
    } else {
      const contact = find(this.items, { id: value.id });
      newId = contact?.id || '';
    }

    if (this.#selectedId !== newId) {
      this.#selectedId = newId;
      this.#render();
    }
  }

  #pendingIds = new Set();

  get pendingIds() {
    return this.#pendingIds;
  }

  set pendingIds(value) {
    if (!areSetsEqual(this.#pendingIds, value)) {
      this.#pendingIds = new Set(value);
      this.#render();
    }
  }

  #render = (newItems = this.#items) => {
    const oldCount = this.#items.length;
    const newCount = newItems.length;
    const minCount = Math.min(newCount, oldCount);
    const maxCount = Math.max(newCount, oldCount);

    for (let index = 0; index < maxCount; index += 1) {
      const shouldUpdate = index < minCount;
      const shouldAdd = !shouldUpdate && (index >= oldCount);
      const shouldDelete = !shouldUpdate && (index >= newCount);

      const itemValue = newItems[index];

      if (shouldAdd) {
        this.#appendListItem(itemValue, index);
      } else if (shouldUpdate) {
        this.#updateListItem(itemValue, index);
      } else if (shouldDelete) {
        this.#removeListItem(itemValue, index);
      }
    }
  };

  #appendListItem = (value) => {
    const contactsItem = document.createElement('contacts-item');
    contactsItem.value = value;
    contactsItem.disabled = this.#pendingIds.has(value.id);

    const li = document.createElement('li');
    li.append(contactsItem);
    li.classList.toggle('selected', value.id === this.#selectedId);

    this.#list.appendChild(li);
  };

  #updateListItem = (value, index) => {
    const li = this.#list.children[index];
    li.classList.toggle('selected', value.id === this.#selectedId);

    const [contactsItem] = li.getElementsByTagName('contacts-item');

    console.assert(contactsItem, '<contacts-list> should have <contacts-item> within every <li>');
    contactsItem.value = value;
    contactsItem.disabled = this.#pendingIds.has(value.id);
  };

  #removeListItem = (_value, index) => {
    const li = this.#list.children[index];
    console.assert(li, `<contacts-list> should have <li> at index: ${index}`);
    li.remove();
  };
}
