import imp
import json
from flask import Flask, render_template
import flask
from flask import request,jsonify

from flask_cors import CORS
from city import search_city

app = Flask(__name__)
CORS(app)

@app.route('/citynames',methods=['GET','POST'])
def get_city_names():
    city_name = request.json['text_query']
    city, total_city =  search_city(city_name)
    print (city, total_city)
    city_dict = {}
    city_dict['cities'] =  city
    city_dict['total_city'] = total_city
    city_dict = json.dumps(city_dict)
    return city_dict


if __name__ == '__main__':
    app.run('0.0.0.0',port=5000)
    app.debug = True


