import React from 'react';

export function HelpPanel() {
  return (
    <div>
      <ul>
        <li>Pressing "h" will show you this overview</li>
        <li>Press "s" to toggle settings menu, where you can adjust the sizing of elements and the types of data displayed</li>
      </ul>
      <div className="fitImageToBox center-align">
        <img src="img/layoutExplained.svg" alt="general layout"/>
      </div>
    </div>
  );
}
