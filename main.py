import matplotlib.pyplot as plt
from time import sleep
from Server import CustomServer
from SocialConnect import SocialConnect

# Instancia a classe SocialConnect e executa a leitura de dados se tiver algum dado a ser lido
database = SocialConnect()
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
