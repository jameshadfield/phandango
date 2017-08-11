/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { AnimatedLogo } from '../components/logo';
import { incomingFile, clearAllData } from '../actions/fileInput';
import { increaseSpinner } from '../actions/general';

const defaultDataPrefix = 'https://cdn.rawgit.com/jameshadfield/phandangoExampleData/master/';

/* examples
 * a list of maps
 * modify this when you want to add in more examples
 */
const examples = [

  {
    name: 'Gubbins + BRAT NextGen (PMEN1 data)',
    imgPath: 'img/merge.png',
    caption: 'An exploration of recombination in 240 Streptococcus pneumoniae (PMEN1 lineage) genomes using both Gubbins & BRAT NextGen reveals an enrichment for horizontal gene transfer affecting major antigens and results in a number of capsule-switching events. Hint: go to the settings page (or use the shortcut keys z, x, c & v.) to toggle between gubbins & BRAT NextGen results.',
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
    caption: 'These data show the distribution of genes across a sample of 616 pneumococci, isolated from carriage throughout Massachusetts in the years following the introduction of the seven valent anti-pneumococcal polysaccharide conjugate vaccine. Note: this dataset is ~6Mb in size so may be slow to load.',
    citeURLs: [ 'https://www.nature.com/articles/sdata201558' ],
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
    caption: 'A genome-wide association study to identify SNPs and indels that could confer beta-lactam non-susceptibility using 3,085 Thai and 616 USA pneumococcal isolates as independent datasets for the variant discovery.',
    citeURLs: [ 'http://journals.plos.org/plosgenetics/article?id=10.1371/journal.pgen.1004547' ],
    citeCaptions: [ <span>Chewapreecha <em>et al.</em> PLOS Genetics 2014</span> ],
    paths: [
      defaultDataPrefix + 'PMEN1_recombination/Spn23f.gff',
      defaultDataPrefix + 'PneumoGWAS/Maela.MA.cmh.unadjusted.plot',
    ],
  },

  {
    name: 'Gubbins (Neisseria gonorrhoeae)',
    imgPath: 'img/gubbinsGono.png',
    caption: 'N. gonorrhoeae with decreased susceptibility to extended spectrum cephalosporins could become untreatable. Here is the recombination and metadata results (including resistance profiles) for 236 isolates collected from sentinel public sexually transmitted disease clinics in the USA. The results  show that Mosaic penA XXXIV had a high positive predictive value for cefR and a major lineage of cefRS strains spread eastward, predominantly through a sexual network of men who have sex with men.',
    citeURLs: [ 'http://www.thelancet.com/journals/laninf/article/PIIS1473-3099(13)70693-5/abstract' ],
    citeCaptions: [ <span>Grad <em>et al.,</em> Lancet Infec Dis 2014</span> ],
    paths: [
      defaultDataPrefix + 'gubbinsGono/original_set.FA1090.final_tree.figtree.tre',
      defaultDataPrefix + 'gubbinsGono/ESC_resistance_groups.csv',
      defaultDataPrefix + 'gubbinsGono/Neisseria_gonorrhoeae_strain_FA_1090_v1.gff',
      defaultDataPrefix + 'gubbinsGono/original_set.FA1090.recombination_predictions.gff',
    ],
  },

  {
    name: 'Gubbins (Legionella pneumophila ST578)',
    imgPath: 'img/legionellaST578.png',
    caption: 'Outbreak investigation of 46 Legionella pneumophila strains (ST578) linked to recurrent outbreaks in a single location (Alcoy, Spain) over 11 years showed that 16 recombination events are responsible for almost 98% of the SNPs detected in the core genome and an apparent acceleration in the evolutionary rate. This analysis is vitally important for public health interventions in Legionella outbreaks and is a great example of how non-vertical processes have a major role in the short-term evolution of pathogens and environmental bacteria alike.',
    citeURLs: [ 'http://www.nature.com/ng/journal/v46/n11/full/ng.3114.html' ],
    citeCaptions: [ <span>Sánchez-Busó <em>et al.</em> Nature Genetics 2014</span> ],
    paths: [
      defaultDataPrefix + 'LegionellaST578/st578_3120genes_Final.tre',
      defaultDataPrefix + 'LegionellaST578/st578_metadata.csv',
      defaultDataPrefix + 'LegionellaST578/lpa.gff',
      defaultDataPrefix + 'LegionellaST578/st578_3120genes_rec.gff',
    ],
  },

  {
    name: 'ROARY pan-genome (Salmonella Weltevreden)',
    imgPath: 'img/roary.png',
    caption: 'S. Weltevreden is an emerging cause of diarrheal and invasive disease in humans residing in tropical regions and little is known about its genetic diversity. Here, genome analysis of more than 100 isolates demonstrated that the population of S. Weltevreden can be segregated into two main phylogenetic clusters, one associated predominantly with continental Southeast Asia and the other more internationally dispersed. Here you can explore the pan genome content of the species and see how it differs between lineages.',
    citeURLs: [ 'http://journals.plos.org/plosntds/article?id=10.1371/journal.pntd.0004446' ],
    citeCaptions: [ <span>Makendi <em>et al.</em> PLoS Negl Trop Dis 2016</span> ],
    paths: [
      defaultDataPrefix + 'roary_S.Weltevreden/sw_chr_gubbins.tre',
      defaultDataPrefix + 'roary_S.Weltevreden/sw_metadata.csv',
      defaultDataPrefix + 'roary_S.Weltevreden/gene_presence_absence.csv',
    ],
  },

  {
    name: 'BRAT NextGen (Yersinia enterocolitica PG1)',
    imgPath: 'img/BNG_YEnt.png',
    caption: 'This data set is the core genome phylogeny of Yersinia enterocolitica inferred using harvest. The species is split into 6 phylogroups (PGs) with PG1 being non-pathogenic, PG2 being highly-pathogenic, PG3-5 being the most commonly isolated human pathogens, and PG6 being a very rare type only isolated from wild Hares. Here are the recombination regions inffered by BRAT NextGen for PG1 set against the phylogeny generated from a LS-BSR core alignment. Note: this dataset is ~7Mb in size.',
    citeURLs: [ 'http://mgen.microbiologyresearch.org/content/journal/mgen/10.1099/mgen.0.000030' ],
    citeCaptions: [ <span>Reuter <em>et al.</em> Microbial Genomics 2015</span> ],
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
    caption: 'The same Yersinia enterocolitica data but this time showing the recombinations inferred for PGs 3-6. Interestingly PG1 was shown to be a common donor for these lineages. Note: this dataset is ~6Mb in size.',
    citeURLs: [ 'http://mgen.microbiologyresearch.org/content/journal/mgen/10.1099/mgen.0.000030' ],
    citeCaptions: [ <span>Reuter <em>et al.</em> Microbial Genomics 2015</span> ],
    paths: [
      defaultDataPrefix + 'BratNextGen_Yersinnia/Yent.all.tre',
      defaultDataPrefix + 'BratNextGen_Yersinnia/metadata.csv',
      defaultDataPrefix + 'BratNextGen_Yersinnia/Low/YentLow.gff',
      defaultDataPrefix + 'BratNextGen_Yersinnia/Low/Yentlow_recombinations_tabular.txt',
    ],
  },

  {
    name: 'Gubbins (PMEN1 data)',
    imgPath: 'img/gubbinsNAR.png',
    caption: 'The example from the original Gubbins paper, describing an iterative algorithm that uses spatial scanning statistics to identify loci containing elevated densities of base substitutions suggestive of horizontal sequence transfer while concurrently constructing a maximum likelihood phylogeny based on the putative point mutations outside these regions of high sequence diversity.',
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
    name: 'Gubbins + Metadata (C. trachomatis data)',
    imgPath: 'img/gubbinsNAR.png',
    caption: 'The data underlying a global analysis of 463 Chlamydia trachomatis genomes, which revealed widespread recombination with differing dynamics across lineages. Associated metadata provided.',
    citeURLs: [
      'http://genome.cshlp.org/content/27/7/1220.full',
    ],
    citeCaptions: [
      <span>Hadfield <em>et al.</em> Genome Research 2017</span>,
    ],
    paths: [
      defaultDataPrefix + 'gubbinsCTGD/tree.tre',
      defaultDataPrefix + 'gubbinsCTGD/metadata.csv',
      defaultDataPrefix + 'gubbinsCTGD/genome.gff',
      defaultDataPrefix + 'gubbinsCTGD/gubbins.gff',
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

      <div className="strong center-align">Data adapted from:</div>
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
export class ExamplesPage extends React.Component {
  render() {
    return (
      <div className="bgwhite content">
        <div className="center">
          <AnimatedLogo w={400} h={150} interval={10000}/>
        </div>
        <br/>
        <h2 className="light center">
          Example Datasets - click the pictures to load
        </h2>
        <br/>
        <div className="row">
          {examples.map((value, idx) => {
            return (
              <div key={idx} className="col-xs-4">
                <Example { ...value } callback={this.loadExample}/>
              </div>
            );
          })}
        </div>

        <p className="center" style={{ paddingTop: '5vh', paddingBottom: '5vh' }}>
          The raw data may be accessed at <a href={"https://github.com/jameshadfield/phandangoExampleData"}>github.com/jameshadfield/phandangoExampleData</a> if needed. Please note that downloading this data is not necessary - simply click on the relevant image to load the examples.
        </p>

      </div>
    );
  }

  loadExample(paths) {
    this.props.dispatch(clearAllData());
    this.props.dispatch(increaseSpinner(paths.length));
    for (const url of paths) {
      this.props.dispatch(incomingFile(url, true));
    }
  }

}

ExamplesPage.propTypes =  {
  dispatch: PropTypes.func.isRequired,
};
