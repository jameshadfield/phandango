/* eslint-disable max-len */
import React from 'react';
import version from '../version';
import { AnimatedLogo } from '../components/animatedLogo';

export const AboutPage = () => {
  return (
    <div className="bgwhite content">
      <div className="row">
        <div className="col-xs-2">
          <LeftPanel />
        </div>
        <div className="col-xs-1">
        </div>
        <div className="col-xs-8">
          <MainText />
        </div>
      </div>
    </div>
  );
};


function LeftPanel() {
  return (
    <div>
      <div>
        <AnimatedLogo w={300} h={150} interval={2000} animate={false}/>
      </div>
      <br/>
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
      </p>
      <p className="light">
        <strong>Uses:</strong>&nbsp;
        <a href="http://phylocanvas.org/">PhyloCanvas</a>,&nbsp;
        <a href="https://facebook.github.io/react/">React</a>,&nbsp;
        <a href="http://redux.js.org/">Redux</a>
      </p>
      <p className="light">
        <strong>Bugs / comments:</strong>&nbsp;
        <a href="mailto:jh22@sanger.ac.uk">email</a>
        &nbsp;/&nbsp;
        <a href="https://github.com/jameshadfield/JScandy/issues">github</a>
      </p>
      <p className="light">
        <strong>Roadmap:</strong>&nbsp;
        <a href="https://github.com/jameshadfield/JScandy#roadmap">here</a>
      </p>
      <p className="light">
        <strong>Version:</strong>&nbsp;{version}
      </p>
      <p className="light">
        <strong>License:</strong> <a href="https://tldrlegal.com/license/mit-license#summary">MIT</a>
      </p>
    </div>
  );
}


function MainText() {
  return (
    <div>
      <br/>
      <h2>Interactive visualization of genome phylogenies</h2>
      <p>
        JScandy is a fully interactive tool to allow visualisation of a phylogenetic tree and associated metadata
        and genomic information such as recombination blocks, or SNP variation.
        Additionally it allows visualisation of plot files (such as GWAS) and pan-genome content
      </p>
      <p>Running is as simple as loading <a href="https://jameshadfield.github.io/JScandy/">this page</a> in Google Chrome and then dragging on your data. That's it.</p>

      <br/>
      <div className="dots"></div>

      <h3>Data formats you can visualise</h3>
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


    </div>
  );
}
