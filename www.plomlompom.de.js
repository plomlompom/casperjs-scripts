/* CasperJS script: Make above-fold screenshots of all pages linked to from
 * <http://www.plomlompom.de> with a URL that contains the string
 * "www.plomlompom.de".
 */
var casper = require('casper').create();
var clipRect = {
    top: 0,
    left: 0,
    width: 800,
    height: 600
};
casper.start('http://www.plomlompom.de');
casper.viewport(800, 600);
casper.then(function() {
    var urls = this.evaluate(function() {
        return __utils__.getElementsByXPath(
            './/a[contains(@href, "www.plomlompom.de")]'
        ).map(function(e) {
            return url = e.getAttribute('href');    
        });
    });
    var i = 0;
    this.each(urls, function(self, url) {
        this.then(function () {
            this.thenOpen(url, function () {
                this.echo('Capturing: ' + this.getTitle());
                this.capture('screenshot_' + i + '.jpg', clipRect);
                i = i + 1;
            });
        });
    });
});
casper.run();
