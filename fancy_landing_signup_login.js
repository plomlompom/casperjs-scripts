// CasperJS script template for taking screenshots of a fancier website's
// landing page, login, and signup screens, and various views that appear when
// clicking some buttons and filling out some forms. Will also build a gallery
// index.html of pseudo-thumbnails. Won't work with the default values.
var start_url = 'http://fancywebsite.example.com';
var mail_with_account = 'mail_with_account@example.com';
var mail_sans_account = 'mail_sans_account@example.com';
var example_domain = 'example.com'
var password = 'password';
var screen_width = 1024;
var screen_height = 800;
var dir_pix = 'pix';

var gallery_code = '<html><ul>\n';

// Capture screenshot of current page to name, add thumbnail link to gallery.
function then_capture(name) {
    casper.then(function() {
        var filename = name + '.jpg';
        var path = dir_pix + '/' + filename;
        casper.echo('capturing: ' + path);
        casper.capture(path);
        var document_height = casper.evaluate(function() {
            return __utils__.getDocumentHeight();
        });
        gallery_code = gallery_code + '<li><a href="' + filename + '">' + name
                       + '<br /><img style="width: ' + screen_width / 4
                       + 'px; height: ' + document_height / 4
                       + 'px; border: 1px solid black;" src="' + filename
                       + '" /></a></li>\n';
    });
}

// Click selector, wait for duration (default 1s), capture screenshot to filename.
function then_click_wait_capture(filename, selector, duration) {
    casper.then(function() {
        duration = isNaN(duration) ? 1000 : duration;
        casper.mouseEvent('click', selector);
        casper.wait(duration);
    });
    then_capture(filename);
}

// Fill form with input, click submit selector, wait for duration (default 1s),
// capture screenshot to filename.
function then_formfill_click_wait_capture(filename, input, selector, duration) {
    casper.then(function() {
        casper.fillSelectors('div[class="active"] form', input, false);
    });
    then_click_wait_capture(filename, selector, duration);
}

// Use this as workaround to the failure of casper.back() on SlimerJS. With
// casper.back() working, all .then_store() calls may be deleted, and all calls
// to .then_load() may be replaced with casper.then(function() {casper.back()});
return_url = {
    url : '',
    then_store : function() {
        var self = this;
        casper.then(function(self) {
            self.url = casper.getCurrentUrl();
        });
    },
    then_load : function(duration) {
        var self = this;
        casper.then(function(self) {
            duration = isNaN(duration) ? 1000 : duration;
            casper.open(self.url);
            casper.wait(duration);
        });
    }
};

// Define, and start, CasperJS run.
var casper = require('casper').create();
casper.start(start_url);
casper.then(function() { // Assume landing page loads huge picture to wait for.
    var path_landing_pic = casper.evaluate(function() {
        var element = document.getElementById('keyvisual');
        return window.getComputedStyle(element).backgroundImage.slice(5, -2);
    });
    casper.waitForResource(path_landing_pic, function() {
        then_capture('landing');
    });
});
then_click_wait_capture('login', 'a[href="/login"]');
return_url.then_store();
then_click_wait_capture('login_fail', 'div[class="active"] button');
then_click_wait_capture('password_reset', 'a[href="/password-reset"]');
then_click_wait_capture('password_reset_nomail', 'div[class="active"] button')
then_formfill_click_wait_capture('password_reset_wrong_mail',
                                 { 'input':mail_sans_account },
                                 'div[class="active"] button');
then_formfill_click_wait_capture('password_reset_correct_mail',
                                 { 'input':mail_with_account },
                                 'div[class="active"] button');
return_url.then_load();
then_click_wait_capture('login_google', 'div[class="active"] span');
return_url.then_load();
then_click_wait_capture('signup', 'a[href="/signup"]');
return_url.then_store();
then_click_wait_capture('signup_terms', 'a[href="/terms.html"]');
return_url.then_load();
then_click_wait_capture('signup_privacy', 'a[href="/privacy.html"]');
return_url.then_load();
then_click_wait_capture('signup_fail', 'div[class="active"] button');
then_formfill_click_wait_capture('signup_fail_nomail',
                                 { 'input[id="user-password"]':password },
                                 'div[class="active"] button');
then_formfill_click_wait_capture('signup_fail_mail',
                                 { 'input[id="user-email"]':mail_with_account },
                                 'div[class="active"] button');
then_formfill_click_wait_capture('signup_success',
                                 { 'input[id="user-email"]':
                                      new Date().getTime()+'@'+example_domain },
                                 'div[class="active"] button',
                                 3000);
casper.viewport(screen_width, screen_height);
casper.run(function() {
    casper.echo("writing gallery's index.html");
    require('fs').write(dir_pix + '/index.html',
                        gallery_code + '</ul></html>',
                        'w');
    casper.exit();
});
