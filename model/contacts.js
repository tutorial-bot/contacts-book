const _ = require('lodash');

function createInitialState() {
    return {
        meta: {
            title: 'Contacts',
            location: '/contacts',
        },
        errors: [],
        contactForm: null,
        contactsList: {
            items: [],
            selectedIndex: -1,
        },
    };
}

function createContact() {
    return {
        firstName: '',
        lastName: '',
        company: '',
        email: [],
        phone: [],
    };
}

const actions = {
    gotoContactsList(state) {
        return {
            ...state,
            meta: createInitialState().meta,
        };
    },

    openNewContactForm(state) {
        return {
            ...state,
            meta: {
                ...state.meta,
                title: 'New contact',
                location: '/contacts/new',
            },
            contactForm: {
                ...createContact(),
            },
        };
    },

    openEditContactForm(state, action) {
        const contacts = state.contactsList.items;
        const item = _.find(contacts, { id: action.contactId });
        if (!item) {
            return state;
        }

        return {
            ...state,
            meta: {
                ...state.meta,
                location: `/contacts/${item.id}`,
                title: `${item.firstName} ${item.lastName} - Edit`,
            },
            contactForm: _.cloneDeep(item),
            contactsList: {
                ...state.contactsList,
                selectedIndex: contacts.indexOf(item),
            },
        }
    },

    saveContact(state, action) {
        const { contact, contactId } = action;
        const contacts = state.contactsList.items;

        const index = _.findIndex(contacts, { id: contactId });

        let updatedContacts;
        if (index === -1) {
            updatedContacts = contacts.concat(contact);
        } else {
            updatedContacts = contacts.slice();
            updatedContacts.splice(index, 1, contact);
        }

        if (!contact.id) {
            contact.id = Math.random().toString(16).slice(2);
            // TODO: immutability
        }

        return {
            ...actions.gotoContactsList(state),
            contactForm: null,
            contactsList: {
                ...state.contactsList,
                items: updatedContacts,
            },
        };
    },

    discardEditing(state) {
        return {
            ...actions.gotoContactsList(state),
            contactForm: null,
        };
    },
};

module.exports = function (state = createInitialState(), action) {
  if (!action) {
    return state;
  }

  if (actions[action.type]) {
    return actions[action.type](state, action);
  }
};
