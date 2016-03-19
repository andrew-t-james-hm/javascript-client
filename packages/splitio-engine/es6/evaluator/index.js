/**
Copyright 2016 Split Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/

const log = require('debug')('splitio-engine:evaluator');
const engine = require('../engine');

// Evaluator factory
function evaluatorContext(
  matcherEvaluator /*: function */,
  treatments       /*: Treatments */,
  attributeName    /*: string */
) /*: function */ {

  function evaluator(key /*: string */, seed /*: number */, attributes /*: object */) /*:? string */ {
    let valueToMatch = undefined;

    if (attributeName) {
      if (attributes) {
        valueToMatch = attributes[attributeName];

        log('extracted attribute %s, using %s for matching', attributeName, attributes[attributeName]);
      } else {
        log('defined attribute %s, but none attributes defined', attributeName);
      }
    } else {
      valueToMatch = key;
    }

    // if the matcherEvaluator return true, then evaluate the treatment
    if (valueToMatch !== undefined && matcherEvaluator(valueToMatch)) {
      return engine.getTreatment(key, seed, treatments);
    }

    // else we should notify the engine to continue evaluating
    return undefined;
  }

  return evaluator;
}

module.exports = evaluatorContext;
