from MicroWebSrv2 import *
from socialNet import SimpleNet


class CustomServer(MicroWebSrv2):
    def __init__(self, database: SimpleNet):
        super().__init__()
        # Permitir requisições de qualquer endpoint
        self.AllowAllOrigins = True
        # Permtir troca de recursos (dados) sem protocolo de segurança
        self.CORSAllowAll = True
        # Alterar a porta onde o backend estará disponível
        self.BindAddress = ('localhost', 3000)
        self.database = database
        self.shouldClearPlot = False

    def start(self):
        self.StartManaged()

    def stop(self,):
        self.Stop()

    # Cadastrar usuário/empresa
    @WebRoute(POST, '/signup', name="signup")
    def Signup(self, request):
        newEntity = request.GetPostedJSONObject()
        response = self.database.createAccount(
            newEntity['user'], newEntity['password'], newEntity['person'], newEntity['data'])
        if response == "Usuário já Cadastrado":
            request.Response.ReturnUnauthorized("Usuário já Cadastrado")
        else:
            request.Response.ReturnOk()
    # {"user":"Marcos","password":"Admin@","person":true, "data": {"private": {"name": "Rafael", "idade": 10}, "public": {"sexo": "masculino"} }}

    @WebRoute(PUT, '/edit', name="edit")
    def Edit(self, request):
        newEntity = request.GetPostedJSONObject()
        params = request.QueryParams
        userName = params['userName']
        response = self.database.updateAccount(
            userName, newEntity['data'])
        request.Response.ReturnOk()
# params userName
# {"user":"Marcos","password":"Admin@","person":true, "data": {"private": {"name": "Rafael", "idade": 10}, "public": {"sexo": "masculino"} }}

    # Logar usuário/empresa
    @WebRoute(POST, '/login', name="login")
    def Login(self, request):

        body = request.GetPostedJSONObject()
        userName = body['userName']
        password = body['password']

        user = self.database.getUser(userName)
        if not user:
            return request.Response.ReturnBadRequest()
        if user.value['password'] != password:
            return request.Response.ReturnUnauthorized('Invalid information')
        userCopy = user.copy()

        userCopy["userName"] = userName
        request.Response.ReturnOkJSON(userCopy)

    # Carregar os nodos que se relacionam com o usuário
    @WebRoute(GET, '/relations', name="relations")
    def LoadRelations(self, request):
        params = request.QueryParams
        userName = params['userName']
        user = self.database.getUser(userName)
        response = self.database.getAllConnections(user)

        if user:
            return request.Response.ReturnOkJSON({'relations': response})
        request.Response.ReturnBadRequest()

    # search=Rafae&searchKey=user

    # Carregar as TODAS as entidades, por busca em largura
    @WebRoute(GET, '/entities', name="entities")
    def LoadEntities(self, request):
        params = request.QueryParams
        userName = params['userName']
        search = params['search']
        searchKey = params['searchKey']
        typeSearch = params['typeSearch']

        if typeSearch == "1":
            searchResults = self.database.dumbSearch(
                searchKey, search, userName)
            request.Response.ReturnOkJSON({'entities': searchResults})

        elif typeSearch == "2":
            searchResultsSmart = self.database.smartSearch(
                userName, searchKey, search, )
            matches = []
            for key in searchResultsSmart:
                newKey = key.copy()
                newKey["userName"] = key.key
                try:
                    connections = self.getConnection(
                        self.database.getUser(userName), key)
                    newKey["connections"] = connections
                    matches.append(newKey)
                except:
                    matches.append(newKey)
            request.Response.ReturnOkJSON({'entities': matches})
            print(matches)

        # del searchResultsSmart[key]["adjacent"]
        # print(searchResultsSmart)
        request.Response.ReturnOkJSON({'entities': searchResults})
        # search=Rafae&searchKey=user
        request.Response.ReturnBadRequest()

    # Montar e retornar o grafo (.png), com e sem foca no usuário
    @WebRoute(GET, '/graph/', name="graph")
    def CreateGraph(self, request):
        levels = None
        params = request.QueryParams
        userName = params['userName']
        try:
            levels = int(params['levels'])
        except:
            levels = None
        user = self.database.getUser(userName)
        self.shouldClearPlot = self.database.saveGraphImg(
            user, levels)
        return request.Response.ReturnFile('./files/graph.jpg')

    # Adicionar/deletar a relação x do usuário de id userid
    @WebRoute(PUT, '/relation', name="toggle_relation")
    def EditRelation(self, request):
        body = request.GetPostedJSONObject()
        params = request.QueryParams
        userName = params['userName']
        entityName = body['entityName']
        relationType = body['relationType']
        operation = body['operation']
        user = self.database.getUser(userName)
        entityName = self.database.getUser(entityName)

        if operation == 'add':
            if relationType == "friendShip":
                self.database.addFriendship(user, entityName)
            elif relationType == "acquaintance":
                self.database.addAcquaintance(user, entityName)
            elif relationType == "family":
                self.database.addFamily(user, entityName)
            elif relationType == "client":
                self.database.addClient(user, entityName)
            return request.Response.ReturnOk()

        elif operation == 'remove':
            if relationType == "friendShip":
                self.database.removeFriendship(user, entityName)
            elif relationType == "acquaintance":
                self.database.removeAcquaintance(user, entityName)
            elif relationType == "family":
                self.database.removeFamily(user, entityName)
            elif relationType == "client":
                self.database.removeClient(user, entityName)
            return request.Response.ReturnOk()

        request.Response.ReturnBadRequest()
