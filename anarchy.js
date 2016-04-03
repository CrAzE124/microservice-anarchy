var request = require('superagent');
var os = require('os');

var registryScheme = process.env.REGISTRY_SCHEME || 'http';
var registryHost = process.env.REGISTRY_HOST || 'localhost';
var registryPort = process.env.REGISTRY_PORT || '9000';
var registerEndpoint = process.env.REGISTER_ENDPOINT || 'register';
var findServiceEndpoint = process.env.FIND_ENDPOINT || 'find';
var removeServiceEndpoint = process.env.REMOVE_SERVICE_ENDPOINT || 'remove';
var serviceKey = process.env.SERVICE_KEY || 'default';

/**
 * Just get the service registry URI
 *
 * @returns {string}
 */
function getBaseUri() {
    return registryScheme + '://' + registryHost + ':' + registryPort + '/';
}

/**
 * Get the data that will need to be posted to the server
 *
 * @returns {{key: (*|string), serviceName: string}}
 */
function getPostData() {
    return {
        key: serviceKey,
        serviceName: os.hostname() + ':' + (process.env.PORT || '3000') //Local networking will obviously recognize hostnames
    }
}

/**
 * Anarchy main object
 *
 * @constructor
 */
function Anarchy() {
    /**
     * Register the microservice here!
     *
     * @param server
     */
    this.register = function(server) {
        server.on('listening', function() {
            request
                .post(getBaseUri() + registerEndpoint)
                .send(getPostData())
                .set('Content-Type', 'application/json')
                .end(function (err, res) {
                    if (err || !res.ok) {
                        console.log('Something went wrong!', err);

                        return false;
                    }

                    console.log('Service has been registered with registry');
                });
        });

        server.on('exit', function() {
            console.log('De-registering from container registry');

            request
                .del(getBaseUri() + removeServiceEndpoint)
                .set('Content-Type', 'application/json')
                .send(getPostData())
                .end(function (err, res) {
                    if (err || !res.ok) {
                        console.log('Something went wrong!', err);

                        return false;
                    }

                    console.log('De-registered service from registry');
                });
        });
    };

    /**
     * While we're at it, might as well write a finder, so we can find *other* keys
     *
     * @param serviceName
     * @param cb Function
     * @returns {Promise|*}
     */
    this.getService = function(serviceName, cb) {
        return request
            .get(getBaseUri() + findServiceEndpoint)
            .query({
                key: serviceKey
            })
            .set('Content-Type', 'application/json')
            .end(cb);
    }
}

module.exports = new Anarchy();