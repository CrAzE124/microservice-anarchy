/**
 * Created by thomas on 2016/04/03.
 */
var http = require('http');
var request = require('superagent');
var os = require('os');

var registryScheme = process.env.REGISTRY_SCHEME || 'http';
var registryHost = process.env.REGISTRY_HOST || 'localhost';
var registryPort = process.env.REGISTRY_PORT || '9000';
var registerEndpoint = process.env.REGISTER_ENDPOINT || 'register';
var findServiceEndpoint = process.env.FIND_ENDPOINT || 'find';
var removeServiceEndpoint = process.env.REMOVE_SERVICE_ENDPOINT || 'remove';
var serviceKey = process.env.SERVICE_KEY || 'default';

function getBaseUri() {
    return registryScheme + '://' + registryHost + ':' + registryPort + '/';
}

function getPostData() {
    return {
        key: serviceKey,
        serviceName: os.hostname() + ':' + (process.env.PORT || '3000') //Local networking will obviously recognize hostnames
    }
}

/**
 * Register the service to the endpoint
 */
function onListen() {
    request
        .post(getBaseUri() + registerEndpoint)
        .send(getPostData())
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
            if (err || !res.ok) {
                console.log('Something went wrong!', err);

                return false;
            }

            console.log('Service has been registered with registry');
        });
}

/**
 * Un-register the service
 */
function onExit() {
    console.log('De-registering from container registry');

    request
        .del(getBaseUri() + removeServiceEndpoint)
        .set('Content-Type', 'application/json')
        .send(getPostData())
        .end(function(err, res) {
            if (err || !res.ok) {
                console.log('Something went wrong!', err);

                return false;
            }

            console.log('De-registered service from registry');
        });
}

/**
 * While we're at it, might as well write a finder, so we can find *other* keys
 *
 * @param serviceName
 */
function getService(serviceName) {
    return request
        .get(getBaseUri + findServiceEndpoint)
        .send({
            key: serviceKey
        })
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
            if (err || !res.ok) {
                console.log('Something went wrong!', err);

                return false;
            }

            return res;
        });
}

http.on('listening', onListen);
http.on('exit', onExit);

//We only want to export one service...
module.exports = getService;