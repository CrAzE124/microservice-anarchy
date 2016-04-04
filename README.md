# Anarchy

A microservice registry client easy-maker, i.e. a simple way to register a service with some service registry endpoint

## Usage

```js
//In bin/www.js
//...
var anarchy = require('microservice-anarchy');

var server = http.createServer(app);

//...

anarchy.register(server);
```

That's it. If you want to *find* another service, all you need to do is run

```js
var anarchy = require('anarchy');

anarchy.getService('some-other-microservice', function(err, res) {
  //Do stuff here...
  //res and err are the response types sent by the superagent package
});
```

That, also, is it.

Feel free to add some PR's or whatever. I was semi-drunk while writing this. No unit tests either.
