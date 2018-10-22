import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { incomingFile, clearAllData } from '../../actions/fileInput';
import { increaseSpinner } from '../../actions/general';
import { AnimatedLogo } from '../../components/logo';

const prefixes = [
  'GPSC1',
  'GPSC2',
  'GPSC3',
  'GPSC4',
  'GPSC5',
  'GPSC6',
  'GPSC7',
  'GPSC8',
  'GPSC9',
  'GPSC10',
  'GPSC11',
  'GPSC12',
  'GPSC13',
  'GPSC14',
  'GPSC15',
  'GPSC16',
  'GPSC17',
  'GPSC18',
  'GPSC19',
  'GPSC20',
  'GPSC21',
  'GPSC22',
  'GPSC23',
  'GPSC24',
  'GPSC25',
  'GPSC26',
  'GPSC27',
  'GPSC30',
  'GPSC31',
  'GPSC32',
  'GPSC33',
  'GPSC34',
  'GPSC37',
  'GPSC38',
  'GPSC39',
  'GPSC40',
  'GPSC41',
  'GPSC43',
  'GPSC47',
  'GPSC48',
  'GPSC50',
  'GPSC51',
  'GPSC52',
  'GPSC53',
  'GPSC54',
  'GPSC55',
  'GPSC56',
  'GPSC57',
  'GPSC58',
  'GPSC61',
  'GPSC62',
  'GPSC65',
  'GPSC67',
  'GPSC68',
  'GPSC70',
  'GPSC72',
  'GPSC76',
  'GPSC77',
  'GPSC78',
  'GPSC79',
  'GPSC80',
  'GPSC81',
  'GPSC90',
  'GPSC91',
  'GPSC93',
  'GPSC94',
  'GPSC97',
  'GPSC103',
  'GPSC105',
  'GPSC108',
  'GPSC115',
  'GPSC117',
  'GPSC131',
];
const makePaths = (prefix, pan = false, recomb = false) => {
  const address = `https://cdn.rawgit.com/jameshadfield/phandangoExampleData/master/GPS/${prefix}/${prefix}`;
  /* everything has a tree and a metadata CSV */
  const paths = [
    `${address}.tre`,
    `${address}_metadata.csv`,
  ];
  if (pan) {
    paths.push(`${address}_gene_presence_absence.csv`); /* roary */
  } else if (recomb) {
    paths.push(`${address}.gff`); /* genome annotation */
    paths.push(`${address}_predictions.gff`); /* gubbins */
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
          Global Pneumococcal Sequencing Project
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
        GPS homepage: <a href="http://www.pneumogen.net/gps/" style={{ color: '#225ea8' }}>pneumogen.net/gps/</a>
      </div>
    );
  }
}
