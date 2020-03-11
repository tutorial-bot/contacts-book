import * as path from 'path';
import express from 'express';
import {Store} from "../common/Store";
import {Navigation} from "../common/Navigation";

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const store = new Store();

app.get('/', function (req, res) {
  res.render('app', {
    state: store.toJSON(),
    meta: Navigation.viewContacts(),
  });
});

const port = Number(process.env.PORT || 8080);

app.listen(port, function () {
    console.log('Listening on port: ' + port);
});
