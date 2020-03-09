import * as path from 'path';
import express from 'express';
import appView from './views/app.ejs';

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname));

app.get('/', function (req, res) {
    res.render(appView, {
      meta: {
        lang: 'en',
        title: 'Contacts Book'
      },
    });
});

const port = Number(process.env.PORT || 8080);

app.listen(port, function () {
    console.log('Listening on port: ' + port);
});
