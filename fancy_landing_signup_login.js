// CasperJS script template for taking screenshots of a fancier website's
// landing page, login, and signup screens, and various views that appear when
// clicking some buttons and filling out some forms. Won't work with the default
// values.
var start_url = 'http://fancywebsite.example.com';
var path_landing_pic = 'https://example.com/hugepicture.jpg';
var mail_with_account = 'mail_with_account@example.com';
var mail_sans_account = 'mail_sans_account@example.com';
var example_domain = 'example.com'
var password = 'password';
var screen_width = 1024;
var screen_height = 800;
var dir_pix = 'pix';

// Capture screenshot of current page to filename.
function then_capture(filename) {
    casper.then(function() {
        var path = dir_pix + '/' + filename + '.jpg';
        casper.echo('capturing: ' + path);
        casper.capture(path);
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
casper.start(start_url);                              // Assume the landing page
casper.waitForResource(path_landing_pic, function() { // loads a huge picture
    then_capture('0_landing');                        // that we want to see
});                                                   // fully before capturing.
then_click_wait_capture('1_login', 'a[href="/login"]');
return_url.then_store();
then_click_wait_capture('2_login_fail', 'div[class="active"] button');
then_click_wait_capture('3_password_reset', 'a[href="/password-reset"]');
then_click_wait_capture('4_password_reset_nomail', 'div[class="active"] button')
then_formfill_click_wait_capture('5_password_reset_wrong_mail',
                                 { 'input':mail_sans_account },
                                 'div[class="active"] button');
then_formfill_click_wait_capture('6_password_reset_correct_mail',
                                 { 'input':mail_with_account },
                                 'div[class="active"] button');
return_url.then_load();
then_click_wait_capture('7_login_google', 'div[class="active"] span');
return_url.then_load();
then_click_wait_capture('8_signup', 'a[href="/signup"]');
return_url.then_store();
then_click_wait_capture('9_signup_terms', 'a[href="/terms.html"]');
return_url.then_load();
then_click_wait_capture('A_signup_privacy', 'a[href="/privacy.html"]');
return_url.then_load();
then_click_wait_capture('B_signup_fail', 'div[class="active"] button');
then_formfill_click_wait_capture('C_signup_fail_nomail',
                                 { 'input[id="user-password"]':password },
                                 'div[class="active"] button');
then_formfill_click_wait_capture('D_signup_fail_mail',
                                 { 'input[id="user-email"]':mail_with_account },
                                 'div[class="active"] button');
then_formfill_click_wait_capture('E_signup_success',
                                 { 'input[id="user-email"]':
                                      new Date().getTime()+'@'+example_domain },
                                 'div[class="active"] button', 3000);
casper.viewport(screen_width, screen_height);
casper.run();
