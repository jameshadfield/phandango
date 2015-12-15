const React = require('react');

export const Landing = React.createClass({
  propTypes: {
  },

  render: function () {
    return (
      <div className="fullpage bgwhite">

        <div className="center-align">
          <img id="logoLanding" src="img/JScandy.v2.svg" alt="JScandy"/>
        </div>

        <div className="row">
          <div className="col s6">
            <p className="promo-caption ">
              Introduction
            </p>
            <p className="light">
              JScandy is an interactive viewer for populations of bacterial genomes linked by a phylogeny.
              It allows visualisation of recombination breakpoints, genome annotations and pan-genomes.
              Additionally it allows visualisation of plot files (such as GWAS).
            </p>
            <p className="light">
              Designed and coded by James Hadfield & Simon Harris&nbsp;
              at the <a href="http://www.sanger.ac.uk/">Wellcome Trust Sanger Institute</a>&nbsp;
              using <a href="https://facebook.github.io/react/">React</a>,&nbsp;
              <a href="http://redux.js.org/">Redux</a>, <a href="http://phylocanvas.org/">PhyloCanvas</a> and HTML canvas.
            </p>
            <p className="light">
              View the source at&nbsp;
              <a href="https://github.com/jameshadfield/JScandy">github.com/jameshadfield/JScandy</a>
            </p>
            <p className="light">
              License: <a href="https://tldrlegal.com/license/mit-license#summary">MIT</a>
            </p>
            <p className="light">
              Version: 0.3.0 (redux development)
            </p>

          </div>
          <div className="col s6">
            <p className="promo-caption ">How To Use</p>
            <p className="light">
              Simply click one of the examples below or drag on your own data files (see "Data Formats").
              Clicking on the JScandy logo will toggle the settings.
              All data processing is done in your browser so none of your&nbsp;
              files are sent to (or stored in) servers.
            </p>
            <p className="promo-caption ">Data Formats</p>
            <p className="light">
              The <a href="http://jameshadfield.github.io/JScandy/">github page</a>
              &nbsp;explains the data formats which JScandy can read and gives you help on
              &nbsp;converting into these formats.
            </p>
            <p className="promo-caption ">Bug Reports // Feature Requests</p>
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

  // loadGubbins: function () {
  //   this.props.showLoading();
  //   Actions.loadDefaultData('gubbins');
  // },

  // loadRoary: function () {
  //   this.props.showLoading();
  //   Actions.loadDefaultData('roary');
  // },

});

