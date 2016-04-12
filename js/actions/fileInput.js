import merge from 'lodash/merge';
import { notificationNew } from './notifications';
// PARSERS:
import { gffParser } from '../parsers/gff';
import { metaParser } from '../parsers/metadataParser';
import { clearLineGraph, computeLineGraph, computeMergedLineGraph } from './lineGraph.js';
import { roaryParser } from '../parsers/roaryParser';
import { plotParser } from '../parsers/plotParser';
import { bratNextGenParser } from '../parsers/bratNextGenParser';

/* readURL (via AJAX)
 * @RETURNS: promise
 * resolves to file contents
 * rejects on error
 */
const readURL = (url) => new Promise((resolve, reject) => {
  const reader = new XMLHttpRequest();
  reader.open('GET', url, true);
  reader.onreadystatechange = () => {
    if (reader.readyState === 4) {
      if (reader.status === 200) {
        resolve(reader.responseText);
      } else {
        reject('AJAX failed for url ' + url + ' (status ' + reader.status + ')');
      }
    }
  };
  reader.send();
});

/* fileReaderPromise
 * @RETURNS: promise
 * turns the (async) FileReader into a promise
 * resolves the result (file contents)
 * rejects any error
 */
const fileReaderPromise = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {resolve(e.target.result);}; // onload callback resolves
  reader.onerror = (e) => {reject('File ' + file.name + ' could not be read! Code ' + e.target.error.code);};
  reader.readAsText(file);
});

/* read
 * @RETURNS promise which resolves to the file contents
 * @PARAMS filename {string} - local path | url
 * @PARAMS ajax {bool}
 */
const read = (filepath, ajax) =>
  ajax ? readURL(filepath) : fileReaderPromise(filepath);

/* analyseIncomingData (syncronous)
 * decides what type of data it is (tree / annotation e.t.c)
 * and which parser to use based upon file suffix and file inspection
 * @RETURNS:
 *    fileType {string} - tree | roary | meta | gwas | gubbins | annotation
 *    parserFn - parser function to be called
 */
const analyseIncomingData = (fileName, fileContents) => {
  const fileExtension = fileName.split('.').slice(-1)[0].toLowerCase();
  let parserFn;
  let fileType;
  switch (fileExtension) {
  case 'nex': // fallthrough
  case 'newick': // fallthrough
  case 'new': // fallthrough
  case 'tree': // fallthrough
  case 'tre':
    if (fileContents.startsWith('#NEXUS')) {
      throw new Error('Tree\'s can\'t be NEXUS format!');
    } else if (!fileContents.startsWith('(')) {
      throw new Error('Tree is not in Newick format (must start with a \')\')!');
    }
    fileType = 'tree';
    /*
    phylocanvas wants the string, so the parser as a promise is:
    parserFn = (x) => new Promise((resolve) => { resolve(x); });
    or, even easier, return the input syncronously
    */
    parserFn = (x) => x;
    break;
  case 'gff3': // fallthrough
  case 'gff':
    parserFn = gffParser;
    if (fileContents.split('\n')[3].split('\t')[1] === 'GUBBINS') {
      fileType = 'gubbins';
    } else { // assume it's an annotation gff
      fileType = 'annotation';
    }
    break;
  case 'embl':
    throw new Error('EMBL files cannot be parsed -- you must convert to GFF3');
  case 'csv':
    if (fileContents.startsWith('"Gene","Non-unique Gene name"') || fileContents.startsWith('Gene,Non-unique Gene name')) { // ROARY
      fileType = 'roary';
      parserFn = roaryParser;
    } else {
      fileType = 'meta';
      parserFn = metaParser;
    }
    break;
  case 'gwas': // fallthrough
  case 'plot':
    parserFn = plotParser;
    fileType = 'gwas';
    break;
  case 'txt':
    if (fileContents.startsWith('LIST OF FOREIGN GENOMIC SEGMENTS:')) { // bratNextGen
      parserFn = bratNextGenParser;
      fileType = 'bratNextGen';
    } else {
      throw new Error('Unknown file extension (' + fileExtension + ')');
    }
    break;
  default:
    throw new Error('Unknown file extension (' + fileExtension + ')');
  }
  // console.log('File', fileName, 'to be parsed by ', fileType);
  return [ fileType, parserFn ];
};

