/* eslint-disable max-len */
import React from 'react';
import version from '../version';
import { AnimatedLogo } from '../components/logo';

export const AboutPage = () => {
  return (
    <div className="bgwhite content">
      <div className="row">
        <div className="col-sm-4 col-md-2">
          <LeftPanel />
        </div>
        <div className="col-sm-1 col-md-1">
        </div>
        <div className="col-sm-7 col-md-7">
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
        <AnimatedLogo w={300} h={150} interval={10000}/>
      </div>
      <br/>
      <h3 className="view">
        <img style={{ verticalAlign: 'middle' }} src="img/GitHub-Mark-32px.png"/>
        <a style={{ verticalAlign: 'middle' }} href="https://github.com/jameshadfield/phandango">&nbsp;&nbsp;&nbsp;View the project on GitHub</a>
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
        <a href="https://github.com/jameshadfield/phandango/issues">github</a>
      </p>
      <p className="light">
        <strong>Roadmap:</strong>&nbsp;
        <a href="https://github.com/jameshadfield/phandango#roadmap">here</a>
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
        Phandango is a fully interactive tool to allow visualisation of a phylogenetic tree,associated metadata and genomic information such as recombination blocks or pan-genome content. Additionally it allows visualisation of plot files such as GWAS or seer.
      </p>

      <p>
        Phandango runs entirely on the client (i.e. your computer) so none of your results are sent to any servers. If you would like your data to become one of the examples then <a href="mailto:jh22@sanger.ac.uk">let me know</a>.
      </p>

      <div className="dots"></div>

      <h3>Data formats currently visualised</h3>
      <p/>
      Data formats in bioinformatics can be problematic so phandango tries to warn you if things aren't looking right. Take a look at <a href="https://github.com/jameshadfield/phandango#roadmap">the roadmap</a> for things coming in the future.
      <p>
        <strong>Phylogenies</strong> form the backbone of the visualization as they link together all the other data. Trees must be in <a href="http://evolution.genetics.washington.edu/phylip/newicktree.html">Newick format</a> (which is the standard output from software such as <a href="http://sco.h-its.org/exelixis/software.html">RAxML</a>). If you need to convert your tree to a different format try using <a href="http://tree.bio.ed.ac.uk/software/figtree/">FigTree</a>. Files must end in <code>.tre</code> or <code>.tree</code>. We try to identify (and raise an error) if Nexus files are used, and parsing of these formats is on the to-do list. If you use FigTree check that single quotes haven't been added around the taxa names!
      </p>

      <p>

        <strong>Metadata</strong> can be displayed alongside the tree. A comma seperated value (CSV) file with a header is used (<a href="https://rawgit.com/jameshadfield/phandango/exampleData/examples/PMEN1_recombination/meta.simple.csv">example</a>). The entries of first column must match the taxa in the tree! Phandango tries to classify values into binary, ordinal or continuous (and uses different colour scales for each) but this isn't perfect so you may add on <code>:o</code> or <code>:c</code> to the header string to force that column to be ordinal or continuous respecively. If you have groups of columns that you would like the same colour scale to be applied to (e.g. so that the value <code>42</code> is the same colour in each column) then add an ID like so <code>:o1</code> to multiple columns (you can have as many different groups as you'd like). This file must end in <code>.csv</code>.
      </p>

      <p>
        <strong>Genome annotation</strong> file in GFF3 format ending in <code>.gff</code>. Converting embl files to GFF3 is a bit of a dark art but can often be done in using <a href="https://www.sanger.ac.uk/resources/software/artemis/">Artemis</a> or <a href="http://www.ebi.ac.uk/Tools/sfc/emboss_seqret/help/">seqret</a> via&emsp;
          <code>
            seqret -sequence GFF_FILE -feature -fformat embl -fopenfile EMBL_FILE -osformat gff -auto
          </code>
          <br/>
          All of the semi-colon seperated fields are read and displayed and if the colour field is set then you'll get colours!
          <br/>
          Take a look at <a href="https://rawgit.com/jameshadfield/phandango/exampleData/examples/PMEN1_recombination/Spn23f.gff">this example file</a> if all else fails.
      </p>

      <p>
        <strong>Genomic data</strong>, i.e. recombination blocks, pan-genome output or any custom data that mimicks the following specifications:
      </p>
      <ul>
        <li>
          <a href="https://github.com/sanger-pathogens/gubbins" className="heavy">Gubbins</a> (GFF3 format as above&mdash;each line links a whitespace seperated list of taxa with genomic co-ordinates). Note that the second field of each line (apart from the header) must be <code>GUBBINS</code> in order to distinguish it from an annotation file.
          <br/>
          If you have old output from gubbins (e.g. <code>*_rec.tab</code> file) then <a href="https://github.com/jameshadfield/phandango/blob/master/scripts/gubbins_tab2gff.py">here's a python script</a> which will convert this for you.
        </li>

        <li>
          <a href="http://www.helsinki.fi/bsg/software/BRAT-NextGen/" className="heavy">BRAT NextGen</a> (the tab seperated <code>*_segments_tabular.txt</code> file). BRAT NextGen uses HMMs to infer recombination regions from genomes.
        </li>

        <li>
          <span className="heavy">Gubbins + BRAT NextGen</span> are both recombination detection algorithms for genomic data. If you have run both then drop both sets of data on and you can toggle between the different results and a merged output. Use the settings panel to switch between them.
        </li>

        <li>
          <a href="https://github.com/sanger-pathogens/Roary" className="heavy">Roary</a> pan-genome output (the <code>gene_presence_absence.csv</code> file). Example of the csv file <a href="https://rawgit.com/jameshadfield/phandango/exampleData/examples/SPARC/sparc.roary.csv">here</a>.
        </li>

      </ul>


      <p>
        <strong>Plot data</strong> files ending in <code>.plot</code>
      </p>
      <ul>
         <li>
           <strong>GWAS</strong> results in plink format, i.e. a tab deliminated file with header line similar to
           <br/>
           <code>
           #CHR&emsp;SNP&emsp;BP&emsp;minLOG10(P)&emsp;log10(p)&emsp;r^2
           </code>
           <br/>
            We use the 3rd column as the genome co-ordinate, the 5th column as the <em>p</em> value and the 6th as the R^2 value (which changes the colour).
        </li>

        <li>
          <a href="https://github.com/johnlees/seer" className="heavy">Seer</a> output is similar to GWAS except that the matches are k-mers not bases. The only difference in file format is that the 3rd column is seperated by two dots, e.g. <code>140..160</code>.
        </li>

      </ul>

    </div>
  );
}
