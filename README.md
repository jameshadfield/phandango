<img src="https://raw.githubusercontent.com/jameshadfield/phandangoExampleData/master/wikiImages/logo600.png" width="400" height="200" />


* ### Load [phandango.net (including examples)](http://phandango.net)
* ### [Wiki (help) Page](http://github.com/jameshadfield/phandango/wiki)



If you use phandango in a publication please cite [Hadfield _et al._, Bioinformatics (2017) ](https://doi.org/10.1093/bioinformatics/btx610) 🎉


If you would like your data to appear as one of the examples, [make a new issue](https://github.com/jameshadfield/phandango/issues/new) and i'll add it 👍


Designed and build by [James Hadfield](https://github.com/jameshadfield/) and [Simon Harris](mailto:sh16@sanger.ac.uk) at the [Wellcome Sanger Institute](http://www.sanger.ac.uk), Cambridge, U.K.


### Developing 

This repo was built using a (now ancient) version of node & npm. 
The following conda environment works as of October 2023:
```
conda create --name phandango -c conda-forge nodejs=8
```
Hot reloading no longer works, and if you use VS-Code you need to prefix commands with `NODE_OPTIONS=""`