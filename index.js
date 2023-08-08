require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 5000;

const RulesSections = require('./models/RulesSections');

app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);

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
  const project = new RulesSections({
    ...req.body,
  });
  project
    .save()
    .then(() =>
      res.status(201).json({ message: 'rulesSection added successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Deleting a project from the database. */
app.delete('/rulesSections', (req, res) => {
  RulesSections.deleteOne({ id: req.body.id.toString() })
    .then(() =>
      res.status(200).json({ message: 'rulesSection deleted successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

app.listen(PORT, () =>
  console.log('Server started at http://localhost:' + PORT)
);
