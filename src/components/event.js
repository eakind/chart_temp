import {
  drawTooltip,
  hideTooltip
} from './tooltip.js';
let addEvent = function (config, eventName) {
  let eventProcess = (function () {
    return {
      mouseoverProcess: function (e) {
        let dataset = e.target.dataset;
        if (dataset.data) {
          let {
            data,
            index
          } = dataset;
          drawTooltip(e, config, data, index);
        }
      },
      mouseoutProcess: function () {
        hideTooltip(config);
      }
    };
  })();
  let {
    id
  } = config;
  document.querySelector(id).removeEventListener(eventName, eventProcess[eventName + 'Process'], false);
  document.querySelector(id).addEventListener(eventName, eventProcess[eventName + 'Process'], false);
};

export {
  addEvent
};
