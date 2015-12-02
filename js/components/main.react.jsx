const React = require('react');
const ReactDOM = require('react-dom');
const Actions = require('../actions/actions.js');
const RawDataStore = require('../stores/RawDataStore.js');
// react components
const Landing = require('./landing.react.jsx');
const CanvasDivs = require('./canvases.react.jsx');
const Settings = require('./settings.react.jsx');
const ErrComponent = require('./err.react.jsx');

function add(a, b) {return (a + b);} // http://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers

// this is an extremely stateful component
// it is the main class called by app.js
// it includes a router e.t.c
const MainReactElement = React.createClass({ displayName: 'MainReactElement',
  getInitialState: function () {
    // initial values
    return ({
      divPerc: {
        col: [ 20, 11, 69 ],
        row: [ 15, 70, 15 ],
      },
      router: 'landing', // what page do we start with?
      elementsOn: {
        col: [ true, true, true ],
        row: [ true, true, true ],
      },
      dataLoaded: RawDataStore.getDataLoaded(),
      showLoading: this.showLoading,
    });
  },

  componentDidMount: function () {
    const myState = this;
    document.addEventListener('keyup', this.keyIncoming);
    window.onresize = this.recomputeAndDrawCanvases;
    ReactDOM.findDOMNode(this).addEventListener('dragover', function (event) {
      event.preventDefault();
    }, false);
    ReactDOM.findDOMNode(this).addEventListener('drop', function (event) {
      const files = event.dataTransfer.files;
      event.preventDefault();
      myState.showLoading();
      Actions.files_dropped(files);
      // myState.setState({router:'main'});
    }, false);
    RawDataStore.addChangeListener(function () {
      myState.setState({ 'dataLoaded': RawDataStore.getDataLoaded(), 'router': 'main' });
    });
  },

  render: function () {
    let LoadingDiv = <div/>;
    let LandingDiv = <div/>;
    let SettingsDiv = <div/>;
    this.googleAnalytics();
    // which one is on???
    if (this.state.router === 'loading') {
      LoadingDiv = <Spinner/>;
    } else if (this.state.router === 'landing') {
      LandingDiv = (
        <Landing
        showLoading={this.state.showLoading}/>
        );
    } else if (this.state.router === 'settings') {
      SettingsDiv = (
        <Settings
        logoClick={this.showMain}
        divPerc={this.state.divPerc}
        newDivPerc={this.newDivPerc}
        topState={this}
        toggleColRow={this.toggleColRow}
        elementsOn={this.state.elementsOn}
        dataLoaded={this.state.dataLoaded}/>
      );
    }
    return (
      <div id="mainDiv">
        <ErrComponent/>
        {LoadingDiv}
        {LandingDiv}
        {SettingsDiv}
        <CanvasDivs
          logoClick={this.showSettings}
          divPerc={this.state.divPerc}
          on={true}
          elementsOn={this.state.elementsOn}
          dataLoaded={this.state.dataLoaded}/>
        {/* always on to keep components alive */}
      </div>
    );
  },

  currentGAPageName: undefined,

  sendGAtoken: function (pageName) {
    if (this.currentGAPageName === 'pageName') {
      // console.log('not sending GA (pageName unchanged)');
      return;
    }
    // console.log('sending GA. Page:', pageName);
    window.ga('set', 'page', '/' + pageName);
    window.ga('send', 'pageview');
    this.currentGAPageName = pageName;
  },

  googleAnalytics: function () {
    // page code for GA:
    // simple: landing | settings
    // data pages:
    //    default_roary | default_gubbins
    //    userData_roary | userData_gubbins
    if (this.state.router === 'landing') {
      this.sendGAtoken('landing');
    } else if (this.state.router === 'settings') {
      this.sendGAtoken('settings');
    } else if (this.state.router === 'main') {
      const prefix = RawDataStore.isDefaultData() ? 'default' : 'userData';
      const gwasSuffix = RawDataStore.getDataLoaded('GWAS') ? '_GWAS' : '';
      const genomicSuffix = RawDataStore.getGenomicDatasetType() ? '_' + RawDataStore.getGenomicDatasetType() : '';
      this.sendGAtoken(prefix + genomicSuffix + gwasSuffix);
    }
  },

  keyIncoming: function (key) {
    // http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
    // console.log("incoming key stroke",event.keyCode)
    if (event.keyCode === 83 || event.charCode === 83) { // 's'
      this.setState({ router: this.state.router === 'settings' ? 'main' : 'settings' });
    } else if (event.keyCode === 76 || event.charCode === 76) { // 'l'
      this.setState({ router: this.state.router === 'landing' ? 'main' : 'landing' });
    }
  },

  showLoading: function () {
    this.setState({ router: 'loading' });
  },

  showLanding: function () {
    this.setState({ router: 'landing' });
  },

  showSettings: function () {
    this.setState({ router: 'settings' });
  },

  showMain: function () {
    this.setState({ router: 'main' });
  },

  toggleColRow: function (colRow, num) {
    // console.log("params:",colRow,num)
    // this is a callback from settings
    const elementsOn = {
      col: this.state.elementsOn.col.slice(),
      row: this.state.elementsOn.row.slice(),
    };
    elementsOn[colRow][num - 1] = !this.state.elementsOn[colRow][num - 1];
    // console.log("elementsOn (columns) were:",this.state.elementsOn.col,"are now",elementsOn.col)
    this.setState({ elementsOn: elementsOn });
    elementsOn[colRow][num - 1] ? this.newDivPerc(colRow, num, 11) : this.newDivPerc(colRow, num, 0);
  },

  newDivPerc: function (colRow, numArg, event) {
    // this is a callback for a user change to a slider
    const divPerc = {
      col: this.state.divPerc.col.slice(),
      row: this.state.divPerc.row.slice(),
    };
    const num = numArg - 1;
    // event could be the new value (not an actual event!)
    divPerc[colRow][num] = isFinite(event) ? event : parseInt(event.target.value, 10);
    // divPerc[colRow][num]=parseInt(event.target.value);
    const newSpaceToFill = this.state.divPerc[colRow][num] - divPerc[colRow][num]; // could be -ve
    // console.log("new space to fill:",newSpaceToFill)
    for (let i = 0; i < divPerc[colRow].length; i++) {
      if (i === num) {
        continue;
      }
      divPerc[colRow][i] = parseInt(this.state.divPerc[colRow][i] + newSpaceToFill * (this.state.divPerc[colRow][i] / 100), 10);
    }
    // randomly asign an index the extra amount!  http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
    // ensure that if an element is "off" it is always 0
    // i.e. what are all the indexes that can receive the overflow?
    // this is fivPerc[colRow]
    // var possible_idx_values_to_get_overflow = divPerc[colRow].slice();
    // possible_idx_values_to_get_overflow.splice(num,1); // splice out the changed idx
    // for (var i=0; i<this.state.elementsOn.length; i++) {
    //  if (!this.state.elementsOn[i]) { // i.e. turned off
    //  }
    // }
    // myArray[Math.floor(Math.random() * myArray.length)]
    // divPerc[colRow][Math.floor(Math.random()*(3))] -= divPerc[colRow].reduce(add,0) - 100;
    divPerc[colRow][0] -= divPerc[colRow].reduce(add, 0) - 100;
    if (divPerc[colRow].reduce(add, 0) !== 100) {
      console.log('percentages don\'t add to 100%', colRow, '=', divPerc[colRow]);
    }
    this.setState({ divPerc: divPerc });

    // console.log("phylocanvas div is w:",parseInt(divPerc.col[0]/100*document.documentElement.clientWidth),"px & h:",parseInt(divPerc.row[1]/100*document.documentElement.clientHeight),"px")
    // console.log("gubbins div is w:",parseInt(divPerc.col[2]/100*document.documentElement.clientWidth),"px & h:",parseInt(divPerc.row[1]/100*document.documentElement.clientHeight),"px")

    this.recomputeAndDrawCanvases();
  },

  recomputeAndDrawCanvases: function () {
    const canvases = document.getElementsByTagName('canvas');
    for (let i = canvases.length - 1; i >= 0; i--) {
      const width = canvases[i].clientWidth;
      const height = canvases[i].clientHeight;
      if (canvases[i].width !== width || canvases[i].height !== height) {
        // Change the size of the canvas to match the size it's being displayed
        canvases[i].width = width;
        canvases[i].height = height;
        // console.log("\t", canvases[i].id, ' resized to w:',width,'h',height);
        // now we need to redraw the canvas
      }
    }

    // phylocanvas is a black box
    try {
      window.phylocanvas.resizeToContainer();
      window.phylocanvas.draw(true); // forces phylocanvas.fitInPanel()
    } catch (e) {
      if (e instanceof ReferenceError) {
        // console.log('caught silently');
      }
    }
    Actions.phylocanvas_changed();
    Actions.redrawAll();
  },
});


