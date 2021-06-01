import Common from './common.js';
import { getMaxValue } from './common/yAxisDataUtils';
import { scaleBand, scaleLinear, setScopeList, getScopeObj } from './common/scale';
import { initAxis } from './common/axisUtil';
import { createBottomAxis, setBottomAxisStyle } from './common/bottomAxisUtils';
import { createTopAxis, getTopTitle } from './common/topAxisUtils';
import { createPartTxt, createPartLine, initVerLine, drawBottomLine } from './common/partAxisUtils';
import { createYAxis, setYAxisStyle, createYGrid } from './common/yAxisUtils';
import { createContainer, createLeftAxis, createMiddle, createRightAxis } from './common/layoutUtils';
export default class Base extends Common {
  initShapeWidth () {
    // 计算中间画图区域的宽度
    this.shapeWidth = this.width - (this.leftMaxWidth + this.rightMaxWidth);
    let len = this.xAxisList.length;
    let minWidth = this.isMoblie ? 240 : 120; // 在标准跟适应高度模式下，单位最小宽度
    switch (this.fitModel) {
      case 'standard':
      case 'fitHeight':
        // 但单位宽度小于300时重新计算画图区域的宽度
        if (this.shapeWidth / len < minWidth) {
          this.shapeWidth = minWidth * len;
        }
        break;
    }
  }

  initHeightConfig () {
    // canvasHeight为画布高度，因为canvasWidth总是跟width相等所以不定义，高度计算区分合并坐标轴跟不合并坐标轴两种情况
    let canvasNum = this.yAxis.length; // 一共有多少个画布
    this.canvasNum = canvasNum;
    if (this.isCombined) {
      this.canvasHeight = this.height;
      // 每个画布画图区域等于：画布高度- (底部坐标轴高度 + 顶部坐标轴高度) / 画布个数
      this.shapeHeight = (this.canvasHeight - (this.bottomAxisHeight + this.topAxisHeight)) / canvasNum;
    } else {
      this.canvasHeight = Math.floor(this.height / canvasNum);
      this.shapeHeight = this.canvasHeight - (this.bottomAxisHeight + this.topAxisHeight);
    }
    // Y轴的高度 = 单个画布的高度 / 单个画布轴的个数
    this.yAxisHeight = this.shapeHeight / this.yAxisNum;

    let minHeight = this.isMobile ? 300 : 240; // 单个画布轴的最小高度
    switch (this.fitModel) {
      case 'standard':
      case 'fitWidth':
        // 在标准跟适应宽度的模式下，单个画布的轴高度小于300时，重新计算各种高度
        if (this.yAxisHeight < minHeight) {
          this.yAxisHeight = minHeight;
          this.shapeHeight = minHeight * this.yAxisNum;
          if (this.isCombined) {
            this.canvasHeight = (this.shapeHeight * canvasNum) + (this.bottomAxisHeight + this.topAxisHeight);
          } else {
            this.canvasHeight = this.shapeHeight + (this.bottomAxisHeight + this.topAxisHeight);
          }
        }
        break;
    }
  }

  // 初始化单个画布容器
  initCanvasContainer (index) {
    // 图表容器
    this.container = createContainer(this.id, this.canvasHeight, index, this.colorList, this.click);
    // 左侧容器
    this.leftAxis = createLeftAxis(this.container, this.leftMaxWidth, this.canvasHeight, index);
    // 中间画图部分
    this.middle = createMiddle(this.container, this.shapeWidth, this.canvasHeight, index);
    this.gridContainer = this.middle.append('g').attr('class', 'grid-container');
    this.barContainer = this.middle.append('g').attr('class', 'bar-container');
    this.lineContainer = this.middle.append('g').attr('class', 'line-container');
    this.labelContainer = this.middle.append('g').attr('class', 'label-container');
    // 右侧坐标轴容器
    this.rightAxis = createRightAxis(this.container, this.rightMaxWidth, this.canvasHeight, index);
  }

  // 创建底部X轴
  createBottomAxis () {
    this.scaleX = scaleBand(this.xAxisList, this.shapeWidth);
    let height = this.shapeHeight;
    if (this.isCombined) {
      // 合并坐标轴的高度 = 单个画布的高度 * 画布个数
      height = height * this.canvasNum;
    }
    height = height + this.topAxisHeight;
    let axis = initAxis(this.scaleX, 'bottom');
    let axisInstance = createBottomAxis(this.middle, axis, height);
    setBottomAxisStyle(axisInstance, this.xAxis, this.scaleX.bandwidth(), this.shapeWidth, this.bottomAxisHeight);
  };

