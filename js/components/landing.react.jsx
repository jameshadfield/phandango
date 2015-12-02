const React = require('react');
const Actions = require('../actions/actions.js');

const Landing = React.createClass({ displayName: 'displayName',
  render: function () {
    return (
      <div className="fullpage bgwhite">

        <div className="center-align">
          <img id="logoLanding" src="img/JScandy.v2.svg" alt="JScandy"/>
        </div>

        <div className="row">
          <div className="col s6">
            <p className="promo-caption ">Introduction</p>
            <p className="light">
              JScandy is an interactive viewer for populations of bacterial genomes linked by a phylogeny.
              &nbsp;It allows visualisation of recombination breakpoints, genome annotations and pan-genomes.
            </p>
            <p className="light">
              Designed and coded by James Hadfield & Simon Harris. (c)
              <a href="www.sanger.ac.uk/">Wellcome Trust Sanger Institute</a> 2015-.
            </p>
            <p className="light">
              Built using <a href="https://facebook.github.io/react/">React</a> and
              &nbsp;<a href="http://www.materializecss.com">Materialize</a>.
              &nbsp;Rendered with HTML canvas.
            </p>
            <p className="light">View the source on <a href="https://github.com/jameshadfield/JScandy">github.</a></p>
            <p className="light">Version: 0.2 (internal testing)</p>

          </div>
          <div className="col s6">
            <p className="promo-caption ">How to use</p>
            <p className="light">Simply click one of the examples below or drag on your own data files. Press "s" to toggle the settings page.</p>
            <p className="promo-caption ">Data Formats</p>
            <p className="light">
              The <a href="http://jameshadfield.github.io/JScandy/">github page</a>
              &nbsp;explains the data formats which JScandy can read and gives you help on
              &nbsp;converting into these formats.
            </p>
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
            <p className="light center">
              Data from <a href="https://www.sciencemag.org/content/331/6016/430.abstract">
              &nbsp;Croucher <em>et al.</em> Science <strong>2011</strong></a>
            </p>
          </div>
          <div className="col s6">
            <p className="promo-caption center">Load Roary Example</p>
            <p className="light center"></p>
          </div>
        </div>
      </div>
      );
  },

  loadGubbins: function () {
    this.props.showLoading();
    Actions.loadDefaultData('gubbins');
  },

  loadRoary: function () {
    this.props.showLoading();
    Actions.loadDefaultData('roary');
  },

});


module.exports = Landing;


