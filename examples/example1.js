var OLX = require('../crawler');

var opts = {
  'category': 'motociclos-scooters-cat-379',
  'search': '/wr+250/make,101'
};

var olx = new OLX(opts);

olx.on('hit', function(hit) {
  console.log(hit);
});

olx.on('page', function(data) {
  console.log(data);
});

olx.start();
