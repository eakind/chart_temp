import Common from './common.js';
import { createRotatedContainer, createRotatedLeftAxis, createRotatedMiddle, createRotatedRightAxis } from './common/layoutUtils';
import { scaleBand, rotateScaleLinear, setScopeList, getScopeObj } from './common/scale';
import { initAxis } from './common/axisUtil';
import { createBottomAxis, setBottomAxisStyle } from './common/bottomAxisUtils';
import { createRotatedTopAxis, getTopTitle } from './common/topAxisUtils';
import { getMaxValue } from './common/yAxisDataUtils';
import { createRotatedYAxis, setYAxisStyle, createRotatedYGrid } from './common/yAxisUtils';
import { createRotatedPartTxt, createRotatedPartLine, initRotatedVerLine, drawRotatedBottomLine } from './common/partAxisUtils';
export default class RotatedBase extends Common {
  initShapeWidth () {
    // 计算中间画图区域的宽度
    this.shapeWidth = this.height - (this.leftMaxWidth + this.rightMaxWidth);
    let len = this.xAxisList.length;
    let minWidth = 100; // 在标准跟适应高度模式下，单位最小宽度是300
    switch (this.fitModel) {
      case 'standard':
      case 'fitWidth':
        // 但单位宽度小于300时重新计算画图区域的宽度
        if (this.shapeWidth / len < minWidth) {
          this.shapeWidth = minWidth * len;
        }
        break;
    }
  };

  initHeightConfig () {
    let canvasNum = this.yAxis.length; // 一共有多少个画布
    this.canvasNum = canvasNum;
    if (this.isCombined) {
      // 条状图，画布高度等于宽度
      this.canvasHeight = this.width - 20;
      // 每个画布画图区域等于：画布高度- (底部坐标轴高度 + 顶部坐标轴高度) / 画布个数
      this.shapeHeight = (this.canvasHeight - (this.bottomAxisHeight)) / canvasNum;
    } else {
      // 条状图，画布高度等于宽度
      this.canvasHeight = Math.floor(this.width / canvasNum) - 20;
      this.shapeHeight = this.canvasHeight - (this.bottomAxisHeight); // + this.topAxisHeight);
    }
    // Y轴的高度 = 单个画布的高度 / 单个画布轴的个数
    this.yAxisHeight = this.shapeHeight / this.yAxisNum;
    // debugger;

    let minHeight = 200; // 单个画布轴的最小高度为300
    switch (this.fitModel) {
      case 'standard':
      case 'fitHeight':
        // 在标准跟适应宽度的模式下，单个画布的轴高度小于300时，重新计算各种高度
        if (this.yAxisHeight < minHeight) {
          this.yAxisHeight = minHeight;
          this.shapeHeight = minHeight * this.yAxisNum;
          if (this.isCombined) {
            this.canvasHeight = (this.shapeHeight * canvasNum) + (this.bottomAxisHeight); // + this.topAxisHeight);
          } else {
            this.canvasHeight = this.shapeHeight + (this.bottomAxisHeight); // + this.topAxisHeight);
          }
        }
        break;
    }
  };

  initCanvasContainer (index) {
    // 图表容器
    // let containerColor = filterColor(this.colorList, index);
    this.container = createRotatedContainer(this.id, this.canvasHeight, index, this.colorList, this.click);
    // 底部坐标轴容器
    this.leftAxis = createRotatedLeftAxis(this.container, this.leftMaxWidth, this.canvasHeight, index);
    // 中间画图部分容器
    this.middle = createRotatedMiddle(this.container, this.height, this.leftMaxWidth, this.rightMaxWidth, this.canvasHeight, this.shapeWidth, index);
    this.gridContainer = this.middle.append('g').attr('class', 'grid-container');
    this.barContainer = this.middle.append('g').attr('class', 'bar-container');
    this.labelContainer = this.middle.append('g').attr('class', 'label-container');
    // 顶部坐标轴容器
    this.rightAxis = createRotatedRightAxis(this.container, this.rightMaxWidth, this.canvasHeight, index);
  };

