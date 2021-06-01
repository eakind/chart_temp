import { getToTalBar } from './common/utils';
import { drawBarShape } from './shape/barShape';
import { drawLineShape } from './shape/lineShape';
// import { drawLabel } from './shape/label';
import Base from './base';
export default class Bar extends Base {
  constructor (data, config) {
    super(data, config);
    this.initData(config);
    this.init();
  };

  drawCanvas (yAxis, yAxisChild, scaleY, index, parentIndex, start, yPartChild) {
    let bandwidth = this.scaleX.bandwidth();
    let total = getToTalBar(yAxis);
    let data = yAxisChild.data;
    let keyArr = yAxisChild.key;
    let keyIdArr = yAxisChild.keyId;
    let typeArr = yAxisChild.type;
    let num = index !== 0 ? yAxis[index - 1].type.filter(item => item === 'bar').length : 0;
    let height = this.yAxisHeight * start;
    let topAxisHeight = this.topAxisHeight + height - this.xAxis.line.style.lineWidth / 2;
    // this.drawClipPath(this.barContainer, height, topAxisHeight, index, start);
    for (let i = 0; i < keyArr.length; i++) {
      let keyId = keyIdArr[i];// `${parentIndex}-${num}`;
      let drawData = JSON.parse(JSON.stringify(data[i]));
      let allData = JSON.parse(JSON.stringify(data[i]));
      if (yPartChild) {
        drawData = yPartChild.allDataObj[yAxisChild.position][i];
      }
      let chartType = typeArr[i];
      if (chartType === 'bar') {
        drawBarShape(
          this.middle, // 整个图形容器
          this.barContainer, // 当前图形容器
          this.labelContainer, // 标签容器
          drawData, // 数据
          scaleY, // Y轴刻度
          bandwidth, // x轴间隔
          height, // Y轴高度
          topAxisHeight, // 顶部间隔
          num, // 第几个柱子
          total, // 总共多少个柱子
          keyArr[i], // 坐标关键字
          this.colorList, // 颜色列表
          this.xAxisList, // X轴数组
          this.xAxis, // X轴信息
          this.xAxisPart, // 顶部X轴信息
          this.size, // 柱子大小
          this.tooltipList, // tooltip显示内容
          this.labelsList, // 标签
          keyId, // keyId匹配颜色
          allData, // 所有数据
          yPartChild,
          this.format,
          this.click,
          this.id,
          this.shapeWidth,
          this.yAxisHeight,
          index,
          start
        );
      } else {
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
          this.xAxisPart, // 顶部X轴信息
          this.lineStyle,
          this.lineSize, // 线的粗细
          this.tooltipList, // tooltip显示内容
          this.labelsList, // 标签
          keyId, // 根据keyId来匹配颜色
          // this.partKey,
          allData, // 所有数据
          yPartChild,
          this.click,
          this.id,
          this.shapeWidth,
          this.yAxisHeight,
          index,
          start
        );
      }
      num = num + 1;
    }
  };

  render () {
  }
};
