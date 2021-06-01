import Bubble from './geometry/Bubble.js';
import Scatter from './geometry/Scatter.js';
import Map from './chart/map.js';
import Bar from './chart/bar.js';
import Line from './chart/line.js';
import barLine from './chart/barLine.js';
import barRotated from './chart/barRotated.js';
import Table from './chart/table.js';

let drawClasses = {
  bubble: Bubble,
  scatter: Scatter,
  map: Map,
  bar: Bar,
  line: Line,
  barLine: barLine,
  barRotated: barRotated,
  table: Table
};

let GeometryDrawingProcess = function ({ config, data, chartType }) {
  let instance = new drawClasses[chartType](data, config);
  return {
    draw: () => {
      instance.render();
    },
    update: (type, data) => {
      instance.update(type, data);
    },
    getColorList: () => {
      return instance.getColorList();
    },
    getDomain: () => {
      return instance.getDomain();
    }
  };
};

export { GeometryDrawingProcess };
export default GeometryDrawingProcess;