  createBottomAxis () {
    this.scaleX = scaleBand(this.xAxisList, this.shapeWidth);
    let height = this.bottomAxisHeight;
    let axis = initAxis(this.scaleX, 'bottom', null, null, true);
    let axisInstance = createBottomAxis(this.middle, axis, height, true);
    let topTitle = getTopTitle(this.xAxis, this.xAxisPart);
    setBottomAxisStyle(axisInstance, this.xAxis, this.scaleX.bandwidth(), this.shapeWidth, this.bottomAxisHeight, true, this.leftAxis, this.leftMaxWidth, topTitle);
  };

  createTopAxis (len) {
    if (!this.xPartList.length) return;
    createRotatedTopAxis(this.middle, this.canvasHeight, this.bottomAxisHeight, this.scaleX.bandwidth(), this.xPartList, this.xAxisPart[0]);
  }

  // 创建Y轴跟画图
  createYAxisCanvas (yAxisChild, index, len) {
    if (this.yPartList.length) {
      // 如果有多Y轴
      this.createPartAxisCanvas(this.yAxisPart[0], yAxisChild, index, len);
      return;
    }
    // 初始化单个画布的Y轴信息
    this.createAxisAndDraw(yAxisChild, index, 0, null, len);
  };

  // 创建合并坐标轴画布
  createCombined (yAxisChild, index, len) {
    if (!this.yPartList.length) {
      if (index !== 0) {
        drawRotatedBottomLine(this.middle, this.shapeWidth, this.yAxisHeight, this.bottomAxisHeight, index, yAxisChild[0]);
      }
      this.createAxisAndDraw(yAxisChild, index, index, null, len);
    } else {
      this.createPartAxisCanvas(this.yAxisPart[0], yAxisChild, index, len);
    }
  }

  createPartAxisCanvas (yAxisPartChild, yAxisChild, index, len) {
    let leftPart = this.leftAxis.append('g').attr('class', 'right-part');
    // let { style } = yAxisPartChild.title;
    let start = 0;
    let isLast = false;
    let partList = this.yPartList[index];
    for (let i = 0, partLen = partList.length; i < partLen; i++) {
      if (i > 0) start = start + partList[i - 1].len;
      if (i === partLen - 1) isLast = true;
      this.initRightPart(leftPart, partList[i], 0, start, yAxisPartChild, isLast, yAxisChild, index, partList.length - 1);
    }
  };

  initRightPart (leftPart, yPartChild, index, start, yAxisPartChild, isLast, yAxisChild, parentIndex, len) {
    let width = this.isMobile ? index * 50 + 50 : index * 40 + 20;
    let yAxisHeight = this.yAxisHeight;
    let shapeHeight = this.shapeHeight;
    if (this.isCombined) {
      yAxisHeight = yAxisHeight * this.canvasNum;
      shapeHeight = this.canvasHeight;
    }
    createRotatedPartTxt(leftPart, yPartChild, yAxisPartChild, yAxisHeight, this.bottomAxisHeight, width, start);
    createRotatedPartLine(leftPart, yPartChild, yAxisHeight, this.bottomAxisHeight, width, this.shapeWidth, start, isLast, yAxisPartChild);
    if (yPartChild.children.length) {
      initRotatedVerLine(leftPart, width, shapeHeight, this.bottomAxisHeight, yAxisPartChild);
      let list = yPartChild.children;
      let childStart = start;
      let childIsLast = false;
      for (let i = 0, len = list.length; i < len; i++) {
        if (i > 0) childStart = childStart + list[i - 1].len;
        if (i === len - 1) childIsLast = true;
        this.initRightPart(leftPart, list[i], index + 1, childStart, yAxisPartChild, childIsLast, yAxisChild, parentIndex, len);
      }
    } else {
      if (this.isCombined) {
        start = start * this.canvasNum + parentIndex;
      }
      if (start !== 0) drawRotatedBottomLine(this.middle, this.shapeWidth, this.yAxisHeight, this.bottomAxisHeight, start, yAxisPartChild);
      this.createAxisAndDraw(yAxisChild, parentIndex, start, yPartChild, len);
    }
  };

