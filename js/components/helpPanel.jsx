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
        <div className="col-xs-3">
          <h3>
            General Help
          </h3>
          The "main" page layout is designed around a phylogeny (left hand side) and a linerised genome (right hand side) as described below. Hovering over regions (e.g. genes in the annotation, metadata output) displays relevent information. You can zoom and pan the genomic regions (hint: a mouse works better than a trackpad!).

        </div>

        <div className="col-xs-3">

          <h3>Trees</h3>
          You can zoom and pan the phylogeny to explore bigger datasets in more detail. Holding ctrl / cmd while you zoom will limit it to the horizontal direction. Right clicking on nodes brings up a range of options such as rotating nodes and viewing subtrees.

        </div>

        <div className="col-xs-3">

          <h3>Metadata</h3>
          Metadata columns can be toggled on or off in the settings panel (press s). Pressing k toggles a key, but it's often easier to simply hover over the data to see the actual information. Soon you will be able to colour the tree based on a column as well as change the type of a column (e.g. continuous data, ordinal e.t.c).

        </div>

        <div className="col-xs-3">
          <h3>
            Page Navigation
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
