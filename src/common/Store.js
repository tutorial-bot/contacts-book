export class Store {
    #contacts = new Map();
    #lastUpdated = new Date(0);

    constructor(state) {
        if (typeof state === 'string') {
            state = JSON.parse(state);
        }

        if (state) {
            this.#contacts = new Map(Object.entries(state.contacts));
            this.#lastUpdated = new Date(state.lastUpdated);
        }
    }

    toJSON() {
        return {
            contacts: Object.fromEntries(this.#contacts.entries()),
            lastUpdated: this.#lastUpdated,
        };
    }

    addContact({ id, ...data }) {
        if (!id) {
            throw new Error('Failed to create a contact due to the missing ID');
        }

        if (!data.firstName && !data.lastName) {
            throw new Error('Failed to create a contact due to the missing name');
        }

        this.#contacts.set(id, {id, ...data});
        this.#lastUpdated = new Date();
    }

    updateContact({ id, ...data }) {
        const contact = this.#contacts.get(id);
        if (contact) {
            this.#contacts.set(id, { ...contact, ...data });
            this.#lastUpdated = new Date();
        } else {
            throw new Error(`Failed to update a contact due to the non-existent ID: ${id}`);
        }
    }

    removeContact({ id }) {
        if (this.#contacts.delete(id)) {
            this.#lastUpdated = new Date();
        } else {
            throw new Error(`Failed to delete a contact due to the non-existent ID: ${id}`);
        }
    }
}
