# TwitterAPI - Backend Assessment

## Installation

You will need:
- Node
- MySQL
- Postman

You will need to run the queries in twitterdb.sql first. The database is running on localhost, so make sure you have mySQL running. 
Then, you must change the .env variables to match your localhost settings.

```sh
DB_USER=root
DB_PASS=root
DB_PORT=3306
```

Once the database is ready, you will need to install the node modules. 

```sh
cd TwitterAPI
npm install
```

The application is now ready to run! 
```sh
npm run dev
npm test
```
npm run dev will run the program in watch mode. You will need to press ctrl+c to exit. npm test will run all tests.
