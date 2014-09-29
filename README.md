# Hapi plugin for Elastic Search

Provides a central Elastic Search client for your other hapi plugins and server
to use.

## Features

- Elastic Search logs through your hapi server
- Elastic Search connection pool for entire server (or pack)

## Installation

Simply install the `elasticsearch-hapi-plugin` module from npm:

```sh
npm install --save elasticsearch-hapi-plugin
```

## Usage example

See the Elastic Search [configuration documentation](http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/configuration.html) for all the configuration options.

```js
var Hapi = require('hapi');

var server = new Hapi.Server();

server.pack.register({
  plugin: require('elasticsearch-hapi-plugin'),
  options: {
    host: "http://localhost:9200"
  }
},
function (err) {
  if (err) return;

  server.start();
});
```
