export default class App {
  createInitialState() {
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

  gotoContactsList(state) {
    return {
      ...state,
      meta: this.createInitialState().meta,
    };
  }

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
  }

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
  }

  saveContact(state, action) {
    const { contact } = action;
    const contacts = state.contactsList.items;

    const index = _.findIndex(contacts, { id: contact.id });

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
      ...this.gotoContactsList(state),
      contactForm: null,
      contactsList: {
        ...state.contactsList,
        items: updatedContacts,
      },
    };
  }

  discardEditing(state) {
    return {
      ...this.gotoContactsList(state),
      contactForm: null,
    };
  }

  // static viewContacts() {
  //   return {
  //     href: '/contacts',
  //     title: 'Contacts Book',
  //   };
  // }
  //
  // static createContact() {
  //   return {
  //     href: '/contacts/new',
  //     title: 'New Contact - Contacts Book',
  //   };
  // }
  //
  // static editContact(contact) {
  //   return {
  //     href: `/contacts/${contact.id}`,
  //     title: `${contact.firstName} ${contact.lastName} - Contacts Book`,
  //   };
  // }
  //
  // static determineRoute(url) {
  //   const { pathname } = new URL(url);
  //
  //   if (!pathname || pathname === '/') {
  //     return 'viewContacts';
  //   }
  //
  //   if (pathname === '/contacts') {
  //     return
  //   }
  // }
}
