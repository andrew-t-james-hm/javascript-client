'use strict';

var matcherTypes = require('../matchers/types');

var segmentTransform = require('./segment');
var whitelistTransform = require('./whitelist');

/**
 * Flat the complex matcherGroup structure into something handy.
 */
function transform(matcherGroup) {
  let {
    matcherType,
    userDefinedSegmentMatcherData: segmentObject,
    whitelistMatcherData: whitelistObject
  } = matcherGroup.matchers[0];

  let type = matcherTypes.mapper(matcherType);
  let value;

  if (type === matcherTypes.enum.ALL) {
    value = undefined;
  } else if (type === matcherTypes.enum.SEGMENT) {
    value = segmentTransform(segmentObject);
  } else if (type === matcherTypes.enum.WHITELIST) {
    value = whitelistTransform(whitelistObject);
  }

  return {
    type,
    value
  };
}

module.exports = transform;
