/* eslint-disable no-useless-constructor */
import Geometry from './Geometry.js';
import { fontSizeLineHeightPair, getTextWidth } from '../utils/utils.js';
import defaultObj from '../utils/defaultConfig.js';
let { defaultText, defaultLineStyle } = defaultObj;
class GeometryWithAxis extends Geometry {
  constructor (data, config) {
    super(data, config);
    this.xScale = null;
    this.yScale = null;
    this.xAxisG = null;
    this.yAxisG = null;
    this.dpr = this.config.dpr || 1;
    this.fontSizeLineHeightPair = JSON.parse(
      JSON.stringify(fontSizeLineHeightPair)
    );
    if (this.dpr && this.dpr !== 1) {
      this.initFontSizeLineHeight();
    }
  }

  initFontSizeLineHeight () {
    for (const key in fontSizeLineHeightPair) {
      if (Object.hasOwnProperty.call(fontSizeLineHeightPair, key)) {
        const ele = fontSizeLineHeightPair[key];
        this.fontSizeLineHeightPair[key * this.config.dpr] =
          ele * this.config.dpr;
      }
    }
  }

  /**
   * 定义比例尺
   */
  xScaleConfig () {
    this.xScale = d3
      .scaleLinear()
      .domain(
        this.getMinMaxData(
          this.config.xAxis.title.feature || this.config.xAxis.title.value
        )
      ); // 待修改
    this.xScale.nice();
  }

  yScaleConfig () {
    this.ticksProcess();
    let {
      yTitleWidth,
      yLabelWidth,
      xLabelWidth,
      labelHeight,
      titleHeight,
      hasRotateHeight
    } = this.getTransformData();

    this.xScale
      .range([
        yTitleWidth + yLabelWidth, // + (6 + 4) * (this.config.dpr || 1),
        this.config.width - xLabelWidth
      ])
      .nice();

    this.yScale
      .range([
        this.config.height - labelHeight - titleHeight - (6 + 4) * this.dpr - hasRotateHeight,
        // -  (this.xLabelWidth * 2) / 3,
        labelHeight // + yLabelWidth / 2
      ]) // 半个字体高度
      .nice();

    this.xAxisConfig(labelHeight, titleHeight, hasRotateHeight);

    this.yAxisConfig(yLabelWidth, yTitleWidth);

    this.xTitleConfig(labelHeight, hasRotateHeight);

    this.yTitleConfig(labelHeight, titleHeight, yTitleWidth, yLabelWidth);
    // 重新计算坐标轴标题的长度
    this.optimizationTzitle(yTitleWidth, yLabelWidth);

    this.gridLineConfig();
    this.diagonalLineConfig();
  }

  ticksProcess () {
    let {
      scopeObj: { scale, select, tickRange, tick_counts: tickCounts }
    } = this.config;
    let originalRange = this.getMinMaxData(
      this.config.yAxis.title.feature || this.config.yAxis.title.value
    );
    if (scale === 1 && select === 0) {
      this.yScale = d3.scaleLinear().domain(originalRange); // 待修改
      return;
    }
    if (select === 3) {
      this.yScale = d3
        .scaleLinear()
        .domain(
          typeof tickRange[0] !== 'undefined' ? tickRange : originalRange
        );
      this.yScale.ticks(tickCounts);
      return;
    }
    if (select === 1) {
      let min = originalRange[0];
      let max = originalRange[1];
      if (scale < 1) {
        let newMin = max - (max - min) / scale;
        this.yScale = d3.scaleLinear().domain([newMin, max]);
        this.yScale.nice();
      } else {
        let newMax = scale * (max - min) + min;
        this.yScale = d3.scaleLinear().domain([min, newMax]);
        this.yScale.nice();
      }
    }
  }

  getMinMaxData (feature) {
    if (this.data.length === 1) {
      if (this.data[0][feature] > 0) {
        return [0, this.data[0][feature]];
      } else {
        return [this.data[0][feature], 0];
      }
    }
    let sortData = this.data.sort((a, b) => a[feature] - b[feature]);
    let min = sortData[0][feature];
    let max = sortData[sortData.length - 1][feature];

    return [min, max];
  }

