"use strict";
var canvas = document.getElementById('canvas');
var OSMD = new opensheetmusicdisplay.OSMD(canvas, false);
OSMD.load("./sheets/La_La_Land_-_Epilogue_piano_arrangement.mxl").then(function () {
    return OSMD.render();
}, function (e) {
    error("Error reading sheet: " + e);
}).then(function () {
});
//# sourceMappingURL=index.js.map