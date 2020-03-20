import * as path from 'path';
import express from 'express';
import Store from '../common/model/Store';
import LocationBuilder from "../common/model/LocationBuilder";

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const store = new Store();

app.get('/', (req, res) => {
  res.redirect('/contacts');
});

app.get('/contacts', (req, res) => {
  res.render('app', {
    state: store.toJSON(),
    location: LocationBuilder.viewContacts(),
  });
});

const port = Number(process.env.PORT || 8080);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port: ${port}`);
});
