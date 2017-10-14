from flask import Flask, session, redirect, url_for, escape, request
from flask_restful import Resource, Api, reqparse
import json
import spacy

app = Flask(__name__)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('text')

text = []

class NLPService(Resource):
    def __init__(self):
        self.nlp = spacy.load('en')
        self.nlp_es = spacy.load('es')

    def get(self):
        processed = nlp_bla()
        return NotImplementedError('get not impl')
    
    def post(self):
        args = parser.parse_args()
        text = args['text']
        # doc = self.nlp(text)
        return json.dumps(text)


api.add_resource(NLPService, '/nlp')

def nlp_bla():
    pass

if __name__ == '__main__':
    app.run(debug=True)
