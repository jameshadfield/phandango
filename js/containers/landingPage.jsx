/* eslint-disable max-len */
import React from 'react';
import { incomingFile } from '../actions/fileInput';
/* VERSION STRING */
const version = '0.3.0';

/* EXAMPLE DATA URLS */
const defaultDataPrefix = 'https://cdn.rawgit.com/jameshadfield/JScandy/';
const defaultDataPaths = {
  'gubbins': [
    defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/Spn23f.gff',
    defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/gubbins.gff',
    defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/gubbins.tre',
    defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/meta.simple.csv',
  ],
  'roary': [
    defaultDataPrefix + 'v0.2.0/example_datasets/roary/gene_presence_absence.csv',
    defaultDataPrefix + 'v0.2.0/example_datasets/roary/gubbins.tre',
    defaultDataPrefix + 'v0.2.0/example_datasets/roary/metadata.csv',
  ],
};

export const Landing = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
  },

  render: function () {
    return (
      <div style={{ width: '99%' }} className="bgwhite ">
        <div className="row">
          <div className="col-md-3 col-xs-5">
            <LeftPanel />
          </div>

          <div className="col-md-5 col-xs-7">
            <MainText />
          </div>

          <div className="col-md-4 col-xs-6">
            <Examples loadExample={this.loadExample} />
          </div>

        </div>
      </div>
    );
  },

  loadExample(name) {
    // this.props.dispatch(route('loading'));
    for (const url of defaultDataPaths[name]) {
      this.props.dispatch(incomingFile(url, true));
    }
  },

});


function Examples(props) {
  return (
    <div>
      <h2 className="center-align">Example Datasets</h2>

      <p className="promo-caption center-align">Gubbins</p>
      <div className="fitImageToBox center-align" onClick={props.loadExample.bind(null, 'gubbins')}>
        <img className="pointer" src="img/gubbins.png" alt="GUBBINS"/>
      </div>
      <p className="light center-align">
        An exploration of recombination in 240 Streptococcus pneumoniae (PMEN1 lineage) genomes reveals an enrichment for horisontal gene transfer affecting major antigens and results in a number of capsule-switching events.
        <br/>
        <a href="https://www.sciencemag.org/content/331/6016/430.abstract">
          <strong>Croucher <em>et al.</em> Science 2011</strong>
        </a>
      </p>

      <div className="dots"></div>

        <p className="promo-caption center-align">Roary</p>

        <div className="fitImageToBox center-align" onClick={props.loadExample.bind(null, 'roary')}>
          <img className="pointer" src="img/roary.png" alt="ROARY"/>
        </div>
        <p className="light center">
        </p>

      <div className="dots"></div>

      <h3 className=" center"><em>more coming soon...</em></h3>

    </div>
  );
}


function LeftPanel() {
  return (
    <div>
      <div>
        <img id="logoLanding" src="img/JScandy.v2.svg" alt="JScandy"/>
      </div>
      <h3 className="view">
        <img style={{ verticalAlign: 'middle' }} src="img/GitHub-Mark-32px.png"/>
        <a style={{ verticalAlign: 'middle' }} href="https://github.com/jameshadfield/JScandy">&nbsp;&nbsp;&nbsp;View the project on GitHub</a>
      </h3>

      <p className="light">
        Drag your data onto the window to start!
      </p>

      <p className="light">
        <strong>Designed & built</strong> by&nbsp;
        <a href="mailto:jh22@sanger.ac.uk">James Hadfield</a> and&nbsp;
        <a href="mailto:sh16@sanger.ac.uk">Simon Harris</a> at the&nbsp;
        <a href="http://www.sanger.ac.uk/">Wellcome Trust Sanger Institute</a>
        <br/>
        <strong>Uses:</strong>&nbsp;
        <a href="http://phylocanvas.org/">PhyloCanvas</a>,&nbsp;
        <a href="https://facebook.github.io/react/">React</a>,&nbsp;
        <a href="http://redux.js.org/">Redux</a>
        <br/>
        <strong>Bugs / comments:</strong>&nbsp;
        <a href="mailto:jh22@sanger.ac.uk">email</a>
        &nbsp;or&nbsp;
        <a href="https://github.com/jameshadfield/JScandy/issues">github</a>
        <br/>
        <strong>Roadmap:</strong>&nbsp;
        {/*<a href="https://github.com/jameshadfield/JScandy#roadmap">here</a>*/}
        <em>coming soon</em>
        <br/>
        <strong>Version:</strong>&nbsp;{version}
        <br/>
        <strong>License:</strong> <a href="https://tldrlegal.com/license/mit-license#summary">MIT</a>
      </p>
    </div>
  );
}


