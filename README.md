Per eseguire il progetto in locale:

1- Clonare la repo e aprire il folder con Visual Studio Code

2- Aggiungere nel folder backendEF il file .env con le seguenti variabili desiderate

   2.1- PORT=

   2.2- MONGO_URI=

   2.3- JWT_SECRET=

   2.4- FRONTEND_URL= //se per deploy

3- Aprire il terminale ed eseguire i seguenti comandi

   3.1- cd backendEF

   3.2- npm i

   3.3- cd ..

   3.4- cd frontendEF

   3.5- npm i

4- Avviare i progetti all'interno dei rispettivi folder come segue

   4.1- cd backendEF

   4.2- npm run dev

   4.3- cd ..

   4.4- cd frontendEF

   4.5- ng serve --open

5- Aspettare che vi si apra la pagina del browser