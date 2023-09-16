import spotipy
from spotipy.oauth2 import SpotifyOAuth
import cred
import base64
from requests import post, get
import json
import openai


scope = "user-read-recently-played"
openai.api_key = cred.openai_api_key
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=cred.client_id, client_secret= cred.client_secret, redirect_uri=cred.redirect_url, scope=scope))

def get_songs():
    system_msg = 'You are a helpful song guru that specializes on bpm'
    user_msg = 'Give me a list of popular rap songs with a bpm of 104'

    response = openai.ChatCompletion.create(model="gpt-4-0613",
                                            messages=[{"role": "system", "content": system_msg},
                                            {"role": "user", "content": user_msg}])

    return response
    # songs = response["choices"][0]["message"]["content"]
    # song = songs[3:songs.find("\n2")]
    # name = song[1:songs.find("\"", 2)]
    # if 'feat.' in song:
    #     artist = song[len(name) + 5: song.find("feat.") - 1]
    # else:
    #     artist = song[len(name) + 5:]

    # return (name.replace(" ", "%20"), artist.replace(" ", "%20"))

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

    url = 'https://api.spotify.com/v1/search'
    headers = get_auth_header(token)
    query = f"?q=track:{name}%20artist:{artist}&type=track&limit=1"

    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)

    if len(json_result) == 0:
        return 'error'
    
    return json_result

def add_to_q(token, uri):
    url = 'https://api.spotify.com/v1/me/player/queue'
    headers = get_auth_header(token)
    
    result = post(url + '?uri=' + uri, headers=headers)
    json_result = json.loads(result.content)

    return json_result


token = get_token()
result = search(token)
print(result)
# test = add_to_q(token, result)
# print(test)
# ['tracks']['items'][0]['album']['artists'][0]['uri']