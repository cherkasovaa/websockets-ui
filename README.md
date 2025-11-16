# RSSchool NodeJS websocket task template
![Static Badge](https://img.shields.io/badge/status-in_progress-blue)
![Node.js](https://img.shields.io/badge/Node.js-24.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
> Static http server and base task packages. 
> By default WebSocket client tries to connect to the 3000 port.

## Installation
1. Clone/download repo 
2. `npm install`

## Usage
The server runs on port 5000 and listens for messages from client applications.

In the `.env.example` file, you can find an example of basic parameter settings for the `.env` file.

**Development**

`npm run start:dev`

* App served @ `http://localhost:5000` with ts-node-dev

**Production**

`npm run start`

* App served @ `http://localhost:5000` without ts-node-dev

---

**All commands**

Command | Description
--- | ---
`npm run start:dev` | App served @ `http://localhost:5000` with ts-node-dev
`npm run start` | App served @ `http://localhost:5000` without ts-node-dev
`npm run format` | Format code with Prettier
`npm run lint` | Check and fix code with ESLint
