//Install express server
const _dirname = dirname(fileURLToPath(import.meta.url));

const express = require('express');
const path = require('path');
const {dirname} = require("@angular/compiler-cli");
const {fileURLToPath} = require("url");

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(_dirname + '/SafeChatFrontEnd'));

app.get('/*', function(req,res) {

  res.sendFile(path.join(_dirname + '/SafeChatFrontEnd/src/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