const Spinner = React.createClass({ displayName: 'displayName',
  render: function () {
    return (
      <div className="fullpage center-align" id="spinner">


      <div className="preloader-wrapper big active">
      <div className="spinner-layer spinner-blue">
      <div className="circle-clipper left">
      <div className="circle"></div>
      </div><div className="gap-patch">
      <div className="circle"></div>
      </div><div className="circle-clipper right">
      <div className="circle"></div>
      </div>
      </div>

      <div className="spinner-layer spinner-red">
      <div className="circle-clipper left">
      <div className="circle"></div>
      </div><div className="gap-patch">
      <div className="circle"></div>
      </div><div className="circle-clipper right">
      <div className="circle"></div>
      </div>
      </div>

      <div className="spinner-layer spinner-yellow">
      <div className="circle-clipper left">
      <div className="circle"></div>
      </div><div className="gap-patch">
      <div className="circle"></div>
      </div><div className="circle-clipper right">
      <div className="circle"></div>
      </div>
      </div>

      <div className="spinner-layer spinner-green">
      <div className="circle-clipper left">
      <div className="circle"></div>
      </div><div className="gap-patch">
      <div className="circle"></div>
      </div><div className="circle-clipper right">
      <div className="circle"></div>
      </div>
      </div>
      </div>


      </div>
    );
  },
});


module.exports = MainReactElement;
