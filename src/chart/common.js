import { setBottomLabelWidth, getTopAxisHeight, setTitleHeight, setContainer, removeContainer, getTxtWidth, getTxtHeight } from './common/containerUtils';
import { setXAxisPartList } from './common/xAxisDataUtils';
import { setYAxisPartList } from './common/yAxisDataUtils';
import { initTooltip, hideTooltip } from './shape/tooltip';
export default class Common {
  initData (config) {
    this.id = config.id; // 容器ID
    this.xAxis = config.xAxis[0] || {}; // 底部X轴参数
    this.xAxisPart = config.xAxisPart || []; // 顶部X轴参数
    this.yAxis = config.yAxis || []; // Y轴参数
    this.yAxisPart = config.yAxisPart || []; // 左侧多Y轴参数
    this.isCombined = config.isCombined; // 是否合并坐标轴
    this.colorList = config.colorList || []; // 颜色列表
    this.scopeList = config.scopeList || []; // 刻度列表
    this.labelsList = config.labelsList || []; // 标签列表
    this.tooltipList = config.tooltipList || []; // tooltip列表
    this.scopeList = config.scopeList || []; // scopeList
    this.size = (config.size || 50) / 100; // 柱图大小
    this.lineSize = (config.lineSize || 50) / 100;
    this.lineStyle = config.lineStyle; // 线图中，线点的样式
    this.hasUnit = config.hasUnit; // Y轴是否使用单位
    this.fitModel = config.fitModel; // 视图模式
    this.dpr = config.dpr || 1;
    let { width, height } = setContainer(this.id, this.isRotated, this.dpr); // 设置容器宽高，并返回宽高值
    this.width = width; // 容器的宽度
    this.height = height; // 容器的高度
    this.format = config.hasUnit ? d3.format('.3s') : d3.format('.3r'); // 显示格式
    this.zoom = config.zoom ? config.zoom : 1; // 缩放倍数
    this.chartContainer = d3.select(`#${this.id}`);
    this.isMobile = config.isMobile;
    this.click = config.click || function () {};
  };

  init () {
    // 初始化X轴信息
    this.initXAxisConfig();
    // 初始化宽度信息
    this.initWidthConfig();
    // 初始化高度信息
    this.initHeightConfig();
    // 初始化tooltip
    this.tooltip = initTooltip();
    let dom = document.body.querySelector('.dashboard-container');
    if (dom) {
      dom.addEventListener('scroll', hideTooltip);
      // setTimeout(() => {
      //   dom.removeEventListener('scroll', hideTooltip);
      // }, 1500);
    }
    if (this.isCombined) {
      // 创建合并坐标轴画布
      this.initCombined();
    } else {
      // 创建单个画布
      this.initCanvas();
    };
  };

  initXAxisConfig () {
    if (!this.yAxis.length) return;
    // 获取data数据
    let data = [];
    for (let i = 0; i < this.yAxis.length; i++) {
      for (let j = 0; j < this.yAxis[i].length; j++) {
        let arr = this.yAxis[i][j].data;
        if (arr.length) {
          data = arr;
        };
      }
    }
    // 获取X轴的数据
    let { xAxisList, maxXAxisLen, xPartList } = setXAxisPartList(this.xAxisPart, this.xAxis.key, data[0]);
    // 底部X轴列表
    this.xAxisList = xAxisList;
    // 顶部X轴列表
    this.xPartList = xPartList;
    // 顶部最后一个key
    // this.partKey = partKey;
    // X轴坐标标签的高度
    let width = this.isRotated ? this.height : this.width;
    let labelHeight = setBottomLabelWidth(this.xAxis, maxXAxisLen, this.isRotated, this.xAxisList, this.fitModel, width);
    // X轴坐标标题的高度
    let titleHeight = setTitleHeight(this.xAxis);
    // 底部坐标轴高度
    this.bottomAxisHeight = labelHeight + titleHeight + 20; // 预留滚动条的空间
    // 顶部坐标轴高度
    this.topAxisHeight = getTopAxisHeight(this.xAxisPart, this.isMobile);
    if (this.isRotated) {
      this.bottomAxisHeight = this.topAxisHeight + this.bottomAxisHeight;
    }
  };

