export function dom2svg(dom) {
  const childNodes = dom.childNodes;
  console.log('found ', childNodes.length, 'child nodes');
  const ret = [];
  for (let idx = 0; idx < childNodes.length; idx++) {
    // check if leaf node!
    const content = childNodes[idx].innerHTML;
    const left = String(parseFloat(childNodes[idx].style.left));
    const top = String(parseFloat(childNodes[idx].style.top));
    const fontSize = parseFloat(getComputedStyle(childNodes[idx], null).getPropertyValue('font-size'));
    // getComputedStyle(cn[0], null).getPropertyValue('font-family')

    let rotate = false;
    if (childNodes[idx].style.transform.indexOf('rotate') > -1) {
      rotate = String(childNodes[idx].style.transform.match(/(\d+)/)[0]);
    }

    let svg = '<text x="' + left + '" y="' + top + '" font-family="Helvetica" font-size="' + fontSize + '"';
    if (rotate) {
      svg += ' transform="rotate(' + rotate + ' ' + left + ',' + top + ')"';
    }
    svg += '>\n';
    svg += content;
    svg += '\n';
    svg += '</text>';
    ret.push(svg);
  }
  // console.log(ret.join('\n'));
  return (ret.join('\n'));
}

