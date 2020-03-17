export class ServerApi {
    async saveContact(contact) {
        return contact.id
            ? this._saveExistingContact(contact)
            : this._saveNewContact(contact);
    }

    async deleteContact(contact) {
        return fetch(`/contacts/${contact.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(r => r.json());
    }

    async _saveExistingContact(contact) {
        return fetch(`/contacts/${contact.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact),
        }).then(r => r.json());
    }

    async _saveNewContact(contact) {
        return fetch('/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contact),
        }).then(r => r.json());
    }
}
