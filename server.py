#!/usr/bin/env python3
from flask import Flask, render_template, jsonify
import os
import time
import uuid
import sys
import logging
from flask_compress import Compress

GLOBAL_SETTINGS = {
    'port': 5000,
    'templates': "static/templates"
}
GLOBAL_SESSIONS = {}

logging.basicConfig(stream=sys.stderr, level=logging.DEBUG)
app = Flask(__name__, template_folder=os.path.abspath(GLOBAL_SETTINGS['templates']))
Compress(app)

class Session:
    #set session time to live for 6 hours
    #time to live is based on how long after use to keep
    #the session in memory
    DEFAULT_TTL = 21600
    
    def __init__(self, TTL=-1):
        self._id = str(uuid.uuid4())
        self._indicatorStatus = False
        self._created = time.time()

        if TTL < -1:
            self._TTL = self.DEFAULT_TTL
        else:
            self._TTL = TTL

    def getID(self):
        return self._id

    def getState(self):
        return self._indicatorStatus

    def toggleState(self, off=False, on=False):
        if on: self._indicatorStatus = True
        elif off: self._indicatorStatus = False
        else:
            self._indicatorStatus = not self._indicatorStatus

    def isExpired(self):
        return (time.time() - self._created) >= self._TTL

    def extendSession(self):
        self._created = time.time()

        
@app.route("/")
def index():
    return render_template("local.html")


@app.route("/remote")
def remote():
    return render_template("remote.html")


@app.route("/api/new")
def newSession():
    new_session = Session()
    id = new_session.getID()
    GLOBAL_SESSIONS[id] = new_session
    resp = {
        'status': 200,
        'id': id
    }
    return jsonify(**resp)
    


@app.route("/api/<string:sessionid>/state")
def getState(sessionid):
    resp = {
        'status': 200,
        'state': False
    }
    try:
        session = GLOBAL_SESSIONS[sessionid]
    except:
        resp['status'] = 404
        return jsonify(**resp)

    resp['state'] = session.getState()
    return jsonify(**resp)


@app.route("/api/<string:sessionid>/toggle")
def toggleState(sessionid):
    resp = {
        'status': 200,
        'oldstate': False,
        'newstate': False
    }

    try:
        session = GLOBAL_SESSIONS[sessionid]
    except:
        resp['status'] = 404
        return jsonify(**resp)


    resp['oldstate'] = session.getState()
    session.toggleState()
    resp['newstate'] = session.getState()
    return jsonify(**resp)



def args():
    # get port number
    try:
        idx = sys.argv.index('-p')
        if idx + 1 < len(sys.argv):
            GLOBAL_SETTINGS['port'] = sys.argv[idx + 1]
        else:
            logging.error("Missing port value!")
            exit(1)
    except:
        logging.info("Using default port: {}".format(GLOBAL_SETTINGS['port']))


if __name__ == "__main__":
    args()
    app.run(host='0.0.0.0', threaded=True, port=GLOBAL_SETTINGS['port'])
    
