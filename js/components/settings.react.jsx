var React = require('react');
// var RawDataStore = require('../stores/RawDataStore.js');
var Actions = require('../actions/actions.js');
var MetadataStore = require('../stores/MetadataStore.js');
// var Taxa_Locations = require('../stores/Taxa_Locations.js')


// "switch" class. requires four props:
//		isChecked (bool), handleChange (callback), header (label), key (uniq ID, used by react)
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

var MetaSettings = React.createClass({displayName: "displayName",
	toggleColumn: function(i){
		console.log("change in "+this.state.results[i].header)
		Actions.toggleMetadataColumn(i)
	},
	toggleDisplay: function(){
		// can't work out how to access the actual "checked" value of the element!
		Actions.toggleMetaDisplay(!this.state.display)
		this.setState({display:MetadataStore.shouldWeDisplay()});
	},

	getInitialState : function() {
		var storeData = MetadataStore.getDataForSettings()
		// console.log(storeData)
		return ( { results:storeData, display:MetadataStore.shouldWeDisplay(), loaded:MetadataStore.isLoaded()  } );
	},


	render: function() {
		// var results = this.state.results
		return (
			<div className="border settings-col">
				<h4>Metadata</h4>
				<hr/>
				<Switch header="Panel displayed" handleChange={this.toggleDisplay} isChecked={this.state.display} disabled={!this.state.loaded}/>
				<hr/>
				<div className = {this.state.display ? '' : 'hidden'}>
					{this.state.results.map(function(result,i) {
						return <Switch key={result.id} header={result.header} handleChange={this.toggleColumn.bind(this, i)} isChecked={result.isChecked} disabled={false}/>
					}.bind(this))}
				</div>
			</div>
		);
	}
});

var Settings = React.createClass({displayName: "displayName",
	render: function() {
		return (
			<div id="balshalshalh" className="fullpage">
					<MetaSettings/>
			</div>
		);
	}
});



function changeEventHandler(elem){
	console.log(elem)
}
module.exports = Settings;



// document.querySelector('input').checked = false
// var gender = document.querySelector('input[name = "gender"]:checked').value;




