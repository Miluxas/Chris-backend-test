const TargetsController = require('../controllers/targetControllers');

module.exports = {
  name: 'targets',
  version: '1.0.0',
  register: async (server) => {

    server.route([
      {
        method: 'GET',
        path: '/targets',
        handler: TargetsController.getList,
        options: {
          description: 'List all Targets',
          tags: ['api'],
        },
      },
      {
        method: 'GET',
        path: '/targets/{id}',
        handler: TargetsController.getById,
        options: {
          description: 'Get a target by its {id}',
          tags: ['api'],
        },
      },
    ]);
  }
};