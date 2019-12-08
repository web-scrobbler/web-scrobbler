"use strict";

const shell = require("shelljs");
const path = require('path');

const vendor = "src/vendor";

const bootstrap_js = vendor + "/bootstrap/js";
const bootstrap_css = vendor + "/bootstrap/css";

const fontawesome_css = vendor + "/fontawesome/css";
const fontawesome_webfonts = vendor + "/fontawesome/webfonts";

const bootstrap_dist = "node_modules/bootstrap/dist";
const fontawesome_dist = "node_modules/@fortawesome/fontawesome-free";

function copyDep(src, in_dest) {
    
    const dest = (in_dest === undefined) ? vendor : in_dest;

    const dep = path.basename(src);
    console.log("Copy " + dep);
    shell.cp(src, dest);
}

shell.mkdir('-p', vendor);

shell.mkdir('-p', bootstrap_js);
shell.mkdir('-p', bootstrap_css);

shell.mkdir('-p', fontawesome_css);
shell.mkdir('-p', fontawesome_webfonts);


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
