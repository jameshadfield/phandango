// /* global define, it, describe */
// import { expect } from 'chai';
// import rewire from 'rewire';
// const csv = rewire('../csv.js');


// describe('CSV parsing', function () {
//   describe('_classifyValues', function () {
//     const _classifyValues = csv.__get__('_classifyValues');
//     it('classify strings, even when mixed with ints / floats', function () {
//       expect(_classifyValues([ 'a', 'string' ])[0]).to.eql('string');
//       expect(_classifyValues([ 'a', 'string', '1' ])[0]).to.eql('string');
//       expect(_classifyValues([ 'a' ])[0]).to.eql('string');
//     });
//     it('classify ints only when all are ints', function () {
//       expect(_classifyValues([ '1', '2' ])[0]).to.eql('int');
//       expect(_classifyValues([ '1' ])[0]).to.eql('int');
//       expect(_classifyValues([ '0', '1' ])[0]).to.eql('int');
//     });
//     it('classify floats only when none are strings and not all are ints', function () {
//       expect(_classifyValues([ '1', '2.123' ])[0]).to.eql('float');
//       expect(_classifyValues([ '1', 'aa' ])[0]).to.not.eql('float');
//       expect(_classifyValues([ '0.12' ])[0]).to.eql('float');
//     });
//     it('two values are bool', function () {
//       expect(_classifyValues([ '1', '2' ])[1]).to.be.true;
//       expect(_classifyValues([ '1', 'aa' ])[1]).to.be.true;
//       expect(_classifyValues([ '1' ])[1]).to.be.true;
//       expect(_classifyValues([ '1', '2', '3' ])[1]).to.be.false;
//     });
//   });
//   describe('_sortValues', function () {
//     const _sortValues = csv.__get__('_sortValues');
//     it('integer / float sorting', function () {
//       expect(_sortValues(new Set([ '1', '2', '3' ]), 'int')).to.eql([ '1', '2', '3' ]);
//       expect(_sortValues(new Set([ '1', '3', '2' ]), 'int')).to.eql([ '1', '2', '3' ]);
//       expect(_sortValues(new Set([ '1.2', '0.1', '-0.3' ]), 'float')).to.eql([ '-0.3', '0.1', '1.2' ]);
//     });
//     it('string sorting', function () {
//       expect(_sortValues([ 'a', '1', 'Z', '3', '1a' ], 'string'))
//         .to.eql([ '1', '1a', '3', 'a', 'Z' ]);
//       // expect(_sortValues(new Set([ '1', '3', '2' ]), 'int')).to.eql([ '1', '2', '3' ]);
//       // expect(_sortValues(new Set([ '1.2', '0.1', '-0.3' ]), 'float')).to.eql([ '-0.3', '0.1', '1.2' ]);
//     });
//   });
// });

