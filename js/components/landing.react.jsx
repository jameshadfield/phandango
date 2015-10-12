var React = require('react');

var Landing = React.createClass({displayName: "displayName",
	render: function() {
		return (
			<div className="fullpage">
				<div className="divider"></div>
				<h1 className="center-align">JScandy</h1>
				<div className="divider"></div>
				<div className="row">
					<div className="col s6">
						<h5>Introduction</h5>
						<p className="light">JScandy is an interactive viewer for populations of bacterial genomes connected by a tree. It allows visualisation of recombination breakpoints, genome annotations all connected by a phylogenetic tree.</p>
						<p className="light">Designed and coded by James Hadfield & Simon Harris. (c) <a href="www.sanger.ac.uk/">Wellcome Trust Sanger Institute</a> 2016.</p>
						<p className="light">Built using <a href="https://facebook.github.io/react/">React</a> and <a href="www.materializecss.com">Materialize</a>. Rendered with HTML canvas.</p>
						<p className="light">Version: 1.0 (internal testing)</p>
						<p className="light">Bug reports either via <a href="mailto:jh22@sanger.ac.uk">email</a> or via <a href="https://github.com/jameshadfield/JScandy/">github</a></p>

					</div>
					<div className="col s6">
						<h5>How to use</h5>
						<p className="light">simply hit "l" to get rid of this landing page then drag on your own files. Press "s" to bring up the settings.</p>
						<div className="collection">
							<a href="#!" className="collection-item">Phylogenetic tree (newick) [required]</a>
							<a href="https://github.com/sanger-pathogens/gubbins" className="collection-item">Gubbins output [required]</a>
							<a href="http://www.sequenceontology.org/gff3.shtml" className="collection-item">Genome annotation (gff) [optional]</a>
							<p className="collection-item">Metadata file (csv) [optional]</p>

						</div>
					</div>
				</div>

				<div className="divider"></div>
				<p/>

				<div className="row">
					<div className="col s4">
						<a href="https://github.com/jameshadfield/JScandy/">
							<img className="center-align frontpage" src="img/github-512.png" alt="github"/>
						</a>
					</div>
					<div className="col s4">
						<a href="http://microreact.org/">
							<img className="center-align frontpage" src="img/microreact_logo.png" alt="microreact"/>
						</a>
					</div>
					<div className="col s4">
						<img className="center-align frontpage" src="img/cover.png" alt="cover"/>
					</div>
				</div>
				<div className="row">
					<div className="col s4">
						<p className="promo-caption center">View on Github</p>
						<p className="light center">Full codebase is available to fork and file bug reports</p>
					</div>
					<div className="col s4">
						<p className="promo-caption center">Microreact</p>
						<p className="light center">A similar project which links geographical and temporal data to a phylogenetic tree</p>
					</div>
					<div className="col s4">
						<p className="promo-caption center">Get started!</p>
						<p className="light center">simply hit "l" to get rid of this page and then "d" to load a default dataset</p>
					</div>
				</div>

				<div className="divider"></div>

			</div>
			);
	}
});


module.exports = Landing;


