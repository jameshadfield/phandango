/* eslint-disable max-len */
import React from 'react';
import { AnimatedLogo } from '../components/logo';
import { incomingFile, clearAllData } from '../actions/fileInput';
import { increaseSpinner } from '../actions/general';

const defaultDataPrefix = 'https://rawgit.com/jameshadfield/JScandy/exampleData/examples/';

/* examples
 * a list of maps
 * modify this when you want to add in more examples
 */
const examples = [

  {
    name: 'Gubbins (PMEN1 data)',
    imgPath: 'img/gubbinsNAR.png',
    caption: 'The example from the orinal paper: Gubbins is an iterative algorithm that uses spatial scanning statistics to identify loci contain- ing elevated densities of base substitutions suggestive of horizontal sequence transfer while concurrently constructing a maximum likelihood phylogeny based on the putative point mutations out- side these regions of high sequence diversity.',
    citeURLs: [
      'http://nar.oxfordjournals.org/content/early/2014/11/20/nar.gku1196.abstract',
    ],
    citeCaptions: [
      <span>Croucher <em>et al.</em> Nucleic Acids Research 2015</span>,
    ],
    paths: [
      defaultDataPrefix + 'gubbinsNAR/EVAL.PMEN1.final_tree.tre',
      defaultDataPrefix + 'gubbinsNAR/Spn23f.gff',
      defaultDataPrefix + 'gubbinsNAR/EVAL.PMEN1.recombination_predictions.gff',
    ],
  },

  {
    name: 'Gubbins + BRAT NextGen (PMEN1 data)',
    imgPath: 'img/merge.png',
    caption: 'An exploration of recombination in 240 Streptococcus pneumoniae (PMEN1 lineage) genomes using both Gubbins & BRAT NextGen reveals an enrichment for horisontal gene transfer affecting major antigens and results in a number of capsule-switching events. Hint: go to the settings page (or use the shortcut keys z, x, c & v.) to toggle between gubbins & BRAT NextGen.',
    citeURLs: [
      'https://www.sciencemag.org/content/331/6016/430.abstract',
      'http://nar.oxfordjournals.org/content/early/2011/11/07/nar.gkr928.abstract',
    ],
    citeCaptions: [
      <span>Croucher <em>et al.</em> Science 2011</span>,
      <span>Marttinen <em>et al.</em> Nucleic Acids Research 2012</span>,
    ],
    paths: [
      defaultDataPrefix + 'PMEN1_recombination/Spn23f.gff',
      defaultDataPrefix + 'PMEN1_recombination/gubbins.gff',
      defaultDataPrefix + 'PMEN1_recombination/gubbins.tre',
      defaultDataPrefix + 'PMEN1_recombination/meta.simple.csv',
      defaultDataPrefix + 'PMEN1_recombination/pmen1_segments_tabular.txt',
    ],
  },

  {
    name: 'ROARY pan-genome (SPARC data)',
    imgPath: 'img/roary.png',
    caption: 'These data show the distribution of genes across a sample of 616 pneumococci, isolated from carriage throughout Massachusetts in the years following the introduction of the seven valent anti-pneumococcal polysaccharide conjugate vaccine. Note: this dataset is ~6Mb in size.',
    citeURLs: [ 'http://www.ncbi.nlm.nih.gov/pmc/articles/PMC4622223' ],
    citeCaptions: [ <span>Croucher <em>et al.</em> Scientific Data 2015</span> ],
    paths: [
      defaultDataPrefix + 'SPARC/sparc.phandango.newick',
      defaultDataPrefix + 'SPARC/sparc.metadata.csv',
      defaultDataPrefix + 'SPARC/sparc.roary.csv',
    ],
  },

  {
    name: 'Bacterial GWAS (Strep Pneumo)',
    imgPath: 'img/Chewapreecha.png',
    caption: 'A genome-wide association study to identify SNPs and indels that could confer beta-lactam non-susceptibility using 3,085 Thai and 616 USA pneumococcal isolates as independent datasets for the variant discovery. Use the settings panel (press s) to resize the panels as you wish.',
    citeURLs: [ 'http://journals.plos.org/plosgenetics/article?id=10.1371/journal.pgen.1004547' ],
    citeCaptions: [ <span>Chewapreecha <em>et al.</em> PLOS Genetics 2014</span> ],
    paths: [
      defaultDataPrefix + 'PMEN1_recombination/Spn23f.gff',
      defaultDataPrefix + 'PneumoGWAS/Maela.MA.cmh.unadjusted.plot',
    ],
  },

  {
    name: 'BRAT NextGen (Yersinia enterocolitica PG1)',
    imgPath: 'img/BNG_YEnt.png',
    caption: 'Yersinia enterocolitica is a common cause of food-borne gastroenteritis worldwide.  Here is data for recombination flow in the non-pathogenic PG1 strains which are found to act as a reservoir for diversity, frequently acting as donors in recombination events. Note: this dataset is ~7Mb in size.',
    citeURLs: [ 'http://mgen.microbiologyresearch.org/content/journal/mgen/10.1099/mgen.0.000030' ],
    citeCaptions: [ <span>Reuter <em>et al.</em> Microbial Genetics 2015</span> ],
    paths: [
      defaultDataPrefix + 'BratNextGen_Yersinnia/Yent.all.tre',
      defaultDataPrefix + 'BratNextGen_Yersinnia/metadata.csv',
      defaultDataPrefix + 'BratNextGen_Yersinnia/Non/YentNon.gff',
      defaultDataPrefix + 'BratNextGen_Yersinnia/Non/Yentnon_recombinations_tabular.txt',
    ],
  },

  {
    name: 'BRAT NextGen (Yersinia enterocolitica PG3-6)',
    imgPath: 'img/BNG_YEnt.png',
    caption: 'Recombination flow in the dominant phylogroups isolated from human infections (PG3–5) which show very little diversity at the sequence level but present marked patterns of gain and loss of functions, including those involved in pathogenicity and metabolism, including the acquisition of phylogroup-specific O-antigen loci. Note: this dataset is ~6Mb in size.',
    citeURLs: [ 'http://mgen.microbiologyresearch.org/content/journal/mgen/10.1099/mgen.0.000030' ],
    citeCaptions: [ <span>Reuter <em>et al.</em> Microbial Genetics 2015</span> ],
    paths: [
      defaultDataPrefix + 'BratNextGen_Yersinnia/Yent.all.tre',
      defaultDataPrefix + 'BratNextGen_Yersinnia/metadata.csv',
      defaultDataPrefix + 'BratNextGen_Yersinnia/Low/YentLow.gff',
      defaultDataPrefix + 'BratNextGen_Yersinnia/Low/Yentlow_recombinations_tabular.txt',
    ],
  },

];

