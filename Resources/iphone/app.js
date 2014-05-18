var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.Map = require("ti.map");

Alloy.Globals.Facebook = require("facebook");

newrelic = require("ti.newrelic");

newrelic.start("AA478abc33060f2e6f606d57a7ed8aa59096da31f1");

Alloy.createController("index");