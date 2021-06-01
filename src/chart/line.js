import { drawLineShape } from './shape/lineShape';
// import { drawLabel } from './shape/label';
import Base from './base';
export default class Line extends Base {
  constructor (data, config) {
    super(data, config);
    this.chartType = 'line';
    this.initData(config);
    this.init();
  };

  drawCanvas (yAxis, yAxisChild, scaleY, index, parentIndex, start, yPartChild) {
    let bandwidth = this.scaleX.bandwidth();
    let data = yAxisChild.data;
    let keyArr = yAxisChild.key;
    let num = index !== 0 ? yAxis[index - 1].key.length : 0;
    let height = this.yAxisHeight * start;
    let topAxisHeight = this.topAxisHeight + height - this.xAxis.line.style.lineWidth / 2;
    for (let i = 0; i < keyArr.length; i++) {
      let keyId = `${parentIndex}-${num}`;
      let drawData = JSON.parse(JSON.stringify(data[i]));
      let allData = JSON.parse(JSON.stringify(data[i]));
      if (yPartChild) {
        drawData = yPartChild.allDataObj[yAxisChild.position][i];
      }
      drawLineShape(
        this.middle,
        this.lineContainer,
        this.labelContainer,
        drawData,
        scaleY,
        bandwidth,
        topAxisHeight,
        height,
        keyArr[i],
        this.colorList,
        this.xAxisList,
        this.xAxis,
        this.xAxisPart,
        this.lineStyle,
        this.lineSize, // 线的粗细
        this.tooltipList, // tooltip显示内容
        this.labelsList, // 标签
        keyId,
        // this.partKey,
        allData,
        yPartChild,
        this.click,
        this.id,
        this.shapeWidth,
        this.yAxisHeight,
        index,
        start
      );
      num = num + 1;
    }
  };

  render () {

  };
};
