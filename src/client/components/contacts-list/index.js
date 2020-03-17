const listTemplate = `
  <ol id="list">
    <slot>
    </slot>
  </ol>
`;

class ContactList extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = listTemplate;
  }
}

customElements.define('contact-list', ContactList);

export default ContactList;
