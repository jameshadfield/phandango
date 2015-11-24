var React = require('react');
var Actions = require('../actions/actions.js');


var Landing = React.createClass({displayName: "displayName",
	loadGubbins: function() {
		console.log("LOAD GUBBINS")
		this.props.showLoading()
		Actions.loadDefaultData("gubbins")
	},

	loadRoary: function() {
		console.log("LOAD ROARY")
		this.props.showLoading()
		Actions.loadDefaultData("roary")
	},

	render: function() {
		return (
			<div className="fullpage bgwhite">


				<div className="center-align">
					<img id="logoLanding" src="img/JScandy.v2.svg" alt="JScandy"/>
				</div>


				<div className="row">
					<div className="col s6">
						<p className="promo-caption ">Introduction</p>
						<p className="light">JScandy is an interactive viewer for populations of bacterial genomes linked by a phylogeny. It allows visualisation of recombination breakpoints, genome annotations and pan-genomes. Additionally it allows visualisation of plot files (such as GWAS). </p>
						<p className="light">Designed and build by James Hadfield & Simon Harris at the <a href="www.sanger.ac.uk/">Wellcome Trust Sanger Institute</a>  using <a href="https://facebook.github.io/react/">React</a>, <a href="https://facebook.github.io/flux/docs/overview.html">Flux</a>, <a href="http://www.materializecss.com">Materialize</a> and HTML canvas.</p>
						<p className="light">View the source at <a href="https://github.com/jameshadfield/JScandy">github.com/jameshadfield/JScandy</a></p>
						<p>(c) 2015- under a <a href="https://tldrlegal.com/license/mit-license#summary">MIT license</a></p>
						<p className="light">Version: 0.2.4</p>

					</div>
					<div className="col s6">
						<p className="promo-caption ">How to use</p>
						<p className="light">Simply click one of the examples below or drag on your own data files (see "Data Formats"). Clicking on the JScandy logo will toggle the settings. All data processing is done in your browser so none of your files are sent to (or stored in) servers.</p>
						<p className="promo-caption ">Data Formats</p>
						<p className="light"><a href="http://jameshadfield.github.io/JScandy/intro.html">This page</a> explains the data formats which JScandy can read and gives you help on converting files into these formats.</p>
						<p className="promo-caption ">Bug reports</p>
						<p className="light">via <a href="mailto:jh22@sanger.ac.uk">email</a> or <a href="https://github.com/jameshadfield/JScandy/">github</a></p>

					</div>
				</div>



				<p/>

				<div className="row">
					<div className="col s6 pointer" onClick={this.loadGubbins}>
							<img className="center-align frontpage" src="img/gubbins.png" alt="GUBBINS"/>
					</div>
					<div className="col s6 pointer" onClick={this.loadRoary}>
							<img className="center-align frontpage" src="img/roary.png" alt="ROARY"/>
					</div>
				</div>
				<div className="row">
					<div className="col s6">
						<p className="promo-caption center">Load Gubbins Example</p>
						<p className="light center">Data from <a href="https://www.sciencemag.org/content/331/6016/430.abstract">Croucher <em>et al.</em> Science <strong>2011</strong></a></p>
					</div>
					<div className="col s6">
						<p className="promo-caption center">Load Roary Example</p>
						<p className="light center"></p>
					</div>
				</div>






			</div>
			);
	}
});


module.exports = Landing;


