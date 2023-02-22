from flask import Flask, jsonify
import json

app = Flask(__name__)

@app.route('/getInfo', methods=['GET'])
def get_table_info():
  with open('./sampleData.json',"r") as f:
    table = json.load(f)
  with open('./sampleConfig.json',"r") as f:
    config = json.load(f)
  data = jsonify({
    "table": table,
    "config": config
  })
  return data

if __name__ == '__main__':
  app.run()