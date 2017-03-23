![logo](https://raw.githubusercontent.com/jameshadfield/phandangoExampleData/master/wikiImages/logo600.png)

***

## [Load the app](http://jameshadfield.github.io/phandango/)

## [Wiki Page](http://github.com/jameshadfield/phandango/wiki)

If you use phandango in a publication please cite [Hadfield _et al._, bioRxiv (2017) ](http://biorxiv.org/content/early/2017/03/22/119545).

***

Designed and build by [James Hadfield](mailto:jh22@sanger.ac.uk) and [Simon Harris](mailto:sh16@sanger.ac.uk) at the [Wellcome Trust Sanger Institute](http://www.sanger.ac.uk), Cambridge, U.K.
Many thanks to [The Centre for Genomic Pathogen Surveillance (CGPS)](http://www.sanger.ac.uk/science/collaboration/centre-global-pathogen-surveillance-cgps) especially Richard Goater.
Phandango uses:
* [Phylocanvas](http://phylocanvas.org/)
* [React](https://facebook.github.io/react/)
* [Redux](http://redux.js.org/)
* [canvas2svg](https://github.com/gliffy/canvas2svg)

***


<a name="dev" />
## Development

As phandango is a web app you only need to install it if you wish to contribute to development.

* [Prerequisite] You must have Node and Node Package Manager (npm) which will then install the required javascript libraries. On OS X [I find nvm](http://stackoverflow.com/a/28025834) to be the best way.
* Clone or fork this github repo: `git clone git@github.com:jameshadfield/phandango.git`
* Run `npm install` inside the phandango directory
* [optional] Run the tests with `npm run test`
* `npm run start` bundles the javascript and serves it to `localhost:8080` with dev-tools enabled and will automagically update the bundle when you edit a file.
* `npm run build` produces a production-ready bundle available at index.html
