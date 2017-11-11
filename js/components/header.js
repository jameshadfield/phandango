import React from 'react';
import { Link } from 'react-router-dom';


const HeaderEntry = ({ name, active }) => {
  let cname = 'pointer'; // class name(s)
  if (active) {
    cname = cname + ' heavy';
  }
  return (
    <span style={{ verticalAlign: 'middle', color: 'rgba(0, 0, 0, 0.87)' }} className = {cname}>{name}</span>
  );
};

export const Header = ({ pageName, treeActive, annotationActive }) => {
  const cssClass = 'col-xs center';
  let unavalStyle = {};
  if (!treeActive & !annotationActive) {
    unavalStyle = { color: 'rgba(0, 0, 0, 0.3)' };
  }
  return (
    <div id="header">
      <div className="row">
        <div className={cssClass}>
          <Link to={"/"}>
            <HeaderEntry name="Landing" active={pageName === 'landing'}/>
          </Link>
        </div>
        <div className={cssClass} style={unavalStyle}>
          <Link to={"/main"}>
            <HeaderEntry name="Main" active={pageName === 'main'}/>
          </Link>
        </div>
        <div className={cssClass} onClick={()=>console.log("TO DO")} style={unavalStyle}>
          <HeaderEntry name="Settings" active={pageName === 'settings'}/>
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
};
