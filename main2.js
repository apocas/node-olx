var request = require('request'),
  zlib = require('zlib'),
  cheerio = require('cheerio');


scrapPage('motociclos-scooters-cat-379', '/wr+250/make,101', 1);


function scrapPage(category, search, page) {
  var url = 'http://www.olx.pt/';

  if(search) {
    url = 'http://www.olx.pt/nf/';
  }

  url += category + '-p-' + page + (search || '');

  console.log('Fetching ' + url);

  var options = {
    method: 'GET',
    url: url,
    headers: {
      'Accept-Encoding': 'gzip',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.117 Safari/537.36'
    }
  };

  var response = request(options);

  gunzipJSON(response, function() {
    setTimeout(function() {
      scrapPage(category, search, page + 1);
    }, 1000);
  });
}

function gunzipJSON(response, cb) {
  var gunzip = zlib.createGunzip();
  var bulk = "";

  gunzip.on('data', function(data) {
    bulk += data.toString();
  });

  gunzip.on('end', function() {
    $ = cheerio.load(bulk);

    $('.results').each(function() {
      var price;
      var title = $(this).find('.ti a').html();
      var url = $(this).find('.ti a').attr('href');
      var img = $(this).find('.pic a > img').attr('src');

      var aux = $(this).find('.price').html().split(' ');
      for (var i = aux.length - 1; i >= 0; i--) {
        var auxx = aux[i].split('<img')[0];
        if (isNaN(auxx.replace('.', '').replace(',', '.')) === false) {
          price = parseFloat(auxx.replace('.', '').replace(',', '.'));
          break;
        }
      }

      console.log(title + ' - ' + price + ' - ' + url);
    });
    cb();
  });

  response.pipe(gunzip);
}
