import { gffParser } from '../parsers/gff';
import { metaParser } from '../parsers/csv';
import { computeLineGraph } from './lineGraph.js';
import merge from 'lodash/object/merge';
// const roaryParser = require('../components/genomic/roary.parser.js').parseCSV;
// const gwasParser = require('../components/graphs/plotFileParser.js');
const gwasParser = () => {throw 'not done';};

// readFilePromise() returns a new Promise
const readFilePromise = (file) => new Promise((resolve, reject) => {
  // console.log('file reader promise called to read file:', file.name);
  const reader = new FileReader();
  reader.onload = (e) => {resolve(e.target.result);}; // onload callback resolves
  reader.onerror = (e) => {reject('File ' + file.name + ' could not be read! Code ' + e.target.error.code);};
  reader.readAsText(file);
});

/*
  analyseIncomingData decides what type of data it is (tree / annotation e.t.c) and
  which parser to use. It may read a few lines of data to accomplish this.
  TO DO. Return a promise so this can be asyncrounously chained.
  TO DO. SNPs (VCF / TAB)
*/
const analyseIncomingData = (fileName, success) => {
  const fileExtension = fileName.split('.').slice(-1)[0].toLowerCase();
  let parserFn;
  let fileType;
  switch (fileExtension) {
  case 'nex': // fallthrough
  case 'newick': // fallthrough
  case 'new': // fallthrough
  case 'tree': // fallthrough
  case 'tre':
    if (success.startsWith('#NEXUS')) {
      throw new Error('Tree\'s can\'t be NEXUS format!');
    } else if (!success.startsWith('(')) {
      throw new Error('Tree is not in Newick format (must start with a \')\')!');
    }
    fileType = 'tree';
    // phylocanvas want's the string, so the parser is
    // just the identity promise
    parserFn = (x) => new Promise((resolve) => { resolve(x); });
    break;
  case 'gff3': // fallthrough
  case 'gff':
    parserFn = gffParser;
    if (success.split('\n')[3].split('\t')[1] === 'GUBBINS') {
      fileType = 'gubbins';
    } else { // assume it's an annotation gff
      fileType = 'annotation';
    }
    break;
  case 'embl':
    throw new Error('EMBL files cannot be parsed -- you must convert to GFF3');
  case 'csv':
    if (success.startsWith('"Gene","Non-unique Gene name"')) { // ROARY
      fileType = 'roary';
    } else {
      fileType = 'meta';
      parserFn = metaParser;
    }
    break;
  case 'gwas': // fallthrough
  case 'plot':
    parserFn = gwasParser;
    fileType = 'gwas';
    break;
  default:
    throw new Error('Unknown file extension');
  }
  console.log('File', fileName, 'to be parsed by ', fileType);
  return [ parserFn, fileType ];
};

const prepareDispatchPromise = (parsedData, dataType, fileName) =>
  new Promise((resolve, reject) => {
    let dispatchObj = { type: dataType + 'Data', fileName: fileName };
    switch (dataType) {
    case 'annotation':
      dispatchObj.genomeLength = parsedData[0][1];
      dispatchObj.data = parsedData[1];
      break;
    case 'gubbins':
      dispatchObj.genomeLength = parsedData[0][1];
      dispatchObj.data = parsedData[1];
      break;
    case 'meta':
      dispatchObj = merge(dispatchObj, parsedData);
      break;
    case 'tree':
      dispatchObj.data = parsedData;
      break;
    case 'gwas':
      reject('gwas case not done yet');
      break;
    case 'roary':
      reject('roary parser not configured with papaparse');
      break;
    default:
      reject('parse failed on data type' + dataType);
    }
    resolve(dispatchObj);
  }
);


/*
  fileDropped is a thunk, that is it returns a function which the store evaluates which eventyally returns a dispatch
  this allows for async processing
  fileDropped reads and parses an incomming file and dispatches appropriatly (error on failure)
  http://blog.oozou.com/stateful-context-working-with-multiple-values-in-a-promise-chain/
*/
export function fileDropped(file) {
  // thunks return function(dispatch)
  return function (dispatch) {
    let dataType; // e.g. meta or annotation
    readFilePromise(file).then( (success) => {
      let parser; // will hold a fn
      [ parser, dataType ] = analyseIncomingData(file.name, success);
      return parser(success); // promise
    }).then( (success) =>
      prepareDispatchPromise(success, dataType, file.name)
    ).then( (success) => {
      dispatch({ type: 'clearSpinner' });
      dispatch(success);
      // hack
      if (success.type === 'gubbinsData') {
        dispatch(computeLineGraph());
      }
    }).catch( (failure) => {
      console.error(failure.stack);
      dispatch({ type: 'newError', message: '' + failure + ' (fileDropped action)' });
    });
  };
}


// export function fileDropped(file) {
//   // thunks return function(dispatch)
//   return function (dispatch) {
//     let dataType; // e.g. meta or annotation
//     readFilePromise(file).then( (success) => {
//       let parser; // will hold a fn
//       [ parser, dataType ] = analyseIncomingData(file.name, success);
//       return parser(success); // promise
//     }).then( (success) =>
//       prepareDispatchPromise(success, dataType)
//     ).catch( (failure) => {
//       dispatch({ type: 'newError', message: '' + failure + ' (fileDropped action)' });
//     }).then( (success) => {
//       dispatch(success);
//     });
//   };
// }

