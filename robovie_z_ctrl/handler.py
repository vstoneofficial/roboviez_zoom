# -*- coding:utf-8 -*-
import falcon
import json

class Handler(object):
    def __init__(self, motion):
        self.motion = motion

    def on_post(self, req, res):
        print("post")
        
        try:
            # postパラメーターを取得し、パースする
            params = req.bounded_stream.read().decode('utf-8')
            datas = json.loads(params)

            if datas is None:
                res.status = falcon.HTTP_400
                return
            
            print(datas)
            cmd = datas["cmd"]
            res.status = self.execCommand(cmd)
        except Exception as e:
            print(e)
            res.status = falcon.HTTP_500
        finally:
            print(res.status)
    
    def execCommand(self, cmd):
        """
        コマンド実行
        
        Parameters
        ----------
        cmd : string
            コマンド
        """
        try:
            if cmd == 'on':
                self.motion.servoOn()
            elif cmd == 'off':
                self.motion.servoOff()
            elif cmd == 'cam_up':
                self.motion.upCam()
            elif cmd == 'cam_left':
                self.motion.leftCam()
            elif cmd == 'cam_right':
                self.motion.rightCam()
            elif cmd == 'cam_down':
                self.motion.downCam()
            elif cmd == 'shak':
                self.motion.shakingHands()
            elif cmd == 'point':
                self.motion.pointing()
            elif cmd == 'wave':
                self.motion.wave()
            else:
                print("[ERR]コマンドが不明です")
                return falcon.HTTP_400
        except Exception as e:
            print(e)
            return falcon.HTTP_500
        
        return falcon.HTTP_200