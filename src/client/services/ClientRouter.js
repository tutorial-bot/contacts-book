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

  #onpopstate = (e) => {
    this.handleRoute(location.pathname);
  };

  handleRoute(path) {
    const equals = str => path === str || path === `${str}/`;

    if (!path || equals('')) {
      return this.#appState.gotoContactsList();
    }

    if (equals('/contacts')) {
      return this.#appState.gotoContactsList();
    }

    if (equals('/contacts/new')) {
      return this.#appState.openNewContactForm();
    }

    if (path.startsWith('/contacts/')) {
      const id = path.split('/')[2];
      return this.#appState.openEditContactForm(id);
    }

    this.#appState.pushError(new Error(`Cannot resolve path: ${path}`));
  }
}
