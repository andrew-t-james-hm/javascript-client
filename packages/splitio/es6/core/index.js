/* @flow */ 'use strict';

let SchedulerFactory = require('@splitsoftware/splitio-utils/lib/scheduler');
let settings = require('@splitsoftware/splitio-utils/lib/settings');

let {
  splitChangesUpdater,
  segmentsUpdater
} = require('@splitsoftware/splitio-cache');

let metrics = require('@splitsoftware/splitio-metrics');

let _isStarted = false;
let core = {
  start() {
    if (!_isStarted) {
      _isStarted = true;
    } else {
      return Promise.reject('Engine already started');
    }

    let coreSettings = settings.get('core');
    let featuresRefreshRate = settings.get('featuresRefreshRate');
    let segmentsRefreshRate = settings.get('segmentsRefreshRate');

    let splitRefreshScheduler = SchedulerFactory();
    let segmentsRefreshScheduler = SchedulerFactory();

    // the first time the download is sequential:
    // 1- download feature settings
    // 2- segments
    return splitRefreshScheduler.forever(splitChangesUpdater, featuresRefreshRate, coreSettings).then(() => {
      return segmentsRefreshScheduler.forever(segmentsUpdater, segmentsRefreshRate, coreSettings);
    });
  },

  isStared() {
    return _isStarted;
  }
};

module.exports = core;
