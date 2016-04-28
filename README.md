![logo](https://raw.githubusercontent.com/jameshadfield/phandangoExampleData/master/wikiImages/logo600.png)


##[Click to load this app](http://jameshadfield.github.io/phandango/)

##

1. <a href="#what">What is it?</a>
  1. <a href="#examples">Examples</a>
  1. <a href="#motivation">Motivation</a>
  1. <a href="#who">Who's behind it?</a>
1. [Layout Explained (wiki)](https://github.com/jameshadfield/phandango/wiki#panels)
1. [Roadmap (wiki)](https://github.com/jameshadfield/phandango/wiki#roadmap)
1. [F.A.Q. (wiki)](https://github.com/jameshadfield/phandango/wiki#faq)
1. [Data Formats in depth (wiki)](https://github.com/jameshadfield/phandango/wiki/Input-data-formats)
1. [What's new (wiki)](https://github.com/jameshadfield/phandango/wiki/What's-new)
1. <a href="#dev">Development</a>


<a name="what" />
## What is it?
A interactive viewer for population-scale genomic data linked together by a phylogeny. Examples include metadata, recombination blocks, GWAS results and pan-genome contents. It is a single-page javascript application that runs entirely in your browser (so none of your results are sent to any server).

<a name="examples" />
#### Examples
[Load the app](http://jameshadfield.github.io/phandango/) to see some example datasets to explore.

<a name="motivation" />
#### Motivation
This was originally written to help explore recombination in populations of bacteria using [gubbins](https://github.com/sanger-pathogens/gubbins) in the context of the bacteria's phylogeny. We found that the ability to interact with the data allows much easier and faster understanding. It has since been expanded to visualise a number of other formats and data types, with more on the way.

<a name="who" />
#### Who's behind it?
Phandango was designed and build by [James Hadfield](mailto:jh22@sanger.ac.uk) (PhD student) and [Simon Harris](mailto:sh16@sanger.ac.uk) (Senior Staff Scientist) at the [Wellcome Trust Sanger Institute](http://www.sanger.ac.uk), Cambridge, U.K.
Many thanks to [The Centre for Genomic Pathogen Surveillance (CGPS)](http://www.sanger.ac.uk/science/collaboration/centre-global-pathogen-surveillance-cgps) especially Richard Goater.
Phandango makes use of:
* [Phylocanvas](http://phylocanvas.org/)
* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [canvas2svg](https://github.com/gliffy/canvas2svg)

<a name="dev" />
## [Development](#development)

As phandango is a web app you only need to *install* it if you wish to contribute to development.

#### Installing

* [Prerequisite] You must have Node and Node Package Manager (npm) which will then install the required javascript libraries. On OS X [I find nvm](http://stackoverflow.com/a/28025834) to be the best way.
* Clone or fork this github repo: `git clone git@github.com:jameshadfield/phandango.git`
* Run `npm install` inside the phandango directory
* [optional] Run the tests with `npm run test`
* `npm run start` bundles the javascript and serves it to `localhost:8080` with dev-tools enabled and will automagically update the bundle when you edit a file.
* `npm run build` produces a production-ready bundle available at index.html

#### Deployment checklist

* Bump version in `package.json` & `js/version.js`
* Build
* `git checkout gh-pages`
* `git checkout master dist/phandango.js`
