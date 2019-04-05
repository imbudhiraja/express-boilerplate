# Express Boilerplate

ExpressJS boilerplate with Socket.IO, Mongoose for scalable projects.

### Includes

- [ExpressJS](https://expressjs.com)
- [NodeJS](https://nodejs.org/en/)
- [Mongoose](http://mongoosejs.com/docs/guide.html)
- [Socket.io](https://socket.io/docs)
- [API-Docs](http://apidocjs.com)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

```bash
#!/bin/bash
Node@v10.x.x
```

### Installing

A step by step series that will tell you how to get a development env running

```bash
#!/bin/bash
$ git clone https://github.com/imbudhiraja/express-boilerplate.git
$ cd express-boilerplate
```

```node
#!/.nvm/versions/node/v10.x.x/bin/node
$ npm ci
```

### Run at local server

```bash
touch .env
nano .env
NODE_ENV=development

npm run start
http://localhost:3001/
```

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md][PlDb] |
| Github | [plugins/github/README.md][PlGh] |
| Google Drive | [plugins/googledrive/README.md][PlGd] |
| OneDrive | [plugins/onedrive/README.md][PlOd] |
| Medium | [plugins/medium/README.md][PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |
