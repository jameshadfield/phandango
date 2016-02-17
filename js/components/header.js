import React from 'react';


const HeaderEntry = ({ name, active }) => {
  let cname = 'pointer'; // class name(s)
  if (active) {
    cname = cname + ' heavy';
  }
  return (
    <span style={{ verticalAlign: 'middle' }} className = {cname}>{name}</span>
  );
};


/*  Header
 * @prop goToPage {function}
 * @prop pageName {string}
*/
export const Header = ({ pageName, goToPage, treeActive, annotationActive }) => {
  const cssClass = 'col-xs center';
  let unavalStyle = {};
  if (!treeActive & !annotationActive) {
    unavalStyle = { color: 'rgba(0, 0, 0, 0.3)' };
  }
  return (
    <div id="header">
      <div className="row">
        <div className={cssClass} onClick={()=>goToPage('landing')}>
          <HeaderEntry name="Landing" active={pageName === 'landing'}/>
        </div>
        <div className={cssClass} onClick={()=>goToPage('main')} style={unavalStyle}>
          <HeaderEntry name="Main" active={pageName === 'main'}/>
        </div>
        <div className={cssClass} onClick={()=>goToPage('settings')} style={unavalStyle}>
          <HeaderEntry name="Settings" active={pageName === 'settings'}/>
        </div>
        <div className={cssClass} onClick={()=>goToPage('about')}>
          <HeaderEntry name="About" active={pageName === 'about'}/>
        </div>
        <div className={cssClass} onClick={()=>goToPage('examples')}>
          <HeaderEntry name="Examples" active={pageName === 'examples'}/>
        </div>
        <div className={cssClass} onClick={()=>goToPage('help')}>
          <HeaderEntry name="Help" active={pageName === 'help'}/>
        </div>
        <div className={cssClass} onClick={()=>window.open('https://github.com/jameshadfield/phandango', '_blank')}>
          <HeaderEntry name="GitHub" active={false}/>
        </div>
      </div>
    </div>
  );
};
