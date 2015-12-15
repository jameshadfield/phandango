import React from 'react';

export const Spinner = React.createClass({ displayName: 'displayName',
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
