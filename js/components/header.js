import React from 'react';
import { Link } from 'react-router-dom';
import {connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toggleSettings } from '../actions/general';


const HeaderEntry = ({ name, active, hide }) => {
  let cname = 'pointer'; // class name(s)
  if (active) {
    cname = cname + ' heavy';
  }
  const opacity = hide ? 0.3 : 0.87;
  return (
    <span style={{ verticalAlign: 'middle', color: `rgba(0, 0, 0, ${opacity})` }} className = {cname}>{name}</span>
  );
};

@connect((state)=>({
  showSettings: state.misc.showSettings,
  treeActive: state.layout.active.tree,
  annotationActive: state.layout.active.annotation,
}))
class Header extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    showSettings: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
  }
  render() {
    const pageName = this.props.location.pathname.split('/')[1];
    const cssClass = 'col-xs center';
    const mainSettingsDull = this.props.treeActive === false & this.props.annotationActive === false;
    return (
      <div id="header">
        <div className="row">
          <div className={cssClass}>
            <Link to={"/"}>
              <HeaderEntry name="Landing" active={pageName === ''}/>
            </Link>
          </div>
          <div className={cssClass}>
            <Link to={"/main"}>
              <HeaderEntry name="Main" active={pageName === 'main' && !this.props.showSettings} hide={mainSettingsDull}/>
            </Link>
          </div>
          <div className={cssClass} onClick={()=>this.maybeShowSettings()}>
            <HeaderEntry name="Settings" active={pageName === 'main' && this.props.showSettings} hide={mainSettingsDull}/>
          </div>
          <div className={cssClass}>
            <Link to={"/examples"}>
              <HeaderEntry name="Examples" active={pageName === 'examples'}/>
            </Link>
          </div>
          <div className={cssClass} onClick={()=>window.open('https://github.com/jameshadfield/phandango/wiki', '_blank')}>
            <HeaderEntry name="About (wiki)" active={pageName === 'about'}/>
          </div>
          <div className={cssClass} onClick={()=>window.open('https://github.com/jameshadfield/phandango', '_blank')}>
            <HeaderEntry name="GitHub" active={false}/>
          </div>
        </div>
      </div>
    );
  }
  maybeShowSettings() {
    if (this.props.location.pathname.split('/')[1] === 'main') {
      this.props.dispatch(toggleSettings());
    }
  }
}

export default Header;
