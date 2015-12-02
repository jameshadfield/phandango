const EventEmitter = require('events').EventEmitter;
const assign = require('object-assign');
const Dispatcher = require('../dispatcher/dispatcher');
const Actions = require('../actions/actions.js');
const ErrStruct = require('../structs/errStruct.js');
const React = require('react');

// P A R S E R S
// all parsers return null / false upon failure
const gubbinsParser = require('../components/genomic/parse.gubbins.js');
const metaParser = require('../components/meta/parse.csv.js');
const annotationParser = require('../components/annotation/parse.annotations.js');
const roaryParser = require('../components/genomic/roary.parser.js');
const gwasParser = require('../components/graphs/plotFileParser.js');

// only possible to have one of each loaded at a given time!!!!!
const loaded = { // value is fileName
  'tree': undefined,
  'meta': undefined,
  'annotation': undefined,
  'genomic': undefined,
  'SNPs': undefined,
  'GWAS': undefined,
};
const parsed = {};
const rawData = {}; // internal ONLY
const misc = { roarySortCode: 'asIs' };
const datasetType = { default: false, data: undefined }; // default -> false == user data. data = gubbins | roary (defined by parser success)
let blockTaxaNames = [];
// change prefix for testing / production purposes!
// var defaultDataPrefix = "https://rawgit.com/jameshadfield/JScandy/"
const defaultDataPrefix = 'https://cdn.rawgit.com/jameshadfield/JScandy/';
const defaultDataPaths = {
  'gubbins': [
    defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/Spn23f.gff',
    defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/gubbins.gff',
    defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/gubbins.tre',
    defaultDataPrefix + 'v0.2.0/example_datasets/gubbins/meta.simple.csv',
	],
	'roary': [
    defaultDataPrefix + 'v0.2.0/example_datasets/roary/gene_presence_absence.csv',
    defaultDataPrefix + 'v0.2.0/example_datasets/roary/gubbins.tre',
    defaultDataPrefix + 'v0.2.0/example_datasets/roary/metadata.csv',
  ],
};


const RawDataStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
		this.emit('change');
	},
  addChangeListener: function (callback) {
		this.on('change', callback);
	},
  removeChangeListener: function (callback) {
		this.removeListener('change', callback);
	},
  // getData: function () {
  //   return data; // reference
  // },
  getDataLoaded: function (name) {
		return name ? loaded[name] : loaded;
	},
  getParsedData: function (name) {
		return parsed[name];
	},
  getRoarySortCode: function () {
		return misc.roarySortCode;
	},
  isDefaultData: function () {
		return datasetType.default;
	},
  getGenomicDatasetType: function () {
		return datasetType.data;
  },
  getBlockTaxaNames: function () {
    return blockTaxaNames;
  },
});

