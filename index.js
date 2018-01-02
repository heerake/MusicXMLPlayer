let canvas = document.getElementById('canvas');
let OSMD = new opensheetmusicdisplay.OSMD(canvas, false);

//OSMD.load("./sheets/4828922-La_La_Land_-_Its_OverEngagement_Party").then(
OSMD.load("./sheets/La_La_Land_-_Epilogue_piano_arrangement.mxl").then(
	function() {
		return OSMD.render();
	},
	function(e) {
		error("Error reading sheet: " + e);
	}
).then(function(){

});