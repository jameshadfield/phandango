# phandango (formerly known as JScandy)

##

###[Click for the live version](http://jameshadfield.github.io/phandango/)

##

#### What is it?
A interactive viewer for population-scale genomic data linked together by a phylogeny. Examples include metadata, recombination blocks, GWAS results and pan-genome contents. It is a single-page javascript application that runs in Chrome entirely on the client (so none of your results are sent to any server).

#### Motivation
This was originally written to help explore recombination in populations of bacteria using [gubbins](https://github.com/sanger-pathogens/gubbins) in the context of the bacteria's phylogeny. We found that the ability to interact with the data allows much easier and faster understanding. It has since been expanded to visualise a number of other formats and data types, with more on the way.

#### What's new (v0.8.x)
* Firefox support!
* better zooming on trackpads
* better phylocanvas layout

#### What's new (v0.7.x)
* panels can be resized by dragging on the transparent gray circles at the edges of each panel
* default layout now better represents loaded data
* you can now drag + zoom on the small genome (top left)
* more options in the settings panel

#### What's new (v0.6.x)
* SVG output by pressing "p"
* Multi-contig GFF parsing

#### What's new (v0.5.x)
* Safari support
* The type (ordinal / continuous) of metadata columns can be specified in the CSV file
* Multiple new examples
* BratNextGen parsing and overlay with gubbins.
* Tree default display is much better & you can zoom horizontally by holding down cmd / ctrl)
* Roary fragments are now displayed
* animated logo
* new layout

#### Examples

Load the [live version](http://jameshadfield.github.io/phandango/) to see some example datasets to explore.

#### [Roadmap](#roadmap)
Here is our list of (big) things to implement -- additional ideas or contributions are welcome.

* Back-button support
* Multiple plot display
* Multiple contig support
* ClonalFrameML & fastGEAR input
* SNP display (VCF / tab file)
* Homoplasic SNP display
* Searching for gene / taxa
* Persist data via server
* Firefox / Edge support
* Display of r/m values, bootstrap support on tree nodes
* BEAST display
* PDF output
* Tree tips coloured by selected metadata

#### [Development](#development)

##### Installing

* [Prerequisite] You must have Node and Node Package Manager (npm) which will then install the required javascript libraries. On OS X [I find nvm](http://stackoverflow.com/a/28025834) to be the best way.
* Clone or fork this github repo: `git clone git@github.com:jameshadfield/phandango.git`
* Run `npm install` inside the phandango directory
* [optional] Run the tests with `npm run test`
* `npm run start` bundles the javascript and serves it to `localhost:8080` with dev-tools enabled and will automagically update the bundle when you edit a file.
* `npm run build` produces a production-ready bundle available at index.html

##### Pull request checklist

* Modify version in `package.json` & `js/version.js`
* Build
