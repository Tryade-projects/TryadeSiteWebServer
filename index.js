require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 5000;

const RulesSection = require('./models/RulesSection');
const UpdatesSection = require('./models/UpdatesSection');
const StreamersSection = require('./models/StreamersSection');

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
  RulesSection.find()
    .then((rulesSection) => res.status(200).json(rulesSection))
    .catch((error) => res.status(400).json({ error }));
});

/* Creating a new rulesSections in the database. */
app.post('/rulesSections', (req, res) => {
  const rulesSection = new RulesSection({
    ...req.body,
  });
  rulesSection
    .save()
    .then(() =>
      res.status(201).json({ message: 'rulesSection added successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Updating a rulesSections in the database. */
app.put('/rulesSections/:id', (req, res) => {
  RulesSection.updateOne(
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
  RulesSection.deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: 'rulesSection deleted successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* updates */
/* This is a route that will return all the updates in the database. */
app.get('/updatesSections', (_req, res) => {
  UpdatesSection.find()
    .then((updatesSection) => res.status(200).json(updatesSection))
    .catch((error) => res.status(400).json({ error }));
});

/* Creating a new updatesSections in the database. */
app.post('/updatesSections', (req, res) => {
  const updatesSection = new UpdatesSection({
    ...req.body,
  });
  updatesSection
    .save()
    .then(() =>
      res.status(201).json({ message: 'updatesSection added successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Updating a updatesSections in the database. */
app.put('/updatesSections/:id', (req, res) => {
  UpdatesSection.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: 'updatesSection modified successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Deleting a updatesSections from the database. */
app.delete('/updatesSections/:id', (req, res) => {
  UpdatesSection.deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: 'updatesSection deleted successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* streamers */
/* This is a route that will return all the streamers in the database. */
app.get('/streamersSections', (_req, res) => {
  StreamersSection.find()
    .then((streamersSection) => res.status(200).json(streamersSection))
    .catch((error) => res.status(400).json({ error }));
});

/* Creating a new streamersSections in the database. */
app.post('/streamersSections', (req, res) => {
  const streamersSection = new StreamersSection({
    ...req.body,
  });
  streamersSection
    .save()
    .then(() =>
      res.status(201).json({ message: 'streamersSection added successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Updating a streamersSection in the database. */
app.put('/streamersSections/:id', (req, res) => {
  StreamersSection.updateOne(
    { _id: req.params.id },
    { ...req.body, _id: req.params.id }
  )
    .then(() =>
      res
        .status(200)
        .json({ message: 'streamersSection modified successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Deleting a streamersSection from the database. */
app.delete('/streamersSections/:id', (req, res) => {
  StreamersSection.deleteOne({ _id: req.params.id })
    .then(() =>
      res.status(200).json({ message: 'streamersSection deleted successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

app.listen(PORT, () =>
  console.log('Server started at http://localhost:' + PORT)
);
