var redis = require("./redis");
var targetArray = [];
redis.get("targetArray", function (err, data) {
  targetArray = JSON.parse(data);
});

const saveNewTarget = (target) => {
  if (!targetArray) targetArray = [];
  var index = targetArray.findIndex((tar) => tar.id == target.id);
  if (index > -1) return { error: "A target with this Id is exist" };
  targetArray.push(target);
  saveTargetArray();
  return target;
};

const getTargetList = () => {
  return targetArray;
};

const saveTargetArray = () => {
  const jsonTargetArray = JSON.stringify(targetArray ?? []);
  redis.set("targetArray", jsonTargetArray);
};

const getTarget = (id) => {
  const target = targetArray.find((tar) => tar.id == id);
  return target;
};

const updateTarget = (id, target) => {
  var index = targetArray.findIndex((tar) => tar.id == id);
  if (index > -1) targetArray[index] = target;
  saveTargetArray();
  return index;
};

const route = (route) => {
  const routeFullDate = new Date(route.timestamp);
  const routeHour = routeFullDate.getUTCHours();
  const routeDate = routeFullDate.getUTCDate();
  var result = targetArray.filter(
    (tar) =>
      tar.accept.geoState["$in"].includes(route.geoState) &&
      tar.accept.hour["$in"].includes(routeHour.toString()) &&
      (tar.remainAccepts ?? tar.maxAcceptsPerDay) > 0
  );
  if (result.length == 0) {
    return { decision: "reject" };
  }
  const bestTarget = result.sort(
    (a, b) =>
      (b.lastRouted == routeDate ? b.remainAccepts : b.maxAcceptsPerDay) -
      (a.lastRouted == routeDate ? a.remainAccepts : a.maxAcceptsPerDay)
  )[0];
  const foundTarget = { decision: bestTarget.url };

  bestTarget.remainAccepts =
    (bestTarget.remainAccepts ?? bestTarget.maxAcceptsPerDay) - 1;
  bestTarget.lastRouted = routeDate;
  var index = targetArray.findIndex((tar) => tar.id == bestTarget.id);
  targetArray[index] = bestTarget;
  saveTargetArray();

  return foundTarget;
};
module.exports = {
  saveNewTarget,
  getTargetList,
  getTarget,
  updateTarget,
  route,
};
