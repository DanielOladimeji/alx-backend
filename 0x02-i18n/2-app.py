#!/usr/bin/env python3
"""Basic Flask app.
"""

from flask import Flask, render_template, request
from flask_babel import Babel


class Config(object):
    '''
    configuring Flask Babel
    '''
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = 'en',
    BABEL_DEFAULT_TIMEZONE = 'UTC'


app = Flask(__name__)
babel = Babel(app)
app.config.from_object(Config)


@babel.localeselector
def get_locale() -> str:
    '''
    Select and return best language match based on supported languages
    '''
    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/', strict_slashes=False)
def home_index() -> str:
    '''
    The home index page
    '''
    return render_template('2-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