  /**
   *
   */
  getTransformData () {
    let { hasUnit } = this.config;
    let {
      title: { style = defaultText },
      label: { style: labelStyle = defaultText }
    } = this.config.yAxis;

    let yTitleWidth =
      getTextWidth('测', style.fontSize * this.dpr + 'px') *
      (this.dpr > 1 ? this.dpr * 0.52 : 1);
    yTitleWidth = yTitleWidth * 4;
    let yTicks = this.yScale.ticks();

    let yMaxLabel = yTicks[yTicks.length - 1];
    yTicks.forEach((i) => {
      let start = i;
      let end = yMaxLabel;
      if (hasUnit) {
        start = d3.format('~s')(i);
        end = d3.format('~s')(yMaxLabel);
      }
      if (start.toString().length > end.toString().length) {
        yMaxLabel = i;
      }
    });

    let yLabelWidth =
      getTextWidth(yMaxLabel, labelStyle.fontSize * this.dpr + 'px') * this.dpr;
    yLabelWidth = this.dpr > 1 ? yLabelWidth : yLabelWidth + 6 + 4;
    let xTicks = this.xScale.ticks();
    let xMaxLabel = xTicks[xTicks.length - 1];

    let xLabelWidth =
      getTextWidth(xMaxLabel, labelStyle.fontSize * this.dpr + 'px') *
      (this.config.dpr || 1);

    if (hasUnit) {
      yLabelWidth =
        getTextWidth(
          d3.format('~s')(yMaxLabel),
          labelStyle.fontSize * this.dpr + 'px'
        ) * (this.config.dpr || 1);
      xLabelWidth =
        getTextWidth(
          d3.format('~s')(xMaxLabel),
          labelStyle.fontSize * this.dpr + 'px'
        ) * (this.config.dpr || 1);
    }
    let { label, title } = this.config.xAxis;

    // let labelStyleFontSize = label.style.fontSize ? label.style.fontSize : 12;
    let labelHeight =
      this.fontSizeLineHeightPair[label.style.fontSize] * this.dpr;

    let titleHeight =
      this.fontSizeLineHeightPair[title.style.fontSize] * this.dpr;
    if (labelStyle.rotate === -45) {
    } else if (labelStyle.rotate === 45) {
      labelHeight += yLabelWidth / 2;
    }

    if (label.style.rotate === -45 || label.style.rotate === 45) {
      titleHeight += xLabelWidth / 2;
    }
    // titleHeight = titleHeight + titleHeight / 2;

    // 坐标轴名方向不为横向时，预留一定的高度作为坐标轴名的高度
    let hasRotateHeight = 0;
    if (label.style.rotate !== 0) {
      hasRotateHeight = 24;
    }

    this.yTitleWidth = yTitleWidth;
    this.yLabelWidth = yLabelWidth;
    this.xLabelWidth = xLabelWidth;
    this.labelHeight = labelHeight;
    this.titleHeight = titleHeight;
    this.hasRotateHeight = hasRotateHeight;
    return {
      yTitleWidth,
      yLabelWidth,
      xLabelWidth,
      labelHeight,
      titleHeight,
      hasRotateHeight
    };
  }

