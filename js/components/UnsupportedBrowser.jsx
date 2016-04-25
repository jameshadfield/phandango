/* eslint-disable max-len */
import React from 'react';
import { AnimatedLogo } from '../components/logo';
import version from '../version';

export const UnsupportedBrowser = ({ msg }) => {
  return (
    <div className="center" style={{ paddingTop: '15vh' }}>
      <div className="row center-xs">
        <div className="col-xs-10 col-md-6">
          <h2>
            Interactive visualization of genome phylogenies
          </h2>
          <AnimatedLogo w={400} h={150} animate={false}/>

          <h2 className="light">Apologies, {msg}</h2>

          <h3 className="light">
            We have successfully tested phandango on the following browsers
            <ul style={{ listStyleType: 'none' }}>
              <li>
                <a href="https://www.google.com/chrome/browser/desktop/">Chrome 49+</a> (best results)
              </li>
              <li>
                <a href="http://www.apple.com/uk/safari/">Safari 9+</a>
              </li>
              <li>
                <a href="https://www.mozilla.org/en-GB/firefox/new/">Firefox 45+</a>
              </li>
            </ul>
          </h3>

          <strong>Why is this?</strong> Different browsers use different syntax to handle events (such as zooming, dragging) as well as niggly things like scroll bars, animations e.t.c. Unfortunately there is lots of code which relies on these things in an interactive app such as this and it's hard to support every browser out there!
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

UnsupportedBrowser.propTypes = {
  msg: React.PropTypes.string.isRequired,
};
