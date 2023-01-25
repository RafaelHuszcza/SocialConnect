from MicroWebSrv2 import *
from SocialConnect import SocialConnect


class CustomServer(MicroWebSrv2):
    def __init__(self, database: SocialConnect):
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
            newEntity["userName"], newEntity)

        if response == "Usuário já Cadastrado":
            request.Response.ReturnUnauthorized("Usuário já Cadastrado")
        else:
            request.Response.ReturnOk()
    # Edita uma usuário/empresa

    @WebRoute(PUT, '/edit', name="edit")
    def Edit(self, request):
        newEntity = request.GetPostedJSONObject()
        params = request.QueryParams
        userName = params['userName']
        response = self.database.updateAccount(
            userName, newEntity)
        request.Response.ReturnOk()

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
        request.Response.ReturnOkJSON(userCopy)

    # Carregar os vertices que se relacionam com o usuário
    @WebRoute(GET, '/relations', name="relations")
    def LoadRelations(self, request):
        params = request.QueryParams
        userName = params['userName']
        response = self.database.getAllConnections(userName)
        return request.Response.ReturnOkJSON({'relations': response})

    # Executa dois tipos de busca, baseado no parametro passado
    @WebRoute(GET, '/entities', name="entities")
    def LoadEntities(self, request):
        params = request.QueryParams
        userName = params['userName']
        search = params['search']
        searchKey = params['searchKey']
        typeSearch = params['typeSearch']

        # Se for tipo dumbSearch, executa a busca burra
        if typeSearch == "dumbSearch":
            searchResults = self.database.dumbSearch(userName,
                                                     searchKey, search)
            print(searchResults)
            request.Response.ReturnOkJSON({'entities': searchResults})

        # Se for tipo dumbSearch, executa a busca inteligente
        elif typeSearch == "smartSearch":
            searchResults = self.database.smartSearch(
                userName, searchKey, search)

            request.Response.ReturnOkJSON({'entities': searchResults})

    # Montar e retornar o grafo (.jpg) baseado nem níveis

    @WebRoute(GET, '/graph', name="graph")
    def CreateGraph(self, request):
        levels = None
        params = request.QueryParams
        userName = params['userName']
        try:
            levels = int(params['levels'])
        except:
            levels = None

        self.database.saveGraphImg(userName, levels)
        return request.Response.ReturnFile('./files/graph.jpg')

    # Adicionar/deletar as relações de usuários
    @WebRoute(PUT, '/relation', name="toggle_relation")
    def EditRelation(self, request):
        body = request.GetPostedJSONObject()
        params = request.QueryParams
        userName = params['userName']
        entityName = body['entityName']
        relationType = body['relationType']
        operation = body['operation']

        if operation == 'add':
            if relationType == "Friend":
                self.database.addFriendship(userName, entityName)
            elif relationType == "Acquaintance":
                self.database.addAcquaintance(userName, entityName)
            elif relationType == "Family":
                self.database.addFamily(userName, entityName)
            elif relationType == "Client":
                self.database.addClient(userName, entityName)
            return request.Response.ReturnOk()

        elif operation == 'remove':
            self.database.removeRelation(userName, entityName)
            return request.Response.ReturnOk()

        request.Response.ReturnBadRequest()
