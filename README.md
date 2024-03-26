# mealmingle_backend

MealMingle takes a photo and parses the amount of food in it, adding it to the database. It's application is for restaurants and grocery's giving food away, so that it's easier for them to share it with the local community.

It is made of two parts, the frontend and the backend.  The frontend has two pages, one to add new food and one to see all available food. We are using a ChatGPT model to analyze the food, however it requires a private API key that is in the .env file and may run out of uses.


to run mealmingle frontend
(runs on port 9000)

``` 
git clone https://github.com/ramjayakumar21/mealmingle_frontend
cd mealmingle_frontend
npm ci
npm run start
```

to run mealmingle backend
backend needs .env with following values:
```
MONGODB_URL = 
AI_API = (astica API key)
MONGODB_PASS = 
```
(runs on port 9001)

``` 
git clone https://github.com/ramjayakumar21/mealmingle_backend
cd mealmingle_backend
npm ci
npm run devstart
```

