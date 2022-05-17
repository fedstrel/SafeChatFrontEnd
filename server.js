//Install express server
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/safe-chat-front-end'));
app.use(cors());

app.get('/*', function(req,res) {

  res.sendFile(path.join(__dirname + 'dist/safe-chat-front-end/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
