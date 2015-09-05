var webdriver = require("selenium-webdriver");
const NUM_RETRY = 4;

exports.shouldBehaveLikeAMusicSite = function(driver, url) {

  describe("music site behaviour", function() {

    it(NUM_RETRY, "should load", function(done) {
      var pageLoad = true;

      if(url) {
        pageLoad = false;
        helpers.getAndWait(driver, url)
        .then(function() {
          pageLoad = true;
        })
        .thenCatch(function(err) {
          console.log("Driver Timeout!", err);
          //pageLoad = true;
          return done(new Error("Driver timeout!"));
        });
      }

      driver.wait(function() {
        return pageLoad;
      })
      .then(function() {
        helpers.alertCheck(driver).then(function() {
          console.log("Alert check done!\nStarting waitforload");
          helpers.waitForLoad(driver)
          .then(function() {
            console.log("Wait for load done!\nInjecting test capture.");
            helpers.injectTestCapture(driver).then(function() {
              helpers.waitForExtensionLoad(driver, {count: 0})
              .then(function(result) {
                console.log("Extension loaded!");
                //expect(result).to.be.true;
                if(!result) return done(new Error("Extension load error!"));
                done();
              }, function(err) {
                console.log("Extension error: ", err);
                return done(err);
              });
            });
          }, function(err) {
            console.log("Driver Timeout!", err);
            return done(err);
          });
        });
      });
    });

  });
};
