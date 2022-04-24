var redis = require("./redis");
var targetArray = [];
redis.get("targetArray", function (err, data) {
  targetArray = JSON.parse(data);
});

const saveNewTarget = (target) => {
  try {
    if (!targetArray) targetArray = [];
    var index = targetArray.findIndex((tar) => tar.id == target.id);
    if (index > -1) return [{ error: "A target with this Id is exist" },null];
    targetArray.push(target);
    saveTargetArray();
    return [target,null];
  } catch (error) {
    return [null, error];
  }
};

const getTargetList = () => {
  try {
    return [targetArray,null]
  } catch (error) {
    return [null, error];
  }
};

const saveTargetArray = () => {
    const jsonTargetArray = JSON.stringify(targetArray ?? []);
    redis.set("targetArray", jsonTargetArray);
};

const getTarget = (id) => {
  try {
    const target = targetArray.find((tar) => tar.id == id);
    return [target, null];
  } catch (error) {
    return [null, error];
  }
};

const updateTarget = (id, target) => {
  try {
    var index = targetArray.findIndex((tar) => tar.id == id);
    if (index > -1) targetArray[index] = target;
    saveTargetArray();
    return [index, null];
  } catch (error) {
    return [null, error];
  }
};

const route = (route) => {
  try {
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
      return [{ decision: "reject" }, null];
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

    return [foundTarget, null];
  } catch (error) {
    return [null, error];
  }
};
module.exports = {
  saveNewTarget,
  getTargetList,
  getTarget,
  updateTarget,
  route,
};