/* goDispatch (syncronous)
 * takes the parsed results and dispatches appropriately
 * @PARAM dispatch {func}
 * @PARAM parsedData - the returned value from the parser. You need to know something about the parser to understand this!!!!!
 * @PARAM dataType {string} - gubbins | meta | annotation etc
 * @PARAM filename {string} - basename of file
 * @SIDE-EFFECTS dispatches (potentially multiple times)
 * @SIDE-EFFECTS may throw
 * @RETURNS undefined
 */
const goDispatch = (dispatch, getState, parsedData, dataType, filename) => {
  let dispatchObj = { type: dataType + 'Data', fileName: filename };
  switch (dataType) {
  case 'annotation':
    dispatch({ ...dispatchObj, data: [ parsedData[1], parsedData[2] ], genomeLength: parsedData[0][1] });
    break;
  case 'gubbins':
    dispatch({ ...dispatchObj, data: parsedData[1], genomeLength: parsedData[0][1] });
    // dispatch an action to check the genomeLength is the same...

    // if bratNextGen is loaded then we want to switch to merged view
    // else just make the line graph for this one...
    dispatch(clearLineGraph());
    if (getState().blocks.fileNames.bratNextGen) {
      dispatch({ type: 'showBlocks', name: 'merged' });
      dispatch(computeMergedLineGraph([ 'gubbinsPerTaxa', 'bratNextGen' ]));
    } else {
      dispatch(computeLineGraph());
    }
    break;
  case 'bratNextGen':
    dispatch({ ...dispatchObj, data: parsedData[0], metadata: parsedData[1] });
    // if gubbins is loaded then we want to switch to merged view
    // else just make the line graph for this one...
    dispatch(clearLineGraph());
    if (getState().blocks.fileNames.gubbins) {
      dispatch({ type: 'showBlocks', name: 'merged' });
      dispatch(computeMergedLineGraph([ 'gubbinsPerTaxa', 'bratNextGen' ]));
    } else {
      dispatch(computeLineGraph(true));
    }
    break;
  case 'meta':
    dispatchObj = merge(dispatchObj, parsedData);
    dispatch(dispatchObj);
    break;
  case 'tree':
    dispatch({ ...dispatchObj, data: parsedData });
    break;
  case 'gwas':
    dispatch({ ...dispatchObj, data: parsedData });
    break;
  case 'roary':
    // we have 3 dispatches -- the blocks, annotation and linegraph!
    dispatch({ ...dispatchObj, data: parsedData[0], type: 'annotationData' });
    dispatch({ ...dispatchObj, data: parsedData[1], genomeLength: parsedData[2] });
    dispatch(clearLineGraph());
    dispatch(computeLineGraph());
    break;
  default:
    throw new Error('unexpected fallthrough in goDispatch()');
  }
};


/*
  incomingFile is a thunk--it returns a function which (eventually) dispatches
  the returned function sets up a promise which does the dispatching

  the promise has three parts
  (1) the file is read (file reader / ajax)
  (2) a parser is chosen
  (3) the dispatches are formulated and dispatched
  (catch) a notification is dispatched

  helpful guides:
  http://blog.oozou.com/stateful-context-working-with-multiple-values-in-a-promise-chain/
  http://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html

  @PARAM ajax - is the file a url to get or a file dropped event object?
  @PARAM file {obj | string} - url (if ajax = true) or file dropped event blob

*/
export function incomingFile(file, ajax = false) {
  // thunks return function(dispatch)
  return function (dispatch, getState) {
    // dispatch action to toggle spinner on?
    let dataType; // e.g. meta | annotation | tree | gubbins e.t.c
    // const filename = file.name.split('/').slice(-1)[0]; // basename of file
    const filename = ajax ? file : file.name;
    // fileReaderPromise(file).then( (success) => {
    read(file, ajax).then( (success) => {
      let parser; // temporary storage
      [ dataType, parser ] = analyseIncomingData(filename, success);
      return parser(success); // usually a promise
    }).then( (success) =>
      goDispatch(dispatch, getState, success, dataType, filename) // returns undefined | throws
    ).catch( (failure) => {
      console.error(failure.stack);
      dispatch( notificationNew(
        'Input error. File: ' + filename,
        failure.toString()
      ));
    });
  };
}

export function clearAllData() {
  return ({ type: 'clearAllData' });
}
