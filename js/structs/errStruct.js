var errStruct = function (isDialog, errTitle, errMessage) {
  this.isDialog = isDialog === false ? false : true;
  this.title = errTitle || undefined;
  this.message = errMessage || undefined;
  this.isScrollable = false;
};

// coult add proptotypes here to make error creation easier...
// errStruct.prototype.addCompareList = function () {
// };

// could have some structures here? like a compare struct which
// is parsed into a 2-column display
// has form {list1Name -> [arr of strings], list2name -> [arr of str]}
// there could be type checking here, no?
// this.compareList = undefined;

module.exports = errStruct;
