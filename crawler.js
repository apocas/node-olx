var request = require('request'),
  zlib = require('zlib'),
  cheerio = require('cheerio'),
  events = require('events'),
  sys = require('sys');


var Crawler = function(options) {
  if (options.url) {
    this.url = options.url;
  } else {
    this.category = options.category;
    this.search = options.search;
    this.page = options.page || 1;
    this.pages = options.pages || -1;
  }
};

sys.inherits(Crawler, events.EventEmitter);

Crawler.prototype.start = function() {
  this.scrapPage();
};

Crawler.prototype.single = function(page) {
  this.page = page || this.page;
  this.scrapPage(true);
};

Crawler.prototype.prepURL = function() {
  var url = this.url || 'http://www.olx.pt/';

  if(!this.url) {
    if (this.search) {
      url = 'http://www.olx.pt/nf/';
    }

    url += this.category + '-p-' + this.page + '/' + (this.search || '');
  } else {
    url += '-p-' + this.page;
  }

  return url;
};

Crawler.prototype.scrapPage = function(single) {
  var self = this;

  var url = this.prepURL();

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

  this.gunzipJSON(response, function() {
    self.emit('page', {
      'page': self.page
    });
    if(!single && (self.pages - self.page >= 0 || self.pages === -1)) {
      setTimeout(function() {
        self.page++;
        self.scrapPage();
      }, 1000);
    }
  });
};

Crawler.prototype.gunzipJSON = function(response, cb) {
  var self = this;
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

      self.emit('hit', {
        'price': price,
        'title': title,
        'url': url,
        'image': img
      });

      //console.log(title + ' - ' + price + ' - ' + url);
    });
    cb();
  });

  response.pipe(gunzip);
};

module.exports = Crawler;
