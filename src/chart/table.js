/* eslint-disable */
// import Chart from '../Chart.js';
import { notEmpty, isDefined, isEmpty, isMobile, isNumber, isArray } from '../utils/check.js';
// import CLASS from '../Classes.js';
import {
  dataProcess, hexToRgba
} from '../utils/utils.js';

export default class Table {
  constructor (data, config) {
    this.data = data;
    this.config =config;
    this.userDefined_colorRange = [];
  };
  render () {
    let tableHandle = init.call(this, this.data, this.config);
    tableHandle.drawTable();
  }

  getColorList() {
    let config = this.config;
    let y_colored = [];
    let colorRange = notEmpty(config.data.range.color) ? config.data.range.color[0] : []
    let colored_feature = config.data.colored.feature,
      colored_type = config.data.colored.type,
      keys = [];
    keys = isDefined(colored_feature)
      ? (this.data.map((d) => d[colored_feature]))
      : [];
    keys = Array.from(new Set(keys));
    if(isEmpty(keys)) return;

    let dataRange;

    y_colored = d3.extent((this.data).map((d) => d[colored_feature]));

    dataRange = JSON.parse(JSON.stringify(y_colored));
    if(isDefined(colorRange[0]) && colorRange[0] !== null) y_colored[0] = Number(colorRange[0])
    if(isDefined(colorRange[1]) && colorRange[1] !== null) y_colored[1] = Number(colorRange[1])
    let min = isDefined(y_colored[0]) ? y_colored[0] : 0;
    let max = isDefined(y_colored[1]) ? y_colored[1] : min;
    let userColorRange = [min, max];

    let list = []
    let axis_format = d3.format(".3s");
    // dataRange = [axis_format(dataRange[0]), axis_format(dataRange[1])]
    if(colored_type === 'linear') {
      list = d3.extent(keys).map((d, i) => {
        let format_val = axis_format(userColorRange[i])
        return {
          val: format_val, 
          color: this.getColor(d),
          unique: format_val,
          index: i, 
          originalVal: d, 
          rangeType: i > 0 ? 'max' : 'min'
        }
      })
    } else {
      list = keys.map((d, i) => {
        return {
          val: d, 
          color: this.getColor(d), 
          fill: isFunction(pattern_function) ? pattern_function(d) : '',
          unique: d,
          index: i, 
          className: `mc-element mc-element-${i}`,
        }
      })
    }
    let colorObj = {
      id: config.bindto,
      aggr: colored_feature,
      name: colored_feature,
      colored_type: colored_type,
      key: `${colored_feature}`,
      key_id: '0-0',
      type: colored_type === 'linear' ? 'linear' : type || '',
      showRange: colored_type === 'linear',
      list: list,
      opacity: config.color.opacity[0] * 100 || 100,
      dataRange: dataRange
    }

    let scheme = config.color.schemes[0]
    if(isEmpty(scheme)) {
      let colorLinear = ['#7AC9F5', '#2A5783'];
      let colorSchemes = ['#4284F5', '#03B98C', '#FACC14', '#F5282D', '#8543E0', '#3FAECC', '#3110D0', '#E88F00', '#DE2393', '#91BA38','#99B4BF', '#216A58', '#AB9438', '#F4999B', '#C9BFE1', '#055166', '#1F135A', '#43140A', '#96005A', '#8D8D8D']
      scheme = colored_type === 'linear' ? colorLinear : colorSchemes
    }

    let colorList = config.color.colors[0]
    if(isEmpty(colorList)) {
      if(colored_type === 'linear') {
        colorList = list.map(l => l.color)
      } else {
        colorList = {}
        list.forEach(l => {
          colorList[l.val] = l.color
        })
      }
    }

    let patternList = config.color.patterns[0]
    if(isEmpty(patternList)) {
      patternList = {}
      list.forEach(l => {
        patternList[l.val] = l.fill
      })
    }

    colorObj.schemes = scheme
    colorObj.colors = colorList
    colorObj.patterns = patternList

    return colorObj;
    // $$.modifyColorList({
    //   colored_type: colored_type,
    //   colored_feature: colored_feature,
    //   keys: keys,
    // });
  }

  getColor (value) {
    let config = this.config;
    let tableData = this.data;
    if (notEmpty(value)) {
      let y_colored = [];
      let colorRange = notEmpty(config.data.range.color) ? config.data.range.color[0] : [],
        color_schemes = ['#7AC9F5', '#2A5783'],
        colors = (notEmpty(config.color.colors) && config.color.colors[0]) ? config.color.colors[0] : [],
        colored_type = config.data.colored.type,
        colored_feature = config.data.colored.feature;
      let pattern = d3.scaleOrdinal(color_schemes).range(); //d3.schemeSet3, schemeCategory10
      y_colored = d3.extent((tableData).map((d) => d[colored_feature]));
      if(isDefined(colorRange[0]) && colorRange[0] !== null) y_colored[0] = Number(colorRange[0])
      if(isDefined(colorRange[1]) && colorRange[1] !== null) y_colored[1] = Number(colorRange[1])

      let min = isDefined(y_colored[0]) ? y_colored[0] : 0;
      let max = isDefined(y_colored[1]) ? y_colored[1] : min;

      this.userDefined_colorRange = [min, max];

      let linear_colors = color_schemes, count = 0;

      if(isArray(colors) && notEmpty(colors)) linear_colors = colors

      pattern = d3.scaleLinear().range(linear_colors).domain([min, max]).clamp(true);
      let color = pattern(value);
      return color;
    }
  }
}

