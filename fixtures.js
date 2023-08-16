require('dotenv').config();
const mongoose = require('mongoose');
const { v4 } = require('uuid');

const RulesSections = require('./models/RulesSection');
const RulesSectionsData = require('./rules.json');

const UpdatesSections = require('./models/UpdatesSection');
const UpdatesSectionsData = require('./updates.json');

const StreamersSections = require('./models/StreamersSection');
const StreamersSectionsData = require('./streamers.json');

const cleAPI = process.env.MONGODB_URI || '';

/**
 * It connects to the MongoDB database, then it loops through the data and adds each element to the database
 * @param {Object} Model - the model you want to use to create the new elements.
 * @param {object} data - the data to be inserted into the database.
 * @param {string=} arrayName - the name of the array of objects to be inserted into the database - optional.
 * @returns {Promise} - a promise that resolves when the data is inserted.
 */
async function start(Model, data, arrayName) {
  /* Connecting to the MongoDB database. */
  try {
    await mongoose.connect(cleAPI, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connexion à MongoDB réussie !');
    for (const fixture in data) {
      const newData = data[fixture];
      // Générer une valeur unique pour les champs id dans un tableau d'objets de niveau 2
      if (arrayName) {
        for (const elm of newData[arrayName]) {
          elm.id = v4();
        }
      }

      // Générer une valeur unique pour le champ id dans updatesSection
      newData.id = v4();

      const newElm = new Model(newData);
      await newElm.save();
      console.log('New element added successfully');
    }
  } catch (error) {
    console.log(error);
  }
}

start(RulesSections, RulesSectionsData, 'rules');
// start(UpdatesSections, UpdatesSectionsData, 'details');
// start(StreamersSections, StreamersSectionsData);
