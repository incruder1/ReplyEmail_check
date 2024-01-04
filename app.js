// app.js
const express = require("express");
const sendReplies  = require("./routes/emailUtils");
const oAuth2Client = require("./routes/auth")
const app = express();
const PORT = 3000;
const Scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.modify",
  ]; 
app.get("/", (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: Scopes,
      });
      res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    console.log(code);
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      res.send("Authentication successfull ! You can close this window.");
    } catch (error) {
      console.error("Error retrieving access token:", error.message);
      res.status(500).send("Error during authentication");
    }
  });
 

app.get("/sendReplies", async (req, res) => {
  try {
    await sendReplies();
    res.send("Replies sent successfully.");
  } catch (error) {
    console.error("Error sending replies:", error.message);
    res.status(500).send("Error sending replies");
  }
});
function Interval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
  // Setting Interval and calling the main function in every interval
setInterval(async () => {
    try {
      await sendReplies();
    } catch (error) {
      console.error("Error in interval function:", error.message);
    }
  }, Interval(45, 120) * 1000);
  

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
