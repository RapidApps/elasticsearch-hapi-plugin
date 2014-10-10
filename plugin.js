'use strict';

var pkg = require('./package');
var ElasticSearch = require('elasticsearch');
var Logger = require('elasticsearch-hapi-logger');

exports.register = register;
exports.register.attributes = {
  name: pkg.name,
  version: pkg.version
};

function register(plugin, options, next) {
  var Hapi = plugin.hapi;

  var config = {
    log: new Logger(plugin)
  };

  for (var key in options) {
    config[key] = options[key];
  }

  var es = new ElasticSearch.Client(config);

  plugin.ext('onPostHandler', function (request, reply) {
    var response = request.response;

    if (response instanceof ElasticSearch.errors.ConnectionFault) {
      return reply(Hapi.error.serverTimeout(response.message));
    }

    if (response instanceof ElasticSearch.errors.NoConnections) {
      return reply(Hapi.error.serverTimeout(response.message));
    }

    if (response instanceof ElasticSearch.errors.RequestTimeout) {
      return reply(Hapi.error.gatewayTimeout(response.message));
    }

    if (response instanceof ElasticSearch.errors.ServiceUnavailable) {
      return reply(Hapi.error.serverTimeout(response.message));
    }

    if (response instanceof ElasticSearch.errors.InternalServerError) {
      return reply(Hapi.error.badImplementation(response.message));
    }

    if (response instanceof ElasticSearch.errors.PreconditionFailed) {
      return reply(Hapi.error.preconditionFailed(response.message));
    }

    if (response instanceof ElasticSearch.errors.Conflict) {
      return reply(Hapi.error.conflict(response.message));
    }

    if (response instanceof ElasticSearch.errors.Forbidden) {
      return reply(Hapi.error.forbidden(response.message));
    }

    if (response instanceof ElasticSearch.errors.NotFound) {
      return reply(Hapi.error.notFound(response.message));
    }

    if (response instanceof ElasticSearch.errors.BadRequest) {
      return reply(Hapi.error.badRequest(response.message));
    }

    if (response instanceof ElasticSearch.errors.Generic) {
      return reply(Hapi.error.badImplementation(response.message));
    }

    reply();
  });

  plugin.expose('es', es);
  return next();
}
