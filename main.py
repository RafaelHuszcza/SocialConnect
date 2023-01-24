import matplotlib.pyplot as plt
from time import sleep

from server import CustomServer
from socialNet import SimpleNet

database = SimpleNet()
database.fromPkl()
server = CustomServer(database)
plt.figure()

try:
    server.start()
    # Main loop
    while True:
        sleep(1)
        if server.shouldClearPlot:
            plt.clf()
            server.shouldClearPLot = False

except KeyboardInterrupt:
    database.G.dumpToPkl()
    server.stop()  # Para o servidor
