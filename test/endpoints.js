process.env.NODE_ENV = "test";

var test = require("ava");
var servertest = require("servertest");

var server = require("../lib/server");

test("healthcheck", function (t) {
  var url = "/health";
  servertest(server(), url, { encoding: "json" }, function (err, res) {
    t.falsy(err, "no error");

    t.is(res.statusCode, 200, "correct statusCode");
    t.is(res.body.status, "OK", "status is ok");
    t.end();
  });
});

test("post a target", function (t) {
  var url = "/api/targets";
  servertest(
    server(),
    url,
    {
      encoding: "json",
      method: "POST",
      body: {
        id: "2",
        url: "http://example.com",
        value: "0.50",
        maxAcceptsPerDay: "15",
        accept: {
          geoState: {
            $in: ["ca", "ny", "tx"],
          },
          hour: {
            $in: ["8", "9", "10"],
          },
        },
      },
    },
    function (err, res) {
      t.falsy(err, "no error");

      t.is(res.statusCode, 200, "correct statusCode");
      t.is(res.body.id, "2", "status is ok");
      t.end();
    }
  );
});

test("get all targets", function (t) {
  var url = "/api/targets";
  servertest(
    server(),
    url,
    {
      encoding: "json",
      method: "GET",
    },
    function (err, res) {
      t.falsy(err, "no error");
      t.is(res.statusCode, 200, "correct statusCode");
      t.end();
    }
  );
});

test("get a target", function (t) {
  var url = "/api/target/2";
  servertest(
    server(),
    url,
    {
      encoding: "json",
      method: "GET",
    },
    function (err, res) {
      t.falsy(err, "no error");
      t.is(res.statusCode, 200, "correct statusCode");
      t.is(res.body.id, "2", "status is ok");
      t.end();
    }
  );
});

test.serial.cb("update a target", function (t) {
  var url = "/api/target/2";
  servertest(
    server(),
    url,
    {
      encoding: "json",
      method: "POST",
      body: {
        id: "2",
        url: "http://example.com",
        value: "0.50",
        maxAcceptsPerDay: "10",
        accept: {
          geoState: {
            $in: ["ca", "ny", "tx"],
          },
          hour: {
            $in: ["8", "9", "10"],
          },
        },
      },
    },
    function (err, res) {
      t.falsy(err, "no error");

      t.is(res.statusCode, 200, "correct statusCode");
      t.is(res.body.id, "2", "status is ok");
      t.end();
    }
  );
});

test("route", function (t) {
  var url = "/route";
  servertest(
    server(),
    url,
    {
      geoState: "cea",
      publisher: "abc",
      timestamp: "2018-07-19T23:28:59.513Z",
    },
    function (err, res) {
      t.falsy(err, "no error");

      t.is(res.statusCode, 200, "correct statusCode");
      t.is(res.body.decision, "rejected", "status is ok");
      t.end();
    }
  );
});
