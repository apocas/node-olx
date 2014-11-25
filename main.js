var request = require('request'),
  zlib = require('zlib'),
  cheerio = require('cheerio');


scrapPage("motociclos-scooters-cat-379", 1);


function scrapPage(category, page) {
  console.log('Fetching http://www.olx.pt/' + category + '-p-' + page);
  var url = 'http://www.olx.pt/' + category + '-p-' + page;

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
      scrapPage(category, page+1);
    }, 1000);
  });
}

function gunzipJSON(response, cb){
  var gunzip = zlib.createGunzip();
  var bulk = "";

  gunzip.on('data', function(data){
      bulk += data.toString();
  });
      
  gunzip.on('end', function(){
    $ = cheerio.load(bulk);
    $('.results').each(function() {
      var title = $(this).find('.ti a').html();
      var img =  $(this).find('.pic a > img').attr('src');
      var aux = $(this).find('.price').html().split(' ');
      for (var i = aux.length - 1; i >= 0; i--) {
        if(isNaN(aux[i].replace('.', '').replace(',', '.')) === false) {
          break;
        }
      }
      var price;
      if(aux[i]) price = aux[i].replace('.', '').replace(',', '.');

      console.log(title + ' - ' + price + ' - ' + img);
    });
    cb();
  });

  response.pipe(gunzip);
}