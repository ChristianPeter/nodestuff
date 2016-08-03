// server.js
// where your node app starts

// init project
var MailListener = require("mail-listener2");
var request = require('request');
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/dreams", function (request, response) {
  response.send(dreams);
});

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
app.post("/dreams", function (req, response) {
  dreams.push(req.query.dream);
  
  var payload = {
    "leadRecord": {
        "acceptanceTermsAndConditions": true,
        "salutation": "M",
        "firstName": req.query.dream || 'Testman',
        "lastName": "Coopers",
        "phone": "01232345",
        "eMail": "mail@example.com",
        "city": "Metropolis",
        "country": "DE",
        "postalCode": "45555",
        "street": "Mainstreet 4",
        "hasOptedIn": true,
        "leadSource": "HEATING_CALCULATOR_GLOBAL",
        "leadReference": "www.heizungsprofi.de",
        "userIpAddress": "127.0.0.1",
        "energySource": ["GAS"]
    }
 };
  var opts = {
            url: 'https://visflms.herokuapp.com/lead',
            json: payload,
            timeout: 28000
        };
  request.post(opts);
  response.sendStatus(200);
});

// Simple in-memory store for now
var dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
  ];

// ---

var buf = new Buffer('QWhjcDc5ZGs=', 'base64');
var mailListener = new MailListener({
  username: "peterchr.devcave@gmail.com",
  password: buf.toString('ascii'),
  host: "imap.gmail.com",
  port: 993, // imap port 
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX", // mailbox to monitor 
  //searchFilter: ["UNSEEN", "FLAGGED"], // the search filter being used after an IDLE notification has been retrieved 
  markSeen: true, // all fetched email willbe marked as seen and not fetched next time 
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`, 
  mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib. 
  attachments: true, // download attachments as they are encountered to the project directory 
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments 
});



//mailListener.start(); // start listening 
 
// stop listening 
//mailListener.stop(); 
 
mailListener.on("server:connected", function(){
  console.log("imapConnected");
});
 
mailListener.on("server:disconnected", function(){
  console.log("imapDisconnected");
});
 
mailListener.on("error", function(err){
  console.log(err);
});
 
mailListener.on("mail", function(mail, seqno, attributes){
  // do something with mail object including attachments 
  console.log("emailParsed", mail);
  var subject = mail.subject;
  var text = mail.text;
  var html = mail.html;
  var mailFrom = mail.from;
  
  console.log("from: ", mailFrom);
  console.log("subject: ", subject);
  console.log("text: ", text);
  console.log("html: ", html);
  // mail processing code goes here 
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});