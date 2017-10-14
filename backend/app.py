import json
import spacy
import random
from flask import Flask, session, redirect, url_for, escape, request
from flask_restful import Resource, Api, reqparse

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('text')

text = []
emotions = {0: 'negative', 1:  'neutral', 2: 'positive'}


class NLPService(Resource):
    def __init__(self):
        self.nlp = spacy.load('en')
        self.doc = None

    def get(self):
        args = parser.parse_args()
        text = args['text']
        doc = self.nlp(text)
        return json.dumps({"nlp": str(doc)})

    def post(self):
        return json.dumps({"error": "NLPService POST method not implemented, do a GET on /nlp"})


class RootService(Resource):
    def get(self):
        return json.dumps({"error": "RootService GET method not implemented, do a POST on /nlp"})

    def post(self):
        return json.dumps({"error": "RootService POST method not implemented, do a POST on /nlp"})


api.add_resource(RootService, '/')
api.add_resource(NLPService, '/nlp')

def nlp_bla():
    pass

if __name__ == '__main__':
    app.run(debug=True)
