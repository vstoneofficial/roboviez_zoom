# -*- coding:utf-8 -*-
import time

import com

class Motion(object):
    def __init__(self):
        self.PAN_MAX = 600
        self.TILT_MAX = 150

        self.PAN_VAL = 50
        self.TILT_VAL = 50

        self.com = com.Communication()
        
        self.pan = 0
        self.tilt = 0
        # pan,tiltを初期位置として0位置に動かす
        self.servoOn()
        self.__pan(0)
        self.__tilt(0)
        self.servoOff()

    def close(self):
        """
        モーション実行終了
        """
        self.servoOff()
        self.com.close()
        
    def servoOn(self):
        """
        サーボ電源ON
        """
        self.com.vsrc_send_1byte('0048', 1)
        print('servo on')
        time.sleep(1)
    
    def servoOff(self):
        """
        サーボ電源OFF
        """
        time.sleep(0.1)
        self.com.vsrc_send_1byte('0048', 0)
        time.sleep(1)
        print('servo off')
    
    def upCam(self):
        """
        カメラを上に向ける
        """
        print('upCam')
        self.__tilt(-self.TILT_VAL)

    def downCam(self):
        """
        カメラを下に向ける
        """
        print('downCam')
        self.__tilt(self.TILT_VAL)

    def leftCam(self):
        """
        カメラを左に向ける
        """
        print('leftCam')
        self.__pan(-self.PAN_VAL)

    def rightCam(self):
        """
        カメラを右に向ける
        """
        print('rightCam')
        self.__pan(self.PAN_VAL)

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

    def __pan(self, val):
        """
        カメラのパン(左右に動かす)

        Parameters
        ----------
        val : uint16
            移動量
        """
        self.pan = self.pan + val
        if self.PAN_MAX <= self.pan:
            self.pan = self.PAN_MAX
        elif self.pan <= -self.PAN_MAX:
            self.pan = -self.PAN_MAX
        self.com.vsrc_send_2byte('0f00', self.pan)

    def __tilt(self, val):
        """
        カメラのチルト(上下に動かす)

        Parameters
        ----------
        val : uint16
            移動量
        """
        self.tilt = self.tilt + val
        if self.TILT_MAX <= self.tilt:
            self.tilt = self.TILT_MAX
        elif self.tilt <= -self.TILT_MAX:
            self.tilt = -self.TILT_MAX
        self.com.vsrc_send_2byte('0f02', self.tilt)
