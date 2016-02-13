import React from 'react';

function add(a, b) {return a + b;}

export const AnimatedLogo = React.createClass({
  propTypes: {
    interval: React.PropTypes.number,
    w: React.PropTypes.number.isRequired,
    h: React.PropTypes.number.isRequired,
    animate: React.PropTypes.bool,
  },

  getDefaultProps() {
    return {
      interval: 5000,
      animate: true,
    };
  },

  componentDidMount() {
    this.move();
    if (this.props.animate) {
      this.intervalId = window.setInterval(this.move, this.props.interval);
    }
  },

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  render() {
    const fontSize = 56;
    return (
      <svg ref={(c) => this.svgElem = c} width={this.props.w} height={this.props.h}>

        <g ref={(c) => this.boxes = c}>
          <rect x={this.props.w * 0.1} y="0" fill="#FFFFFF" width="0" height="0"/>
          <rect x={this.props.w * 0.2} y={this.props.h} fill="#FFFFFF" width="0" height="0"/>
          <rect x={this.props.w * 0.3} y="0" fill="#FFFFFF" width="0" height="0"/>
          <rect x={this.props.w * 0.4} y={this.props.h} fill="#FFFFFF" width="0" height="0"/>
          <rect x={this.props.w * 0.5} y="0" fill="#FFFFFF" width="0" height="0"/>
          <rect x={this.props.w * 0.6} y={this.props.h} fill="#FFFFFF" width="0" height="0"/>
          <rect x={this.props.w * 0.7} y="0" fill="#FFFFFF" width="0" height="0"/>
          <rect x={this.props.w * 0.8} y={this.props.h} fill="#FFFFFF" width="0" height="0"/>
          <rect x={this.props.w * 0.9} y="0" fill="#FFFFFF" width="0" height="0"/>
        </g>
        <g>
          {/* react doesn't have textLength so we have to do this :( */}
          <text x = "5%" y = "50%" fill="#FFFFFF" fontFamily="Lato" fontSize={fontSize}>p</text>
          <text x = "15%" y = "50%" fill="#FFFFFF" fontFamily="Lato" fontSize={fontSize}>h</text>
          <text x = "25%" y = "50%" fill="#FFFFFF" fontFamily="Lato" fontSize={fontSize}>a</text>
          <text x = "35%" y = "50%" fill="#FFFFFF" fontFamily="Lato" fontSize={fontSize}>n</text>
          <text x = "45%" y = "50%" fill="#FFFFFF" fontFamily="Lato" fontSize={fontSize}>d</text>
          <text x = "55%" y = "50%" fill="#FFFFFF" fontFamily="Lato" fontSize={fontSize}>a</text>
          <text x = "65%" y = "50%" fill="#FFFFFF" fontFamily="Lato" fontSize={fontSize}>n</text>
          <text x = "75%" y = "50%" fill="#FFFFFF" fontFamily="Lato" fontSize={fontSize}>g</text>
          <text x = "85%" y = "50%" fill="#FFFFFF" fontFamily="Lato" fontSize={fontSize}>o</text>
        </g>
      </svg>
    );
  },

  getLetterSpacing(numBoxes) {
    const letterSpacing = Array.apply(1, Array(numBoxes));
    let count = 0;
    for (let i = 0; i < numBoxes; i++) {
      const multiplier = i < 1 ? i : 3;
      let space = count > 9 ? 0 : Math.round(Math.random() * multiplier);
      if (count + space > 9) {
        space = 9 - count;
      }
      if (i === 8 && count < 9) {
        space = 9 - count;
      }
      letterSpacing[i] = space;
      count += space;
    }
    return letterSpacing;
  },

  getYPositions(n, height) {
    const ret = Array.apply(0, Array(n));
    for (let i = 0; i < n; i++) {
      const top = Math.round(Math.random() * 1 / 4 * height);
      const bottom = Math.round(height * 2 / 3 + Math.random() * 1 / 3 * height);
      ret[i] = [ top, bottom - top ];
    }
    return ret;
  },

  move() {
    const boxes = this.boxes.children;
    const numBoxes = boxes.length;
    const numNewBoxes = numBoxes;
    const letterSpacing = this.getLetterSpacing(numNewBoxes);
    const letterWidthPx = Math.round( this.svgElem.width.baseVal.value * 0.9 / 9);
    const letterBufferLeft = this.props.w > 400 ? -8 : 0;
    const letterBufferRight = this.props.w > 400 ? 8 : 2;
    const xOffset = Math.round(0.05 * this.svgElem.width.baseVal.value);

    const yPositions = this.getYPositions(numNewBoxes, this.svgElem.height.baseVal.value);

    for (let boxNum = 0; boxNum < numBoxes; boxNum++) {
      boxes[boxNum].x.baseVal.value = xOffset + letterSpacing.slice(0, boxNum).reduce(add, 0) * letterWidthPx + letterBufferLeft;
      boxes[boxNum].width.baseVal.value = letterSpacing[boxNum] * letterWidthPx - letterBufferRight;

      boxes[boxNum].y.baseVal.value = yPositions[boxNum][0];
      boxes[boxNum].height.baseVal.value = yPositions[boxNum][1];

      const col = letterSpacing[boxNum] === 1 ? '#225ea8' : '#f03b20';

      boxes[boxNum].setAttribute('style', 'fill: ' + col);
    }
  },
});


export const StaticLogo = () => {
  return (
    <svg viewBox="0 0 173.737 88.637" opacity="0.8">
      <rect y="11.844" fill="#ED1C24" width="38.904" height="65.98"/>
      <rect x="40.019" y="23.688" fill="#ED1C24" width="36.052" height="64.949"/>
      <rect x="114.758" fill="#1C75BC" width="18.146" height="65.98"/>
      <rect x="133.969" y="11.844" fill="#ED1C24" width="39.768" height="65.465"/>
      <rect x="96.585" y="23.688" fill="#1C75BC" width="16.652" height="64.949"/>
      <rect x="77.071" y="11.844" fill="#1C75BC" width="18.5" height="54.137"/>
      <rect y="29.657" fill="none" width="380.808" height="128.788"/>
      <text transform="matrix(1 0 0 1 0 55.8828)" fill="#FFFFFF" fontFamily="Lato" fontSize="36">phandango</text>
    </svg>
  );
};