  /**
   * 定义坐标轴
   */
  xAxisConfig (labelHeight, titleHeight, hasRotateHeight) {
    let {
      hasUnit,
      xAxis: {
        label: { style: labelStyle = {} }
      }
    } = this.config;
    let ticks = this.xScale.ticks();
    let width =
      getTextWidth(
        ticks[ticks.length - 1],
        labelStyle.fontSize * this.dpr + 'px'
      ) * (this.config.dpr || 1);
    let len = parseInt(Math.round(ticks.length / (this.config.width / width)));
    len = len ? len + 1 : 1;
    let xAxis = d3.axisBottom(this.xScale).tickFormat((d, idx) => {
      if (idx % len === 0) {
        let val = d;
        if (hasUnit) {
          val = d3.format('~s')(d);
        }
        return val;
      } else {
        return '';
      }
    });
    this.svg.selectAll('.x-axis').remove();
    this.xAxisG = this.svg
      .append('g')
      .attr('class', 'x-axis')
      .attr(
        'transform',
        `translate(0,${
          this.config.height -
          labelHeight -
          titleHeight -
          (6 + 4) * (this.config.dpr || 1) -
          hasRotateHeight
          //  -  (this.xLabelWidth * 2) / 3
        })`
      );

    this.xAxisG.call(xAxis);

    this.setAxisStyle(this.config.xAxis, 'x');
  }

  setAxisStyle (AxisConfig, type, flag) {
    let {
      tickLine: { style: tickLineStyle = defaultLineStyle },
      line: { style: lineStyle = defaultLineStyle, show: showLine },
      label: { style: labelStyle = defaultLineStyle }
    } = AxisConfig;

    let AxisG = this[type + 'AxisG'];
    let { rotate } = labelStyle;
    let transformValue = `rotate(${rotate})`;
    if (rotate !== 0 && rotate !== 90) {
      if (type === 'x') {
        transformValue += `translate(${
          rotate < 0 ? (-this.xLabelWidth * 2) / 3 : (this.xLabelWidth * 2) / 3
        },${rotate > 0 ? -7 : 0})`;
      } else {
        transformValue += `translate(0,${
          rotate < 0 ? -this.yLabelWidth / 4 : this.yLabelWidth / 4
        })`;
      }
    } else if (rotate === 90) {
      if (type === 'x') {
        transformValue += `translate(${this.xLabelWidth + 7},-10)`;
      } else {
        transformValue += `translate(${this.yLabelWidth},${this.yLabelWidth})`;
      }
    }
    AxisG.selectAll('.tick').selectAll('text')
      .attr('transform', transformValue)
      .attr('stroke', 'none')
      .attr('fill', labelStyle.fontColor)
      .attr('font-size', labelStyle.fontSize * this.dpr)
      .attr('font-weight', labelStyle.fontWeight)
      .attr('font-style', labelStyle.fontStyle);
    if (flag) {
      return;
    }
    AxisG.selectAll('line')
      .attr('stroke', tickLineStyle.fontColor)
      .attr('stroke-opacity', tickLineStyle.opacity || 1)
      .attr('stroke-width', tickLineStyle.lineWidth);

    if (!showLine) {
      AxisG.selectAll('path').remove();
      return;
    }
    AxisG.selectAll('path')
      .attr('stroke', lineStyle.fontColor)
      .attr('stroke-width', lineStyle.lineWidth)
      .attr('stroke-opacity', lineStyle.opacity)
      .attr('stroke-dasharray', lineStyle.lineDash);
  }

