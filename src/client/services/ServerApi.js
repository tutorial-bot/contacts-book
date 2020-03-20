export default class ServerApi {
  async putContact(contact) {
    return this.#fetchContact('PUT', contact.id, contact);
  }

  async deleteContact(contact) {
    return this.#fetchContact('DELETE', contact.id);
  }

  #fetchContact = async (method, contactId, body) => {
    const url = `/contacts/${contactId}`;
    const data = {
      method,
      headers: {},
    };

    if (body) {
      data.headers['Content-Type'] = 'application/json';
      data.body = JSON.stringify(body);
    }

    return fetch(url, data).then((r) => r.json());
  }
}
