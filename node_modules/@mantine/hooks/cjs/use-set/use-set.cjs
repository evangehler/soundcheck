'use client';
'use strict';

var React = require('react');
var useForceUpdate = require('../use-force-update/use-force-update.cjs');

function readonlySetLikeToSet(input) {
  if (input instanceof Set) {
    return input;
  }
  const result = /* @__PURE__ */ new Set();
  for (const item of input) {
    result.add(item);
  }
  return result;
}
function useSet(values) {
  const setRef = React.useRef(new Set(values));
  const forceUpdate = useForceUpdate.useForceUpdate();
  setRef.current.add = (...args) => {
    const res = Set.prototype.add.apply(setRef.current, args);
    forceUpdate();
    return res;
  };
  setRef.current.clear = (...args) => {
    Set.prototype.clear.apply(setRef.current, args);
    forceUpdate();
  };
  setRef.current.delete = (...args) => {
    const res = Set.prototype.delete.apply(setRef.current, args);
    forceUpdate();
    return res;
  };
  setRef.current.union = (other) => {
    const result = new Set(setRef.current);
    readonlySetLikeToSet(other).forEach((item) => result.add(item));
    return result;
  };
  return setRef.current;
}

exports.readonlySetLikeToSet = readonlySetLikeToSet;
exports.useSet = useSet;
//# sourceMappingURL=use-set.cjs.map
