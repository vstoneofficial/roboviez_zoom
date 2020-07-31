var request = require('request');
var auth = require('./auth');

const USER_ID = "SDv9bXN3QK-ABYZpgfh3ig";
const BASE_URL = "https://api.zoom.us/v2/users/" + USER_ID + "/";

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
    var meetingsURL = BASE_URL + MEETINGS;

    var header = {
        authorization: 'Bearer ' + auth.getJWT(),
    };

    var meetingsInfo = {
        topic: "Zoom Robot Demo",
        type: 1,
        password: genPassword(),
    };

    post(meetingsURL, header, meetingsInfo, callback);
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