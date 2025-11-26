# Comandos para Configurar la Base de Datos
(en la carpeta donde se encuentre el archivo YML se ejecuta el comando)
-   docker compose -f instanciaDocker.yml up -d

Esto deberia generar la base de datos dentro de Docker.

En Visual Studio Para realizar la conexion debes de tener instaldo las extenciones
-   SQLTools - SQLTools MySQL/MariaDB/TiDB

Dentro de esta extencion debes de configurar la base de datos con los siguientes datos
(Los que se encuentran vacios no se le agrega nada):

    Connection name:    ring_db
    Connection group:   
    Connect using:      Server and Port
    Server Address:     localhost
    Port:               3306
    Database:           ring_auth
    Username:           ring_user
    Password:           ringpass123

        MySQL driver specific options
    Authentication Protocol:    default
    SSL:                        Disabled

    Over SSH:                   Disabled
    Connection Timeout:
    Show records default limit: 50

Luego de ingresar estos datos se prueba la conexion, si funciona se guarda y se conecta.
Puedes utilizar el archivo ring_db.session.sql para agregar las tablas.