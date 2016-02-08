/* eslint-disable max-len */
import React from 'react';
import { AnimatedLogo } from './logo';

export function HelpPanel() {
  return (
    <div className="content light">
      <div className="center">
        <AnimatedLogo w={400} h={150} interval={10000}/>
      </div>


      <div className="row">
        <div className="col-xs-6">
          <h3>
            General Help
          </h3>
          The "main" page layout is designed around a phylogeny (left hand side) and a linerised genome (right hand side) as described below. Hovering over regions (e.g. genes in the annotation) displays relevent information. You can zoom into the phlogeny as well as the genomic data to explore bigger datasets in more detail. Loading the example datasets is a good place to start...

        </div>

        <div className="col-xs-6">
          <h3>
            Navigation
          </h3>
          Press the first letter of the menu items (at the top of the page) to navigate. E.g. "e" goes to the examples page. Once data is loaded you can change the positioning of panels and change the displayed data from the settings page (by pressing "s" or using the menu at the top of the page).

        </div>
      </div>

      <div className="row center-xs">
        <div className="col-xs-6 col-lg-8">
          <div className="fitImageToBox center-align">
            <img src="img/layoutExplained.svg" alt="general layout"/>
          </div>
        </div>
      </div>

    </div>


  );
}
