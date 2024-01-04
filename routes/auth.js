// auth.js
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const CLIENT_ID = process.env.CLIENTID;
const CLIENT_SECRET = process.env.CLIENTSECRET;
const REDIRECT_URI = process.env.REDIRECTURI;
const REFRESH_TOKEN = process.env.REFRESHTOKEN;

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports = oAuth2Client;
