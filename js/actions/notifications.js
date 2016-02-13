// import React from 'react';
// import { HelpPanel } from '../components/helpPanel';

export function notificationNew(title, msg = '') {
  return ({ type: 'notificationNew', title, msg, dialog: !!msg });
}

export function notificationSeen() {
  return ({ type: 'notificationSeen' });
}

// export function showHelp() {
//   return notificationNew("here's an overview to get you started...", <HelpPanel />);
// }
