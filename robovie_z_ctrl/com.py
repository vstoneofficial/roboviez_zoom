# -*- coding:utf-8 -*-
import time
import serial

class Communication(object):
    def __init__(self):
        self.con = serial.Serial('/dev/ttyAMA0', 115200)
        time.sleep(0.012)
        print("serial connection")
    
    def close(self):
        """
        シリアル通信終了
        """
        self.con.close()
        print("serial close")

    def vsrc_send_1byte(self, addr, data):
        """
        指定アドレスに1バイト書き込むコマンドを送信する
        
        Parameters
        ----------
        addr : string
            書き込み対象のアドレス
        data : uint8
            書き込むデータ
        """
        data_str = format(data, '02x')
        str_send = 'w ' + addr + ' ' + data_str + '\r'
        self.con.write(str_send.encode())
        print(str_send)
        time.sleep(0.012)
        str_read = self.con.read(self.con.inWaiting())
        
    def vsrc_send_2byte(self, addr, data):
        """
        指定アドレスに2バイト書き込むコマンドを送信する
        
        Parameters
        ----------
        addr : string
            書き込み対象のアドレス
        data : uint16
            書き込むデータ
        """
        if 0 <= data:
            data_str = format(data, '04x')
        else:
            data_str = format(data & 0xffff, '04x')
        str_send = 'w ' + addr + ' ' + data_str[2:4] + ' ' + data_str[0:2] + '\r\n'
        self.con.write(str_send.encode())
        print(str_send)
        time.sleep(0.012)
        str_read = self.con.read(self.con.inWaiting())

    def vsrc_read_1byte(self, addr):
        """
        指定アドレスから1バイト読み込むコマンドを送信し、返答を取得する
        
        Parameters
        ----------
        addr : string
            読込対象のアドレス

        Returns
        -------
        ret : string
            読み込み結果
        """
        str_send = 'r ' + addr + ' 1\r'
        self.con.write(str_send.encode())
        time.sleep(0.012)
        str_read = self.con.read(self.con.inWaiting()).decode()
        start_pos = str_read.find('#0000'+addr)+10
        return str_read[start_pos]+str_read[start_pos+1]

    def vsrc_read_2byte(self, addr):
        """
        指定アドレスから2バイト読み込むコマンドを送信し、返答を取得する
        
        Parameters
        ----------
        addr : string
            読込対象のアドレス

        Returns
        -------
        ret : string
            読み込み結果
        """
        str_send = 'r ' + addr + ' 2\r'
        self.con.write(str_send.encode())
        time.sleep(0.012)
        str_read = self.con.read(self.con.inWaiting()).decode()
        start_pos = str_read.find('#0000'+addr)+10
        return str_read[start_pos+3]+str_read[start_pos+4]+str_read[start_pos]+str_read[start_pos+1]
