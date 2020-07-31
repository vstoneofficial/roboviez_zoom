#coding: UTF-8
import falcon
import sys

import handler
import motion

args = sys.argv

def main():
    portStr = "8888"
    if 1 < len(args):
        portStr = args[1]
    print("port: " + portStr)
    
    m = motion.Motion()
    app = falcon.API()
    app.add_route("/", handler.Handler(m))

    try:
        port = int(portStr)
        from wsgiref import simple_server
        httpd = simple_server.make_server("", port, app)
        httpd.serve_forever()
    except Exception as e:
        print(e)
    finally:
        print("finally")
        if m is not None:
            m.close()

if __name__ =='__main__':
    main()
