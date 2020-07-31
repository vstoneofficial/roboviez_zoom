var https = require('https');
var fs = require('fs');
var url = require('url');

var top = require('./controllers/top.js');
var robot = require('./controllers/robot.js');

var LISTEN_PORT = 8080;
var DEFAULT_FILE = "index.html";

// アクセス禁止ファイル一覧
const BAN_FILE_LIST = ["/serverhost.js", "/apikey.json"]

//ファイルの拡張子を確認
function getExtenstion(fileName){
  var tmp = fileName.split('.');
  var tmpLength = tmp.length;
  var ext = tmp[tmpLength-1];

  return ext;
}

//content-typeを取得
function getContentType(fileName){
  var ext = getExtenstion(fileName).toLowerCase();
  var contentType = {
    'html': 'text/html',
    'htm': 'text/htm',
    'css': 'text/css',
    'js': 'text/javaScript; charset=utf-8',
    'json': 'application/json; charset=utf-8',
    'xml': 'application/xml; charset=utf-8',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpg',
    'gif': 'image/gif',
    'png': 'image/png',
    'mp3': 'audio/mp3',
  };
  var contentType_value = contentType[ext];
  if (contentType_value === undefined) {
    contentType_value = 'text/plain';
  };
  return contentType_value;
}

var options = {
  key: fs.readFileSync( './localhost.key' ),
  cert: fs.readFileSync( './localhost.crt' )
};

// webサーバーの構築
var server = https.createServer(options,
  function(request,response){
    var url_parts = url.parse(request.url, true);
    // リクエストからパスを取得
    var fileName = url_parts.pathname;

    // URLがルート(/のみ)だった場合、デフォルトのファイルを指定する
    fileName = (fileName.substring(fileName.length - 1, 1) === '/') ?
              fileName + DEFAULT_FILE : fileName;
    console.log(fileName)
    
    if (request.method == 'POST') {
      postProc(fileName, request, response);
    } else if (request.method == 'GET') {
      getProc(fileName, url_parts, response);
    }
  }
).listen(LISTEN_PORT);

/**
 * POSTメソッド処理
 * @param {*} fileName 
 * @param {*} request 
 * @param {*} response 
 */
function postProc(fileName, request, response) {
  switch (fileName) {
    case "/index.html":
      top.postevent(request, response);
      break;
    default:
      break;
  }
}

/**
 * GETメソッド処理
 * @param {*} fileName 
 * @param {*} response 
 */
function getProc(fileName, url_parts, response) {
  switch (fileName) {
    case "/index.html":
      top.render(response);
      break;
    case "/robotview.html":
      var id = "";
      var pw = "";
      if(url_parts.query) {
        id = url_parts.query.id;
        pw = url_parts.query.pwd;
      }
      
      robot.render(id, pw, response);
      break;
    default:
      if (BAN_FILE_LIST.indexOf(fileName) !== -1) {
          // アクセス禁止ファイルにアクセスしてきた場合は404を返す
          console.log(fileName + " is ban file.");
          response.writeHead(404, {
              'Content-Type': 'text/plain'
          });
          response.write('not found\n');
          response.end();
          break;
      }

      fs.readFile('.' + fileName, 'binary', function(err,data){
        if(err){
          console.log(err)
          response.writeHead(404, {
              'Content-Type': 'text/plain'
          });
          response.write('not found\n');
          response.end();
        } else {
          response.writeHead(200,{"Content-Type":getContentType(fileName)});
          response.write(data, "binary");
          response.end();
        } 
      });
      break;
  }
}