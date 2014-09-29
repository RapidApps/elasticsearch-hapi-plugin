var Lab = require('lab');
var Hapi = require('hapi');
var ElasticSearchPlugin = require('../plugin');

var lab = exports.lab = Lab.script();

lab.experiment('ElasticSearch Hapi Plugin', function () {
  var server;
  var pack;
  var plugin;

  lab.before(function (next) {
    server = new Hapi.Server(0);
    pack = server.pack;
    next();
  });

  lab.test('is registered with a hapi server pack', function (next) {
    pack.register({plugin: ElasticSearchPlugin}, function (err) {
      Lab.expect(err).to.not.exist;

      plugin = pack.plugins['elasticsearch-hapi-plugin'];
      Lab.expect(plugin).to.have.property('es');
      next();
    });
  });
});