  // 创建顶部X轴
  createTopAxis () {
    if (!this.xPartList.length) return;
    let topTitle = getTopTitle(this.xAxis, this.xAxisPart);
    createTopAxis(this.middle, this.canvasHeight, this.shapeWidth, this.scaleX.bandwidth(), this.xPartList, this.xAxisPart, topTitle, this.isMobile);
  };

  // 创建Y轴跟画图
  createYAxisCanvas (yAxisChild, index) {
    if (this.yPartList.length) {
      // 如果有多Y轴
      this.createPartAxisCanvas(this.yAxisPart[0], yAxisChild, index);
      return;
    }
    // 初始化单个画布的Y轴信息
    this.createAxisAndDraw(yAxisChild, index, 0, null);
  };

  // 创建合并坐标轴画布
  createCombined (yAxisChild, index) {
    if (!this.yPartList.length) {
      if (index !== 0) {
        drawBottomLine(this.middle, this.shapeWidth, this.yAxisHeight, this.topAxisHeight, index, this.xAxis);
      }
      this.createAxisAndDraw(yAxisChild, index, index, null);
    } else {
      this.createPartAxisCanvas(this.yAxisPart[0], yAxisChild, index);
    }
  }

  createPartAxisCanvas (yAxisPartChild, yAxisChild, index) {
    let leftPart = this.leftAxis.append('g').attr('class', 'left-part');
    let start = 0;
    let isLast = false;
    let partList = this.yPartList[index];
    for (let i = 0, partLen = partList.length; i < partLen; i++) {
      if (i > 0) start = start + partList[i - 1].len;
      if (i === partLen - 1) isLast = true;
      this.initLeftPart(leftPart, partList[i], 0, start, yAxisPartChild, isLast, yAxisChild, index);
    }
  };

  initLeftPart (leftPart, yPartChild, index, start, yAxisPartChild, isLast, yAxisChild, parentIndex) {
    let width = index * 40 + 20;
    let yAxisHeight = this.yAxisHeight;
    let shapeHeight = this.shapeHeight;
    if (this.isCombined) {
      yAxisHeight = yAxisHeight * this.canvasNum;
      shapeHeight = this.canvasHeight;
    }
    createPartTxt(leftPart, yPartChild, yAxisPartChild, yAxisHeight, this.topAxisHeight, width, start);
    createPartLine(leftPart, yPartChild, yAxisPartChild, yAxisHeight, this.topAxisHeight, width, this.shapeWidth, start, isLast);
    if (yPartChild.children.length) {
      initVerLine(leftPart, width, shapeHeight, this.topAxisHeight, yAxisPartChild);
      let list = yPartChild.children;
      let childStart = start;
      let childIsLast = false;
      for (let i = 0, len = list.length; i < len; i++) {
        if (i > 0) childStart = childStart + list[i - 1].len;
        if (i === len - 1) childIsLast = true;
        this.initLeftPart(leftPart, list[i], index + 1, childStart, yAxisPartChild, childIsLast, yAxisChild, parentIndex);
      }
    } else {
      if (this.isCombined) {
        start = start * this.canvasNum + parentIndex;
      }
      if (start !== 0) drawBottomLine(this.middle, this.shapeWidth, this.yAxisHeight, this.topAxisHeight, start, this.xAxis);
      this.createAxisAndDraw(yAxisChild, parentIndex, start, yPartChild);
    }
  };

  createAxisAndDraw (yAxisChild, index, start, yPartChild) {
    for (let i = 0, yLen = yAxisChild.length; i < yLen; i++) {
      if (!yAxisChild[i].data.length) continue;
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
      let { scaleY, scaleY1 } = scaleLinear(minValue, maxValue, this.yAxisHeight, scopeObj.select);
      let axis = initAxis(scaleY, position, this.yAxisHeight, counts);
      setScopeList(scaleY1, scopeObj);
      let width = this[`${position}MaxWidth`]; // 坐标轴容器的宽度
      let translateX = position === 'left' ? width - 1 : 0;
      let topAxisHeight = this.topAxisHeight + this.yAxisHeight * start;
      createYGrid(this.gridContainer, axis, position, topAxisHeight, this.shapeWidth, yAxisChild[i]);
      let axisInstance = createYAxis(this[`${position}Axis`], axis, topAxisHeight, translateX);
      let labelWidth = this[`${position}LabelWidth`];
      setYAxisStyle(
        axisInstance,
        yAxisChild[i],
        width,
        this[`${position}LabelWidth`],
        this[`${position}TitleWidth`],
        this.shapeWidth,
        this.format,
        labelWidth,
        start,
        false,
        false,
        this.yAxisHeight
      );
      this.drawCanvas(yAxisChild, yAxisChild[i], scaleY, i, index, start, yPartChild);
    }
  };
};
