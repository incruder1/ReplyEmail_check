// index.js
const express = require("express");
const { setupAuthRoutes} = require("./routes/auth.js"); 
const {   sendReplies, setupInterval } = require("./routes/sendReplies.js");

const app = express();
const PORT = 3000;

// Setup authentication routes
app.get("/",async (req, res) => {
  setupAuthRoutes();
})

// Setup send replies route
app.get("/sendReplies", async (req, res) => {
  try {
    await sendReplies();
    res.send("Replies sent successfully.");
  } catch (error) {
    console.error("Error sending replies:", error.message);
    res.status(500).send("Error sending replies");
  }
});

// Setup interval for sending replies
setupInterval();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
