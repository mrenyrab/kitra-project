# Welcome to Kitra!

**Kitra** is a game where users can collect treasures in a given latitude and longitude. Every treasure that is collected will have points based on the monetary value. A treasure may have more than one money value, it depends on the user’s luck. Kitra users may get the highest money from the treasure that has been collected.

## Getting started

- Clone the **Kitra** repository in your computer.
- **Install** the dependencies of the project by opening terminal and run command below:

```
npm install
```

- After installing, **run the project**. As for me, I execute the command below.

```
nodemon index.js
```

- I have provided **kitra.postman_collection** so that you may be able to **import** it on your postman for testing the project.
- **Open your postman application** and **import the collection file** which is located on root folder of the repository.

## API Guides

- **Migration/Seeding [POST]**

  > - This step is optional to run since it is already added on the database
  > - User - http://localhost:4000/seed/seed-user
  > - Treasures - http://localhost:4000/seed/seed-treasures
  > - Money Values - http://localhost:4000/seed/seed-money-values
  > - Provided on the collection file under seed sample data folder

- **Register [POST]** - http://localhost:4000/main/register (Bonus endpoint)
  > - This step is optional, as there are already provided accounts. Please proceed directly to the login page if you dont want to register.
  > - Please note that you can also log in using the sample accounts available in the repository. You can find them in the sample_data folder by opening the seedUsers.js file.
  > - Postman input [raw, json]:

```
{
"userId": "your-userId",
"name": "your-name",
"age": "your-age"
"password": "your-password",
"email": "your-email"
}
```

- **Login [POST]** - http://localhost:4000/main/login (Bonus endpoint)
  > - Please note that you can also log in using the sample accounts available in the repository. You can find them in the sample_data folder by opening the seedUsers.js file.
  > - Postman input [raw, json]:

```
{
"email": "your-username",
"password": "your-password"
}
```

- **Add treasure[POST]** - http://localhost:4000/main/add-treasure (Bonus endpoint)

> - Note that you must login and provide the token via Authorization>Bearer Token.
> - Postman input [raw, json]:

```
{
"treasureId": "treasure-id"
"latitude": "treasure-latitude"
"longitude": "treasure-longitude"
"name": "treasure-name"
}
```

- **Add money value[POST]** - http://localhost:4000/main/add-money-value (Bonus endpoint)
  > - Note that you must login and provide the token via Authorization>Bearer Token.
  > - Postman input [raw, json]:

```
{
"treasureId": "treasure-id"
"amount": "prize-amount"
}
```

- **Find treasure [GET]** - http://localhost:4000/main/find-treasures
  > - Find treasure chests within a specified distance from the provided latitude and longitude
  > - Distance should only be either 1(km) or 10(km).
  > - Note that you must login and provide the token via Authorization>Bearer Token.
  > - Postman input [raw, json]:

```
{
"latitude": "14.5437648051331",
"longitude": "121.019911678311",
"distance": 5
}
```

- **Find treasure by value [GET]** - http://localhost:4000/main/find-treasures-by-value
  > - Find treasure chests within a specified distance from the provided latitude and longitude that matches the specified price value.
  > - Price value is optional. If no price value is specified, find the treasure normally same as above.
  > - If the price value is specified and the treasure chest has multiple prize, only the minimum prize will be considered. So if the treasure chest has $10, $20, $30. The $10 will be considered.
  > - Please note that you must login and provide the token via Authorization>Bearer Token.
  > - Postman input [raw, json]:

```
{
"latitude": "14.5437648051331",
"longitude": "121.019911678311",
"distance": 10,
"price_value": 20 --> (optional)
}

```
