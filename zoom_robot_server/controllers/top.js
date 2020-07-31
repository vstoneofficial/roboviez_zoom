var fs = require('fs');
var ejs = require('ejs');
var qs = require('querystring');
var opener = require("opener");
var request = require('request');

const ip = require('ip');

var zoomapi = require('./zoomapi');
var auth = require('./auth');

const TEMPLATE_HTML = "./views/select.ejs";
const ZOOMVIEW_HTML = "./views/zoomview.ejs";
const HOST = 1;
const ROBOT_VIEW_URL = "https://localhost:8080/robotview.html"
const PARAM_ID = "id";
const PARAM_PW = "pwd";

const URL_ROBOT_CTRL = "http://localhost:8888/";

module.exports = {
    render: render,
    postevent: postEvent,
}

/**
 * レンダリング
 * @param {*} response 
 */
function render(response) {
    var template = fs.readFileSync(TEMPLATE_HTML, 'utf8');
    var renderView = ejs.render(template, {});
    response.writeHead(200, {
            'Content-Type': 'text/html'
    });
    response.end(renderView);
}

/**
 * postイベント
 * @param {*} request 
 * @param {*} response 
 */
function postEvent(request, response) {
    // dataイベント
    var body = '';
    request.on('data', function(data) {
        body += data;
    });
    
    // endイベント
    request.on('end', function(){
        var postData = qs.parse(body);
        if (!postData.json) return;

        var params = JSON.parse(postData.json);
        switch(params.type) {
            case "connect":
                // ミーティング生成
                zoomapi.createMeetings(function(id, password) {
                    // 画面遷移
                    renderZoomView(id, password, params.display_name, response);
                    
                    // サーバ側(ロボット側)でロボット用のZoom Webページを開く
                    // HOSTが起動する前に起動するとエラーになるので、遅延実行する(5秒後に実行)
                    var robotViewURL = ROBOT_VIEW_URL+`?${PARAM_ID}=${id}&${PARAM_PW}=${password}`;
                    setTimeout((url)=>{
                        opener(url);
                    }, 5000, robotViewURL);
                });
                break;
            case "on":
                robotCtrl("on", response);
                break;
            case "off":
                robotCtrl("off", response);
                break;
            case "cam_up":
                robotCtrl("cam_up", response);
                break;
            case "cam_left":
                robotCtrl("cam_left", response);
                break;
            case "cam_right":
                robotCtrl("cam_right", response);
                break;
            case "cam_down":
                robotCtrl("cam_down", response);
                break;
            case "shak":
                robotCtrl("shak", response);
                break;
            case "point":
                robotCtrl("point", response);
                break;
            case "wave":
                robotCtrl("wave", response);
                break;
        }
    });
}

/**
 * Zoom画面のレンダリング
 * @param {*} id 
 * @param {*} password 
 * @param {*} response 
 */
function renderZoomView(id, password, display_name, response) {
    var apiKeyData = auth.getAPIKeyData();
    var apiKey = "";
    if(apiKeyData) {
        apiKey = apiKeyData.apikey;
    }
    
    var template = fs.readFileSync(ZOOMVIEW_HTML, 'utf8');
    var renderView = ejs.render(template, {
        hostname: ip.address(),
        apikey: apiKey,
        meetingNum: id,
        password: password,
        display_name: display_name,
        role: HOST,
        signature: auth.generateSignature(id, HOST),
    });
    response.writeHead(200, {
            'Content-Type': 'text/html'
    });
    response.end(renderView);
}

/**
 * ロボット操作
 * @param {*} cmd 
 */
function robotCtrl(cmd, response) {
    console.log(cmd)
    var params = new Object();
    params.cmd = cmd;
    postRobotCtrl(JSON.stringify(params));
    response.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8'
    });
    response.end();
}

/**
 * ロボット操作用サーバにPOSTする
 * @param {*} value 
 */
function postRobotCtrl(value){
    var headers = {
		"Content-type": "application/json"
	}

	var options = {
		url: URL_ROBOT_CTRL,
		metod: "POST",
        json: true,
		headers: headers,
		form: value
	};

	request.post(options, function(err, res, body){
        console.log(res.statusCode);
		if(err){
			console.log(err);
		}
    });
}