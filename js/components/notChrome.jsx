/* eslint-disable max-len */
import React from 'react';
import { AnimatedLogo } from '../components/logo';
import version from '../version';

export const NotChrome = () => {
  return (
    <div className="center" style={{ paddingTop: '15vh' }}>
      <div className="row center-xs">
        <div className="col-xs-10 col-md-6">
          <h2>
            Interactive visualization of genome phylogenies
          </h2>
          <AnimatedLogo w={400} h={150} interval={10000}/>

          <h2 className="light">
            Apologies, currently only webkit browsers (e.g. <a href="https://www.google.com/chrome/browser/desktop/">Chrome</a>, <a href="http://www.apple.com/uk/safari/">Safari</a>) are supported.
          </h2>
          <strong>Why is this?</strong> Different browsers use different syntax to handle events (such as zooming, dragging) as well as niggly things like scroll bars, animations e.t.c. Unfortunately there is lots of code which relies on these things in an interactive app such as this. I hope we can support Firefox & Edge sometime in the future but it's not trivial to do this and there is science to be done!
          <p>
            <strong>Can you help?</strong> Phandango is open source and <a href="https://github.com/jameshadfield/phandango">is on GitHub</a>. If you can help out and increase browser support that would be great.
          </p>
          <p><a href="mailto:jh22@sanger.ac.uk">Contact (email)</a></p>
          <p>version {version}</p>
        </div>
      </div>
    </div>
  );
};
