/* eslint-disable max-len */
import React from 'react';
import { AnimatedLogo } from '../components/logo';
import { incomingFile } from '../actions/fileInput';

const defaultDataPrefix = 'https://cdn.rawgit.com/jameshadfield/JScandy/';

/* examples
 * a list of maps
 * modify this when you want to add in more examples
 */
const examples = [
  {
    name: 'PMEN1 (gubbins)',
    imgPath: 'img/gubbins.png',
    caption: 'An exploration of recombination in 240 Streptococcus pneumoniae (PMEN1 lineage) genomes reveals an enrichment for horisontal gene transfer affecting major antigens and results in a number of capsule-switching events.',
    citeURL: 'https://www.sciencemag.org/content/331/6016/430.abstract',
    citeCaption: <span>Croucher <em>et al.</em> Science 2011</span>,
    paths: [
      defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/Spn23f.gff',
      defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/gubbins.gff',
      defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/gubbins.tre',
      defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/meta.simple.csv',
    ],
  },

  {
    name: 'Roary (pan-genome)',
    imgPath: 'img/roary.png',
    caption: 'Pan-Genome output for a collection of Salmonella enterica subspecies enterica serovar Weltevreden isolates',
    paths: [
      defaultDataPrefix + 'v0.2.0/example_datasets/roary/gene_presence_absence.csv',
      defaultDataPrefix + 'v0.2.0/example_datasets/roary/gubbins.tre',
      defaultDataPrefix + 'v0.2.0/example_datasets/roary/metadata.csv',
    ],
  },

  {
    name: 'Bacterial GWAS',
    imgPath: 'img/Chewapreecha.png',
    caption: 'A genome-wide association study to identify SNPs and indels that could confer beta-lactam non-susceptibility using 3,085 Thai and 616 USA pneumococcal isolates as independent datasets for the variant discovery. ',
    citeURL: 'http://journals.plos.org/plosgenetics/article?id=10.1371/journal.pgen.1004547',
    citeCaption: <span>Chewapreecha <em>et al.</em> PLOS Genetics 2014</span>,
    paths: [
      defaultDataPrefix + 'v0.4.0/example_datasets/PneumoGWAS/Spn23f.gff',
      defaultDataPrefix + 'v0.4.0/example_datasets/PneumoGWAS/Maela.MA.cmh.unadjusted.plot',
    ],
  },

];

/* Example - the react component which creates an individual example box entirely on passed in props*/
const Example = ({ name, paths, callback, caption, imgPath, citeURL, citeCaption }) => {
  let citation = false;
  if (citeURL) {
    citation = (
      <p className="light center-align">
        <a href={citeURL}>
          {citeCaption}
        </a>
      </p>
    );
  }
  return (
    <div>
      <p className="promo-caption center-align">{name}</p>
      <div className="fitImageToBox center-align" onClick={callback.bind(null, paths)}>
        <img className="pointer" src={imgPath} alt={name}/>
      </div>
      <p className="light center-align">{caption}</p>
      {citation}
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
    // this.props.dispatch(route('loading'));
    for (const url of paths) {
      this.props.dispatch(incomingFile(url, true));
    }
  },

});

