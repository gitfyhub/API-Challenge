import json
import requests


def callMasterServer(string_param):
    print(string_param)
    response = requests.get("http://localhost:3000/worker_params?id=" + string_param)
    print(response.status_code)


callMasterServer('python call')