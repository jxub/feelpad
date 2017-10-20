import json
import random
from textblob import TextBlob
from flask import Flask, session, redirect, url_for, escape, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/nlp*": {"origins": "*"}})

parser = reqparse.RequestParser()
parser.add_argument('text')

text = []
emotions = {
    0: 'awful',
    1: 'negative', 
    2: 'neutral',
    3: 'positive',
    4: 'amazing'}


def sentiment_mapper(text):
    blob = TextBlob(text)
    sent = blob.sentiment.polarity
    if sent > 0.3:
        return emotions.get(4)
    elif sent > 0.1:
        return emotions.get(3)
    elif sent > -0.1:
        return emotions.get(2)
    elif sent > -0.3:
        return emotions.get(1)
    else:
        return emotions.get(0)


class NLPService(Resource):
    def get(self):
        args = parser.parse_args()
        text = args['text']
        sentiment = sentiment_mapper(text)
        return json.dumps({"sentiment": str(sentiment)})

    def post(self):
        return json.dumps({"error": "NLPService POST method not implemented, do a GET on /nlp"})


class RootService(Resource):
    def get(self):
        return json.dumps({"error": "RootService GET method not implemented, do a POST on /nlp"})

    def post(self):
        return json.dumps({"error": "RootService POST method not implemented, do a POST on /nlp"})


api.add_resource(RootService, '/')
api.add_resource(NLPService, '/nlp')

if __name__ == '__main__':
    app.run(debug=True)
