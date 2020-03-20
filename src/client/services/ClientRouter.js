export default class ClientRouter {
  /** @type {AppState} */
  #appState = null;

  constructor(appState) {
    this.#appState = appState;
  }

  listen() {
    window.addEventListener('popstate', this.#onpopstate);
  }

  unlisten() {
    window.removeEventListener('popstate', this.#onpopstate);
  }

  #onpopstate = () => {
    this.handleRoute(window.location.pathname);
  };

  handleRoute(path) {
    const equals = (str) => path === str || path === `${str}/`;

    if (!path || equals('')) {
      this.#appState.gotoContactsList();
      return;
    }

    if (equals('/contacts')) {
      this.#appState.gotoContactsList();
      return;
    }

    if (equals('/contacts/new')) {
      this.#appState.openNewContactForm();
      return;
    }

    if (path.startsWith('/contacts/')) {
      const id = path.split('/')[2];

      this.#appState.openEditContactForm(id);
      return;
    }

    this.#appState.pushError(new Error(`Cannot resolve path: ${path}`));
  }
}