function incomingData(files, ajax) {
  const errQueue = [];
  console.groupCollapsed('File Parsing');

	// using the idea of a barrier from
	// http://stackoverflow.com/questions/7957952/detecting-when-javascript-is-done-executing
	// to know when all the IO is done!
	// only when all IO is done do we emit an event that the components pick up
  const EmitWhenIOFinished = function () {
    this.stillToReturn = files.length;
    const myState = this;
    this.iOdone = function () {
			myState.stillToReturn -= 1;
			// console.log("emitWhenIOFinished.IOdone called. "+this.stillToReturn+" still to return")
			if (myState.stillToReturn === 0) {
        myState.done();
		}
    };
    this.done = function () {
      console.log('all IO done');
      console.groupEnd();
			RawDataStore.emitChange();
      if (errQueue.length > 0) {
        Actions.newErr(errQueue);
		}
    };
  };
  const emitWhenIOFinished = new EmitWhenIOFinished();

  function masterParser(fileName, data) {
    const fileExtension = fileName.split('.').slice(-1)[0];
    const displayName = fileName.split('/').slice(-1)[0];
    let result;
    let errStr;
    switch (fileExtension) {

			case 'gff':
				// could be gubbins OR annotation
      console.log('trying gubbins parsing');
      result = gubbinsParser.parse_gff(data);
      if (result === false) {
        console.log('gubbins parsing failed');
      } else {
        console.log('gubbins parsing success');
					loaded.genomic = displayName;
					datasetType.data = 'gubbins';
        parsed.genomic = result;
        // we now want to know what taxa were included...
        // this should be a fn on the event loop to speed up!
        blockTaxaNames = []; // global to this file
        for (const el of parsed.genomic[1]) {
          for (const taxaName of el.taxa) {
            if  (blockTaxaNames.indexOf(taxaName) === -1) {
              blockTaxaNames.push(taxaName);
            }
          }
        }
					break;
				}

				// try annotation now
      console.log('trying annotation parsing');
      result = annotationParser.parse_gff(data);
      if (result === false) {
        console.log('annotation parsing failed');
				} else {
        console.log('annotation parsing success');
        Actions.set_genome_length(result[0][1]);
        parsed.annotation = result[1];
					loaded.annotation = displayName;
        break;
				}

      // if we're here then both the gubbins & annotation parsing failed
      errStr = [
        'GFF file ', <strong>{fileName}</strong>,
        ' was not parsed by either the Gubbins or Annotation parsers!',
        ' Are you sure the format is correct?',
        <p/>,
        'Currently the 2nd column of the GFF file must be "EMBL" or "artemis" (for annotation) or "GUBBINS" (for gubbins blocks).',
        <p/>,
        <a href="https://jameshadfield.github.io/JScandy/intro.html">This page</a>,
        ' details the file formats that are understood.',
      ];
      errQueue.push(new ErrStruct(true, 'ERROR: Unused input file.', errStr));
				break;

			case 'tree': // FALLTHROUGH
			case 'tre':
				// basically palm this off to PhyloCanvas
				loaded.tree = displayName;
      parsed.tree = data;
				break;


			case 'csv':
				// could be roary OR metadata
      console.log('trying metadata parsing');
      result = metaParser(data);
      if (result === false) {
        console.log('metadata parsing failed');
      } else {
        console.log('metadata parsing success');
					loaded.meta = displayName;
        Actions.hereIsMetadata(result); // seperate store!
					break;
				}

				// try ROARY now
      console.log('trying ROARY parsing');
      result = roaryParser.parseCSV(data);
      if (result === false) {
        console.log('ROARY parsing failed');
      } else {
        console.log('ROARY parsing success');
        rawData.roary = result;
					loaded.genomic = displayName;
					datasetType.data = 'roary';
					loaded.annotation = displayName;
        saveRoaryAsData(
          rawData.roary[0],
          rawData.roary[1],
          100,
          misc.roarySortCode
        ); // modifies parsed['annotation'] & parsed['genomic']
        // we now want to know what taxa were included...
        // this should be a fn on the event loop to speed up!
        blockTaxaNames = []; // global to this file
        for (const el of parsed.genomic[1]) {
          for (const taxaName of el.taxa) {
            if  (blockTaxaNames.indexOf(taxaName) === -1) {
              blockTaxaNames.push(taxaName);
            }
          }
				}
				break;
      }
      // if we're here then both the metadata and roary parsing failed
      errStr = [
        'CSV file ', <strong>{fileName}</strong>,
        ' was not parsed by either the ROARY or metadata parsers!',
        ' Are you sure the format is correct?',
        <p/>,
        'For a metadata file the first entry of the header must be "name", "lane", "isolate" or "id".',
        <p/>,
        <a href="https://jameshadfield.github.io/JScandy/intro.html">This page</a>,
        ' details the file formats that are understood.',
      ];
      errQueue.push(new ErrStruct(true, 'ERROR: Unused input file.', errStr));
      break;

			case 'plot':
      console.log(displayName, ' -> GWAS parsing');
      result = gwasParser(data);
      if (result === false) {
        console.log('GWAS parsing failed');
      } else {
        console.log('GWAS parsing success');
					loaded.GWAS = displayName;
        parsed.GWAS = result;
				}
				break;

    default:
      errStr = [
        'Filename ', <strong>{fileName}</strong>, ' was not parsed due to ',
        'an unknown file suffix (', fileExtension, '). ',
        <p/>,
        <a href="https://jameshadfield.github.io/JScandy/intro.html">This page</a>,
        ' details the file formats that are understood.',
      ];
      errQueue.push(new ErrStruct(true, 'WARNING: Unused input file.', errStr));
		}
    emitWhenIOFinished.iOdone();
	}

  console.log('RawDataStore: ' + files.length + ' incoming file(s) (AJAX:', ajax, ')');


  // remember we're in the incomingData function
  // this is where we read in the data
  // either via AJAX or FileReader

	// A J A X
	// http://stackoverflow.com/questions/13445809/how-to-handle-simultaneous-javascript-xmlhttprequests
	if (ajax) {
    const requests = new Array();
    for (let i = 0; i < files.length; i++) {
      (function (iClosed) {
        requests[iClosed] = new XMLHttpRequest();
        requests[iClosed].open('GET', files[i], true);
        requests[iClosed].onreadystatechange = function () {
          if (requests[iClosed].readyState === 4) {
            if (requests[iClosed].status === 200) {
              masterParser(files[iClosed], requests[iClosed].responseText);
						} else {
              console.log('AJAX Error', requests[iClosed].statusText);
						}
					}
				};
				requests[i].send();
			})(i);
		}
  } else { // L O C A L
    for (let i = 0; i < files.length; i++) {
			// console.log("Filename: " + files[i].name + " " + parseInt(files[i].size/1024) + " kb");
      const reader = new FileReader();
      const fileName = files[i].name;
      // onload, being sent to the event loop (or a callback, maybe it's not on the loop)
      // needs a closure to bind certain variables to it (in this case, fileName)
      reader.onload = function (fileNameClosed) {
        return function (event) {
          masterParser(fileNameClosed, event.target.result);
				};
			}(fileName);
      reader.onerror = function (event) {
        console.error('File could not be read! Code ' + event.target.error.code);
			};
			reader.readAsText(files[i]);
		}
	}
}


function saveRoaryAsData(headerData, roaryData, geneLen, sortCode) {
  const roaryObjs = roaryParser.generateRoary(headerData, roaryData, geneLen, sortCode);
	if (!roaryObjs) {
    console.log('roary data conversion failed!');
		return;
	}
  parsed.genomic = [ [ 0, roaryObjs[2] ], roaryObjs[0] ]; // FIX
  parsed.annotation = roaryObjs[1];
  setTimeout(function () {
    Actions.set_genome_length(roaryObjs[2]);
  }, 0);
  setTimeout(function () {
    Actions.save_plotYvalues(roaryObjs[3], 'recombGraph');
  }, 0);
  setTimeout(function () {
    RawDataStore.emitChange();
  }, 0);
}


Dispatcher.register(function (payload) {
  	// console.log("action triggered: "+payload.actionType)
	if (payload.actionType === 'files_dropped') {
		datasetType.default = false;
    incomingData(payload.files, false);
  } else if (payload.actionType === 'loadDefaultData') {
		datasetType.default = true;
    incomingData(defaultDataPaths[payload.dataset], true);
  } else if (payload.actionType === 'sortRoary') {
    // console.log('ACTION SORT WITH CODE', payload.sortCode);
    saveRoaryAsData(rawData.roary[0], rawData.roary[1], 100, payload.sortCode);
		misc.roarySortCode = payload.sortCode;
	}
});

module.exports = RawDataStore;
