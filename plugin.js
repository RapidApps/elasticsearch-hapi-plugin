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
  var config = {
    log: new Logger(plugin)
  };

  for (var key in options) {
    config[key] = options[key];
  }

  var es = new ElasticSearch.Client(config);

  plugin.expose('es', es);
  return next();
}
