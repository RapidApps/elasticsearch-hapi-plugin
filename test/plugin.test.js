'use strict';

var Lab = require('lab');
var Server = require('hapi').Server;
var Boom = require('hapi').error;
var ElasticSearch = require('elasticsearch');
var ElasticSearchPlugin = require('../plugin');

var lab = exports.lab = Lab.script();

lab.experiment('ElasticSearch Hapi Plugin', function () {
  lab.test('elastic search client on the `es` property', function (next) {
    var server = new Server(0);
    server.pack.register(ElasticSearchPlugin, function (err) {
      if (err) return next(err);

      var plugin = server.pack.plugins['elasticsearch-hapi-plugin'];
      Lab.expect(plugin).to.have.property('es');
      next();
    });
  });

  lab.test('all plugin options passed to elastic search client', function (next) {
    var server = new Server(0);
    server.pack.register({
      plugin: ElasticSearchPlugin,
      options: {
        apiVersion: "1.1"
      }
    }, function (err, pack) {
      if (err) return next(err);

      var es = server.pack.plugins['elasticsearch-hapi-plugin'].es;
      Lab.expect(es.transport._config.apiVersion).to.equal('1.1');
      next();
    });
  });

  lab.experiment('elastic search HTTP errors', function (next) {
    var server;
    var pack;

    lab.before(function (next) {
      server = new Server(0, '127.0.0.1', {debug: false});

      function ErrorRoute(path, Error) {
        this.method = 'GET';
        this.path = path;
        this.handler = function (request, reply) {
          reply(new Error());
        };
      }

      server.route({
        method: 'GET',
        path: '/ok',
        handler: function (request, reply) {
          reply({success: true});
        }
      });

      server.route(new ErrorRoute('/connection-fault', ElasticSearch.errors.ConnectionFault));
      server.route(new ErrorRoute('/no-connections', ElasticSearch.errors.NoConnections));
      server.route(new ErrorRoute('/request-timeout', ElasticSearch.errors.RequestTimeout));
      server.route(new ErrorRoute('/service-unavailable', ElasticSearch.errors.ServiceUnavailable));
      server.route(new ErrorRoute('/internal-server-error', ElasticSearch.errors.InternalServerError));
      server.route(new ErrorRoute('/precondition-failed', ElasticSearch.errors.PreconditionFailed));
      server.route(new ErrorRoute('/conflict', ElasticSearch.errors.Conflict));
      server.route(new ErrorRoute('/forbidden', ElasticSearch.errors.Forbidden));
      server.route(new ErrorRoute('/not-found', ElasticSearch.errors.NotFound));
      server.route(new ErrorRoute('/bad-request', ElasticSearch.errors.BadRequest));
      server.route(new ErrorRoute('/generic', ElasticSearch.errors.Generic));

      pack = server.pack;
      pack.register(ElasticSearchPlugin, function (err) {
        if (err) return next(err);

        server.start(next);
      });
    });

    lab.after(function (next) {
      server.stop(next);
    });

    lab.test('No error', function (next) {
      server.inject('/ok', function (response) {
        Lab.expect(response.statusCode).to.equal(200);
        next();
      });
    });

    lab.test('503 Connection fault', function (next) {
      server.inject('/connection-fault', function (response) {
        Lab.expect(response.statusCode).to.equal(503);
        next();
      });
    });

    lab.test('503 No Connections', function (next) {
      server.inject('/no-connections', function (response) {
        Lab.expect(response.statusCode).to.equal(503);
        next();
      });
    });

    lab.test('504 Request Timeout', function (next) {
      server.inject('/request-timeout', function (response) {
        Lab.expect(response.statusCode).to.equal(504);
        next();
      });
    });

    lab.test('503 Service Unavailable', function (next) {
      server.inject('/service-unavailable', function (response) {
        Lab.expect(response.statusCode).to.equal(503);
        next();
      });
    });

    lab.test('500 Internal Server Error', function (next) {
      server.inject('/internal-server-error', function (response) {
        Lab.expect(response.statusCode).to.equal(500);
        next();
      });
    });

    lab.test('412 Precondition Failed', function (next) {
      server.inject('/precondition-failed', function (response) {
        Lab.expect(response.statusCode).to.equal(412);
        next();
      });
    });

    lab.test('409 Conflict', function (next) {
      server.inject('/conflict', function (response) {
        Lab.expect(response.statusCode).to.equal(409);
        next();
      });
    });

    lab.test('403 Forbidden', function (next) {
      server.inject('/forbidden', function (response) {
        Lab.expect(response.statusCode).to.equal(403);
        next();
      });
    });

    lab.test('404 Not Found', function (next) {
      server.inject('/not-found', function (response) {
        Lab.expect(response.statusCode).to.equal(404);
        next();
      });
    });

    lab.test('400 Bad Request', function (next) {
      server.inject('/bad-request', function (response) {
        Lab.expect(response.statusCode).to.equal(400);
        next();
      });
    });

    lab.test('500 Generic', function (next) {
      server.inject('/generic', function (response) {
        Lab.expect(response.statusCode).to.equal(500);
        next();
      });
    });
  });
});
