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
    const [result, err] = getTargetList();
    if (err) {
      res.statusCode = 500;
      res.end();
    }
    return sendJson(req, res, result);
  } else if (req.method === "POST") {
    const [result, err] = saveNewTarget(req.body);
    if (err) {
      res.statusCode = 500;
      res.end();
    }
    return sendJson(req, res, result);
  }
};

const apiTarget = (req, res, option) => {
  if (req.method === "GET") {
    const [result, err] = getTarget(option.params.id);
    if (err) {
      res.statusCode = 500;
      res.end();
    }
    return sendJson(req, res, result);
  } else if (req.method === "POST") {
    const [result, err] = updateTarget(option.params.id, req.body);
    if (err) {
      res.statusCode = 500;
      res.end();
    }
    return sendJson(req, res, result);
  }
};

const apiRoute = (req, res, option) => {
  const [result, err] = route(req.body);
  if (err) {
    res.statusCode = 500;
    res.end();
  }
  return sendJson(req, res, result);
};

module.exports = {
  apiTargets,
  apiTarget,
  apiRoute,
};
