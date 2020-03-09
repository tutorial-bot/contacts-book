const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const express = require('express');

// const redisClient = require('./services/redis');

const HttpError = require('./utils/HttpError');

const app = express();
const reducer = require('./model/contacts');

let state = reducer(); // initial state

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(function (req, res, next) {
  req.state = state;
  next();
});

app.get('/', function (req, res) {
  res.redirect('/contacts');
});

app.get('/contacts', renderContacts);

app.get('/contacts/new', applyAction(() => ({
  type: 'openNewContactForm',
  template: {},
}), false), renderContacts);

app.get('/contacts/:contactId', applyAction((state, req) => ({
  type: 'openEditContactForm',
  contactId: req.params.contactId,
}), false), renderContacts);

app.post('/contacts', express.json(), applyAction((state, req) => ({
  type: 'saveContact',
  contact: req.body,
}), true), renderConfirmation);

app.put('/contacts/:contactId', express.json(), applyAction((state, req) => ({
  type: 'saveContact',
  contactId: req.params.contactId,
  contact: req.body,
}), true), renderConfirmation);

app.delete('/contacts/:contactId', applyAction((state, req) => ({
  type: 'deleteContact',
  contactId: +req.params.contactId,
}), true), renderConfirmation);

function applyAction(createAction, shouldPersist) {
  return async function (req, res, next) {
    const action = await createAction(req.state, req);
    if (action) {
      req.state = reducer(req.state, action);
    }

    if (shouldPersist) {
        state = req.state;
    }

    next();
  }
}

function renderContacts(req, res) {
  if (req.path !== req.state.meta.location) {
    return res.redirect(req.state.meta.location);
  }

  if (!req.accepts('html')) {
    return res.send(req.state);
  }

  res.render('app', {
    state: req.state,
  });
}

function renderConfirmation(req, res) {
  if (!req.accepts('json')) {
    res.redirect('/contacts');
  } else {
    res.send({ success: true });
  }
}

app.use(() => {
  throw new HttpError(404, 'Not found');
});

app.use(function (err, req, res, _next) {
  const data = {
    status: err instanceof HttpError ? err.statusCode : 500,
    error: err ? err.stack : String(err),
  };

  if (req.accepts('html')) {
    res.render('error', data);
  } else {
    res.send(data);
  }
});

const port = Number(process.env.PORT || 8080);

app.listen(port, function () {
  console.log('Listening on port: ' + port);
});
