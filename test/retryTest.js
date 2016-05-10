var assert = require('chai').assert;
var helper = require('./testHelper');

describe('retries', function() {
    it('should retry a job that didn\'t complete', function (finished) {

        var expireIn = '1 second';
        var retries = 2;

        this.timeout(7000);

        helper.start({expireCheckIntervalSeconds:1}).then(boss => {
            var subscribeCount = 0;

            boss.subscribe('unreliable', function(job, done) {
                // not calling done so it will expire
                subscribeCount++;
            });

            boss.publish('unreliable', null, {
                expireIn: expireIn,
                retryLimit: retries
            });

            setTimeout(function() {
                assert.equal(subscribeCount, retries + 1);
                finished();

            }, 6000);
        });

    });
});
