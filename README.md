# Hottennis API

## Instalation

In order to install dependencies execute:

```
yarn
```

## Environment variables

Before running API make sure you have **.env** file on yout root directory, this is the structure of the file:
*(Substitute <> tag with actual ENV value)*
```
PORT=<PORT> //Port where API will be runnings
MONGO_URI=<MONGO_URI> //URI of the databaste we are going to use.
API_KEY=<API_KEY> //API_KEY to make API work.
```

## Execution environments

There are two environments that we can use to run the API:



```
yarn start:dev
```
To run auto-saving mode when developing.

```
yarn start
```
To run API in production mode (changes will appear until you restart the server).

## Considerations
1. When creating a router file, consider that the endpoint will be: example. users.js -> /api/users.
2. Consider creating one controller file for each router file created with the same name.
3. **ALWAYS** use *"requireSignIn"* middleware so people need to call from client with API KEY.

## Documentation

Documentation can be found [here](https://documenter.getpostman.com/view/14826019/2sA35Mydxt).