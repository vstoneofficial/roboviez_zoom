# RobovieZ操作用サーバ
RobovieZを操作するためのサーバ。  

# 実行手順
## ライブラリ
falconを使用している。  
下記でインストールする。  
```
pip install falcon
```

## 実行方法
以下を実行する。  
```
python main.py (ポート番号)
```

ポート番号が指定されていない場合は、8888がデフォルトになる。  

## URL
下記にPOSTする。  
http://localhost:(ポート番号)/

## request
リクエストBodyは以下の内容。  

|項目|型|内容|
|:--|:--|:--|
|cmd|string|実行コマンド|

コマンド一覧は以下になる。

|コマンド|内容|
|:--|:--|
|on|サーボON|
|off|サーボOFF|
|cam_up|カメラを上に向ける|
|cam_left|カメラを左に向ける|
|cam_right|カメラを右に向ける|
|cam_down|カメラを下に向ける|
|shak|握手する|
|point|指差す|
|wave|手を振る|

```json
{
    "cmd": "cam_up"
}
```

## response
レスポンスコードが返る。

# モーションを追加したり変更する場合
MotionWorksでモーションを追加や変更した場合、そのモーションを追加したり、shak、point、waveのモーション番号を変えたりする方法を説明する。

## モーション実行処理の変更
`motion.py`にモーションを実行するメソッドを実装している。  
shak、point、waveのモーション実行メソッドは以下のようになっている。

```py
def shakingHands(self):
    """
    握手する
    """
    print('shakingHands')
    self.com.vsrc_send_1byte('09c0', 4)
    time.sleep(1)
    self.com.vsrc_send_1byte('09c0', 0)

def pointing(self):
    """
    指差し
    """
    print('pointing')
    self.com.vsrc_send_1byte('09c0', 5)
    time.sleep(1)
    self.com.vsrc_send_1byte('09c0', 0)

def wave(self):
    """
    手を振る
    """
    print('wave')
    self.com.vsrc_send_1byte('09c0', 6)
    time.sleep(1)
    self.com.vsrc_send_1byte('09c0', 0)
```

vsrc_send_1byteメソッドの第二引数がモーション番号になっている。  
モーション番号を変更した場合は、この値を変更する。  
モーションを追加する場合は、同じ要領でメソッドを追加実装する。
```py
self.com.vsrc_send_1byte('09c0', 4)
```

## ハンドラの修正
`handler.py`の`execCommand`メソッドで、受信したコマンド毎に、`motion.py`に実装している、モーション実行メソッドを呼び出している。  
下記の該当箇所を適宜修正する。

```py
def execCommand(self, cmd):
        try:
            ...
            elif cmd == 'shak':
                self.motion.shakingHands()
            elif cmd == 'point':
                self.motion.pointing()
            elif cmd == 'wave':
                self.motion.wave()
        ...
```