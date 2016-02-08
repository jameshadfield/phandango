/* eslint-disable max-len */
import React from 'react';
import { AnimatedLogo } from '../components/logo';

export const NotChrome = () => {
  return (
    <div className="center" style={{ paddingTop: '15vh' }}>
      <AnimatedLogo w={400} h={150} interval={2000}/>
      <br/>
      <h3 className="light">
        Interactive visualization of genome phylogenies
      </h3>
      <h2 className="light">
        Apologies, currently only Google Chrome is supported.
      </h2>
      We hope to increase browser support soon. In the meantime you can <a href="https://www.google.com/chrome/browser/desktop/">Download Chrome here</a>.
    </div>
  );
};
