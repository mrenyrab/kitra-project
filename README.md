# Welcome to Kitra!

**Kitra** is a game where users can collect treasures in a given latitude and longitude. Every treasure that is collected will have points based on the monetary value. A treasure may have more than one money value, it depends on the user’s luck. Kitra users may get the highest money from the treasure that has been collected.

## Getting started

- Clone the **Kitra** repository in your computer.
- **Install** the dependencies of the project by opening terminal and run command below:
  > npm install
- After installing, **run the project**. As for me, I execute the command below.
  > nodemon index.js
- I have provided **kitra.postman_collection** so that you may be able to **import** it on your postman for testing the project.
- **Open your postman application** and **import the file** which is located on root folder of the repository.

## Postman API Guides

- Disregard the seed sample data folder, as it is intended for migration/seeding provided data for the project.
- **Register** - http://localhost:4000/main/register
  -- This step is optional, as there are already provided accounts. Please proceed directly to the login page. > {
  "userId": "your-userId",
  "name": "your-name",
  "age": "your-age"
  "password": "your-password",
  "email": "your-email"
  }
- **Login** - http://localhost:4000/main/login
  -- Please note that you can also log in using the sample accounts available in the repository. You can find them in the sample_data folder by opening the seedUsers.js file.
  > {
      "email": "your-username",
      "password": "your-password"
  }
- **Find treasure** - http://localhost:4000/main/find-treasures
  -- Please note that you must login and provide the token via Authorization>Bearer Token.
  -- Find treasure boxes within 1km or 10 (km).
  > {
  > "latitude": "14.5437648051331",
  > "longitude": "121.019911678311",
  > "distance": 5
  > }
- **Find treasure by value** - http://localhost:4000/main/find-treasures-by-value
  -- Please note that you must login and provide the token via Authorization>Bearer Token.
  -- Discover a treasure chest matching the specified price range of $10 to $30. The inclusion of a price value is optional, as the program will explore all treasures within the designated distance.
  > {
  > "latitude": "14.5437648051331",
  > "longitude": "121.019911678311",
  > "distance": 10,
  > "price_value": 12
  > }
