

var dispatcher = new Dispatcher();
// var simple_store = new Simple_Store();

React.render(React.createElement(A_React_Element, null), document.getElementById('react') );


// Not sure where the following functions should actually go
// although i realise it's not here...

function actionTestButtonPressed() {
	// testing only, clearly
	// this is triggered from a button defined in index.html
	console.log("you clicked... dispatching an action to the dispatcher")

	dispatcher.dispatch({
	  actionType: 'counter-increment'
	});

}

