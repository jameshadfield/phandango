var React = require('react');
// var RawDataStore = require('../stores/RawDataStore.js');
var Actions = require('../actions/actions.js');
var MetadataStore = require('../stores/MetadataStore.js');
// var Taxa_Locations = require('../stores/Taxa_Locations.js')


var Settings = React.createClass({displayName: "displayName",
	render: function() {
		if (!this.props.on) {
			return null
		}
		return (
			<div className="border fullpage bgwhite-alpha">
			<MetaSettings topState={this.props.topState} toggleColRow={this.props.toggleColRow} elementsOn={this.props.elementsOn}/>
			<Layout divPerc={this.props.divPerc} newDivPerc={this.props.newDivPerc} topState={this.props.topState} elementsOn={this.props.elementsOn}/>
			<ComponentsLoaded componentsLoaded={this.props.componentsLoaded}/>
			</div>
		);
	}
});



var ComponentsLoaded = React.createClass({displayName: "displayName",
	render: function() {
		var keys = Object.keys(this.props.componentsLoaded)
		console.log("keys",keys)
		return (
			<div className="border settings-col bgwhite">
				<h4>Loaded Components</h4>
				<hr/>
				{keys.map(function(x,i){
					return(<p>{x}:{this.props.componentsLoaded[x].toString()}</p>)
				}.bind(this))}
				<hr />
			</div>
		);
	}
});





// STATELESS
// props: name, currentValue, newValue (callback), isColumn (bool)
var LayoutEntry = React.createClass({displayName: "displayName",
	render: function() {
		return (
			<p className="range-field">
				{this.props.name}
				<input type="range" min="0" max="100" value={this.props.currentValue} onChange={this.props.newValue}/>
			</p>
		);
	}
});

// props in:
// this.props.divPerc
// this.props.newDivPerc (callback)
var Layout = React.createClass({displayName: "displayName",
	render: function() {
		return(
			<div className="border settings-col bgwhite">
				<h4>Panel Layout</h4>
				<hr/>
				<h5>Columns</h5>
				<LayoutEntry key='c1' name="left" currentValue={this.props.divPerc.col[1-1]} newValue={this.props.newDivPerc.bind(this.props.topState,'col',1)}/>
				<LayoutEntry key='c2' name="middle" currentValue={this.props.divPerc.col[2-1]} newValue={this.props.elementsOn.col[2-1] ? this.props.newDivPerc.bind(this.props.topState,'col',2) : function(){}}/>
				<LayoutEntry key='c3' name="right" currentValue={this.props.divPerc.col[3-1]} newValue={this.props.newDivPerc.bind(this.props.topState,'col',3)}/>
				<hr/>
				<h5>Rows</h5>
				<LayoutEntry key='r1' name="top" currentValue={this.props.divPerc.row[1-1]} newValue={this.props.newDivPerc.bind(this.props.topState,'row',1)}/>
				<LayoutEntry key='r2' name="middle" currentValue={this.props.divPerc.row[2-1]} newValue={this.props.newDivPerc.bind(this.props.topState,'row',2)}/>
				<LayoutEntry key='r3' name="bottom" currentValue={this.props.divPerc.row[3-1]} newValue={this.props.elementsOn.row[3-1] ? this.props.newDivPerc.bind(this.props.topState,'row',3) : function(){}}/>
				<hr/>
			</div>
		)
	}
});
// old map fn was
				// {this.state.rows.map(function(result,i) {
				// 	return <LayoutEntry colIdx={i} numCols={this.state.rows.length} key={i} name={result.name} currentValue={result.currentValue} newValue={this.newValueReceived} isColumn={false} myState={this} maxValue={document.documentElement.clientHeight}/>

				// }.bind(this))}










// state which can be stored in this panel is:
// columns on/off which is a mirror of whats in the store

// props passed:
// callback to toggle metaPanel on/off
// topState (for bind)

var MetaSettings = React.createClass({displayName: "displayName",
	toggleColumn: function(i){
		console.log("change in "+this.state.results[i].header)
		Actions.toggleMetadataColumn(i)
	},

	getInitialState : function() {
		var storeData = MetadataStore.getDataForSettings()
		// console.log("storeData:",storeData)
		return ( { results:storeData } );
	},

	render: function() {
		// var results = this.state.results
		return (
			<div className="border settings-col bgwhite">
				<h4>Metadata</h4>
				<hr/>
				<Switch header="Panel displayed" handleChange={this.props.toggleColRow.bind(this.props.topState,'col',2)} isChecked={this.props.elementsOn.col[2-1]} disabled={!MetadataStore.isLoaded()}/>
				<hr/>
				<div className = {this.props.elementsOn.col[2-1] ? '' : 'hidden'}>
					{this.state.results.map(function(result,i) {
						return <Switch key={result.id} header={result.header} handleChange={this.toggleColumn.bind(this, i)} isChecked={result.isChecked} disabled={false}/>
					}.bind(this))}
				</div>
			</div>
		);
	}
});

// "Switch" class. requires four props:
//		isChecked (bool), handleChange (callback), header (label), key (uniq ID, used by react)
// STATELESS
var Switch = React.createClass({displayName: "displayName",
	render: function() {
		return (
			<div id="mySwitch" key={this.props.id} className="switch">
				<label>
					Off
					<input disabled={this.props.disabled} type="checkbox" defaultChecked={this.props.isChecked} onChange={this.props.handleChange}/>
					<span className="lever"></span>
					On
				</label>
				<div className="horizontalgap">{this.props.header}</div>
			</div>
		);
	}
});




module.exports = Settings;
