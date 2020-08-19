var request = require('request');
var auth = require('./auth');

const USERS_URL = "https://api.zoom.us/v2/users/"
const MEETINGS = "meetings";

// PW使用文字の定義
const PW_BASE = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
// PW桁数の定義
const PW_LEN = 8;

module.exports = {
    createMeetings: createMeetings,
}

/**
 * ミーティング生成
 */
function createMeetings(callback) {
    var header = {
        authorization: 'Bearer ' + auth.getJWT(),
    };

    get(USERS_URL, header, function(userid){
        var meetingsURL = USERS_URL + "/" + userid + "/" + MEETINGS;
    
        var meetingsInfo = {
            topic: "Zoom Robot Demo",
            type: 1,
            password: genPassword(),
        };
    
        post(meetingsURL, header, meetingsInfo, callback);
    });
}

/**
 * postする
 * @param {string} url 
 * @param {*} header 
 * @param {string} json 
 */
function post(url, header, data, callback) {
    var options = {
        method: 'POST',
        url: url,
        headers: header,
        json: data,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    
        console.log(body);
        callback(body.id, body.password);
    });
    console.log("posted");
}

/**
 * getする
 * @param {*} url 
 * @param {*} header 
 * @param {*} callback 
 */
function get(url, header, callback) {
    var options = {
        method: 'GET',
        url: url,
        headers: header,
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
    
        console.log(body);
        var userinfo = JSON.parse(body);
        callback(userinfo.users[0].id);
    });
    console.log("get done");
}

/**
 * パスワード生成
 */
function genPassword(){
    //ランダムな文字列の生成
    var result = "";
    for(var i=0; i < PW_LEN; i++){
      result += PW_BASE.charAt(Math.floor(Math.random() * PW_BASE.length));
    }
    return result;
}