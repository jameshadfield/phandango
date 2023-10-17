/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import version from '../version';
import { AnimatedLogo } from '../components/logo';
import { Link } from 'react-router-dom';
import { getBrowser } from '../misc/helperFunctions';
import { connect } from 'react-redux';

@connect()
export class LandingPage extends React.Component {
  static propTypes = {
    browserMessage: PropTypes.string,
  }
  render() {
    let browserMessage = null;
    const browser = getBrowser();
    if ([ 'Chrome', 'Safari', 'Firefox' ].indexOf((browser.name)) === -1) {
      browserMessage = browser.name + ' version ' + browser.version.toString();
    }
    if (this.props.browserMessage) {
      browserMessage = (
        <strong>
          Please note, we have not tested phandango on your browser - {this.props.browserMessage}. Let us know if anything is amiss!
        </strong>
      );
    }
    return (
      <div className="center" style={{ paddingTop: '15vh' }}>

        <h2 className="light">
          Interactive visualization of genome phylogenies
        </h2>

        <AnimatedLogo w={600} h={200} interval={2000} animate={!!navigator.userAgent.match(/WebKit/i)}/>
        <p/>

        <br/>
        <h3 className="light">
          {"If you use phandango, please cite "}
          <a style={{ color: '#225ea8' }} className="pointer" onClick={()=>window.open('https://doi.org/10.1093/bioinformatics/btx610', '_blank')}>Hadfield <i>et al.</i>, Bioinformatics (2017)</a>
          {' 🎉'}
          <br/>
          <br/>
          {"Want your data to appear as one of the examples? "}
          <a href="https://github.com/jameshadfield/phandango/issues/new">create an issue</a>
          {" and i'll add it 👍"}
        </h3>

        <p>&nbsp;</p>

        <h2 className="light">
          drop your data on to begin
        </h2>

        {browserMessage}

        <p style={{ color: '#225ea8' }}>
          <a className="pointer" onClick={()=>window.open('https://github.com/jameshadfield/phandango/wiki', '_blank')}>About / Help (GitHub wiki)</a>
          <br/><br/>
          <Link to={"/examples"}>
            <span className="pointer" style={{color: 'rgb(34, 94, 168)'}}>Example Datasets</span>
          </Link>
          <br/><br/>
          <a className="pointer" onClick={()=>window.open('https://github.com/jameshadfield/phandango', '_blank')}>Github (source code)</a>
          <br/><br/>

        </p>
        <br/>
        version {version}
        <br/>
        <a href="https://www.sanger.ac.uk/">
          <img
            style={{ maxWidth: '300px' }}
            src={'./img/Wellcome_Sanger_Institute_Logo_Landscape_Digital_RGB_Full_Colour.svg'}
          />
        </a>
      </div>
    );
  }
}
