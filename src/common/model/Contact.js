import * as random from '../utils/random';

export default class Contact {
  id = random.id();

  firstName = '';

  lastName = '';

  company = '';

  email = [];

  phone = [];
}
