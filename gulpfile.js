var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.browserify('./resources/standalone/notify.js', 'build/js/notify.js')
       .styles(['./resources/assets/css/reset.css', './resources/assets/css/notify.css'], 'build/css/notify.css')
        .copy('./resources/assets/icons', 'build/icons')
        .browserSync({proxy: 'http://localhost:9999'});
});
