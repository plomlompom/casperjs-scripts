/* CasperJS script template for taking screenshots of a fancier website's
 * landing page, login, and signup screens, and various views that appear when
 * clicking some buttons and filling out some forms. Won't work with the default
 * values.
 */
var dir_pix = 'pix';
var start_url = 'http://fancywebsite.example.com';
var path_landing_pic = 'https://example.com/hugepicture.jpg';
var mail_with_account = 'mail_with_account@example.com';
var mail_sans_account = 'mail_sans_account@example.com';
var screen_width = 800;
var screen_height = 600;

function then_capture(filename) {
    casper.then(function() {
        var path = dir_pix + '/' + filename + '.jpg';
        casper.echo('capturing: ' + path);
        casper.capture(path);
    });
}

function then_click_wait_capture(filename, selector, duration)
{
    casper.then(function() {
        casper.mouseEvent('click', selector);
        casper.wait(duration);
    });
    then_capture(filename);
}

function then_formfill_click_wait_capture(filename, form_selector, form_input,
                                          submit_selector, duration)
{
    casper.then(function() {
        casper.fillSelectors(form_selector, form_input, false);
    });
    then_click_wait_capture(filename, submit_selector, duration);
}

var casper = require('casper').create();
casper.start(start_url);                              // assume the landing page
casper.waitForResource(path_landing_pic, function() { // loads a huge picture
    then_capture('0_landing');                        // that we want to see
});                                                   // fully before capturing
then_click_wait_capture('1_signup', 'a[href="/signup"]', 0);
then_click_wait_capture('2_signup_fail', 'div[class="active"] button', 1000);
then_click_wait_capture('3_login', 'a[href="/login"]', 1000);
then_click_wait_capture('4_login_fail', 'div[class="active"] button', 1000);
then_click_wait_capture('5_password_reset', 'a[href="/password-reset"]', 1000);
then_click_wait_capture('6_password_reset_nomail', 'div[class="active"] button',
                        1000);
then_formfill_click_wait_capture('7_password_reset_wrong_mail',
                                 'div[class="active"] form',
                                 { 'input':mail_sans_account },
                                 'div[class="active"] button', 1000);
then_formfill_click_wait_capture('8_password_reset_correct_mail',
                                 'div[class="active"] form',
                                 { 'input':mail_with_account },
                                 'div[class="active"] button', 1000);
casper.viewport(screen_width, screen_height);
casper.run();
