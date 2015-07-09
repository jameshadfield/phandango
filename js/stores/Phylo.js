
// normally, using browserify / JSinclude / whatever we would have the following:
// var EventEmitter = require('events').EventEmitter;
// var assign = require('object-assign');
// but, using the following https://github.com/substack/browserify-handbook#standalone
// and http://learnjs.io/blog/2014/02/06/creating-js-library-builds-with-browserify-and-other-npm-modules/
// we have them included as normal scripts in index.html
// e.g. objectAssign via a temp .js file with:
//		var objectAssign = require('object-assign');
//		module.exports = objectAssign;
// variables (global) objectAssign (instead of assign) and EventEmitter (as normal)
// this also means that variables here are global and not closed !

// following http://www.jackcallister.com/2015/02/26/the-flux-quick-start-guide.html

// How the fuck do I access phylocanvas???? It's created inside a react componentDidMount()

var newick_string = "(((ST1_8:0.006925,(ST5_2:0.002162,(ST5_1:0.000001,ST5_3:0.000001)N5:0.000001)N4:0.027575)N3:0.015317,((((((ST1_30:0.011876,((ST1_54:0.001973,ST1_50:0.002936)N13:0.001920,ST1_49:0.005908)N12:0.010853)N11:0.002243,ST1_31:0.006750)N10:0.004451,((ST1_18:0.000945,ST1_17:0.003837)N15:0.004608,ID_1690_BC9:0.013698)N14:0.001314)N9:0.000946,(ST1_15:0.000001,ST1_3:0.000001)N16:0.005751)N8:0.001908,((ST1_7:0.009592,ST1_16:0.011545)N18:0.000001,((ID_891_BC5:0.002371,(ID_598_BC4:0.001957,ID_2947_BC18:0.006876)N21:0.000001)N20:0.004526,((((ST1_39:0.003935,(ST1_11:0.007860,(ST1_34:0.005880,(ST1_33:0.004236,(ST1_42:0.008822,(ST1_40:0.000977,ST1_41:0.001946)N30:0.002939)N29:0.000001)N28:0.000001)N27:0.001308)N26:0.006969)N25:0.005095,((ST1_57:0.025120,ID_1828_BC10:0.036789)N32:0.016674,((ST1_20:0.002864,(ST1_6:0.000001,ST1_9:0.000001)N35:0.001909)N34:0.001910,((ST1_43:0.014437,(ST1_35:0.008689,ST1_38:0.020310)N38:0.000803)N37:0.005748,((ST1_32:0.001917,Paris:0.001908)N40:0.003825,ST1_59:0.015630)N39:0.000001)N36:0.000001)N33:0.002874)N31:0.000922)N24:0.002901,(((((ST1_55:0.000001,ST1_26:0.000001)N45:0.000970,(ST1_10:0.000973,ST1_47:0.004885)N46:0.000001)N44:0.001942,(ST1_27:0.000001,ST1_46:0.000001)N47:0.002921)N43:0.013488,ST1_36:0.028596)N42:0.011071,(ST7_1:0.030730,(ST1_12:0.003888,(ST1_28:0.017780,(ST72_1:0.007735,ST1_13:0.002903)N51:0.000001)N50:0.003859)N49:0.002880)N48:0.000001)N41:0.000001)N23:0.000001,ST1_48:0.029040)N22:0.000025)N19:0.001902)N17:0.003870)N7:0.007064,ID_2948_BC19:0.024400)N6:0.002605)N2:0.016740,(((ST1_22:0.004975,(((ST1_19:0.005981,(ST1_25:0.000995,(ST1_5:0.000001,ST1_24:0.000995)N59:0.000001)N58:0.001991)N57:0.000001,(ST1_23:0.002989,ST1_21:0.000995)N60:0.000001)N56:0.000001,ST1_4:0.000993)N55:0.001973)N54:0.010146,(ST1_58:0.034861,ST152_1:0.030882)N61:0.005321)N53:0.009820,ST8_1:0.021037)N52:0.002782,(((((ST7_3:0.001922,ST7_2:0.000001)N66:0.011623,ST1_29:0.004832)N65:0.000951,(ST1_44:0.004816,ST1_56:0.010335)N67:0.000975)N64:0.006021,((ST1_45:0.013927,(ID_747970_BC74:0.016663,(ID_1688_BC8:0.008922,ID_2041_BC13:0.013620)N71:0.005738)N70:0.004035)N69:0.005406,(ST1_53:0.025556,((ST1_37:0.016122,ST10_1:0.006049)N74:0.002034,(ID_6885_BC41:0.023898,(ST390_1:0.013936,ST1_14:0.007821)N76:0.001406)N75:0.004337)N73:0.013108)N72:0.008707)N68:0.007704)N63:0.004930,(ST1_2:0.017431,(ST6_1:0.001970,(ST1_52:0.001964,ST1_51:0.002464)N79:0.002441)N78:0.009438)N77:0.063974)N62:0.000001)N1;";


var PhyloStore = objectAssign({}, EventEmitter.prototype, {
	emitChange: function() {
		this.emit('change');
	},
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},
	getAll: function() {
		return newick_string;
	}
})

// function _turn_on_canvas(canvasName) {
// 	active_canvases[canvasName] = true;
// }
// function _turn_off_canvas(canvasName) {
// 	active_canvases[canvasName] = false;
// }
// function _toggle_canvas(canvasName) {
// 	if (active_canvases[canvasName]) {
// 		active_canvases[canvasName] = false
// 	} else {
// 		active_canvases[canvasName] = true
// 	}
// }
// // register this store with the dispatcher (here, not in actions)

// dispatcher.register(function(payload) {
//   if (payload.actionType === 'turn-on-canvas') {
//     _turn_on_canvas(payload.canvasName);
//     PhyloStore.emitChange();
//   }
//   else if (payload.actionType === 'turn-off-canvas') {
//     _turn_off_canvas(payload.canvasName);
//     PhyloStore.emitChange();
//   }
//   else if (payload.actionType === 'toggle-canvas') {
//     _toggle_canvas(payload.canvasName);
//     PhyloStore.emitChange();
//   }
// })
