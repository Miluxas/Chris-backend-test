const getTarget = require('../../application/use-cases/get_target');
const getTargets = require('../../application/use-cases/get_targets');

module.exports = {

  async getList(request) {
    const serviceLocator = request.server.app.serviceLocator;
    const targets = await getTargets(serviceLocator);
    return targets;
  },

  async getById(request) {
    const serviceLocator = request.server.app.serviceLocator;
    const targetId = request.params.id;
    const target = await getTarget(targetId, serviceLocator);
    return target
  }
}
