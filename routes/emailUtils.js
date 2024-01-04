// emailUtils.js
const { google } = require("googleapis");
const oAuth2Client = require("./auth");

const Scopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
];
// keep track of users already replied to using repliedUsers
const repliedUsers = new Set();

async function sendReplies() {
    try {
      const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
  
      // Get the list of unread messages.
      const res = await gmail.users.messages.list({
        userId: "me",
        q: "in:inbox", // Adjust the query as needed
        maxResults: 10,
        orderBy: "internalDate", // Order by internal date in descending order
      });
      const messages = res.data.messages;
  
      if (messages && messages.length > 0) {
        // Fetch complete message details.
        for (const message of messages) {
          const email = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
          });
  
          // Extract data from headers
          const from = email.data.payload.headers.find(
            (header) => header.name === "From"
          );
          const toHeader = email.data.payload.headers.find(
            (header) => header.name === "To"
          );
          const subject = email.data.payload.headers.find(
            (header) => header.name === "Subject"
          );
  
          // who sends email extracted
          const From = from.value;
          // who gets email extracted
          const toEmail = toHeader.value;
          // subject of unread email
          const subjectValue = subject.value;
  
          console.log("email come From", From);
          console.log("to Email", toEmail);
  
          // check if the user already been replied to
          if (repliedUsers.has(From)) {
            console.log("Already replied to:", From);
            continue;
          }
  
          // Check if the email has any replies.
          const thread = await gmail.users.threads.get({
            userId: "me",
            id: message.threadId,
          });
  
          // isolated the email into threads
          const replies = thread.data.messages.slice(1);
  
          if (replies.length === 0) {
            // Reply to the email.
            await gmail.users.messages.send({
              userId: "me",
              requestBody: {
                raw: await createReplyRaw(toEmail, From, subjectValue),
              },
            });
  
            // Add a label to the email.
            const labelName = "RepliedEmails";
            await gmail.users.messages.modify({
              userId: "me",
              id: message.id,
              requestBody: {
                addLabelIds: [await createLabel(labelName)],
              },
            });
  
            console.log("Sent reply to email:", From);
            // Add the user to replied users set
            repliedUsers.add(From);
          }
        }
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
      throw error; // Re-throw the error for higher-level handling
    }
  }
// converts string to base64EncodedEmail format
async function createReplyRaw(from, to, subject) {
    const emailContent = `From: ${from}\nTo: ${to}\nSubject: ${subject}\n\n Hello Thank you for contacting me i will get back to you soon.`;
    const base64EncodedEmail = Buffer.from(emailContent)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  
    return base64EncodedEmail;
  }
  
// 3. Add a Label to the email and move the email to the label
async function createLabel(labelName) {
    try {
      const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
      // Check if the label already exists.
      const res = await gmail.users.labels.list({ userId: "me" });
      const labels = res.data.labels;
  
      const existingLabel = labels.find((label) => label.name === labelName);
      if (existingLabel) {
        return existingLabel.id;
      }
  
      // Create the label if it doesn't exist.
      const newLabel = await gmail.users.labels.create({
        userId: "me",
        requestBody: {
          name: labelName,
          labelListVisibility: "labelShow",
          messageListVisibility: "show",
        },
      });
  
      return newLabel.data.id;
    } catch (error) {
      console.error("Error creating label:", error.message);
      throw error; // Re-throw the error for higher-level handling
    }
  }
  
module.exports = sendReplies
