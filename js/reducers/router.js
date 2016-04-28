/* A very simple router
 * simply a string of the currently active page
 */

export function router(state = 'landing', action) {
  switch (action.type) {
  case 'newPage':
    // webpack strips this in production
    const allowed = [ 'landing', 'main', 'settings', 'examples' ];
    console.assert( allowed.indexOf(action.name) > -1, 'router is trying to go to page ' + action.name );
    return state === action.name ? state : action.name;
  // case 'clearSpinner':
    // return state === 'unknown' ? state : 'unknown';


  /* when annotation data or tree data is incomming
   * we automagically switch the view to the main page.
   * If neither of these data is present then the viewer
   * is pretty useless
   */
  case 'annotationData':
  case 'treeData':
    return state === 'main' ? state : 'main';
  default:
    return state;
  }
}
