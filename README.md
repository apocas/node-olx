OLX classifieds scraper
=========


## Installation

```
npm install olx
```

## Usage

```javascript
var OLX = require('olx');

var opts = {
  'category': 'motociclos-scooters-cat-379',
  'search': 'wr+250/make,101'
};

var olx = new OLX(opts);

olx.on('hit', function(hit) {
  console.log(hit);
});

olx.on('page', function(data) {
  console.log(data);
});

olx.start();
```

## Tests

Tests are implemented using `mocha` and `chai`. Run them with `npm test`.

## Examples

Check the test and examples folder for more specific use cases examples.

## License

Pedro Dias - [@pedromdias](https://twitter.com/pedromdias)

Licensed under the Apache license, version 2.0 (the "license"); You may not use this file except in compliance with the license. You may obtain a copy of the license at:

http://www.apache.org/licenses/LICENSE-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the license is distributed on an "as is" basis, without warranties or conditions of any kind, either express or implied. See the license for the specific language governing permissions and limitations under the license.