const init = function (tableData, tableConfig) {
  let self = this;
  const $$ = this;
  const config = tableConfig;
  let colored_feature = config.data.colored.feature,
    colored_type = config.data.colored.type,
    data = [],
    keys = [];

  let table_padding = config.table.padding;
  let table_body = config.table.body;
  let table_padding_left = table_padding.left,
      table_padding_right = table_padding.right,
      table_padding_top = table_padding.top,
      table_padding_bottom = table_padding.bottom,
      table_body_width = table_body.width,
      table_body_height = table_body.height,
      cellBorderWidth = config.table.inner.width,
      headBorderWidth = config.table.outter.width,
      outerBorderColor = config.table.outter.color,
      innerBorderColor = config.table.inner.color,
      tableTitle = config.table.title,
      labelList = config.label.format,
      labels = config.data.labeled;

  if(isEmpty(labels)) {
    const x_aggressions = config.data.column.aggressions
    const y_aggressions = config.data.row.aggressions
    labels = notEmpty(x_aggressions) ? x_aggressions : notEmpty(y_aggressions) ? y_aggressions : []
  }

  // let {
  //   table_padding_left,
  //   table_padding_right,
  //   table_padding_top,
  //   table_padding_bottom,
  //   table_body_width,
  //   table_body_height,
  //   table_title: tableTitle,
  // } = config;
  let paddingLeft = Number(table_padding_left),
    paddingRight = Number(table_padding_right),
    paddingTop = Number(table_padding_top),
    paddingBottom = Number(table_padding_bottom);
  let width = Number(table_body_width) + paddingLeft + paddingRight;

  let height = Number(table_body_height) + paddingTop + paddingBottom;
  let globalFontsize = 12
  if (isMobile()) {
    height = height * config.dpr;
    width = width * config.dpr;
    globalFontsize = globalFontsize * config.dpr;
  }
  // $$.color = $$.generateColor();

  let mode = config.table.mode;

  let maxHeight = d3.max(tableTitle, function (d) {
    return Math.max(Number(d.style['line-height']));
  });

  let titleKey = config.data.column.categories.join(' / ');
  let getTitleMatch = tableTitle.find((i) => i.key === titleKey);
  let titleMatch;
  if (getTitleMatch) {
    titleMatch = JSON.parse(JSON.stringify(tableTitle.find((i) => i.key === titleKey)));
  }
  // let titleMatch = JSON.parse(JSON.stringify(tableTitle.find((i) => i.key === titleKey)));
  let titleStyle = {
		align: 'left',
    fontSize: globalFontsize,
    fontColor: '',
    fontStyle: 'normal',
    decoration: '',
    letterSpacing: '',
    lineHeight: '16.5',
    display: 'auto'
    // 'fill': "#6B6B6B",
    // 'font-size': globalFontsize,
    // 'font-style': "normal",
    // 'letter-spacing': "0",
    // 'line-height': globalFontsize,
    // 'text-align': "left",
    // 'text-decoration': "",
    // display: 'auto',
	};
  let titleShow = config.data.column.categories.length > 0;
  if (titleMatch) {
    titleStyle = titleMatch.style;
    titleShow = titleMatch.show;
    titleStyle.color = titleStyle.fill;
  } else {
    titleStyle.color = config.font.color;
  }
  // titleStyle.lineHeight = Number(titleStyle['line-height']) + 16;
  if (titleMatch) {
    titleStyle.lineHeight = Number(titleStyle['line-height']) + 16;
  } else {
    titleStyle.lineHeight = Number(titleStyle.lineHeight) + 16;
  }
  if (isMobile()) {
    titleStyle.padding = 24;
    if (titleMatch) {
      titleStyle['font-size'] = titleStyle['font-size'] * config.dpr;
      titleStyle['line-height'] = Number(titleStyle['line-height'] * config.dpr) + 16;
    } else {
      titleStyle['font-size'] = titleStyle.fontSize;
      titleStyle['line-height'] = Number(titleStyle.lineHeight * config.dpr) + 16;
    }
  }
  let aggShow = false;

  let mobileTooltipTimer = null;

  let drawTable = function () {
    //获取标签样式
    // $$.getLabelStyleList();

    var minRowHeight = 24;
    var currentRowHeight = height;
    // let formatList = $$.label_format_list;
    let formatList = [];
    let tooltipText = config.tooltip.text;
    let tooltipFormat = config.tooltip.format;
    let rowAggression = isEmpty(config.data.row.aggressions)
      ? isEmpty(config.data.labeled)
        ? []
        : config.data.labeled
      : config.data.row.aggressions;
    let columnAggression = config.data.column.aggressions;

    let aggMatchLen = 0;
    let singleHeadFlag = false;

    let currentOpacity = '';
    if (config.targetAction) {
      currentOpacity = '20%';
    }
    // let aggHeadHideLen = columnAggression.filter(i => {
    //   let match = tableTitle.find(m => m.key === i);
    //   return match && !match.show
    // }).length
    // let hideHeadFlag = aggHeadHideLen === columnAggression.length
    isAggShow();
    if (!aggShow) {
      aggShow = aggMatchLen < rowAggression.length; // 说明会显示
    }
    let titleFlag =
      isEmpty(config.data.row.categories) &&
      isEmpty(config.data.column.categories) &&
      isEmpty(config.data.column.aggressions);

    //将列和数据赋给gridOptions
    let colorFeature = config.data.colored.feature;
    let start = new Date().getTime();
    let columns = initColumns();
    let gridData = initData();
    // console.log('数据处理时间:', new Date().getTime() - start);
    // console.log(gridData);
    // console.log(columns);
    // let startRender = new Date().getTime();
    var gridOptions = initConfig();

    // var minRowHeight = 30;
    // var currentRowHeight;
    var eGridDiv = document.querySelector(config.bindto);
    eGridDiv.innerHTML = '';
    if (!eGridDiv) {
      return;
    }
    let dom = document.querySelectorAll(`.dc-chart`); //  //
    if (dom.length > 1) {
      dom = document.getElementById(config.bindto.slice(1));
    } else {
      dom = dom[0];
    }
    let { background: bgColor, index } = config.table.background;

    let backgroundRgba = hexToRgba(bgColor, (config.table.background.opacity || 100) / 100);

    let { cHeight, cWidth } = setWidthHeight();
    eGridDiv.style.border = headBorderWidth + 'px solid ' + outerBorderColor;
    eGridDiv.style.height = cHeight - headBorderWidth * 2 + 'px'; // cHeight - headBorderWidth * 2 + 'px';
    eGridDiv.style.width = cWidth;
    if (bgColor && bgColor.indexOf('/') > -1) {
      eGridDiv.style.background = 'inherit';
    } else {
      // eGridDiv.style.background = bgColor;
      eGridDiv.style.background = backgroundRgba;
      eGridDiv.style.opacity = config.table.background.opacity || 1;
    }

    eGridDiv.classList.add('ag-theme-balham');

    // document.addEventListener('DOMContentLoaded', function() {
    //   var eGridDiv = document.querySelector(config.bindto);
    //   eGridDiv.style.height='700px'
    //   new agGrid.Grid(eGridDiv, gridOptions);
    // });
    let startRender = new Date().getTime();
    new agGrid.Grid(eGridDiv, gridOptions);

    let currentDom = eGridDiv.parentElement;
    currentDom.addEventListener('click', (e) => {
      if (config.targetAction && config.targetAction[0].actionInfo) {
        delete config.targetAction[0].actionInfo;
      }
      let viewportDom = eGridDiv.querySelector('.ag-center-cols-viewport');
      if (!viewportDom.contains(e.target)) {
        if (isMobile()) {
          let tableBox = document.querySelector(`#${config.id}`);
          let mobileTooltipDom = tableBox.querySelector('#canvas_over');
          if (mobileTooltipDom) {
            tableBox.removeChild(mobileTooltipDom);
          }
          typeof config.data_click === 'function' &&
            config.data_click();
        }
        currentOpacity = '';
        gridOptions.api.redrawRows();
      }
    }); 

    function isAggShow () {
      rowAggression.forEach((i) => {
        let match = tableTitle.find((m) => m.key === i);
        if (match) {
          aggMatchLen++;
        }
        if (match && match.show) {
          aggShow = match.show;
        }
      });
    }

    function setWidthHeight () {
      if (!dom) {
        return {
          cWidth: config.size.width,
          cHeight: config.size.height,
        };
      }
      let cHeight = dom.clientHeight; // - 10;
      let cWidth = '100%';
      if (config.size_width) {
        cWidth = config.size.width + 'px'; //- 10
      }
      if (config.size.height) {
        cHeight = config.size.height; // - 10;
      }
      return {
        cWidth,
        cHeight
      };
    }

    function onFirstDataRendered (params) {
      if (this.onGridSizeChanged) {
        this.onGridSizeChanged(params);
      } else if (onGridSizeChanged) {
        onGridSizeChanged(params);
      }
    }

    function onGridSizeChanged (params) {
      // get the height of the grid body - this excludes the height of the headers
      if (!document.getElementsByClassName('ag-body-viewport')[0]) {
        return;
      }

      var gridHeight = document.getElementsByClassName('ag-body-viewport')[0]
        .offsetHeight;

      // get the rendered rows
      var renderedRows = params.api.getRenderedNodes();

      // if the rendered rows * min height is greater than available height, just just set the height
      // to the min and let the scrollbar do its thing
      if (renderedRows.length * minRowHeight >= gridHeight) {
        if (currentRowHeight !== minRowHeight) {
          currentRowHeight = minRowHeight;
          params.api.resetRowHeights();
        }
      } else {
        // set the height of the row to the grid height / number of rows available
        currentRowHeight = Math.floor(gridHeight / renderedRows.length);
        params.api.resetRowHeights();
      }
    }

    function getCurrentHeight (params) {
      var gridHeight = document.getElementsByClassName('ag-body-viewport')[0]
        .offsetHeight;
      var renderedRows = gridData.length;
      if (renderedRows * minRowHeight >= gridHeight) {
        if (currentRowHeight !== minRowHeight) {
          currentRowHeight = minRowHeight;
          params.api.resetRowHeights();
        }
      } else {
        // set the height of the row to the grid height / number of rows available
        currentRowHeight = Math.floor(gridHeight / renderedRows);
        params.api.resetRowHeights();
      }
    }

    function modifyHeight () {
      gridData.forEach((i) => {
        i.columnStyle.height = currentRowHeight;
        i.columnStyle.lineHeight = currentRowHeight + 'px';
      });
    }
    /**
     * 初始化config
     */
    function initConfig() {
      if (isMobile()) {
        maxHeight = maxHeight * config.dpr;
      }
      return {
        columnDefs: columns,
        // rowData: gridData,
        onGridReady: function (params) {
          if (mode === 'fitHeight' || mode === 'full') {
            getCurrentHeight(params);
            // 获取currentHeight
            modifyHeight();
          }

          let wrap = eGridDiv.querySelector(
            '.ag-theme-balham .ag-root-wrapper'
          );
          if (bgColor && bgColor.indexOf('/') > -1) {
            wrap.style.background = 'inherit';
          } else {
            wrap.style.background = backgroundRgba;
            wrap.style.opacity = config.table.background.opacity || 1;
          }

          let headDom = eGridDiv.querySelector('.ag-header');
          headDom.style.borderColor = innerBorderColor;
          headDom.style.borderWidth = cellBorderWidth + 'px';
          headDom.style.borderBottomWidth = cellBorderWidth + 'px';
          if (titleFlag) {
            headDom.style.display = 'none !important';
          }
          let noGroup = eGridDiv.querySelectorAll(
            '.ag-header-row .ag-header-group-cell-no-group'
          );
          noGroup.forEach((i) => {
            i.style.borderRight =
              cellBorderWidth + 'px solid ' + innerBorderColor;
          });

          let domHeight = cHeight || (dom && dom.clientHeight);
          let domWidth = dom && dom.clientWidth;
          let colLength = params.columnApi.getAllDisplayedColumns().length;
          // + (cellBorderWidth * colLength)
          let curWidth = colLength * width;
          let headCount =
            params.columnApi.columnController.primaryHeaderRowCount;
          let rowCount = gridData.length;
          // + (headCount + rowCount) * cellBorderWidth
          if (currentRowHeight === Infinity) {
            currentRowHeight = height;
          }
          let tempHeight =
            mode === 'fitHeight' || mode === 'full' ? currentRowHeight : height;
          let curHeight = singleHeadFlag
            ? rowCount * tempHeight
            : headCount * maxHeight + rowCount * tempHeight;
          let hBorderLen = 1; // (headCount + rowCount - 1) * cellBorderWidth;
          let lBorderLen = 1; // colLength * cellBorderWidth;
          if (mode === 'standard' || mode === 'fitHeight') {
            if (curWidth < domWidth) {
              if (curHeight < domHeight) {
                eGridDiv.style.width = curWidth + 'px';
                eGridDiv.style.height =
                  curHeight + headBorderWidth * 2 + hBorderLen + 'px';
                eGridDiv.querySelector('.ag-body-horizontal-scroll') &&
                  eGridDiv.querySelector('.ag-body-horizontal-scroll').remove();
              } else {
                eGridDiv.style.width =
                  curWidth + 10 + headBorderWidth * 2 + lBorderLen + 'px';
              }
            } else {
              eGridDiv.style.width = '100%';
              if (curHeight < domHeight) {
                eGridDiv.style.height =
                  curHeight + 10 + headBorderWidth * 2 + hBorderLen + 'px'; // 11
              }
            }
          }
          // if (mode === 'standard' || mode === 'fitHeight') {
          //   if (curWidth < domWidth) {
          //     eGridDiv.style.width = curWidth + 10 + 'px'
          //   } else {
          //     eGridDiv.style.width = '100%'
          //     //eGridDiv.style.height = config.size_height + 6 + 'px'
          //   }
          // }
          // mode === 'standard' ||
          if (mode === 'fitWidth') {
            if (curHeight < domHeight) {
              if (curWidth > domWidth) {
                eGridDiv.style.height =
                  curHeight + headBorderWidth * 2 + +lBorderLen + 'px'; // 10
              } else {
                eGridDiv.style.height =
                  curHeight + headBorderWidth * 2 + hBorderLen + 'px'; // 1
              }
            }
          }
          if (mode === 'full' || mode === 'fitWidth') {
            if (
              curHeight >
              domHeight - rowCount * cellBorderWidth - headBorderWidth * 2
            ) {
              eGridDiv.style.width = 'calc(100% - 10px)';
              // eGridDiv.style.width =
              //   config.size_width + headBorderWidth * 2 + lBorderLen + 'px';
            } else {
              eGridDiv.style.width = '100%';
              // eGridDiv.style.width =
              //   config.size_width + headBorderWidth * 2 + lBorderLen - 10 + 'px';
              if (mode === 'full') {
                eGridDiv.style.height =
                  curHeight +
                  (rowCount * cellBorderWidth) / 2 -
                  cellBorderWidth + 1 +
                  headBorderWidth * 2 +
                  'px';
              }

              eGridDiv.querySelector('.ag-body-horizontal-scroll') &&
                eGridDiv.querySelector('.ag-body-horizontal-scroll').remove();
            }
          }
          if (mode === 'full' || mode === 'fitWidth') {
            gridOptions.api.sizeColumnsToFit(); // 调整表格大小自适应
            if (
              curHeight >
              domHeight - rowCount * cellBorderWidth - headBorderWidth * 2
            ) {
              eGridDiv.style.width = '100%';
            }
          }
          if (isMobile()) {
            let colsClass = eGridDiv.querySelector('.ag-center-cols-viewport').getAttribute('class') + ' ' + 'ag-center-mobile-cols-viewport';
            eGridDiv.querySelector('.ag-center-cols-viewport').setAttribute('class', colsClass);
            // eGridDiv.querySelector('.ag-center-cols-viewport').style.overflow = 'auto !important';
          }

          gridOptions.api.setRowData(gridData);
          // console.log('数据加载时间:', new Date().getTime() - startRender);
        },
        onFirstDataRendered: onFirstDataRendered,
        onGridSizeChanged: onGridSizeChanged,
        defaultColDef: {
          editable: false, // 单元表格是否可编辑
          enableRowGroup: true,
          enablePivot: true,
          enableValue: true,
          color: config['font-color'],
          width: width,
          height: 30,
          'padding-left': table_padding_left,
          'padding-right': table_padding_right + 4,
          'padding-top': table_padding_top,
          'padding-bottom': table_padding_bottom,
          suppressMovable: true
        },
        suppressCellSelection: true,
        cellClass: 'no-border',
        headerHeight: titleFlag ? 0 : maxHeight,
        suppressRowTransform: true,
        suppressDragLeaveHidesColumns: true,
        tooltipShowDelay: 0,
        components: {
          showCellRenderer: createShowCellRenderer(),
          customTooltip: createTooltip(),
          agColumnHeader: createCustomHeader()
        },
        getRowStyle: function (params) {
          let style = {
            background: 'rgba(255, 255, 255, 0.3)'
          };
          if (params.node.rowIndex % 2 === 0) {
            style.background = 'rgba(255, 255, 255, 0.1)';
          }
          return style;
        },
        getRowHeight: function (params) {
          let tempHeight = height;
          tempHeight =
            (params.data.columnStyle &&
              Number(params.data.columnStyle.height)) ||
            30;
          if (mode === 'full' || mode === 'fitHeight') {
            return currentRowHeight || tempHeight;
          }
          return tempHeight;
        },
        onBodyScroll: function (params) {
          let { direction } = params;
          if (direction === 'horizontal') {
            let noGroup = eGridDiv.querySelectorAll(
              '.ag-header-row .ag-header-group-cell-no-group'
            );
            noGroup.forEach((i) => {
              i.style.borderRight =
                cellBorderWidth + 'px solid ' + innerBorderColor;
            });
            gridOptions.api.checkGridSize();
            gridOptions.api.doLayout();
          }
        }
      };
    }

    /**
     * 初始化data
     */
    function initData () {
      let resGridData = [];
      let resGridData1 = [];
      let rowCategory = config.data.row.categories;
      // 先考虑categories不存在
      if (isEmpty(rowCategory)) {
        // 行数据的第一列值就是rowAggression
        let curAgg = isEmpty(rowAggression) ? columnAggression : rowAggression;
        if (curAgg.length === 0) {
          return resGridData;
        }
        let obj1 = {};
        for (let i = 0; i < curAgg.length; i++) {
          let agg = curAgg[i];
          let obj = {};
          let matchAgg = tableTitle.find((m) => m.key === agg);
          if (!matchAgg) {
            obj.data_row_aggressions = agg;
          } else if (matchAgg && matchAgg.show) {
            obj.data_row_aggressions = matchAgg.title;
          }

          obj.columnStyle = returnColumnStyle(agg);
          obj1.columnStyle = obj.columnStyle;
          let match = formatList.find((i) => i.label_name === agg);
          tableData.map((row) => {
            if (row.hasOwnProperty(agg)) {
              Object.assign(obj, returnValue(row, agg, match));
              Object.assign(obj1, returnValue(row, agg, match));
            }
          });
          resGridData.push(obj);
        }
        resGridData1.push(obj1);
        if (isEmpty(rowAggression)) {
          return resGridData1;
        }
      } else {
        resGridData = getGridData(rowCategory);
      }

      return resGridData;
    }

    function returnColProp (i) {
      let prop = '';
      config.data.column.categories.forEach((c) => {
        prop += i[c] + '-';
      });
      if (prop) {
        prop = prop.substr(0, prop.length - 1);
      }
      return prop;
    }

    function returnColumnStyle (agg) {
      let match = formatList.find((i) => i.label_name === agg);
      let aggressionsList = config.data.row.aggressions.length > 0 
                              ? config.data.row.aggressions
                                : config.data.column.aggressions.length > 0
                                  ? config.data.column.aggressions
                                    : [];
      let tableLabel = (config.data.labeled && config.data.labeled.length > 0) ? config.data.labeled : aggressionsList;
      let aggIndex = tableLabel.indexOf(agg);
      let style = {
        align: 'left',
        fontSize: 12,
        fontColor: '#6b6b6b',
        fontStyle: 'normal',
        decoration: '',
        letterSpacing: '',
        lineHeight: '24'
      };
      let styleList;
      if (config.label.text && config.label.text.length > 0 && config.label.text[0].list && config.label.text[0].list.length > 0) {
        // style = config.label.text[0].list[0].format
        styleList = config.label.text[0].list;
      }
      let curStyle = (aggIndex < 0 || !styleList) ? null : styleList[aggIndex];
      if (curStyle) {
        style = curStyle.format;
      }
      if (match) {
        style = match.initLabelText.format;
      }
      let curDpr = 1;
      if (isMobile()) {
        curDpr = config.dpr;
      }
      let columnStyle = {
        textDecoration: style.decoration,
        color: style.setFlag ? style.fontColor : config.font.color,
        fontSize: (style.fontSize * curDpr) + 'px',
        fontStyle: style.fontStyle,
        letterSpacing: style.letterSpacing + 'px',
        paddingLeft: paddingLeft + 'px',
        paddingBottom: paddingBottom + 'px',
        paddingTop: paddingTop + 'px',
        paddingRight: paddingRight + 4 + 'px',
        // lineHeight: Number(style.lineHeight) + paddingBottom + paddingTop + 'px',
        textAlign: style.align
        // height: Number(style.lineHeight) + paddingBottom + paddingTop
      };

      if (mode === 'full' || mode === 'fitHeight') {
        if (currentRowHeight) {
          columnStyle.height = currentRowHeight;
          columnStyle.lineHeight = currentRowHeight + 'px';
        }
      } else {
        columnStyle.height =
          Number(style.lineHeight) + paddingBottom + paddingTop;
        if (isMobile()) {
          columnStyle.height = columnStyle.height * config.dpr;
        }
        if (paddingBottom === 0 && paddingTop === 0) {
          columnStyle.lineHeight = columnStyle.height + 'px';
        }
      }
      return columnStyle;
    }

    function returnValue (i, agg, match) {
      let obj = {};
      let colProp = returnColProp(i);
      if (columnAggression.length > 0) {
        colProp = colProp.length > 0 ? colProp + '-' + agg : agg;
      }
      let columnProp = colProp || 'singleHead';
      // 当前两个特征一样，一个添加了一些下列的特殊字符，这样过滤之后就一样了，导致表格的数据对应不上；如female和fe male；
      // columnProp = columnProp
      //   .replace(/,/g, '')
      //   .replace(/\(/g, '')
      //   .replace(/\)/g, '')
      //   .replace(/\s+/g, '')
      //   .replace(/\./, '');
      obj[columnProp] = {};
      // obj[columnProp].value =
      //   i[agg] || i[agg] === 0
      //     ? match
      //       ? match.formatLabel(i[agg])
      //       : i[agg]
      //     : '';
      let curFormat = {
        selectFormat: 'digit',
        decimal: '',
        negative: '-1',
        unit: '',
        prefix: '',
        suffix: '',
        zone: 'CN',
        useThousandMark: true
      };
      if (agg) {
        let aggIndex = labels.indexOf(agg);
        labelList.forEach(l => {
          if(!l || !l.list) return
          let temp = l.list[aggIndex]
          if(temp) {
            if(temp.format) {
              curFormat = temp.format
            }
          } else {
            //l.list[label_index] = format
          }
        })
      }
      obj[columnProp].value = i[agg] || i[agg] === 0 ? formatNumberFunction(i[agg], curFormat) : '';
      if (colorFeature) {
        obj[columnProp].labelValue = i[colorFeature];
      } else {
        obj[columnProp].labelValue = i[agg];
      }

      obj[columnProp].label = [];
      obj[columnProp].columnStyle = returnColumnStyle(agg);

      let tooltipObj = JSON.parse(JSON.stringify(tooltipText));
      for (const key in i) {
        if (key === 'MC-HIDDEN-KEY') {
          continue;
        }
        if (i.hasOwnProperty(key)) {
          let flag = !!tooltipObj[key];
          let textFormat = {
            align: 'left',
            fontSize: globalFontsize,
            fontColor: '',
            fontStyle: 'normal',
            decoration: '',
            letterSpacing: '',
            lineHeight: '16.5',
            display: 'auto'
          };
          if (isMobile(0)) {
            textFormat = {
              align: 'left',
              fontSize: globalFontsize,
              fontColor: '',
              fontStyle: 'normal',
              decoration: '',
              letterSpacing: '',
              lineHeight: '54',
              display: 'auto'
            };
            if (tooltipObj[key] && tooltipObj[key].fontSize) {
              tooltipObj[key].fontSize = tooltipObj[key].fontSize * config.dpr;
            }
            if (tooltipObj[key] && tooltipObj[key].lineHeight) {
              tooltipObj[key].lineHeight = tooltipObj[key].lineHeight * config.dpr;
            }
          }
          const ele = flag ? tooltipObj[key] : textFormat;
          if (rowAggression.indexOf(key) > -1 && agg !== key) {
            continue;
          }
          let labelObj = {};
          labelObj.tooltipFormat = {};
          labelObj.name = flag ? tooltipObj[key].title : key;
          labelObj.value = i[key];
          labelObj.style = ele;
          labelObj.display = ele.display ? ele.display : 'auto';
          let tableNumFormat = {
            selectFormat: 'digit',
            decimal: '',
            negative: '-1',
            unit: '',
            prefix: '',
            suffix: '',
            zone: 'CN',
            useThousandMark: true
          };
          let format = flag ? tooltipFormat[key] : tableNumFormat;
          Object.assign(labelObj.tooltipFormat, format);
          if (flag) {
            // ele.display !== 'none' &&
            if (rowAggression.indexOf(key) === -1) {
              obj[columnProp].label.push(labelObj);
            } else if (key === agg) {
              // ele.display !== 'none' &&
              obj[columnProp].label.push(labelObj);
            }
          } else {
            obj[columnProp].label.push(labelObj);
          }
        }
      }
      return obj;
    }

    function getGridData (rowCategory) {
      let resData = [];

      let catData = getColumn(rowCategory);
      let catArr = [];
      let catReverse = JSON.parse(JSON.stringify(rowCategory)).reverse();
      // 计算出span
      let spanObj = {};
      let tempData = [];
      getSpanProcess(catData, spanObj);
      let test = JSON.parse(JSON.stringify(spanObj));
      // console.log(test);

      function getSpanProcess (curData, obj) {
        curData.map((curRow) => {
          let key = curRow.parentKey
            ? curRow.parentKey + '-' + curRow.key
            : curRow.key;
          key = key
            .replace(/,/g, '')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .replace(/\s+/g, '')
            .replace(/\./, '');
          curRow.values.map((row, idx) => {
            let arr = [];
            if (curRow.values[0].key) {
              getSpan(curRow.values, arr, obj);
              obj[key] = {};
              obj[key].total = arr.reduce((prev, curr) => {
                return prev + curr;
              });
              obj[key].len = obj[key].total;
            }
            if (row.key) {
              let parentKey = key;
              row.parentKey = parentKey;
              tempData.push(row);
              if (idx === curRow.values.length - 1) {
                let tempChildData = JSON.parse(JSON.stringify(tempData));
                tempData = [];
                getSpanProcess(tempChildData, obj);
              }
            } else if (curRow.values) {
              obj[key] = {};
              obj[key].total = curRow.values.length;
              obj[key].len = curRow.values.length;
            }
          });
        });
      }
      // 最终返回count
      function getSpan (curData, arr, obj) {
        curData.map((row) => {
          if (row.values && row.values[0].key) {
            getSpan(row.values, arr, obj);
          } else {
            // 最后的一个cat
            if (isEmpty(rowAggression)) {
              arr.push(1);
            } else {
              arr.push(rowAggression.length ? rowAggression.length : 1);
            }
          }
        });
      }

      function findSpanByCat (catArr, catName, idx, deduceFlag) {
        idx = catArr.length - idx - 1;
        let curCatArr = JSON.parse(JSON.stringify(catArr));
        curCatArr.reverse();
        // idx = curCatArr.indexOf(catName)
        let str = curCatArr.slice(0, idx + 1).join('-');
        if (deduceFlag) {
          spanObj[str] ? (spanObj[str].len > 1 ? spanObj[str].len-- : 1) : 1;
        }
        return spanObj[str] ? spanObj[str] : 1;
      }

      function gridDataProcess (rowData) {
        rowData.map((row, rowIdx) => {
          // 如果存在，说明
          if (row.values[0].key) {
            // 跨行显示
            catArr.unshift(row.key);
            gridDataProcess(row.values);
            catArr.shift();
          } else {
            catArr.unshift(row.key);
            // 最后的一个cat
            if (columnAggression.length > 0) {
              // let len = 1
              let deepCatArr = JSON.parse(JSON.stringify(catArr));
              let obj = {};
              catReverse.map((rowCat, idx) => {
                obj[rowCat] = {};
                obj[rowCat].value = deepCatArr[idx];
                let { len, total } = findSpanByCat(
                  deepCatArr,
                  deepCatArr[idx],
                  idx
                );
                if (idx === 0) {
                  obj[rowCat].rowSpan = 1;
                  obj[rowCat].rowLen = 1;
                } else {
                  obj[rowCat].rowLen = total;
                  obj[rowCat].rowSpan = len > 0 ? len : 1;
                  findSpanByCat(deepCatArr, deepCatArr[idx], idx, true);
                }
                if (rowIdx % total !== 0) {
                  obj[rowCat].grpSpan = true;
                }
                columnAggression.map((agg) => {
                  obj.columnStyle = returnColumnStyle(agg);
                  let match = formatList.find((i) => i.label_name === agg);
                  row.values.forEach((i) => {
                    // let key = i['MC-HIDDEN-KEY'];
                    // let propArr = key.split(CLASS.join_factor);
                    if (i.hasOwnProperty(agg)) {
                      Object.assign(obj, returnValue(i, agg, match));
                    }
                  });
                });
                if (isMobile()) {
                  obj[rowCat].columnStyle = {
                    fontSize: `${12 * config.dpr}px`,
                    lineHeight: `${24 * config.dpr}px`
                  };
                }
              });
              resData.push(obj);
            } else if (rowAggression.length > 0) {
              rowAggression.map((agg, aggIdx) => {
                let obj = {};
                let len = 1;
                let deepCatArr = JSON.parse(JSON.stringify(catArr));
                let matchAgg = tableTitle.find((m) => m.key === agg);
                catReverse.map((rowCat, idx) => {
                  obj[rowCat] = {};
                  obj[rowCat].value = deepCatArr[idx];
                  let lenObj = findSpanByCat(deepCatArr, deepCatArr[idx], idx);
                  if (idx === 0) {
                    len = rowAggression.length ? rowAggression.length : 1;
                    if (aggIdx !== 0) {
                      // len = len - ((rowIdx + 1) * rowAggression.length - 1)
                      len = len - aggIdx;
                    }
                    // obj[rowCat].rowLen = 1;
                    obj[rowCat].rowLen = rowAggression.length;
                  } else {
                    len = lenObj.len;
                    obj[rowCat].rowLen = lenObj.total;
                  }
                  obj[rowCat].rowSpan = len > 0 ? len : 1;
                  if (
                    (rowIdx *
                      (rowAggression.length ? rowAggression.length : 1)) %
                      (lenObj.total || 1) ===
                    0
                  ) {
                    if (aggIdx !== 0) {
                      obj[rowCat].grpSpan = true;
                    }
                  } else {
                    obj[rowCat].grpSpan = true;
                  }
                  if (idx !== 0) {
                    len = findSpanByCat(deepCatArr, deepCatArr[idx], idx, true)
                      .len;
                  }
                  if (isMobile()) {
                    obj[rowCat].columnStyle = {
                      fontSize: `${12 * config.dpr}px`,
                      lineHeight: `${24 * config.dpr}px`
                    };
                  }
                });
                obj.columnStyle = returnColumnStyle(agg);
                let match = formatList.find((i) => i.label_name === agg);
                row.values.forEach((i) => {
                  obj.data_row_aggressions = matchAgg ? matchAgg.title : agg;
                  // let key = i['MC-HIDDEN-KEY'];
                  // let propArr = key.split('MC-SEPERATE-WORD');
                  // if (i.hasOwnProperty(agg)) {
                  //   if (
                  //     (propArr.length > 1 &&
                  //       propArr[propArr.length - 1] === agg) ||
                  //     isEmpty(config.data_row_aggressions)
                  //   ) {
                  //     Object.assign(obj, returnValue(i, agg, match));
                  //   }
                  // }
                  if (i.hasOwnProperty(agg)) {
                    Object.assign(obj, returnValue(i, agg, match));
                  }
                });
                resData.push(obj);
              });
            } else {
              // let len = 1
              let deepCatArr = JSON.parse(JSON.stringify(catArr));
              let obj = {};
              catReverse.map((rowCat, idx) => {
                obj[rowCat] = {};
                obj[rowCat].value = deepCatArr[idx];
                let { len, total } = findSpanByCat(
                  deepCatArr,
                  deepCatArr[idx],
                  idx
                );
                if (idx === 0) {
                  obj[rowCat].rowSpan = 1;
                  obj[rowCat].rowLen = 1;
                } else {
                  obj[rowCat].rowSpan = len > 0 ? len : 1;
                  len = findSpanByCat(deepCatArr, deepCatArr[idx], idx, true);
                  obj[rowCat].rowLen = total;
                }

                if (rowIdx % total !== 0) {
                  obj[rowCat].grpSpan = true;
                }

                // obj.columnStyle = returnColumnStyle('');
                // let match = null;
                // row.values.forEach((i) => {
                //   Object.assign(obj, returnValue(i, '', match));
                // });
                if (isMobile()) {
                  obj[rowCat].columnStyle = {
                    fontSize: `${12 * config.dpr}px`,
                    lineHeight: `${24 * config.dpr}px`
                  };
                }
              });
              obj.columnStyle = returnColumnStyle('');
              let match = null;
              row.values.forEach((i) => {
                Object.assign(obj, returnValue(i, '', match));
              });
              resData.push(obj);
            }

            catArr.shift();
          }
        });
      }
      gridDataProcess(catData);
      return resData;
    }
    /// ////////////结束获取data/////////////////////

    /**
     * 开始初始化grid的column
     */
    function initColumns() {
      let colCategory = config.data.column.categories;
      let partColumn = getColumn(colCategory);
      let temColumn = config.data.row.categories;
      let resColumn = [];

      temColumn.forEach((i) => {
        let match = tableTitle.find((t) => t.key === i);
        let style = {
          align: 'left',
          fontSize: globalFontsize,
          fontColor: '',
          fontStyle: 'normal',
          decoration: '',
          letterSpacing: '',
          lineHeight: '16.5',
          display: 'auto'
        };
        // if (isMobile()) {
        //   style['font-size'] = globalFontsize;
        //   style['line-height'] = globalFontsize;
        // }
        let show = true;
        if (match) {
          style = JSON.parse(JSON.stringify(match.style));
          style.color = style.fill;
          if (isMobile()) {
            style['font-size'] = style['font-size'] * config.dpr;
            style['line-height'] = style['line-height'] * config.dpr;
          }
          show = match.show;
        } else {
          style.color = config.font.color;
          if (isMobile()) {
            style['font-size'] = globalFontsize;
            style['line-height'] = globalFontsize;
          }
        }
        resColumn.push({
          headerName: match ? match.title : i,
          field: i,
          cellRenderer: 'showCellRenderer',
          headerTooltip: match ? match.title : i,
          headerComponentParams: {
            style: style,
            show: show,
            maxHeight,
            cellBorderWidth,
            borderTopShow: '1',
            innerBorderColor: innerBorderColor
          },
          pinned: 'left',
          lockPinned: true,
          cellClass: 'lock-pinned',
          tooltipComponent: 'customTooltip',
          tooltipField: i,
          tooltipComponentParams: {
            style: {
              align: 'left',
              fontSize: globalFontsize,
              fontColor: '',
              fontStyle: 'normal',
              decoration: '',
              letterSpacing: '',
              lineHeight: '16.5',
              display: 'auto'
            },
            header: true,
          },
          cellStyle: (params) => {
            if (params.value) {
              let height = 0;
              if (mode === 'full' || mode === 'fitHeight') {
                if (currentRowHeight) {
                  height = params.value.rowSpan * currentRowHeight + 'px';
                }
              } else {
                height =
                  params.value.rowSpan * params.data.columnStyle.height + 'px';
              }
              return retHeadCellStyle(height, params);
            }
          },
          rowSpan: function (params) {
            if (params.data[i]) {
              return params.data[i].rowSpan;
            }
          },
          cellClassRules: {
            'cell-span': (params) => {
              if (params.data[i]) {
                return params.data[i].rowSpan ? true : false;
              } else {
                return false;
              }
            },
            'cell-group': 'true',
            'cont-span': (params) => {
              if (params.data[i]) {
                return params.data[i].grpSpan ? true : false;
              } else {
                return false;
              }
            },
          },
        });
      });
      let flag = !aggShow && !titleShow; //
      if (!flag && config.data.row.aggressions.length > 0) {
        let curStyle = {
          align: 'left',
          fontSize: globalFontsize,
          fontColor: '',
          fontStyle: 'normal',
          decoration: '',
          letterSpacing: '',
          lineHeight: '16.5',
          display: 'auto'
        };
        if (tableTitle.length > 0) {
          curStyle = tableTitle[0].style;
          curStyle.color = curStyle.fill;
          if (isMobile()) {
            curStyle['font-size'] = curStyle['font-size'] * config.dpr;
            curStyle['line-height'] = curStyle['line-height'] * config.dpr;
          }
        }
        resColumn.push({
          headerName: titleShow ? '' : titleMatch ? titleMatch.title : titleKey,
          field:
            aggShow && !isEmpty(config.data.row.aggressions)
              ? 'data_row_aggressions'
              : '',
          headerTooltip: titleShow
            ? ''
            : titleMatch
              ? titleMatch.title
              : titleKey,
          tooltipField: 'data_row_aggressions',
          tooltipComponent: 'customTooltip',
          pinned: 'left',
          lockPinned: true,
          cellClass: 'lock-pinned',
          tooltipComponentParams: {
            style: {
              align: 'left',
              fontSize: globalFontsize,
              fontColor: '',
              fontStyle: 'normal',
              decoration: '',
              letterSpacing: '',
              lineHeight: '16.5',
              display: 'auto'
            },
            header: true,
          },
          headerComponentParams: {
            style: curStyle,
            show: titleShow,
            maxHeight,
            cellBorderWidth,
            borderTopShow: '1',
            innerBorderColor: innerBorderColor
          },
          cellStyle: (params) => {
            // params.value
            let style = params.data.columnStyle;
            let height = 0;
            if (mode === 'full' || mode === 'fitHeight') {
              if (currentRowHeight) {
                height = currentRowHeight + 'px';
              }
            } else {
              height = style.height + 'px';
            }
            return retHeadCellStyle(height);
          }
        });
      }
      if (isEmpty(colCategory)) {
        if (columnAggression.length > 0) {
          resColumn.push(...getGridColumn(geneColumnAgg(true)));
        } else {
          resColumn.push(...getGridColumn(partColumn));
        }
      } else {
        resColumn.push(...getGridColumn(partColumn));
      }
      return resColumn;
    }

    function retHeadCellStyle (height, params) {
      let curStyle = {
        borderWidth: cellBorderWidth + 'px'
      };
      if (height) {
        curStyle.height = height + ' !important';
        curStyle.lineHeight = height;
      }
      if (bgColor && bgColor.indexOf('/') > -1) {
        if (index === 15) {
          curStyle.background = '#2b0b0b';
        } else if (index === 17) {
          curStyle.background = 'rgb(3,18,49)';
        } else {
          curStyle.backgroundImage = `url(${bgColor})`;
          curStyle.backgroundSize = `${width}px ${height}px`; // 可以使用cover
          curStyle.backgroundPosition = 'top right'; // 背景图片居中显示，让多余部分相对容器对此展示
          curStyle.backgroundRepeat = 'no-repeat';
        }
      } else {
        // curStyle.background = bgColor || '#fff';
      }
      curStyle.opacity = config.table.background.opacity
        ? (config.table.background.opacity * 100) / 100
        : 1;
      curStyle.borderColor = innerBorderColor;
      curStyle.color = config.font.color;
      if (params && params.value && params.value.rowSpan !== params.value.rowLen) {
        curStyle.display = 'none';
      }
      if (isMobile()) {
        curStyle.fontSize = '36px';
      }
      return curStyle;
    }

    function getGridColumn (column) {
      let resColumn = [];
      let rowCat = isEmpty(config.data.row.aggressions)
        ? isEmpty(config.data.labeled)
          ? []
          : config.data.labeled
        : config.data.row.aggressions;

      maxHeight = maxHeight ? maxHeight + 16 : Number(titleStyle.lineHeight);

      function gridColumnProcess (original, target, propName) {
        original.forEach((parent, idx) => {
          let temColumnObj = {
            tooltipComponent: 'customTooltip',
            headerName: parent.title ? parent.title : parent.key,
            headerTooltip: parent.title ? parent.title : parent.key,
            resizable: false,
            headerGroupComponent: createHeaderGroupComponent(),
            headerGroupComponentParams: {
              style: titleStyle,
              show: true,
              maxHeight,
              cellBorderWidth,
              innerBorderColor: innerBorderColor,
              borderBottomShow: titleShow ? '1' : '0', // 无
              borderTopShow: titleShow ? '0' : '1' // 无
            },
            headerComponentParams: {
              style: parent.parentTitleStyle
                ? parent.parentTitleStyle
                : titleStyle,
              // className: hideHeadFlag ? 'hide-head' : '',
              show: parent.show !== '1',
              maxHeight,
              innerBorderColor: innerBorderColor,
              cellBorderWidth,
              borderTopShow: titleShow ? '0' : '1' // 无
            },
            tooltipComponentParams: {
              context: {dataProcess: dataProcess, formatNumberFunction: formatNumberFunction},
            },
            cellRenderer: (params) => {
              var eDiv = document.createElement('span');
              eDiv.innerHTML =
                params.value && (params.value.value || params.value.value === 0)
                  ? params.value.value
                  : '';
              params.eGridCell.addEventListener('click', function (e) {
                let label = params.value && params.value.label;
                let obj = {};
                label.forEach((i) => {
                  obj[i.name] = i.value;
                });

                let curParentDom = params.eGridCell.parentElement;
                let curAriarowindex = curParentDom.getAttribute('aria-rowindex');
                setTimeout(() => {
                  currentOpacity = '20%';
                  params.api.redrawRows();
                  // setTimeout(() => {
                  //   params.eGridCell.classList.add('cell-highlight');
                  //   // let classStr = params.eGridCell.getAttribute('class') + 'cell-highlight';
                  //   // params.eGridCell.setAttribute('class', classStr);
                  // }, 2000);
                  let curCellDom = params.eGridCell;
                  let allCellDom = document.body.querySelector(config.bindto).querySelectorAll('.ag-cell');
                  let ariaColindex = curCellDom.getAttribute('aria-colindex');
                  // let compId = curCellDom.getAttribute('comp-id');
                  // let colId = curCellDom.getAttribute('col-id');
                  let resultDom = '';
                  for (let i = 0; i < allCellDom.length; i++) {
                    if (allCellDom[i].getAttribute('aria-colindex') === ariaColindex && allCellDom[i].parentElement.getAttribute('aria-rowindex') === curAriarowindex) {
                      resultDom = allCellDom[i];
                    }
                  }
                  resultDom.classList.add('cell-highlight');
                }, 200);

                typeof config.data_click === 'function' &&
                  config.data_click(obj);
                typeof config.click === 'function' &&
                  config.click(obj);
                
                if (isMobile()) {
                  mobileTooltipHandle(e, params);
                }
              });
              // if (isMobile()) {
              //   let timer = null;
              //   let label = params.value.label;
              //   // params.eGridCell.addEventListener('mouseover', function (e) {
              //   //   console.log(params.value.value);
              //   // })
              //   params.eGridCell.addEventListener('mouseenter', function (e) {
              //     if (timer) {
              //       clearTimeout(timer);
              //       // timer = setTimeout(() => {
              //       //   console.log('event', e);
              //       //   console.log('paramsparamsparamsparams', params);
              //       //   let html = '';
              //       //   label.map(l => {
              //       //     let {
              //       //       style,
              //       //       tooltipFormat,
              //       //       name,
              //       //       value
              //       //     } = l;
              //       //     html += `<div 
              //       //               style="font-size: ${style.fontSize}px;  
              //       //               text-align: ${style.align}; 
              //       //               color: ${style.fontColor}; 
              //       //               font-style: ${style.fontStyle}; 
              //       //               text-decoration: ${style.decoration}; 
              //       //               letter-spacing: ${style.letterSpacing}px; 
              //       //               background-color:'#fff';
              //       //               line-height: ${style.lineHeight}px; display: ${style.display || 'auto'}">
              //       //               ${name}${name === '' ? '' : ': '}${formatNumberFunction(value, tooltipFormat)} 
              //       //             </div>`;
              //       //   });
              //       //   let dDom = document.querySelector('#canvas_over');
              //       //   if (dDom) {
              //       //     document.body.removeChild(dDom);
              //       //   }
              //       //   let x = e.clientX;
              //       //   let y = e.clientY;
              //       //   let style = `position: absolute;
              //       //               top: ${y + 20}px;
              //       //               left: ${x - 10}px;
              //       //               font-size: 12px;
              //       //               background-color: #ddd;
              //       //               border-radius: 4px;
              //       //               padding: 4px 8px`;
              //       //   dDom = document.createElement('div');
              //       //   dDom.setAttribute('id', 'canvas_over');
              //       //   dDom.setAttribute('style', style);
              //       //   // let dText = document.createTextNode(retVal);
              //       //   // dDom.appendChild(dText);
              //       //   dDom.innerHTML = html;
              //       //   document.body.appendChild(dDom);
              //       //   setTimeout(() => {
              //       //     let dDom = document.querySelector('#canvas_over');
              //       //     if (dDom) {
              //       //       document.body.removeChild(dDom);
              //       //     }
              //       //   }, 1500);
              //       // }, 500);
              //     } else {
              //       timer = setTimeout(() => {
              //         console.log('event', e);
              //         console.log('paramsparamsparamsparams', params);
              //         let html = '';
              //         label.map(l => {
              //           let {
              //             style,
              //             tooltipFormat,
              //             name,
              //             value
              //           } = l;
              //           html += `<div 
              //                     style="font-size: ${style.fontSize}px;  
              //                     text-align: ${style.align}; 
              //                     color: ${style.fontColor}; 
              //                     font-style: ${style.fontStyle}; 
              //                     text-decoration: ${style.decoration}; 
              //                     letter-spacing: ${style.letterSpacing}px; 
              //                     background-color:'#fff';
              //                     line-height: ${style.lineHeight}px; display: ${style.display || 'auto'}">
              //                     ${name}${name === '' ? '' : ': '}${formatNumberFunction(value, tooltipFormat)} 
              //                   </div>`;
              //         });
              //         let dDom = document.querySelector('#canvas_over');
              //         if (dDom) {
              //           document.body.removeChild(dDom);
              //         }
              //         let x = e.clientX;
              //         let y = e.clientY;
              //         let style = `position: absolute;
              //                     top: ${y + 20}px;
              //                     left: ${x - 10}px;
              //                     font-size: 12px;
              //                     background-color: #ddd;
              //                     border-radius: 4px;
              //                     padding: 4px 8px`;
              //         dDom = document.createElement('div');
              //         dDom.setAttribute('id', 'canvas_over');
              //         dDom.setAttribute('style', style);
              //         // let dText = document.createTextNode(retVal);
              //         // dDom.appendChild(dText);
              //         dDom.innerHTML = html;
              //         document.body.appendChild(dDom);
              //         setTimeout(() => {
              //           let dDom = document.querySelector('#canvas_over');
              //           if (dDom) {
              //             document.body.removeChild(dDom);
              //           }
              //         }, 1500);
              //       }, 1000);
              //     }
              //   });
              //   params.eGridCell.addEventListener('mouseleave', function (e) {
              //     if (timer) {
              //       clearTimeout(timer);
              //     }
              //   })
              // }

              return eDiv;
            },
            // cellRenderer: (params) => {
            //   return params.value && (params.value.value || params.value.value === 0) ? params.value.value : ''
            // },
            cellStyle: (params) => {
              let style = {};
              if (params.columnStyle) {
                style = JSON.parse(JSON.stringify(params.columnStyle));
              }
              if (params.value) {
                if (params.value.columnStyle) {
                  style = JSON.parse(JSON.stringify(params.value.columnStyle));
                }
                style.height = style.height + 'px !important';
                // && colorFeature === params.data.data_row_aggressions
                if (
                  colorFeature &&
                  params.value &&
                  (params.value.value || params.value.value === 0)
                ) {
                  style.color = self.getColor(params.value.labelValue);
                } else if (!colorFeature) {
                } else {
                  style.color = config.font_color;
                }
              }
              if (mode === 'full' || mode === 'fitHeight') {
                if (currentRowHeight) {
                  style.height = currentRowHeight + 'px !important';
                  style.lineHeight = currentRowHeight + 'px !important';
                }
              }
              let opacity = config.color.opacity ? config.color.opacity[0] : 1;
              style.borderWidth = cellBorderWidth + 'px';
              style.borderRightColor = innerBorderColor + ' !important';
              style.borderBottomColor = innerBorderColor + ' !important';
              if (config.targetAction) {
                // currentOpacity = '20%';
                if (config.targetAction[0].actionInfo) {
                  let curFiled = config.targetAction[0].actionInfo[config.targetAction[0].feature[0].feature_name];
                  if (params.colDef.field === curFiled && config.targetAction[0].actionInfo[params.data.data_row_aggressions]) {
                    currentOpacity = '100%';
                  } else {
                    currentOpacity = '20%';
                  }
                }
              }
              if (colorFeature) {
                style.opacity = currentOpacity || (opacity * 100) / 100;
              } else {
                // style.opacity = '100%';
                style.opacity = currentOpacity || '100%';
              }

              return style;
            }
          };
          if (parent.key) {
            propName.push(parent.key);
            if (parent.values[0].key) {
              temColumnObj.children = gridColumnProcess(
                parent.values,
                temColumnObj.columns || [],
                propName
              );
            } else {
              if (columnAggression.length > 0 && parent.type !== 'columnAgg') {
                let colAggValues = geneColumnAgg();
                temColumnObj.children = gridColumnProcess(
                  colAggValues,
                  temColumnObj.columns || [],
                  propName
                );
              }

              temColumnObj.field = propName
                .join('-')
                // .replace(/,/g, '')
                // .replace(/\(/g, '')
                // .replace(/\)/g, '')
                // .replace(/\s+/g, '')
                // .replace(/\./, ''); // parent.key;
              temColumnObj.tooltipField = temColumnObj.field;
            }
            propName.pop();
            target.push(temColumnObj);
          } else {
            if (idx === 0 && rowCat.length > 0) {
              temColumnObj.field = 'singleHead';
              temColumnObj.tooltipField = 'singleHead';
              temColumnObj.headerComponentParams.show = false;
              singleHeadFlag =
                config.data.row.categories.length > 0 ? false : true;
              // temColumnObj.headerComponentParams.hasSpace = '1'
              temColumnObj.headerComponentParams.maxHeight = 0;
              target.push(temColumnObj);
            }
          }
        });
        return target;
      }
      let propName = [];
      resColumn = gridColumnProcess(column, resColumn, propName);
      if (titleShow) {
        let obj = {
          tooltipComponent: 'customTooltip',
          headerName: titleMatch ? titleMatch.title : titleKey,
          headerTooltip: titleMatch ? titleMatch.title : titleKey,
          children: resColumn,
          tooltipComponentParams: {
            context: {dataProcess: dataProcess, formatNumberFunction: formatNumberFunction},
          },
          headerGroupComponent: createHeaderGroupComponent(),
          headerGroupComponentParams: {
            style: titleStyle,
            show: titleShow,
            maxHeight,
            cellBorderWidth,
            innerBorderColor: innerBorderColor,
            borderBottomShow: '1', // 无
            borderTopShow: '1' // 无
          }
        };
        return [obj];
      } else {
        return resColumn;
      }
    }

    function geneColumnAgg (useStyleFlag) {
      let colAggValues = [];
      let curStyle = {
        align: 'left',
        fontSize: globalFontsize,
        fontColor: '',
        fontStyle: 'normal',
        decoration: '',
        letterSpacing: '',
        lineHeight: '16.5',
        display: 'auto'
      };
      if (tableTitle.length > 0) {
        curStyle = tableTitle[0].style;
        curStyle.color = curStyle.fill;
        if (isMobile()) {
          curStyle['font-size'] = curStyle['font-size'] * config.dpr;
          curStyle['line-height'] = curStyle['line-height'] * config.dpr;
        }
      }
      columnAggression.map((i) => {
        let match = tableTitle.find((m) => m.key === i);
        let flag = (match && match.show) || !match;
        colAggValues.push({
          title: match ? match.title : i,
          key: i,
          values: [{}],
          type: 'columnAgg',
          show: flag ? '' : '1',
          parentTitleStyle: useStyleFlag ? curStyle : null
        });
      });
      return colAggValues;
    }

    function getColumn (colCategory) {
      // colCategory = ['品牌', '产品主类']
      let nest = d3.nest();
      for (var i = 0; i < colCategory.length; i++) {
        nest.key(createNestingFunction(colCategory[i]));
        // nest.key((d)=> {
        //   return d[colCategory[i]];
        // });
      }
      let resData = nest.entries(tableData);
      return resData;
    }

    function createNestingFunction(propertyName) {
      return (d)=> {
        return d[propertyName];
      };
    }

    function mobileTooltipHandle (e, params) {
      if (mobileTooltipTimer) {
        clearTimeout(mobileTooltipTimer);
      }
      let tableBox = document.querySelector(`#${config.id}`);
      let tableBoxParent = tableBox.parentNode;
      let mobileTooltipDom = tableBox.querySelector('#canvas_over');
      if (mobileTooltipDom) {
        tableBox.removeChild(mobileTooltipDom);
      }
      let label = params.value.label;
      let html = '';
      label.map(l => {
        let {
          style,
          tooltipFormat,
          name,
          value
        } = l;
        html += `<div 
                  style="font-size: ${style.fontSize}px;  
                  text-align: ${style.align}; 
                  color: ${style.fontColor}; 
                  font-style: ${style.fontStyle}; 
                  text-decoration: ${style.decoration}; 
                  letter-spacing: ${style.letterSpacing}px; 
                  background-color:'#fff';
                  overflow: hidden;
                  text-overflow: ellipsis;
                  line-height: ${style.lineHeight}px; display: ${style.display || 'auto'}">
                  ${name}${name === '' ? '' : ': '}${formatNumberFunction(value, tooltipFormat)} 
                </div>`;
      });
      // let dDom = document.querySelector('#canvas_over');
      // if (dDom) {
      //   document.body.removeChild(dDom);
      // }
      let tableBoxRect = tableBox.getBoundingClientRect();
      let tableBoxParentRect = tableBoxParent.getBoundingClientRect();
      let tableTop = tableBoxRect.top;
      let bodyClientWidth = document.body.clientWidth;
      let bodyClientHeight = document.body.clientHeight;
      let x = e.clientX;
      let y = e.clientY;
      let tooltipPosition = '';
      let tooltipHeight = label.length * 100;
      if (x < bodyClientWidth / 2) {
        tooltipPosition = `${tooltipPosition}; left: ${x - 10}px`;
      } else {
        tooltipPosition = `${tooltipPosition}; right: ${bodyClientWidth - x + 10}px`;
      }
      if (y > bodyClientHeight - tooltipHeight) {
        tooltipPosition = `${tooltipPosition}; bottom: ${tableBoxParentRect.height + tableBoxParentRect.top - y - 20}px`;
      } else {
        if (y - tableBoxParentRect.top < tableBoxParentRect.height / 2) {
          tooltipPosition = `${tooltipPosition}; top: ${y + 20 - tableTop}px`;
        } else {
          tooltipPosition = `${tooltipPosition}; bottom: ${bodyClientHeight - y - 20}px`;
        }
      }
      let style = `position: absolute;
                  font-size: 12px;
                  background-color: #fff;
                  border-radius: 4px;
                  padding: 4px 8px;
                  box-shadow: rgb(174 174 174) 0px 0px 10px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  max-width: ${bodyClientWidth / 2}px`;
      if (tooltipPosition) {
        style = `${style}; ${tooltipPosition}`;
      }
      let dDom = document.createElement('div');
      dDom.setAttribute('id', 'canvas_over');
      dDom.setAttribute('style', style);
      // let dText = document.createTextNode(retVal);
      // dDom.appendChild(dText);
      dDom.innerHTML = html;
      tableBox.appendChild(dDom);
      // document.body.appendChild(dDom);
      if (isMobile()) {
        document.body.querySelector('.dashboard-container').addEventListener('scroll', tooltipScroll);
        setTimeout(() => {
          document.body.querySelector('.dashboard-container').removeEventListener('scroll', tooltipScroll);
          tooltipScroll();
        }, 1500);
      }
      mobileTooltipTimer = setTimeout(() => {
        // let dDom = document.querySelector('#canvas_over');
        // if (dDom) {
        //   document.body.removeChild(dDom);
        // }
      }, 1500);
    }

    function tooltipScroll () {
      // if (d3.select('body').selectAll('#canvas_over')) {
      //   d3.select('body').selectAll('#canvas_over').remove();
      // }
    }

    function formatNumberFunction(label, format) {
      let prefixes = {
        y: 1e-24,
        z: 1e-21,
        a: 1e-18,
        f: 1e-15,
        p: 1e-12,
        mu: 1e-6,
        m: 1e-3,
        none: 1e-0,
        K: 1e+3,
        M: 1e+6,
        G: 1e+9,
        T: 1e+12,
        P: 1e+15,
        E: 1e+18,
        Z: 1e+21,
        Y: 1e+24
      };
      let unitChange = {
        K: 'K 千',
        M: 'M 百万',
        G: 'G 十亿',
        T: 'T 千亿',
      }
      let new_label = label
      let original = false, k_mark = true;
      
      if(format.decimal < 0) format.decimal = 0
      if(format.decimal === '') original = true
    
      if(isNumber(new_label)) {
        // if(isNaN(new_label)) return ''
        let format_decimal = `.${format.decimal}`,
            format_kMark = format.useThousandMark ? ',' : '';
        if(format_kMark === '') k_mark = false
    
        if(format.selectFormat !== 'percent') {
          //单位换算
          Object.keys(prefixes).forEach(p => {
            // if(p === format.unit) new_label /= prefixes[p]
            let splitUnit = format.unit ? format.unit.split(' ')[0] : '';
            if(p === format.unit) {
              new_label /= prefixes[p]
            } else if (p === splitUnit) {
              new_label /= prefixes[splitUnit]
            }
          })
          let cur_new_label = new_label;
          //小数位数
          new_label = original ? (k_mark ? d3.format(format_kMark)(new_label) : new_label) : 
                                 d3.format(`${format_kMark}${format_decimal}f`)(new_label);
          //负值显示
          if (format.negative === '(1234)') {
            format.negative = 0;
          } else if (format.negative === '1234-') {
            format.negative = 1;
          }
          if(parseFloat(new_label) < 0) {
            // if(format.negative === 0) {
            //   new_label = original ? `(${k_mark ? d3.format(format_kMark)(Math.abs(new_label)) : Math.abs(new_label)})` : 
            //                          `(${k_mark ? d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(label)) : d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(new_label))})`
            // } else if(format.negative === 1) {
            //   new_label = original ? `${k_mark ? d3.format(format_kMark)(Math.abs(new_label)) : Math.abs(new_label)}-` : 
            //                          `${k_mark ? d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(label)) : d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(new_label))}-`
            // }
            if(format.negative === 0) {
              new_label = original ? `(${k_mark ? d3.format(format_kMark)(Math.abs(cur_new_label)) : Math.abs(cur_new_label)})` : 
                                     `(${d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(cur_new_label))})`
            } else if(format.negative === 1) {
              new_label = original ? `${k_mark ? d3.format(format_kMark)(Math.abs(cur_new_label)) : Math.abs(cur_new_label)}-` : 
                                     `${d3.format(`${format_kMark}${format_decimal}f`)(Math.abs(cur_new_label))}-`
            }
          }
          
          new_label += (isDefined(format.unit) && unitChange[format.unit]) ? unitChange[format.unit] : ''
        } else {
          new_label *= 100
          //小数位数
          let num = original ? (k_mark ? d3.format(`${format_kMark}`)(Math.abs(new_label)) : d3.format('')(Math.abs(new_label))) :
                               d3.format(`${format_kMark}.${format.decimal}f`)(Math.abs(new_label))
    
          if(new_label < 0) {
            if(format.negative === 0) new_label = `(${num})`
            else if(format.negative === 1) new_label = `${num}-` 
            else new_label = `-${num}` 
          } else {
            new_label = num
          }
        }
    
        //货币
        if(format.selectFormat === 'currency') {
          let areaCode = ['', 'CN', 'JP', 'HK', 'US', 'EUR', 'GBP'];
          let moneyCode = ['', '¥', '￥', 'HK$', '＄', '€', '£'];
          let zoneObj = {
            CN: `¥ 人民币`,
            JP: `￥ 日元`,
            HK: `HK$ 港元`,
            US: `＄ 美元`,
            EUR: `€ 欧元`,
            GBP: `£ 英镑`
          };
          let format_zone = isDefined(format.zone) ? format.zone : '¥ 人民币';
          for (let item in zoneObj) {
            if (format_zone === zoneObj[item]) {
              format_zone = item;
            }
          };
          let prefix = moneyCode[areaCode.indexOf(format_zone.toUpperCase())] || ''
          new_label = `${prefix}${new_label}`
        }
        //前缀后缀
        new_label = `${format.prefix}${new_label}${format.suffix}`
      } else {
        new_label += ''
      }
    
      if(new_label === 'undefined' || new_label === 'NaN') new_label = '' 
    
      return new_label
    }    
    /////////////////////结束获取grid的column////////////////////////
  };

  function initData (values) {
    data = values;
    keys = isDefined(colored_feature)
      ? $$.getUniqueArray(data.map((d) => d.values[0][colored_feature]))
      : [];
  }

  // function getColorList() {
  //   keys = isDefined(colored_feature)
  //     ? (data.map((d) => d.values[0][colored_feature]))
  //     : [];
  //   keys = Array.from(new Set(keys));
  //   if(isEmpty(keys)) return
  //   let list = []
  //   if(colored_type === 'linear') {
  //     list = d3.extent(keys).map((d, i) => {
  //       let format_val = $$.axis_format($$.userDefined_colorRange[i])
  //       return {
  //         val: format_val, 
  //         color: color_function(d),
  //         unique: $$.isBarLineType ? `${d}(${aggr})` : format_val,
  //         index: i, 
  //         originalVal: d, 
  //         rangeType: i > 0 ? 'max' : 'min'
  //       }
  //     })
  //   } else {
  //     list = keys.map((d, i) => {
  //       return {
  //         val: d, 
  //         color: color_function(d), 
  //         fill: isFunction(pattern_function) ? pattern_function(d) : '',
  //         unique: $$.isBarLineType ? `${d}(${aggr})` : d,
  //         index: i, 
  //         className: $$.isBarLineType ? `${CLASS.element} ${CLASS.element}-${i}-${cmi}` : `${CLASS.element} ${CLASS.element}-${i}`,
  //       }
  //     })
  //   }
  //   let colorObj = {
  //     id: bindto,
  //     aggr: $$.isBarLineType ? aggr : colored_feature,
  //     name: colored_feature,
  //     colored_type: colored_type,
  //     key: `${colored_feature}(${aggr})`,
  //     key_id: cmi,
  //     type: colored_type === 'linear' ? 'linear' : type || '',
  //     showRange: colored_type === 'linear',
  //     list: list,
  //     opacity: (isDefined(opacity) ? opacity : config.color_opacity[0]) * 100 || 100
  //   }

  //   let scheme = config.color.schemes[0]
  //   if(isEmpty(scheme)) {
  //     let colorLinear = ['#7AC9F5', '#2A5783'];
  //     let colorSchemes = ['#4284F5', '#03B98C', '#FACC14', '#F5282D', '#8543E0', '#3FAECC', '#3110D0', '#E88F00', '#DE2393', '#91BA38','#99B4BF', '#216A58', '#AB9438', '#F4999B', '#C9BFE1', '#055166', '#1F135A', '#43140A', '#96005A', '#8D8D8D']
  //     scheme = colored_type === 'linear' ? colorLinear : colorSchemes
  //   }

  //   let colorList = config.color.colors[0]
  //   if(isEmpty(colorList)) {
  //     if(colored_type === 'linear') {
  //       colorList = list.map(l => l.color)
  //     } else {
  //       colorList = {}
  //       list.forEach(l => {
  //         colorList[l.val] = l.color
  //       })
  //     }
  //   }

  //   let patternList = config.color.patterns[0]
  //   if(isEmpty(patternList)) {
  //     patternList = {}
  //     list.forEach(l => {
  //       patternList[l.val] = l.fill
  //     })
  //   }

  //   colorObj.schemes = scheme
  //   colorObj.colors = colorList
  //   colorObj.patterns = patternList

  //   return colorObj;
  //   // $$.modifyColorList({
  //   //   colored_type: colored_type,
  //   //   colored_feature: colored_feature,
  //   //   keys: keys,
  //   // });
  // }

  function getColor (value) {
    // if (value) {
    //   let y_colored = [];
    //   let colorRange = notEmpty(config.data.range.color) ? config.data.range.color[0] : [],
    //     color_schemes = ['#7AC9F5', '#2A5783'],
    //     colors = (notEmpty(config.color.colors) && config.color.colors[0]) ? config.color.colors[0] : [],
    //     colored_type = config.data.colored.type,
    //     colored_feature = config.data.colored.feature;
    //   let pattern = d3.scaleOrdinal(color_schemes).range(); //d3.schemeSet3, schemeCategory10
    //   y_colored = d3.extent((tableData).map((d) => d[colored_feature]));
    //   if(isDefined(colorRange[0]) && colorRange[0] !== null) y_colored[0] = Number(colorRange[0])
    //   if(isDefined(colorRange[1]) && colorRange[1] !== null) y_colored[1] = Number(colorRange[1])

    //   let min = isDefined(y_colored[0]) ? y_colored[0] : 0;
    //   let max = isDefined(y_colored[1]) ? y_colored[1] : min;

    //   self.userDefined_colorRange = [min, max];

    //   pattern = d3.scaleLinear().range(color_schemes).domain([min, max]).clamp(true);
    //   let color = pattern(value);
    //   return color;
    // }
  }

  return {
    drawTable,
    // getColorList,
    initData,
    getColor
  };
};
// extend(Chart.prototype, {
//   drawTable,
// });
