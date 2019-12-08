'use strict';

const fs = require('fs');
const path = require('path');

const vendor = "src/vendor";

const bootstrap_js = vendor + "/bootstrap/js";
const bootstrap_css = vendor + "/bootstrap/css";

const fontawesome_css = vendor + "/fontawesome/css";
const fontawesome_webfonts = vendor + "/fontawesome/webfonts";

const bootstrap_dist = "node_modules/bootstrap/dist";
const fontawesome_dist = "node_modules/@fortawesome/fontawesome-free";

var mkdir_count;
var wait_counts;

function mkDirCatch(new_path) {
    fs.mkdir(new_path, {
        recursive: true
    }, (err) => {
        if (err) {
            if (err.code === 'EEXIST') {
                --mkdir_count;
                console.log("Path Exists " + new_path);
                return;
            } else {
                console.warn("Path Create Failed " + err.code + " https://nodejs.org/api/errors.html#errors_error_code_1");
            }
        } else {
            --mkdir_count;
            console.log("Path Created " + new_path);
        }
    });
}

function copyDep(src, in_dest) {

    const dest = (typeof in_dest === "undefined") ? vendor : in_dest;
    const dep = path.basename(src);

    fs.copyFile(src, dest + path.sep + dep, (err) => {
        if (err) {
            if (err.code === 'EEXIST') {
                console.log("Exists " + new_path);
                return;
            } else {
                console.warn("File Create Failed " + err.code + " https://nodejs.org/api/errors.html#errors_error_code_1");
            }
        } else {
            console.log("Copy " + dep);
        }
    });
}

wait_counts = 5;
mkdir_count = 5;

mkDirCatch(vendor);

mkDirCatch(bootstrap_js);
mkDirCatch(bootstrap_css);

mkDirCatch(fontawesome_css);
mkDirCatch(fontawesome_webfonts);

var interval = setInterval(function() {
    if (mkdir_count == 0) {
        copyDep("node_modules/requirejs/require.js");
        copyDep("node_modules/blueimp-md5/js/md5.min.js");
        copyDep("node_modules/jquery/dist/jquery.min.js");
        copyDep("node_modules/showdown/dist/showdown.min.js");
        copyDep("node_modules/webextension-polyfill/dist/browser-polyfill.min.js");

        copyDep(bootstrap_dist + "/css/bootstrap.min.css", bootstrap_css);
        copyDep(bootstrap_dist + "/js/bootstrap.bundle.min.js", bootstrap_js);

        copyDep(fontawesome_dist + "/css/solid.min.css", fontawesome_css);
        copyDep(fontawesome_dist + "/css/brands.min.css", fontawesome_css);
        copyDep(fontawesome_dist + "/css/fontawesome.min.css", fontawesome_css);

        copyDep(fontawesome_dist + "/webfonts/fa-solid-900.woff2", fontawesome_webfonts);
        copyDep(fontawesome_dist + "/webfonts/fa-brands-400.woff2", fontawesome_webfonts);
    }
    if (wait_counts < 1 || mkdir_count == 0) {
        clearInterval(interval);
    }
    --wait_counts;
}, 50);