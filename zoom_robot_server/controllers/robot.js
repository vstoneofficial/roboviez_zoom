var fs = require('fs');
var ejs = require('ejs');

var auth = require('./auth');

const ZOOMVIEW_HTML = "./views/zoomview.ejs";
const ATTENDEE = 0;
const DISPLAY_NAME = "Zoom Robot";

module.exports = {
    render: render,
}

/**
 * Zoom画面のレンダリング
 * @param {*} id 
 * @param {*} password 
 * @param {*} response 
 */
function render(id, password, response) {
    var apiKeyData = auth.getAPIKeyData();
    var apiKey = "";
    if(apiKeyData) {
        apiKey = apiKeyData.apikey;
    }
    
    var template = fs.readFileSync(ZOOMVIEW_HTML, 'utf8');
    var renderView = ejs.render(template, {
        hostname: "localhost",
        apikey: apiKey,
        meetingNum: id,
        password: password,
        display_name: DISPLAY_NAME,
        role: ATTENDEE,
        signature: auth.generateSignature(id, ATTENDEE),
    });
    response.writeHead(200, {
            'Content-Type': 'text/html'
    });
    response.end(renderView);
}