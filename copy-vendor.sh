#!/usr/bin/env bash

vendor=src/vendor

bootstrap_js=$vendor/bootstrap/js
bootstrap_css=$vendor/bootstrap/css

fontawesome_css=$vendor/fontawesome/css
fontawesome_webfonts=$vendor/fontawesome/webfonts

bootstrap_dist=node_modules/bootstrap/dist
fontawesome_dist=node_modules/@fortawesome/fontawesome-free

function copyDep {
    src=$1
    dest=${2:-$vendor}

    dep=$(basename $src)

    echo Copy $dep
    cp $src $dest
}

mkdir -p $vendor

mkdir -p $bootstrap_js
mkdir -p $bootstrap_css

mkdir -p $fontawesome_css
mkdir -p $fontawesome_webfonts


copyDep node_modules/requirejs/require.js
copyDep node_modules/blueimp-md5/js/md5.min.js
copyDep node_modules/jquery/dist/jquery.min.js
copyDep node_modules/showdown/dist/showdown.min.js
copyDep node_modules/webextension-polyfill/dist/browser-polyfill.min.js

copyDep $bootstrap_dist/css/bootstrap.min.css $bootstrap_css
copyDep $bootstrap_dist/js/bootstrap.bundle.min.js $bootstrap_js

copyDep $fontawesome_dist/css/solid.min.css $fontawesome_css
copyDep $fontawesome_dist/css/brands.min.css $fontawesome_css
copyDep $fontawesome_dist/css/fontawesome.min.css $fontawesome_css

copyDep $fontawesome_dist/webfonts/fa-solid-900.woff2 $fontawesome_webfonts
copyDep $fontawesome_dist/webfonts/fa-brands-400.woff2 $fontawesome_webfonts
