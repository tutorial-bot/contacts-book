export default class ClientRouter {
  #todoApp = null;

  constructor(todoApp) {
    this.#todoApp = todoApp;
  }

  listen() {
    window.addEventListener('popstate', this.#onpopstate);
  }

  unlisten() {
    window.removeEventListener('popstate', this.#onpopstate);
  }

  #onpopstate = (e) => {
    this.#todoApp.meta = e.state;
  }
}
