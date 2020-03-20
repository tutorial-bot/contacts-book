export default class ClientRouter {
  /** @type {AppState} */
  #appState = null;

  constructor(appState) {
    this.#appState = appState;
    this.#appState.addEventListener('gotoContactsList', this.#replaceState);
    this.#appState.addEventListener('openNewContactForm', this.#pushState);
    this.#appState.addEventListener('openEditContactForm', this.#pushState);
    this.#appState.addEventListener('pushError', this.#cancelPopState);
  }

  listen() {
    window.addEventListener('popstate', this.#onpopstate);
    this.navigateTo(window.location.pathname);
  }

  unlisten() {
    window.removeEventListener('popstate', this.#onpopstate);
  }

  #isInPopState = false;

  #onpopstate = () => {
    this.#isInPopState = true;
    this.navigateTo(window.location.pathname);
  };

  navigateTo(path) {
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

  #pushState = ({ detail }) => {
    if (!this.#isInPopState) {
      const { path, title } = detail.location;
      window.history.pushState(null, title, path);
    }

    this.#isInPopState = false;
  };

  #replaceState = ({ detail }) => {
    if (!this.#isInPopState) {
      const { path, title } = detail.location;
      window.history.replaceState(null, title, path);
    }

    this.#isInPopState = false;
  };

  #cancelPopState = () => {
    this.#isInPopState = false;
  };
}
