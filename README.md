# Circuits UI
__Circuits UI__ is a logic circuits simulator web app for educational purposes. The project is developing in [Ivan Franko National University of Lviv](http://bit.ly/2rqGtxH) and is fully open-source.

## Our Story
This project was started as a rethinking of [BUMMEL](https://github.com/Uko/BUMMEL) project and we really appreciate the work these guys have done. We are using some of their ideas and their approach to circuits simulation.

__Circuits UI__ is using the client-server model. The backend part is written on [Pharo](http://pharo.org/) language, which is based on Smalltalk. The source code for the backend part could be found on [SmalltalkHub](http://bit.ly/2rTQapQ).

## Project Setup
### Backend part
1. Download [Pharo 5.0](http://pharo.org/web/download)
2. Open Pharo, enter Monticello Browser (Ctrl + O + P) and download [our repository](http://bit.ly/2rTQapQ)
3. Install NeoJSON
```
Gofer it
  url: 'http://mc.stfx.eu/Neo';
  package: 'Neo-JSON-Core';
  package: 'Neo-JSON-Tests';
  load.
```
4. Open Playground and start a Zinc server
```
ZnServer startDefaultOn: 8081.
ZnServer default delegate map: #calcCircuit to: LogicalSchemesServer new.
```
5. Now your server is up and running on `localhost:8081`

### Frontend part
1. Make sure you're using node v6.9 and older before installing dependencies. If you're using [nvm](https://github.com/creationix/nvm),
```
nvm use 6.9.1
```
or
```
nvm install 6.9.1
```
2. [Install yarn](https://yarnpkg.com/lang/en/docs/install/)
3. Install dependencies
```
yarn
```
4. Run in development mode
```
npm run dev
```
5. Open `localhost:8080`