  yAxisConfig (yLabelWidth, yTitleWidth) {
    let {
      hasUnit,
      yAxis: {
        label: { style: labelStyle = {} }
      },
      scopeObj: { select, tick_counts: tickCounts }
    } = this.config;
    let yAxis = null;
    if (select !== 3) {
      let ticks = this.yScale.ticks();
      let height =
        getTextWidth(
          ticks[ticks.length - 1],
          labelStyle.fontSize * this.dpr + 'px'
        ) * (this.config.dpr || 1);
      if (labelStyle.rotate === 0) {
        height = 48;
      } else if (labelStyle.rotate === 45 || labelStyle.rotate === -45) {
        height = height / 2;
      }
      // let len = parseInt(
      //   Math.round(ticks.length / (this.config.height / height))
      // );
      // len = len ? len + 1 : 1;
      let len = ticks.length / (this.config.height / height);
      len = len > 1 ? parseInt(Math.round(len)) + 1 : 1;
      yAxis = d3.axisLeft(this.yScale).tickFormat((d, idx) => {
        if (idx % len === 0) {
          let val = d;
          if (hasUnit) {
            val = d3.format('~s')(d);
          }
          return val;
        } else {
          return '';
        }
      });
    } else {
      let tickValues = this.calculateTickValues(
        tickCounts,
        this.yScale.domain()
      );
      yAxis = d3
        .axisLeft(this.yScale)
        .tickValues(tickValues)
        .tickFormat((d, idx) => {
          if (hasUnit) {
            return d3.format('.2s')(d);
          }
          return d.toString().indexOf('.') > -1 ? d.toFixed(2) : d;
        });
    }

    // let yAxis = d3.axisLeft(this.yScale).tickFormat((d) => {
    //   if (hasUnit) {
    //     return d3.format('~s')(d);
    //   }
    //   return d;
    // });
    this.svg.selectAll('.y-axis').remove();
    this.yAxisG = this.svg
      .append('g')
      .attr('class', 'y-axis')
      .attr(
        'transform',
        `translate(${
          yLabelWidth + yTitleWidth // + (6 + 4) * (this.config.dpr || 1)
        },0)`
      );

    this.yAxisG.call(yAxis);

    this.setAxisStyle(this.config.yAxis, 'y');
  }

  calculateTickValues (tickCounts, domain) {
    if (!tickCounts) return null;

    let tickArray = [];
    let interval = (domain[1] - domain[0]) / tickCounts;
    for (let i = 0; i <= tickCounts; i++) {
      tickArray.push(domain[0] + interval * i);
    }
    return tickArray;
  }

  xTitleConfig (labelHeight, hasRotateHeight) {
    let {
      title: { value, style = defaultText, show: showTitle }
    } = this.config.xAxis;
    if (!showTitle) {
      return;
    }
    let xTitleWidth =
      getTextWidth(value, style.fontSize * this.dpr + 'px') * this.dpr;

    this.xAxisG
      .append('text')
      .attr('class', 'x-title')
      .attr(
        'transform',
        `translate(${this.config.width - xTitleWidth},${
          labelHeight + (6 + 2) * (this.config.dpr || 1) + labelHeight / 2 + hasRotateHeight
          // + (this.xLabelWidth * 2) / 3
        })`
      )
      .attr('stroke', 'none')
      .attr('fill', () => {
        if (this.config.dashboardGrobalCss) {
          return this.config.dashboardGrobalCss.color;
        } else {
          return style.fontColor;
        }
      })
      .attr('font-size', style.fontSize * this.dpr)
      .attr('font-weight', style.fontWeight)
      .attr('font-style', style.fontStyle)
      .attr('text-decoration', style.textDecoration)
      .text(value);
  }

  yTitleConfig (labelHeight, titleHeight, yTitleWidth, yLabelWidth) {
    let {
      title: { style = defaultText, value, show: showTitle }
    } = this.config.yAxis;
    // let { style = defaultText } = title;
    if (!showTitle) {
      return;
    }
    let curHeight =
      getTextWidth('测', style.fontSize * this.dpr + 'px') *
        value.length *
        this.dpr *
        1.35 +
      25 * this.dpr;
    this.yAxisG
      .append('text')
      .attr('class', 'y-title')
      .attr(
        'transform',
        `translate(${
          -yTitleWidth / 2 - yLabelWidth // - (6 + 8) * ((this.config.dpr * 2) / 3 || 1)
        },${curHeight})` // - labelHeight + labelHeight / 2 - titleHeight
      )
      .attr('writing-mode', 'tb')
      .attr('stroke', 'none')
      .attr('fill', () => {
        if (this.config.dashboardGrobalCss) {
          return this.config.dashboardGrobalCss.color;
        } else {
          return style.fontColor;
        }
      })
      .attr('font-size', style.fontSize * this.dpr)
      .attr('font-weight', style.fontWeight)
      .attr('font-style', style.fontStyle)
      .attr('text-decoration', style.textDecoration)
      .text(value);
  }

