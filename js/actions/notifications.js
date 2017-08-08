// import React from 'react';
// import { HelpPanel } from '../components/helpPanel';

export function notificationNew(title, msg = '') {
  return ({ type: 'notificationNew', title, msg, dialog: !!msg });
}

export function notificationSeen() {
  return ({ type: 'notificationSeen' });
}

// export function showHelp() {
//   return notificationNew("here's an overview to get you started...", <HelpPanel />);
// }

export function checkLoadedDataIsComplete() {
  return function (dispatch, getState) {
    console.log("checkLoadedDataIsComplete")
    const { annotation, metadata, blocks, phylogeny } = getState();
    const d = { type: 'notificationNew', dialog: true };
    const notLoaded = 'not loaded';
    const loaded = {
      annotation: annotation.fileName !== notLoaded,
      phylogeny: phylogeny.fileName !== notLoaded,
      metadata: metadata.fileName !== notLoaded,
      blocks: blocks.blocks.length === 0,
    };
    if (!loaded.phylogeny) {
      if (loaded.blocks) {
        dispatch({ ...d, title: 'ERROR', msg: "Blocks provided without a tree, so they can't be displayed!" });
      } else if (loaded.metadata) {
        dispatch({ ...d, title: 'ERROR', msg: "Metadata provided without a tree, so the data can't be displayed!" });
      }
    }
  };
}
