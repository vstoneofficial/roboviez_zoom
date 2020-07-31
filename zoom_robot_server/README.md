# Zoom Robot Server
ロボットとZoomでビデオチャットをし、ボタン操作でロボットを動かすようにしたもの。  
[Zoomのsample-app-web](https://github.com/zoom/sample-app-web)のCDNを元に作成している。  

## ロボット側
Node.jsとnpmをインストールする。
```
sudo apt install -y nodejs npm
```

以下でバージョン確認ができる。
```
node -v
npm -v
```

依存ライブラリを取得する。
```
cd zoom_robot_server
npm install
```

テンプレートファイルからapikey.jsonを作成し、ZoomのJWTのAPIキーとシークレットキーを記載する。  
ZoomのJWTのAPIキーとシークレットキーは、[ZoomのMarketPlace](https://marketplace.zoom.us/)のページからサインインし、Manageページで発行できる。  

テンプレートファイルからapikey.jsonを作成。  
```
cp apikey.json.template apikey.json
```

apikeyの値をZoomのJWTのAPIキー、apisecretの値をシークレットキーに置き換える。  
```
{
    "apikey": "zoom jwt api key",
    "apisecret": "zoom jwt api secret"
}
```

下記コマンドを実行する。
```
node ./serverhost.js
```

クライアント側が接続してきたら、自動的にWebブラウザが起動し、Zoom接続を行う。  
クライアント側がホストになるので、クライアント側で入室許可されるのを待つ。  
入室許可されたら、オーディオ、カメラの有効化をする。

## クライアント側
Webブラウザで、下記にアクセスする。
```
https://(ロボットのIP):8080
```

ユーザ名を入力し、接続ボタンを押下すると、自動的にZoom接続が行われる。  
クライアント側がホストになるので、参加者一覧を表示し、ロボット側のアカウントを入室許可すること。  

# モーションを追加したり変更する場合
MotionWorksでモーションを追加や変更した場合、そのモーションを追加したり、変更したりする方法を説明する。

## モーション実行ボタンの追加・変更
`views/zoomview.ejs`にボタンを追加または変更する。  
握手、指差す、手を振るのモーションは以下のようなボタンを用意している。  
```html
<div>
    <label>モーション：</label>
    <button type="submit" class="btn btn-primary" id="shak_btn" title="shak">握手</button>
    <button type="submit" class="btn btn-primary" id="point_btn" title="point">指差す</button>
    <button type="submit" class="btn btn-primary" id="wave_btn" title="point">手を振る</button>
</div>
```

`views/js/index.js`にボタン押下時の処理を追加または変更する。  
握手、指差す、手を振るのモーションは以下のようなボタンを用意している。  
`params.type`にそれぞれのモーションを識別する値を設定する。  
```js
document.getElementById('shak_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "shak"
    postData(JSON.stringify(params))
})
document.getElementById('point_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "point"
    postData(JSON.stringify(params))
})
document.getElementById('wave_btn').addEventListener("click", function(e){
    e.preventDefault();
    var params = new Object();
    params.type = "wave"
    postData(JSON.stringify(params))
})
```

## モーション実行処理の追加・変更
`controllers/top.js`のpostEventメソッドでボタン押下時のリクエストを受けての処理を実装している。  
握手、指差す、手を振るのモーションは以下のように実装している。  
robotCtrlメソッドの第一引数にモーションを実行するコマンド文字列を渡す。  
```js
case "shak":
    robotCtrl("shak", response);
    break;
case "point":
    robotCtrl("point", response);
    break;
case "wave":
    robotCtrl("wave", response);
    break;
```