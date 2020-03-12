export default class Navigation {
  static viewContacts() {
    return {
      href: '/contacts',
      title: 'Contacts Book',
    };
  }

  static createContact() {
    return {
      href: '/contacts/new',
      title: 'New Contact - Contacts Book',
    };
  }

  static editContact(id) {
    return {
      href: `/contacts/${id}`,
      title: 'New Contact - Contacts Book',
    };
  }
}
