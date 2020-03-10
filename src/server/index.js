import * as path from 'path';
import express from 'express';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.render('app', {
    state: {
      meta: {
        lang: 'en',
        title: 'Contacts Book'
      },
    },
  });
});

const port = Number(process.env.PORT || 8080);

app.listen(port, function () {
    console.log('Listening on port: ' + port);
});
