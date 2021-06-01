import { getToTalBar } from './common/utils';
import { drawBarShape } from './shape/barShape';
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
    let num = index !== 0 ? yAxis[index - 1].key.length : 0;
    let height = this.yAxisHeight * (start + 1);
    let topAxisHeight = this.topAxisHeight + (height - this.yAxisHeight) - this.xAxis.line.style.lineWidth / 2;
    for (let i = 0; i < keyArr.length; i++) {
      let keyId = `${parentIndex}-${num}`;
      let allData = JSON.parse(JSON.stringify(data[i]));
      let drawData = JSON.parse(JSON.stringify(data[i]));
      if (yPartChild) {
        drawData = yPartChild.allDataObj[yAxisChild.position][i];
      }
      drawBarShape(
        this.middle, // 整个图形容器
        this.barContainer, // 当前图形容器
        this.labelContainer, // 标签容器
        drawData, // 数据
        scaleY, // Y轴刻度
        bandwidth, // x轴间隔
        height, // 轴高度
        topAxisHeight, // 顶部间隔
        num, // 第几个柱子
        total, // 总共多少个柱子
        keyArr[i], // 坐标关键字
        this.colorList, // 颜色列表
        this.xAxisList, // X轴数组
        this.xAxis, // X轴信息
        this.xAxisPart, // 顶部X轴的信息
        this.size, // 柱子大小
        this.tooltipList, // tooltip显示内容
        this.labelsList,
        keyId, // keyId匹配颜色
        allData, // 所有数据
        yPartChild,
        this.format, // 格式
        this.click,
        this.id, // 画布id
        this.shapeWidth,
        this.yAxisHeight,
        index,
        start
      );
      num = num + 1;
    }
  };

  render () {
  }
};
