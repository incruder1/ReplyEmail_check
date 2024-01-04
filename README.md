
# Email Autoresponder README
## Overview
This Node.js application demonstrates an email autoresponder using the Gmail API. The program logs in with a Google account, checks for unread emails, and sends predefined replies to those emails without prior responses.

## Prerequisites
Before running the application, ensure you have the following:

Node.js installed: Node.js
Google API credentials:
Create a project on the Google Cloud Console.
Enable the Gmail API for the project.
Create credentials (OAuth client ID) and download the JSON file.
Set up the .env file with the following variables:
CLIENTID: Your OAuth client ID.
CLIENTSECRET: Your OAuth client secret.
REDIRECTURI: Your OAuth redirect URI.
REFRESHTOKEN: Your OAuth refresh token.
Installation
Clone the repository:

``` bash 
git clone https://github.com/your-username/your-repo.git
cd your-repo
```
Install dependencies:

``` bash
npm install 
```
Run the application:

``` bash 
node app.js
```
This will start the server on http://localhost:3000. Open a web browser and navigate to this URL to initiate the OAuth authentication.

Follow the authentication process to grant access to the Gmail account.

Once authenticated, the server will display a message indicating successful authentication. You can close the authentication window.

To trigger the email autoresponder manually, visit:

 ``` http://localhost:3000/sendReplies  ```
## How It Works
Step 1: The application logs in with the Gmail API and initiates the OAuth 2.0 authentication flow.
Step 2: The user grants access, and the application stores the access token for future API requests.
Step 3: The /sendReplies endpoint checks for unread emails in the inbox. For each unread email, it extracts sender information, recipient information, and subject.
Step 4: If the sender has not been replied to before, the application generates a predefined reply, sends the reply, adds a label to the email, and marks it as replied.
Step 5: The process repeats at random intervals between 45 to 120 seconds using the setInterval function.
## Configuration
Automation
The application is designed to automatically check for new emails and send replies at random intervals. The interval is set between 45 to 120 seconds using the setInterval function.

Feel free to modify the code or add additional features based on your requirements.

