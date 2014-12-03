casperjs-scripts
================

experiments in CasperJS

Notes
-----

When CasperJS fails with the default of using PhantomJS, switch to SlimerJS with
'casperjs --engine=slimerjs'. Unfortunately. casper.back() fails to work then,
so no browser history hopping.[1]

[1] <https://github.com/laurentj/slimerjs/issues/199>