  optimizationTzitle (yTitleWidth, yLabelWidth) {
    let yTitleNode = this.yAxisG.select('.y-title') && this.yAxisG.select('.y-title').node();
    if (yTitleNode) {
      let getY = Math.abs(yTitleNode.getBBox().y);
      this.yAxisG.select('.y-title')
        .attr(
          'transform',
          `translate(${
            -yTitleWidth / 2 - yLabelWidth // - (6 + 8) * ((this.config.dpr * 2) / 3 || 1)
          },${getY})` // - labelHeight + labelHeight / 2 - titleHeight
        );
    }
  }

  diagonalLineConfig (xScale, yScale) {
    xScale = xScale || this.xScale;
    yScale = yScale || this.yScale;
    let xDomain = xScale.domain();
    let yDomain = yScale.domain();
    // let xTicks = xScale.ticks();
    // let yTicks = yScale.ticks();
    this.svg.selectAll('.diagonal-line').remove();
    let that = this;
    that.svg
      .append('g')
      .attr('class', 'diagonal-line')
      .selectAll('line')
      .data([1])
      .enter()
      .append('line')
      .attr('x1', () => xScale(xDomain[0]))
      .attr('y1', () => yScale(yDomain[0]))
      .attr('x2', () => xScale(xDomain[1]))
      .attr('y2', () => yScale(yDomain[1]))
      .attr('fill', 'none')
      .attr('stroke', '#c2c9d1')
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 1);
  }

  /**
   * 网格线
   */
  gridLineConfig (xScale, yScale) {
    let {
      line: { style = {}, show }
    } = this.config.yAxis.grid || {};
    if (!show) {
      return;
    }
    let {
      line: { style: xLineStyle = {} }
    } = this.config.xAxis.grid || {};

    let that = this;
    xScale = xScale || this.xScale;
    yScale = yScale || this.yScale;
    let xTicks = xScale.ticks();
    let yTicks = yScale.ticks();

    let xDomain = xScale.domain();
    let yDomain = yScale.domain();

    drawGridLine('y-grid-line', xTicks, style)
      .attr('x1', (d, idx) => {
        if (idx === 0) {
          return xScale(xDomain[0]);
        }
        if (idx === xTicks.length - 1) {
          return xScale(xDomain[1]);
        }
        return xScale(d);
      }) // + config.xOffset
      .attr('x2', (d, idx) => {
        if (idx === 0) {
          return xScale(xDomain[0]);
        }
        if (idx === xTicks.length - 1) {
          return xScale(xDomain[1]);
        }
        return xScale(d);
      })
      .attr('y1', yScale(yDomain[0]))
      .attr('y2', yScale(yDomain[1]));

    drawGridLine('x-grid-line', yTicks, xLineStyle)
      .attr('y1', (d, idx) => {
        if (idx === 0) {
          return yScale(yDomain[0]);
        }
        if (idx === yTicks.length - 1) {
          return yScale(yDomain[1]);
        }
        return yScale(d);
      }) // + config.xOffset
      .attr('y2', (d, idx) => {
        if (idx === 0) {
          return yScale(yDomain[0]);
        }
        if (idx === yTicks.length - 1) {
          return yScale(yDomain[1]);
        }
        return yScale(d);
      })
      .attr('x1', xScale(xDomain[0]))
      .attr('x2', xScale(xDomain[1]));

    function drawGridLine (className, ticks, curStyle) {
      that.svg.selectAll('.' + className).remove();
      return that.svg
        .append('g')
        .attr('class', className)
        .selectAll('line')
        .data(ticks)
        .enter()
        .append('line')
        .attr('class', 'grid-line-item')
        .attr('stroke', curStyle.fontColor || '#c2c9d1')
        .attr('stroke-width', curStyle.lineWidth || 1)
        .attr('stroke-opacity', curStyle.opacity || 1)
        .attr('stroke-dasharray', curStyle.lineDash || [0, 0])
        .attr('fill', 'none');
    }
  }

  draw () {}
}
export default GeometryWithAxis;