function MainText() {
  return (
    <div>

      <h2><em>The previous (more stable, less features) is&nbsp;
        <a href="https://jameshadfield.github.io/JScandy/v02x.html">here</a>
      </em></h2>

      <h3>Interactive visualization of genome phylogenies</h3>
      <p>
        JScandy is a fully interactive tool to allow visualisation of a phylogenetic tree and associated metadata
        and genomic information such as recombination blocks, or SNP variation.
        Additionally it allows visualisation of plot files (such as GWAS) and pan-genome content
      </p>
      <p>Running is as simple as loading <a href="https://jameshadfield.github.io/JScandy/">this page</a> in Google Chrome and then dragging on your data. That's it.</p>

      <div className="dots"></div>

      <h3>Data you can visualise (and their formats)</h3>
      <p/>
      <ol>
        <li>A <strong>phylogenetic tree</strong> is the backbone of the visualization as it links together all the other data. Trees must be in <a href="http://evolution.genetics.washington.edu/phylip/newicktree.html">Newick format</a> (which is the standard output from software such as <a href="http://sco.h-its.org/exelixis/software.html">RAxML</a>). If you need to convert your tree to a different format try using <a href="http://tree.bio.ed.ac.uk/software/figtree/">FigTree</a>. Files must end in <em>.tre</em> or <em>.tree</em></li>

        <li><strong>Metadata</strong> can be displayed alongside the tree. A comma seperated value (CSV) file with a header is used (<a href="https://raw.githubusercontent.com/jameshadfield/JScandy/master/example_datasets/gubbins/meta.simple.csv">example</a>). The entries of first column must match the tips of the tree is used and have a header of <em>name</em>, <em>lane</em> or <em>isolate</em>. Values can be strings, numbers or booleans. This file must end in <em>.csv</em></li>

        <li><strong>Genome annotation</strong> in GFF3 format (if you need to convert an embl file to a gff3 file try using <a href="https://www.sanger.ac.uk/resources/software/artemis/">Artemis</a> or install <a href="http://www.ebi.ac.uk/Tools/sfc/emboss_seqret/help/">seqret</a> and convert via <em>seqret -sequence GFF_FILE -feature -fformat embl -fopenfile EMBL_FILE -osformat gff -auto</em>). Currently the second column of entries must be either <em>EMBL</em> or <em>artemis</em>. This file must end in <em>.gff</em></li>

        <li><strong>Genomic data</strong> JScandy is designed to take the output from the following programs,  so any output which uses the same format should (in theory) work fine.

          <ul>
            <li><a href="https://github.com/sanger-pathogens/gubbins">Gubbins</a> (GFF3 format&mdash;each line links a whitespace seperated list of taxa with genomic co-ordinates). If you have old output from gubbins (a _rec.tab file) then there is a <a href="https://github.com/jameshadfield/JScandy/blob/master/scripts/gubbins_tab2gff.py">simple python script</a> which will convert this for you. Currently the second column of each line must be <em>GUBBINS</em> and the file must end in <em>.gff</em></li>
            <li><a href="https://github.com/sanger-pathogens/Roary">Roary</a> output (the gene_presence_absence.csv file)</li>
            <li>SNP data (VCF)&mdash;<em>coming soon</em></li>
          </ul>
        </li>


        <li><strong>Plot data</strong>
        <ul>
           <li>GWAS results in plink format&mdash;a tab deliminated file with header line similar to<br/>
            #CHR&emsp;SNP&emsp;BP&emsp;minLOG10(P)&emsp;log10(p)&emsp;r^2<br/>
            We use the 3rd column as the genome co-ordinate, the 5th column as the <em>p</em> value and the 6th as the R^2 value. This file must end in <em>.plot</em>
          </li>

          <li>TRADIS data&mdash;<em>coming soon</em></li>
        </ul>
        </li>

      </ol>

      <div className="dots"></div>

    </div>
  );
}
