import pickle
from graphClass import Graph
import matplotlib.pyplot as plt
import networkx as nx
import copy
from matplotlib.lines import Line2D

# Classe Social Connect serve para comunicação do servidor com a classe.


class SocialConnect:

    def __init__(self):

        self.G = None

    def fromPkl(self):
        """
        Carrega o Grafo se este já estiver criado, usando a biblioteca pickle, se não inicia um novo grafo e o salva, criando o arquivo binário, armazenando dessa forma o objeto utilizado
        """
        try:

            with open("files/graph.pkl", 'rb') as file:
                self.G = pickle.load(file)
        except:
            self.G = Graph()
            self.saveGraph()

     # Função que salva o grafo no arquivo
    def saveGraph(self):

        with open('files/graph.pkl', 'wb') as file:
            pickle.dump(self.G, file)

    # Função que retorna todos os vertices do grafo
    def getUsers(self): return self.G.getVertices()

    # Função que retorna o vertice do usuário passado como parâmetro
    def getUser(self, userName): return self.G.getVertex(userName)

    # Função que cria um novo usuário, ou seja um novo vertice no grafo
    def createAccount(self, userName, infos):

        if self.getUser(userName) != None:
            return "Usuário já Cadastrado"

        # Como o vertice possui chave e valor o userName é usado como chave, enquanto as informações são passadas como valor
        self.G.addVertex(userName, infos)
        self.saveGraph()
    # Atualiza o usuário, ou seja o vertice no grafo

    def updateAccount(self, userName, infos):

        if self.getUser(userName):
            UserToEdit = self.getUser(userName)
            UserToEdit.value = infos
            self.saveGraph()
            return True
        else:
            return False

    """
    Busca esperta, ou seja essa busca retorna somente itens relacionados através de busca em largura, itens não relacionados n
    ao serão retornados
    """

    def smartSearch(self, userName, key, value):
        """
        Busca esperta, ou seja essa busca retorna somente itens relacionados através de busca em largura, itens não relacionados não serão retornados
        """
        if key == "userName":
            matches = self.G.BFS(
                userName, True, lambda v: value in v.key)
        else:
            matches = self.G.BFS(userName, True, lambda v: key in v.value["data"]["public"].keys(
            ) and value in v.value["data"]["public"][key])
        for entity in matches:
            try:
                connections = self.getConnection(userName, entity)
                entity["connections"] = connections
            except:
                None

        return matches

    def dumbSearch(self, userName, key, value):
        """
        Busca Burra, ou seja  retorna todos os itens do grafo, relacionado com os valores passados
        """
        print("oi")
        matches = []
        for v in self.G.vertices.values():
            print("oi")
            if key == "userName" and value in v.key:
                print("kk")
                try:
                    connections = self.getConnection(userName, v.key)
                    copy = v.copy()
                    copy["connections"] = connections
                    matches.append(copy)
                except:
                    matches.append(copy)

            elif key in v.value["data"]["public"].keys() and value in v.value["data"]["public"][key]:

                try:
                    connections = self.getConnection(userName, v)
                    copy = v.copy()
                    copy["connections"] = connections
                    matches.append(copy)
                except:
                    matches.append(copy)

        return matches

    # Função que retorna a relação entre 2 usuários
    def getConnection(self, userName1, userName2):

        user1 = self.getUser(userName1)
        user2 = self.getUser(userName2)
        return self.G.getEdgeWeight(user1.key, user2.key)
        self.saveGraph()

    # Função que adiciona  a relação entre dois usuários como amigos
    def addFriendship(self, userName1, userName2):

        user1 = self.getUser(userName1)
        user2 = self.getUser(userName2)
        self.G.addEdge(user1.key, user2.key, weight="Friend")
        self.G.addEdge(user2.key, user1.key, weight="Friend")
        self.saveGraph()
    # Função que adiciona  a relação entre dois usuários como conhecidos

    def addAcquaintance(self, userName1, userName2):

        user1 = self.getUser(userName1)
        user2 = self.getUser(userName2)
        self.G.addEdge(user1.key, user2.key, weight="Acquaintance")
        self.saveGraph()

    # Função que adiciona  a relação entre dois usuários como Família
    def addFamily(self, userName1, userName2):

        user1 = self.getUser(userName1)
        user2 = self.getUser(userName2)
        self.G.addEdge(user1.key, user2.key, weight="Family")
        self.G.addEdge(user2.key, user1.key, weight="Family")
        self.saveGraph()

    # Função que adiciona a relação entre dois usuários como Cliente
    def addClient(self, userName1, userName2):

        user1 = self.getUser(userName1)
        user2 = self.getUser(userName2)
        self.G.addEdge(user1.key, user2.key, weight="Client")
        self.saveGraph()

    # Função que remove relação entre dois usuários
    def removeRelation(self, userName1, userName2):

        user1 = self.getUser(userName1)
        user2 = self.getUser(userName2)
        self.G.removeEdge(user1.key, user2.key)
        self.G.removeEdge(user2.key, user1.key)
        self.saveGraph()

    # Função que retorna todas as relações de um usuário
    def getAllConnections(self, userName):

        user = self.getUser(userName)
        connections = []
        for x in user.adjacent:
            userToSend = self.getUser(x).copy()
            print("aa")
            connections.append(
                [userToSend, self.getConnection(user.key, x)])
        return connections

    def subGraph(self, user, levels):
        """
        Create subgraph centered in user that extends to a certain level of adjacent vertices
        """
        newG = copy.deepcopy(self.G)
        vs = []
        level_vs = [user]
        for i in range(levels):
            next_vs = []
            for vertex in level_vs:
                next_vs += [i[0] for i in vertex.adjacent.values()]
            vs += level_vs
            if not next_vs:
                break
            level_vs = next_vs

        for v in self.G.vertices.values():
            if v not in vs:
                newG.removeVertex(v.key)
        return newG
    # Cria um grafo usando a biblioteca networkx e salva ele

    def saveGraphImg(self, userName, levels=None):
        user = self.getUser(userName)
        if levels:
            subgraph = self.subGraph(user, levels)
        else:
            subgraph = self.G
        DG = nx.DiGraph()
        for node in subgraph.vertices.keys():
            DG.add_node(node)
        edges = subgraph.getEdges()

        for v1, v2, w in edges:
            if w == "Amigo":
                color = "red"
            elif w == "Conhecido":
                color = "blue"
            elif w == "Família":
                color = "green"
            else:
                color = "black"
            DG.add_edge(v1, v2, color=color)
        pos = nx.circular_layout(DG)
        edges = DG.edges()
        colors = [DG[u][v]['color'] for u, v in edges]
        nx.draw(DG, pos, with_labels=True, edge_color=colors,
                node_color="paleturquoise")
        legend_elements = [
            Line2D([0], [0], marker='o', color='w', label='Família',
                   markerfacecolor='g', markersize=8),
            Line2D([0], [0], marker='o', color='w', label='Amigo',
                   markerfacecolor='r', markersize=8),
            Line2D([0], [0], marker='o', color='w', label='Conhecido',
                   markerfacecolor='blue', markersize=8),
            Line2D([0], [0], marker='o', color='w', label='Cliente',
                   markerfacecolor='black', markersize=8),
        ]
        plt.legend(handles=legend_elements, loc='upper right')
        plt.savefig("files/graph.jpg", dpi=1000)
        plt.clf()
