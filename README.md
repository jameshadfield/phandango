# [JScandy](http://jameshadfield.github.io/JScandy/)

Introduction and overview [here](http://jameshadfield.github.io/JScandy/)

### Install your own (local) copy

JSCandy is entirely run from within the browser and runs entirely on your computer (i.e. entirely client side). If you want to download / fork the project from github and have a local (development) copy on your computer then this is for you:

* Node and Node Package manager (npm) are needed to build the javascript bundles. On OS X I recommend following this guide which uses homebrew and nvm.
* Clone/Fork the github repo or download the zip files via github.com/jameshadfield/JScandy
* As the bundled javascript file is included in the repo, you should now be good to go -- simply open up index.html in google chrome...
* But if you want to have a development version then you'll need to install the required packages by running **npm install** in the JScandy directory, with these caveats
  * Currently [PhyloCanvas](https://github.com/PhyloCanvas/PhyloCanvas) is linked in, so you'll have to clone that repo (branch release/2.0) and then link that with these commands **npm link** (in the PhyloCanvas directory) and **npm link PhyloCanvas** (in the JScandy directory)
  * run **npm run build** to build the javascript files into a single bundle.
  * open index.html in google chrome


