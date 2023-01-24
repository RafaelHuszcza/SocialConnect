import pickle
from graphClass import Graph
import matplotlib.pyplot as plt
import networkx as nx
import copy
from matplotlib.lines import Line2D


class SimpleNet:
    def __init__(self):
        """
        This is a SimpleNet class
        It is an interface between the windows and the graph
        """
        self.G = None

    def fromPkl(self):
        """
        Load graph from pickle
        """
        try:
            # Open the file in binary mode
            with open("files/graph.pkl", 'rb') as file:
                # Call load method to deserialize
                self.G = pickle.load(file)
        except:
            self.G = Graph()
            self.saveGraph()

    def saveGraph(self):
     # Open a file and use dump()
        with open('files/graph.pkl', 'wb') as file:
            pickle.dump(self.G, file)  # A new file will be created

    def getUsers(self):
        """
        Return network users / graph vertices
        """
        return self.G.getVertices()

    def getUser(self, username):
        """
        Return vertex instance given the username (key)
        """
        return self.G.getVertex(username)

    def isUser(self, user):
        """
        Return whether an user is in the network or not
        """
        return self.G.inGraph(user)

    def createAccount(self, user, password, person, data):
        """
        Create account / add vertex to graph
        """

        if self.getUser(user) != None:
            return "Usuário já Cadastrado"
        info = {"person": person, "password": password,
                "private": data["private"], "public": data["public"],
                }
        self.G.addVertex(user, info)
        self.saveGraph()

    def updateAccount(self, user, data):
        """
        Update user's information / vertex's value
        """
        if self.getUser(user):
            UserToEdit = self.getUser(user)
            UserToEdit.value["private"] = data["private"]
            UserToEdit.value["public"] = data["public"]
            self.saveGraph()
            return True
        else:
            return False

    def smartSearch(self, user, key, value, person=True):
        """
        Perform BFS to find user[key] = value
        """
        if key == "user":
            matches = self.G.BFS(
                user, True, lambda v: value in v.key)
        else:
            matches = self.G.BFS(user, True, lambda v: key in v.value["public"].keys(
            ) and value in v.value["public"][key])
        return matches

    def dumbSearch(self, key, value, userReal):
        """
        Perform BFS to find user[key] = value
        """
        userReal = self.getUser(userReal)

        matches = []
        for v in self.G.vertices.values():
            if key == "user" and value in v.key:

                copy = v.copy()
                copy["userName"] = v.key
                try:
                    connections = self.getConnection(userReal, v.key)
                    copy["connections"] = connections
                    matches.append(copy)
                except:
                    matches.append(copy)

            elif key in v.value["public"].keys() and value in v.value["public"][key]:
                copy = v.copy()
                copy["userName"] = v.key
                try:
                    connections = self.getConnection(userReal, v)
                    copy["connections"] = connections
                    matches.append(copy)
                except:
                    matches.append(copy)

        return matches

    def getConnection(self, user1, user2):
        """
        Get relatioship between two users
        """
        user2 = self.getUser(user2)
        return self.G.getEdgeWeight(user1.key, user2.key)

    def addFriendship(self, user1, user2):
        """
        Add edge between two users with weight = friend
        """
        self.G.addEdge(user1.key, user2.key, weight="Amigo")
        self.G.addEdge(user2.key, user1.key, weight="Amigo")
        self.saveGraph()

    def addAcquaintance(self, user1, user2):
        """
        Add edge between two users with weight = acquaintance
        """
        self.G.addEdge(user1.key, user2.key, weight="Conhecido")
        self.saveGraph()

    def addFamily(self, user1, user2):
        """
        Add edge between two users with weight = family
        """
        self.G.addEdge(user1.key, user2.key, weight="Família")
        self.G.addEdge(user2.key, user1.key, weight="Família")
        self.saveGraph()

    def addClient(self, user1, user2):
        """
        Add edge between two users with weight = client
        """
        self.G.addEdge(user1.key, user2.key, weight="Cliente")
        self.saveGraph()

    def removeFriendship(self, user1, user2):
        """
        Remove edge between two users
        """
        self.G.removeEdge(user1.key, user2.key)
        self.G.removeEdge(user2.key, user1.key)
        self.saveGraph()

    def removeAcquaintance(self, user1, user2):
        """
        Remove edge between two users
        """
        self.G.removeEdge(user1.key, user2.key)
        self.saveGraph()

    def removeFamily(self, user1, user2):
        """
        Remove edge between two users
        """
        self.G.removeEdge(user1.key, user2.key)
        self.G.removeEdge(user2.key, user1.key)
        self.saveGraph()

    def removeClient(self, user1, user2):
        """
        Remove edge between two users
        """
        self.G.removeEdge(user1.key, user2.key)
        self.saveGraph()

    def getAllConnections(self, user):
        connections = []
        for x in user.adjacent:
            userToSend = self.getUser(x).copy()
            userToSend["userName"] = x
            # del userToSend["adjacent"]
            connections.append([userToSend, self.getConnection(user, x)])
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

    def saveGraphImg(self, user, levels=None):
        """
        Create graph in the networkx library
        Save it to image
        """
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