  initWidthConfig () {
    /*
      leftMaxValue: 左边坐标轴最大值 yPartList: 左边坐标轴列表 rightMaxValue: 右边坐标轴最大值 yAxisNum: 左侧y轴个数
    */
    let {
      leftMaxValue,
      leftMinValue,
      rightMaxValue,
      rightMinValue,
      yPartList,
      yAxisNum
    } = setYAxisPartList(
      this.yAxisPart,
      this.yAxis,
      this.xAxis.key,
      this.colorList,
      this.xAxisList,
      this.xAxisPart,
      this.chartType,
      this.xPartList
    );
    let { title, label } = this.yAxis[0][0];
    // 左轴的最大值、最小值、宽度
    this.leftMaxValue = leftMaxValue;
    this.leftMinValue = leftMinValue;
    if (this.hasUnit) {
      leftMaxValue = this.format(leftMaxValue);
    } else {
      if (leftMaxValue < 1) {
        let arr = String(leftMaxValue).split('.')[1].split('');
        let index = 0;
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] !== '0') {
            index = i;
            break;
          }
        }
        index = index + 5;
        leftMaxValue = leftMaxValue.toFixed(index);
      } else {
        leftMaxValue = Math.floor(leftMaxValue).toFixed(1);
      }
    }
    this.leftLabelWidth = getTxtWidth(String(leftMaxValue), label.style.fontSize || 12);
    this.leftTitleWidth = getTxtHeight(String(title.value), title.style.fontSize || 12);
    this.leftMaxWidth = this.leftLabelWidth; // 预留10像素的间隔
    if (title.show) {
      // 有标题时加上标题的宽度
      this.leftMaxWidth = this.leftMaxWidth + this.leftTitleWidth;
    }
    // 计算左侧顶部的坐标轴的区域
    let leftPartWidth = getTopAxisHeight(this.yAxisPart);
    this.leftMaxWidth = this.leftMaxWidth + leftPartWidth;

    // 右轴的最大值、最小值、宽度
    this.rightMaxWidth = 0;
    this.rightMaxValue = rightMaxValue;
    this.rightMinValue = rightMinValue;
    if (rightMaxValue !== rightMinValue) {
      if (this.hasUnit) {
        rightMaxValue = this.format(rightMaxValue);
      } else {
        if (rightMaxValue < 1) {
          let arr = String(rightMaxValue).split('.')[1].split('');
          let index = 0;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] !== '0') {
              index = i;
              break;
            }
          }
          index = index + 5;
          rightMaxValue = rightMaxValue.toFixed(index);
        } else {
          rightMaxValue = Math.floor(rightMaxValue).toFixed(1);
        }
      }
      this.rightLabelWidth = getTxtWidth(String(rightMaxValue), label.style.fontSize || 12);
      this.rightTitleWidth = getTxtHeight(String(title.value), title.style.fontSize || 12);
      this.rightMaxWidth = this.rightLabelWidth + 30; // 预留20像素的间隔
      if (title.show) {
        this.rightMaxWidth = this.rightMaxWidth + this.rightTitleWidth;// 跟title预留20像素间隔
      }
    } else {
      if (this.hasUnit) rightMaxValue = this.format(rightMaxValue);
    }

    // 左侧顶部的坐标轴数据
    this.yPartList = yPartList;
    // 单个画布轴的数量
    this.yAxisNum = yAxisNum;
    this.initShapeWidth();
  }

  initCanvas () {
    for (let i = 0, len = this.yAxis.length; i < len; i++) {
      // 初始化单个画布的容器
      this.initCanvasContainer(i);
      // 创建底部X轴
      this.createBottomAxis();
      // 创建顶部X轴
      this.createTopAxis(len);
      // 创建Y轴并画图
      this.createYAxisCanvas(this.yAxis[i], i, len);
      // this.container.call(this.initZoom(i));
    }
  };

  initCombined () {
    this.initCanvasContainer(0);
    this.createBottomAxis();
    this.createTopAxis();
    // this.initZoom(0);
    // this.container.call(this.initZoom());
    for (let i = 0, len = this.yAxis.length; i < len; i++) {
      this.createCombined(this.yAxis[i], i, len);
    }
  };

  initZoom (index) {
    // console.log(this.scopeList);
    // debugger;
    if (this.scopeList[0].select !== 1) return;
    let timer = null;
    let perValue = 0;
    let isAdd = false;
    let zoomHandler = d3.zoom().scaleExtent([0.1, 64])
      .on('zoom', () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        let currentY = d3.event.transform.y;
        if (perValue > currentY) {
          isAdd = true;
        } else {
          isAdd = false;
        }
        perValue = currentY;
        timer = setTimeout(() => {
          if (isAdd) {
            this.zoom = this.zoom / 2;
          } else {
            this.zoom = this.zoom * 2;
          }
          removeContainer(this.id);
          this.init();
        }, 100);
      });
    return zoomHandler;
  }

  // 返回颜色列表
  getColorList () {
    return this.colorList;
  };

  // 返回刻度值列表
  getDomain () {
    return this.scopeList;
  };
};
