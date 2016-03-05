# phandango (formerly known as JScandy)

##

###[Click for the live version](http://jameshadfield.github.io/phandango/)

##

#### What is it?
A interactive viewer for population-scale genomic data linked together by a phylogeny. Examples include metadata, recombination blocks, GWAS results and pan-genome contents. It is a single-page javascript application that runs in Chrome entirely on the client (so none of your results are sent to any server).

#### Motivation
This was originally written to help explore recombination in populations of bacteria using [gubbins](https://github.com/sanger-pathogens/gubbins) in the context of the bacteria's phylogeny. We found that the ability to interact with the data allows much easier and faster understanding. It has since been expanded to visualise a number of other formats and data types, with more on the way.

#### What's new (v0.5.5)
* Safari support
* The type (ordinal / continuous) of metadata columns can be specified in the CSV file
* Multiple new examples

#### What's new (v0.5.0)
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
* ClonalFrameML & fastGEAR input
* SNP display (VCF / tab file)
* Homoplasic SNP display
* Searching for gene / taxa
* Persist data via server
* Firefox / Edge / Safari support
* Display of r/m values, bootstrap support on tree nodes
* BEAST display
* PDF output
* Tree tips coloured by selected metadata

#### [Development](#development)

##### Installing a local copy

* Install Node and Node Package manager (npm), which allow bundling of the javascript packages. On OS X [I find nvm](http://stackoverflow.com/a/28025834) to be the best way.
* Clone or fork this github repo
* Run `npm install` in the phandango directory
* If you need to modify PhyloCanvas then:
 * npm rm phylocanvas
 * clone the repo & link it via `npm link`
 * `npm link PhyloCanvas`
* Run the tests with `npm run test`
* `npm run start` bundles the javascript and serves it to `localhost:8080` with dev-tools enabled
* `npm run build` produces a production-ready bundle available at index.html

##### Branching

* Branch off `master`
* Ensure `eslint` is working in your editor
* Write`.md` files using [markdownlivepreview](http://markdownlivepreview.com/)
* Include bundle in all commits by first running `npm run build`

##### Merging into `master`

* Modify version in `package.json`
* Modify version in `js/version.js`

##### Deployment to `gh-pages`

* Add the bundle from the master branch via `git checkout master dist/phandango.js`
* if `index.html` has changed (`git diff gh-pages master index.html`) then: `git checkout master index.htm` and make sure google analytics are not commented out
* manually checkout any newly required images / fonts (CSS is bundled).
