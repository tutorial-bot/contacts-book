export default class ContactsList extends HTMLElement {
  #items = [];
  #list = document.createElement('ol');

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(this.#list);
  }

  get items() {
    return this.#items;
  }

  set items(value) {
    const oldCount = this.#items.length;
    const newCount = value.length;
    const minCount = Math.min(newCount, oldCount);
    const maxCount = Math.max(newCount, oldCount);

    for (let index = 0; index < maxCount; index++) {
      const shouldUpdate = index < minCount;
      const shouldAdd = !shouldUpdate && (index >= oldCount);
      const shouldDelete = !shouldUpdate && (index >= newCount);

      const itemValue = value[index];

      if (shouldAdd) {
        this.#appendListItem(itemValue, index)
        continue;
      }

      if (shouldUpdate) {
        this.#updateListItem(itemValue, index);
        continue;
      }

      if (shouldDelete) {
        this.#removeListItem(itemValue, index);
        continue;
      }
    }

    this.#items = value;
  }

  #appendListItem(value) {
    const contactsItem = document.createElement('contacts-item');
    contactsItem.value = value;

    const li = document.createElement('li');
    li.append(contactsItem);

    this.#list.appendChild(li);
  }

  #updateListItem(value, index) {
    const li = this.#list.children[index];
    const [contactsItem] = li.getElementsByTagName('contacts-item');

    console.assert(contactsItem, '<contacts-list> should have <contacts-item> within every <li>');
    contactsItem.value = value;
  }

  #removeListItem(_value, index) {
    const li = this.#list.children[index];
    console.assert(li, `<contacts-list> should have <li> at index: ${index}`);
    li.remove();
  }
}
