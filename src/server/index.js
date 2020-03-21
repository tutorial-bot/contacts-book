import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import Store from '../common/model/Store';
import LocationBuilder from '../common/model/LocationBuilder';
import HttpError from './utils/HttpError';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public'), {
  immutable: true,
  maxAge: 864e5,
}));


const serializedData = fs.existsSync('.store')
  ? fs.readFileSync('.store', 'utf8')
  : undefined;

const store = new Store(serializedData);

app.get('/', (req, res) => {
  res.redirect('/contacts');
});

app.get('/contacts', (req, res) => {
  res.render('app', {
    state: store.toJSON(),
    location: LocationBuilder.viewContacts(),
  });
});

app.get('/contacts/new', (req, res) => {
  res.render('app', {
    state: store.toJSON(),
    location: LocationBuilder.createContact(),
  });
});

app.get('/contacts/:contactId', (req, res) => {
  const contact = store.getContact(req.params.contactId);

  res.render('app', {
    state: store.toJSON(),
    location: LocationBuilder.editContact(contact),
  });
});

app.put('/contacts/:contactId', express.json(), (req, res) => {
  store.saveContact({
    ...req.body,
    id: req.params.contactId,
  });

  fs.writeFileSync('.store', JSON.stringify(store));

  res.send({ success: true });
});

app.delete('/contacts/:contactId', (req, res) => {
  store.removeContact({ id: req.params.contactId });

  fs.writeFileSync('.store', JSON.stringify(store));

  res.send({ success: true });
});

app.use((req, res) => {
  res.render('error', {
    error: new HttpError(404, 'Not found'),
  });
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.render('error', { error });
});

const port = Number(process.env.PORT || 8080);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${port}`);
});
