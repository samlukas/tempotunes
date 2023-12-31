import spotipy
from spotipy.oauth2 import SpotifyOAuth
import cred
import base64
from requests import post, get
import json
import openai
from flask import Flask, request, jsonify, render_template
import sys
from pymongo import MongoClient
from flask_cors import CORS



app = Flask(__name__)
CORS(app)
scope = "app-remote-control"
openai.api_key = cred.openai_api_key
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=cred.client_id, client_secret= cred.client_secret, redirect_uri=cred.redirect_url, scope=scope))

def get_songs():
    system_msg = 'You are a helpful song guru that specializes on bpm'
    user_msg = 'Give me a list of popular rap songs with 104 bpm'

    response = openai.ChatCompletion.create(model="gpt-4-0613",
                                            messages=[{"role": "system", "content": system_msg},
                                            {"role": "user", "content": user_msg}])

    #response is a json
    #here we parse the json for artist and song name
    songs = response["choices"][0]["message"]["content"]

    song = songs[songs.find("\n1.") + 4: songs.find("\n2")]
    name = song[1:song.find("\"", 2)]
    if 'feat.' in song:
        artist = song[len(name) + 5: song.find("feat.") - 1]
    else:
        artist = song[len(name) + 5:]

    return (name.replace(" ", "%20"), artist.replace(" ", "%20"))



@app.route("/", methods=["GET", "POST"])
def getBPM():
    if request.method=="POST":
        data={}
        data['bpm']=request.json['bpm']
        print(data, file=sys.stderr)
        return jsonify(data)
    else:
        return render_template("localhost:5000")

        


def get_token():
    auth_string = cred.client_id + ":" + cred.client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]

    return token

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}

def search(token):
    name, artist = get_songs()

    n_name = name.replace('\'', '')
    n_artist = artist.replace('\'', '')

    url = 'https://api.spotify.com/v1/search'
    headers = get_auth_header(token)
    query = f"?q=track:{n_name}%20artist:{n_artist}&type=track&limit=1"

    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)

    if len(json_result) == 0:
        return 'error'
    
    return json_result['tracks']['items'][0]['album']['artists'][0]['uri']

def add_to_q(token, uri):
    url = 'https://api.spotify.com/v1/me/player/queue'
    headers = get_auth_header(token)
    
    result = post(url + '?uri=' + uri, headers=headers)
    json_result = json.loads(result.content)

    sp.add_to_queue(uri)
    # return json_result

def database_filler(uri):
    Client=MongoClient('localhost', 27017)
    db=Client['test']
    collection=db['songs']
    insert_result = collection.insert_one({"spotify_uri": uri})
    return insert_result

if __name__ =='__main__':
    app.run(debug=True, port=5000)


# token = get_token()
# print(token)
# result = search(token)
# print(result)
# test = add_to_q(token, result)
# print(test)
# 'BQCAwaJA9nJfOPheEtZRaOgt_bir2PqU--Sqnaody6klMvLwbBHzAKvdCBX6NDcOzypTKz1Hecr8tjJ-Uzb7Oi8VOR6vV_Qb65Vsn-ltKwQI7AEUjY4'
# 'spotify:artist:6l3HvQ5sa6mXTsMTB19rO5'

