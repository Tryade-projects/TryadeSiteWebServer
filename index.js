require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT || 5000;

const RulesSection = require('./models/RulesSection');
const UpdatesSection = require('./models/UpdatesSection');
const StreamersSection = require('./models/StreamersSection');
const AdminSchema = require('./models/AdminSchema');

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173',
      'https://tryade-site-web.vercel.app',
    ],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);

app.use(
  express.static('public', {
    setHeaders: function (res, path) {
      if (path.endsWith('.svg')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    },
  })
);

// Ajoutez ce middleware pour parser automatiquement les données JSON du corps de la requête
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// const adminData = [
//   {
//     username: process.env.ADMIN_USER_ZORAL,
//     password: process.env.ADMIN_PASSWORD_ZORAL,
//   },
//   {
//     username: process.env.ADMIN_USER_SARKO,
//     password: process.env.ADMIN_PASSWORD_SARKO,
//   },
// ];

// post les données d'admin dans la bdd en cryptant le mot de passe et en utilisant toutes les sécurité necessaires
// async function postAdminData() {
//   adminData.map(async (admin) => {
//     const { username, password = '' } = admin;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newAdmin = new AdminSchema({
//       username,
//       password: hashedPassword,
//     });
//     newAdmin
//       .save()
//       .then(() => console.log('admin added successfully'))
//       .catch((error) => console.log({ error }));
//   });
// }

// postAdminData();

/* admins */
/* This code is handling the POST request to the '/admins' endpoint. It is responsible for
authenticating the admin user by checking their username and password. */
app.post('/admins', (req, res) => {
  const { username, password } = req.body;

  AdminSchema.findOne({ username: username.toString() })
    .then(async (admin) => {
      if (!admin) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      const token = jwt.sign(
        { id: admin.id },
        `${process.env.JWT_SECRET_KEY}`,
        {
          expiresIn: '1h',
        }
      );
      res.json({
        token: token,
        expiresIn: 120, // Ajoutez cette ligne pour renvoyer expiresIn
        authUserState: {
          id: admin.id,
          username: admin.username,
        }, // Ajoutez cette ligne pour renvoyer authUserState
      });
    })
    .catch((error) => {
      console.error("Erreur lors de la recherche de l'administrateur", error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    });
});

/* projects */
/* This is a route that will return all the projects in the database. */
app.get('/rulesSections', (_req, res) => {
  RulesSection.find()
    .then((rulesSection) => res.status(200).json(rulesSection))
    .catch((error) => res.status(400).json({ error }));
});

/* Creating a new rulesSection in the database. */
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

/* Updating a rulesSection in the database. */
app.put('/rulesSections/:id', (req, res) => {
  RulesSection.updateOne(
    { id: req.params.id },
    { ...req.body, id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: 'rulesSection modified successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Deleting a rulesSection from the database. */
app.delete('/rulesSections/:id', (req, res) => {
  RulesSection.deleteOne({ id: req.params.id })
    .then(() =>
      res.status(200).json({ message: 'rulesSection deleted successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Remplace la collection  */
app.put('/rulesSections', async (req, res) => {
  const newOrderCollection = req.body;

  try {
    // Supprimer tous les documents existants dans la collection "RulesSection"
    await RulesSection.deleteMany({});

    // Insérer la nouvelle collection avec le nouvel ordre
    await RulesSection.insertMany(newOrderCollection.toString());

    res.status(200).json({ message: 'rulesSections reordered successfully' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

/* updates */
/* This is a route that will return all the updates in the database. */
app.get('/updatesSections', (_req, res) => {
  const { cursor } = _req.query;
  if (typeof cursor === 'string') {
    const cursorNumber = parseInt(cursor, 10);
    const pageSize = 3;
    UpdatesSection.find({})
      .skip(cursorNumber * pageSize)
      .limit(pageSize)
      .then((updatesSection) => res.status(200).json(updatesSection))
      .catch((error) => res.status(400).json({ error }));
  } else {
    UpdatesSection.find()
      .then((updatesSection) => res.status(200).json(updatesSection))
      .catch((error) => res.status(400).json({ error }));
  }
});

/* Get one updatesSection */
app.get('/updatesSections/:id', (req, res) => {
  UpdatesSection.findOne({ id: req.params.id })
    .then((updatesSection) => res.status(200).json(updatesSection))
    .catch((error) => res.status(404).json({ error }));
});

/* Creating a new updatesSection in the database. */
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

/* Updating a updatesSection in the database. */
app.put('/updatesSections/:id', (req, res) => {
  UpdatesSection.updateOne(
    { id: req.params.id },
    { ...req.body, id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: 'updatesSection modified successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Deleting a updatesSection from the database. */
app.delete('/updatesSections/:id', (req, res) => {
  UpdatesSection.deleteOne({ id: req.params.id })
    .then(() =>
      res.status(200).json({ message: 'updatesSection deleted successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Remplace la collection  */
app.put('/updatesSections', async (req, res) => {
  const newOrderCollection = req.body;

  try {
    // Supprimer tous les documents existants dans la collection "updatesSections"
    await UpdatesSection.deleteMany({});

    // Insérer la nouvelle collection avec le nouvel ordre
    await UpdatesSection.insertMany(newOrderCollection);

    res.status(200).json({ message: 'updatesSections reordered successfully' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

/* streamers */
/* This is a route that will return all the streamers in the database. */
app.get('/streamersSections', (_req, res) => {
  const { cursor } = _req.query;
  if (typeof cursor === 'string') {
    const cursorNumber = parseInt(cursor, 10);
    const pageSize = 6;
    StreamersSection.find({})
      .skip(cursorNumber * pageSize)
      .limit(pageSize)
      .then((streamersSection) => res.status(200).json(streamersSection))
      .catch((error) => res.status(400).json({ error }));
  } else {
    StreamersSection.find()
      .then((streamersSection) => res.status(200).json(streamersSection))
      .catch((error) => res.status(400).json({ error }));
  }
});

/* Creating a new streamersSection in the database. */
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
    { id: req.params.id },
    { ...req.body, id: req.params.id }
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
  StreamersSection.deleteOne({ id: req.params.id })
    .then(() =>
      res.status(200).json({ message: 'streamersSection deleted successfully' })
    )
    .catch((error) => res.status(400).json({ error }));
});

/* Remplace la collection  */
app.put('/streamersSections', async (req, res) => {
  const newOrderCollection = req.body;

  try {
    // Supprimer tous les documents existants dans la collection "streamersSections"
    await StreamersSection.deleteMany({});

    // Insérer la nouvelle collection avec le nouvel ordre
    await StreamersSection.insertMany(newOrderCollection);

    res
      .status(200)
      .json({ message: 'streamersSections reordered successfully' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.listen(PORT, () =>
  console.log('Server started at http://localhost:' + PORT)
);