/* Example - the react component which creates an individual example box entirely on passed in props*/
const Example = ({ name, paths, callback, caption, imgPath, citeURLs, citeCaptions = [] }) => {
  return (
    <div>
      <p className="promo-caption center-align">{name}</p>
      <div className="fitImageToBox center-align" onClick={callback.bind(null, paths)}>
        <img className="pointer" src={imgPath} alt={name}/>
      </div>
      <p className="light center-align">{caption}</p>

      {citeCaptions.map((value, idx) => {
        return (
          <div key={idx} className="light center-align">
            <a href={citeURLs[idx]}>
              {value}
            </a>
          </div>
        );
      })}

      <br/>
    </div>
  );
};

/* Examples page - begins with the logo + title
 * Then maps all the examples (defined above) to Example components
 * uses flexboxgrid classes for layout
 */
export const ExamplesPage = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
  },

  render: function () {
    return (
      <div className="bgwhite content">
        <div className="center">
          <AnimatedLogo w={400} h={150} interval={10000}/>
        </div>
        <h2 className="light center">
          Example Datasets - click to load
        </h2>
        <div className="row">
          {examples.map((value, idx) => {
            return (
              <div key={idx} className="col-xs-4">
                <Example { ...value } callback={this.loadExample}/>
              </div>
            );
          })}
        </div>
      </div>
    );
  },

  loadExample(paths) {
    this.props.dispatch(clearAllData());
    this.props.dispatch(increaseSpinner(paths.length));
    for (const url of paths) {
      this.props.dispatch(incomingFile(url, true));
    }
  },

});