  createAxisAndDraw (yAxisChild, index, start, yPartChild, len) {
    let isLast = start === len;
    for (let i = 0, yLen = yAxisChild.length; i < yLen; i++) {
      let position = yAxisChild[i].position;
      let left = 0;
      if (i !== 0) left = yAxisChild[i - 1].key.length;
      let scopeObj = getScopeObj(this.scopeList, yAxisChild[i]);
      let maxValue = 0;
      let minValue = 0;
      let counts = 0;
      let { max, min } = getMaxValue(
        yAxisChild[i],
        this.xAxis.key,
        this.colorList,
        index,
        left,
        [],
        this.xAxisPart,
        this.chartType,
        this.xPartList
      );
      maxValue = max * 1.1;
      minValue = min * 1.1;
      if (scopeObj.select === 3 && scopeObj.range) {
        maxValue = scopeObj.range[1];
        minValue = scopeObj.range[0];
        counts = scopeObj.counts;
      }
      if ((scopeObj.select === 0 || scopeObj.select === 1) && scopeObj.align) {
        let child = yAxisChild[i === 1 ? 0 : 1];
        if (child) {
          let { max, min } = getMaxValue(
            child,
            this.xAxis.key,
            this.colorList,
            index,
            left,
            [],
            this.xAxisPart,
            this.chartType,
            this.xPartList
          );
          max = max * 1.1;
          min = min * 1.1;
          if ((minValue < 0) || (min < 0)) {
            let max = Math.max(Math.abs(minValue), Math.abs(maxValue));
            maxValue = Math.max(max, maxValue);
            minValue = -maxValue;
          }
        }
        if (scopeObj.zoom !== 1) {
          let zoom = scopeObj.zoom || 1;
          maxValue = maxValue / zoom;
          minValue = minValue / zoom;
          // maxValue = maxValue / zoom;
          // minValue = minValue - (maxValue) / zoom + maxValue;
          // if (maxValue <= 0) {
          //   minValue = minValue / zoom;
          // }
        }
      }
      if (scopeObj.select === 2) {
        let child = yAxisChild[i === 1 ? 0 : 1];
        if (child) {
          let { max, min } = getMaxValue(
            child,
            this.xAxis.key,
            this.colorList,
            index,
            left,
            [],
            this.xAxisPart,
            this.chartType,
            this.xPartList
          );
          max = max * 1.1;
          min = min * 1.1;
          maxValue = Math.max(maxValue, max);
          minValue = Math.min(minValue, min);
        };
      }
      let { scaleY, scaleY1 } = rotateScaleLinear(minValue, maxValue, this.yAxisHeight, scopeObj.select);
      let axis = initAxis(scaleY, position, this.yAxisHeight, counts, true);
      setScopeList(scaleY1, scopeObj, yAxisChild[i]);
      let width = this[`${position}MaxWidth`]; // 坐标轴容器的宽度
      let translateX = position === 'right' ? 0 : width - 1;
      let bottomAxisHeight = this.bottomAxisHeight + this.yAxisHeight * start;
      createRotatedYGrid(this.gridContainer, axis, position, bottomAxisHeight, this.shapeWidth, yAxisChild[i]);
      let axisInstance = createRotatedYAxis(this[`${position}Axis`], axis, bottomAxisHeight, translateX, this.id);
      let labelWidth = this[`${position}LabelWidth`];
      setYAxisStyle(
        axisInstance,
        yAxisChild[i],
        width,
        this.shapeHeight,
        this.leftLabelWidth,
        this[`${position}TitleWidth`],
        this.format,
        labelWidth,
        start,
        true,
        isLast,
        this.yAxisHeight,
        this.isCombined
      );
      this.drawCanvas(yAxisChild, yAxisChild[i], scaleY, i, index, start, yPartChild);
    }
  };
};
