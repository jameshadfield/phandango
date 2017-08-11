import React from 'react';
import PropTypes from 'prop-types';

/*  InfoTip
stateless component
renders a div with text
*/
export const InfoTip = ({ x, y, disp }) => {
  const style = {
    position: 'absolute',
    zIndex: 100,
    left: x,
    top: y,
    background: 'black',
    color: 'white',
    pointerEvents: 'none',
  };
  return (
    <div style={style}>
      {Object.keys(disp).map( (id, idx) =>
        <g key={idx}>{id}: {disp[id]}<br/></g>
      )}
    </div>
  );
};

InfoTip.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  disp: PropTypes.object,
};
