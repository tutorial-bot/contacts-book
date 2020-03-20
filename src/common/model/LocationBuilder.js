export default class LocationBuilder {
  static viewContacts() {
    return {
      path: '/contacts',
      title: 'Contacts Book',
    };
  }

  static createContact() {
    return {
      path: '/contacts/new',
      title: 'New Contact - Contacts Book',
    };
  }

  static editContact(contact) {
    return {
      path: `/contacts/${contact.id}`,
      title: `${contact.firstName} ${contact.lastName} - Contacts Book`,
    };
  }
}
