const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');

dotenv.config();
const client = new OAuth2Client("979170936973-aq2ri0q2h52dbgn2r8mu5gkur90ed0bk.apps.googleusercontent.com");

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

function upsert(list_val, item_val) {
  const i = list_val.findIndex((it) => it.email === item_val.email);
  if (i >= 0) list_val[i] = item_val;
  else list_val.push(item_val);
}

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: "979170936973-aq2ri0q2h52dbgn2r8mu5gkur90ed0bk.apps.googleusercontent.com",
  });
  const { name, email, picture } = ticket.getPayload();
  upsert(users, { name, email, picture });
  // send the data back to reactjs
  res.status(201);
  res.json({ name, email, picture });
});

app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/build/index.html'))
);

app.listen(5000, () => {
  console.log(
    `Server is ready at http://localhost:5000`
  );
});
