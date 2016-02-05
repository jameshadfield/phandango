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
export const Header = ({ pageName, goToPage }) => {
  const cssClass = 'col-xs center';
  let main = false;
  let settings = false;
  if (true) {
    main = (
      <div className={cssClass} onClick={()=>goToPage('main')}>
        <HeaderEntry name="Main" active={pageName === 'main'}/>
      </div>
    );
    settings = (
      <div className={cssClass} onClick={()=>goToPage('settings')}>
        <HeaderEntry name="Settings" active={pageName === 'settings'}/>
      </div>
    );
  }

  return (
    <div id="header">
      <div className="row">
        <div className={cssClass} onClick={()=>goToPage('landing')}>
          <HeaderEntry name="Landing" active={pageName === 'landing'}/>
        </div>
        {main}
        {settings}
        <div className={cssClass} onClick={()=>goToPage('about')}>
          <HeaderEntry name="About" active={pageName === 'about'}/>
        </div>
        <div className={cssClass} onClick={()=>goToPage('examples')}>
          <HeaderEntry name="Examples" active={pageName === 'examples'}/>
        </div>
        <div className={cssClass}>
          <HeaderEntry name="Help" active={pageName === 'help'}/>
        </div>
        <div className={cssClass} onClick={()=>window.open('https://github.com/jameshadfield/JScandy', '_blank')}>
          <HeaderEntry name="GitHub" active={false}/>
        </div>
      </div>
    </div>
  );
};
