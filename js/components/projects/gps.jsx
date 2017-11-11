import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { incomingFile, clearAllData } from '../../actions/fileInput';
import { increaseSpinner } from '../../actions/general';
import { AnimatedLogo } from '../../components/logo';

const prefixes = [ 'GPSC79', 'GPSC84' ];
const makePaths = (prefix, pan = false, recomb = false) => {
  const defaultDataPrefix = 'https://cdn.rawgit.com/jameshadfield/phandangoExampleData/master/';
  const paths = [
    defaultDataPrefix + "GPS/" + prefix + '.tre',
    defaultDataPrefix + "GPS/" + prefix + '_MR.csv',
  ];
  if (pan || recomb) {
    paths.push(defaultDataPrefix + "GPS/" + prefix + '_reference.gff');
  }
  if (pan) {
    paths.push(defaultDataPrefix + "GPS/" + prefix + '_gene_presence_absence_min.csv');
  } else if (recomb) {
    paths.push(defaultDataPrefix + "GPS/" + prefix + '_recombinations.gff');
  }
  return paths;
};

@connect()
export default class ProjectGPS extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  }
  constructor(...args) {
    super(...args);
    this.loadExample = (paths) => {
      this.props.dispatch(clearAllData());
      this.props.dispatch(increaseSpinner(paths.length));
      this.context.router.history.push('/main');
      for (const url of paths) {
        this.props.dispatch(incomingFile(url, true));
      }
    };
  }
  render() {
    return (
      <div className="center" style={{ paddingTop: '15vh' }}>

        <h2 className="light">
          Global Pneumococcal Sequencing Project Data
        </h2>

        <AnimatedLogo w={600} h={200} interval={2000} animate={!!navigator.userAgent.match(/WebKit/i)}/>
        <p/>

        <p>
          {prefixes.map((cv) => (
            <p key={cv}>
              {`${cv}: `}
              <span className="pointer" style={{ color: '#225ea8' }} onClick={this.loadExample.bind(null, makePaths(cv))}>
                metadata only
              </span>
              {" / "}
              <span className="pointer" style={{ color: '#225ea8' }} onClick={this.loadExample.bind(null, makePaths(cv, false, true))}>
                recombinations
              </span>
              {" / "}
              <span className="pointer" style={{ color: '#225ea8' }} onClick={this.loadExample.bind(null, makePaths(cv, true, false))}>
                pan genome
              </span>
            </p>
          ))}

        </p>

        <br/>
        <br/>
        <a href="http://www.pneumogen.net/gps/" style={{ color: '#225ea8' }}>GPS homepage</a>
      </div>
    );
  }
}
