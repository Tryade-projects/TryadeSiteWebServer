require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 5000;

const RulesSections = require('./models/RulesSections');
const UpdatesSections = require('./models/UpdatesSections');

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);

// Ajoutez ce middleware pour parser automatiquement les données JSON du corps de la requête
app.use(express.json());

/* Connecting to the MongoDB database. */
mongoose
  .connect(process.env.MONGODB_URI || '', {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.get('/', (req, res) => {
  res.send('Hello World !!');
});

/* projects */
/* This is a route that will return all the projects in the database. */
app.get('/rulesSections', (_req, res) => {
  RulesSections.find()
    .then((rulesSections) => res.status(200).json(rulesSections))
    .catch((error) => res.status(400).json({ error }));
});

/* Creating a new rulesSections in the database. */
app.post('/rulesSections', (req, res) => {
  const rulesSections = new RulesSections({
    ...req.body,
  });
  rulesSections
    .save()
    .then(() =>
      res.status(201).json({ message: 'rulesSection added successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Updating a rulesSections in the database. */
app.put('/rulesSections/:id', (req, res) => {
  RulesSections.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: 'rulesSection modified successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Deleting a rulesSections from the database. */
app.delete('/rulesSections/:id', (req, res) => {
  RulesSections.deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: 'rulesSection deleted successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* updates */
/* This is a route that will return all the updates in the database. */
app.get('/updatesSections', (_req, res) => {
  UpdatesSections.find()
    .then((updatesSections) => res.status(200).json(updatesSections))
    .catch((error) => res.status(400).json({ error }));
});

/* Creating a new updatesSections in the database. */
app.post('/updatesSections', (req, res) => {
  const updatesSections = new UpdatesSections({
    ...req.body,
  });
  updatesSections
    .save()
    .then(() =>
      res.status(201).json({ message: 'rulesSection added successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Updating a updatesSections in the database. */
app.put('/updatesSections/:id', (req, res) => {
  UpdatesSections.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: 'rulesSection modified successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Deleting a updatesSections from the database. */
app.delete('/updatesSections/:id', (req, res) => {
  UpdatesSections.deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: 'rulesSection deleted successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

app.listen(PORT, () =>
  console.log('Server started at http://localhost:' + PORT)
);