var sendJson = require("send-data/json");
var {
  saveNewTarget,
  getTargetList,
  getTarget,
  updateTarget,
  route,
} = require("./target.service");
const apiTargets = (req, res, option) => {
  if (req.method === "GET") {
    const result = getTargetList();
    return sendJson(req, res, result);
  } else if (req.method === "POST") {
    const result = saveNewTarget(req.body);
    return sendJson(req, res, result);
  }
};

const apiTarget = (req, res, option) => {
  if (req.method === "GET") {
    const result = getTarget(option.params.id);
    return sendJson(req, res, result);
  } else if (req.method === "POST") {
    const result = updateTarget(option.params.id, req.body);
    return sendJson(req, res, result);
  }
};

const apiRoute = (req, res, option) => {
  const result = route(req.body);
  return sendJson(req, res, result);
};

module.exports = {
  apiTargets,
  apiTarget,
  apiRoute,
};
