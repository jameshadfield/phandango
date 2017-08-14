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
    const { annotation, metadata, blocks, phylogeny, gwasGraph } = getState();
    const d = { type: 'notificationNew', dialog: true };
    const notLoaded = 'not loaded';
    const loaded = {
      annotation: annotation.fileName !== notLoaded,
      phylogeny: phylogeny.fileName !== notLoaded,
      metadata: metadata.fileName !== notLoaded,
      blocks: blocks.blocks.length !== 0,
      gwas: gwasGraph.values.length !== 0,
    };
    // console.log("LOADED STATUS", "annotation", loaded.annotation, "tree", loaded.phylogeny, "meta", loaded.metadata, "blocks", loaded.blocks, "gwas", loaded.gwas)
    if (!loaded.phylogeny) {
      if (loaded.blocks) {
        dispatch({ ...d, title: 'HEADS UP', msg: 'Blocks provided without a tree, so this data cannot be displayed!' });
      } else if (loaded.metadata) {
        dispatch({ ...d, title: 'HEADS UP', msg: 'Metadata provided without a tree, so this data cannot be displayed!' });
      } else if (loaded.annotation) {
        dispatch({ ...d, title: 'HEADS UP', msg: 'An annotation is being displayed but without corresponding recombination / pan genome / GWAS / tree data.' });
      }
    } else if (loaded.phylogeny && !loaded.metadata && !loaded.blocks) {
      dispatch({ ...d, title: 'HEADS UP', msg: 'A phylogeny has been loaded, but without recombination / pan genome / metadata files.' });
    } else if ((loaded.blocks || loaded.gwas) && !loaded.annotation) {
      dispatch({ ...d, title: 'HEADS UP', msg: 'Recombination / pan-genome / GWAS data is loaded but this cannot be displayed without an annotation file!' });
    }
  };
}
