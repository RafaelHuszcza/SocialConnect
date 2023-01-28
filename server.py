from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from SocialConnect import SocialConnect
from time import sleep

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


database = SocialConnect()
database.fromPkl()

# Cadastrar usuário/empresa


@app.route("/signup", methods=["POST"])
def signup():
    newEntity = request.get_json()
    response = database.createAccount(newEntity["userName"], newEntity)
    if response == "Usuário já Cadastrado":
        return jsonify({"error": "Usuário já Cadastrado"}), 401
    else:
        return jsonify({"message": "Conta criada com sucesso"}), 200


@app.route('/edit', methods=['PUT'])
def Edit():
    newEntity = request.get_json()
    userName = request.args.get('userName')
    response = database.updateAccount(userName, newEntity)
    if response:
        return "Conta atualizada com sucesso", 200
    else:
        return "Não foi possível atualizar a conta", 400


@app.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    userName = body['userName']
    password = body['password']
    user = database.getUser(userName)
    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 400
    if user.value['password'] != password:
        return jsonify({'error': 'Informações inválidas'}), 401
    userCopy = user.copy()
    return jsonify(userCopy), 200


@app.route('/relations', methods=['GET'])
def LoadRelations():
    userName = request.args.get('userName')
    response = database.getAllConnections(userName)
    return jsonify({'relations': response}), 200


@app.route('/entities', methods=['GET'])
def LoadEntities():
    userName = request.args.get('userName')
    search = request.args.get('search')
    searchKey = request.args.get('searchKey')
    try:
        searchResults = database.Search(userName, searchKey, search)
        return jsonify({'entities': searchResults}), 200
    except:
        return jsonify({'error': 'Invalid typeSearch'}), 400


@app.route('/graph', methods=['GET'])
def CreateGraph():
    levels = None
    userName = request.args.get('userName')
    try:
        levels = int(request.args.get('levels'))
    except:
        levels = None

    database.saveGraphImg(userName, levels)
    return send_file('./files/graph.jpg', mimetype='image/jpg')


@app.route("/relation", methods=["PUT"])
def toggle_relation():
    userName = request.args.get('userName')
    body = request.get_json()
    entityName = body['entityName']
    relationType = body['relationType']
    operation = body['operation']
    if operation == 'add':
        if relationType == "Friend":
            database.addFriendship(userName, entityName)
        elif relationType == "Acquaintance":
            database.addAcquaintance(userName, entityName)
        elif relationType == "Family":
            database.addFamily(userName, entityName)
        elif relationType == "Client":
            database.addClient(userName, entityName)
        return jsonify(status="Ok"), 200

    elif operation == 'remove':
        database.removeRelation(userName, entityName)
        return jsonify(status="Ok"), 200

    else:
        return jsonify(status="Bad request"), 400


if __name__ == '__main__':
    app.run(host='localhost', port=3000, debug=True)
