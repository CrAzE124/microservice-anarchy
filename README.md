# Anarchy

A microservice registry client easy-maker, i.e. a simple way to register a service with some service registry endpoint

## Usage

```js
//In bin/www.js
//...
var anarchy = require('microservice-anarchy');

var server = http.createServer(app);

//...

anarchy(server);
```

That's it. If you want to *find* another service, all you need to do is run

```js
var anarchy = require('anarchy');

var endpoint = anarchy.getService('some-other-microservice');
```

That, also, is it.

Feel free to add some PR's or whatever. I was semi-drunk while writing this. No unit tests either.
