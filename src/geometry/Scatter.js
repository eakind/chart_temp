/* eslint-disable no-useless-constructor */
import GeometryWithAxis from './GeometryWithAxis.js';
import { dataProcess, getTextWidth } from '../utils/utils.js';
import defaultConfig from '../utils/defaultConfig.js';
import { isMobile, notEmpty } from '../utils/check.js';
let { defaultFormat, defaultText } = defaultConfig;

class Scatter extends GeometryWithAxis {
  constructor (data, config) {
    super(data, config);
    this.colorScale = null;
    this.init();
  }

  init () {
    this.createContainer();
    this.xScaleConfig();
    this.yScaleConfig();
    this.addCircleColorScale();
    this.zoomProcess();
  }

  zoomProcess () {
    let {
      // xAxis: { key: xKey = '' },
      // yAxis: { key: yKey = '' },
      scopeObj: { select },
      hasUnit
    } = this.config;
    // let { yLabelWidth, yTitleWidth, labelHeight, opacity, titleHeight } = this;
    if (select !== 1) {
      return;
    }
    let that = this;
    let height = this.config.height;
    let width = this.config.width;
    let zoom = d3
      .zoom()
      .scaleExtent([0.5, 64]) // This control how much you can unzoom (x0.5) and zoom (x16)
      .on('zoom', updateChart);

    this.svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .call(zoom);
    let { xAxisG, yAxisG, svg, xScale, yScale } = this;
    function updateChart () {
      // recover the new scale
      var newX = d3.event.transform.rescaleX(xScale);
      var newY = d3.event.transform.rescaleY(yScale);

      // update axes with these new boundaries
      if (hasUnit) {
        xAxisG.call(d3.axisBottom(newX).tickFormat((d) => d3.format('~s')(d)));
        yAxisG.call(d3.axisLeft(newY).tickFormat((d) => d3.format('.2s')(d)));
      } else {
        xAxisG.call(d3.axisBottom(newX));
        yAxisG.call(d3.axisLeft(newY));
      }
      svg.selectAll('.scatter-circle-bundle').remove();
      // update circle position

      // svg
      //   .selectAll('circle')
      //   .attr('cx', function (d) {
      //     return newX(d[xKey]);
      //   })
      //   .attr('cy', function (d) {
      //     return newY(d[yKey]);
      //   })
      //   .attr('fill-opacity', (i) => {
      //     if (newX(i[xKey]) - 16 <= yLabelWidth + yTitleWidth) {
      //       return 0;
      //     } else if (newY(i[yKey]) + 16 >= height - labelHeight - titleHeight) {
      //       return 0;
      //     }
      //     return opacity;
      //   });
      that.setAxisStyle(that.config.xAxis, 'x', true);
      that.setAxisStyle(that.config.yAxis, 'y', true);
      that.draw(newX, newY);
      that.labelsConfig(newX, newY);
      that.diagonalLineConfig(newX, newY);
      that.gridLineConfig(newX, newY);
      that.tooltipConfig();
      that.registerEvent('click');
    }
  }

  getDomain () {
    return this.yScale.domain();
  }

  addCircleColorScale () {
    let { feature } = this.config.sizeFeature;
    if (!feature) {
      return;
    }
    this.data = this.data.filter(item => {
      return item[feature];
    });
    let min = 0;
    let max = 0;
    let sortData = this.data.sort((a, b) => a[feature] - b[feature]);
    min = sortData[0][feature];
    max = sortData[sortData.length - 1][feature];
    let sizeRange = [5, 9];
    if (isMobile()) {
      let curDpr = this.config.dpr;
      sizeRange = [5 * curDpr, 9 * curDpr];
    }
    this.colorScale = d3.scaleLinear().domain([min, max]).range(sizeRange);
  }

  isExistCircle (
    x,
    y,
    radius,
    xKey,
    yKey,
    yTitleWidth,
    yLabelWidth,
    textWidth,
    lineHeight,
    xScale,
    yScale
  ) {
    xScale = xScale || this.xScale;
    yScale = yScale || this.yScale;
    let match = this.data.find((i) => {
      let minX =
        xScale(i[xKey]) - radius - yTitleWidth - yLabelWidth - 6 - 2;
      let minY = yScale(i[yKey]) - radius;
      let maxY = yScale(i[yKey]) + radius;

      if (
        x <= minX &&
        x + textWidth >= minX + radius * 2 &&
        y >= minY &&
        y <= maxY &&
        y + lineHeight >= maxY
      ) {
        return i;
      }
      return null;
    });
    return !!match;
  }

  isExistInCoord (list, x, y, lineHeight) {
    if (list.length === 0) {
      return false;
    }
    let match = list.find((i) => {
      let { x: minX, y: minY, textWidth } = i;
      // console.log(minX, minY, textWidth);
      if (
        Math.abs(minX - x) < textWidth &&
        Math.abs(minY - y) < lineHeight / 2
      ) {
        return i;
      }
      let tempHeight = lineHeight;
      let dpr = this.config.dpr || 1;
      if (dpr !== 1) {
        tempHeight = (dpr * lineHeight * 2) / 3;
      }
      if (
        y + tempHeight >=
        this.config.height - this.labelHeight - this.titleHeight
      ) {
        return i;
      }
      return null;
    });
    return !!match;
  }

  labelsConfig (xScale, yScale) {
    xScale = xScale || this.xScale;
    yScale = yScale || this.yScale;
    this.geometry.selectAll('.scatter-labels').remove();
    let yTitleWidth = this.yTitleWidth;
    let yLabelWidth = this.yLabelWidth;

    let labelHeight = this.labelHeight;
    let titleHeight = this.titleHeight;
    let list = this.config.labelsList;
    if (list.length === 0) {
      return;
    }
    let {
      xAxis: { key: xKey = '' },
      yAxis: { key: yKey = '' },
      sizeFeature
    } = this.config;
    let coordList = [];
    this.geometry
      .selectAll('text')
      .data((d) => {
        let notShowCount = 0;
        list = list.filter((i) => {
          if (xScale(i[xKey]) - 16 <= yLabelWidth + yTitleWidth) {
            return false;
          } else if (
            yScale(i[yKey]) + 16 >=
            this.config.height - labelHeight - titleHeight
          ) {
            return false;
          }
          return true;
        });

        let tempList = list
          .map((l, idx) => {
            let { format = defaultFormat, text = defaultText } = l;
            let radius = 8;
            if (isMobile()) {
              radius = radius * this.config.dpr;
            }
            if (this.colorScale) {
              radius = this.colorScale(d[sizeFeature.feature]);
            }
            let formatVal = dataProcess(d[l.key], format);
            let labelX = xScale(d[xKey]) - yTitleWidth - yLabelWidth + 8; // +radius

            let labelY =
              yScale(d[yKey]) + (idx - notShowCount) * text.lineHeight;

            let textWidth = getTextWidth(formatVal, text.fontSize + 'px');
            if (isMobile()) {
              textWidth = textWidth * this.config.dpr;
            }
            if (
              this.isExistInCoord(coordList, labelX, labelY, text.lineHeight)
            ) {
              notShowCount++;
              return null;
            }
            coordList.push({
              x: labelX,
              y: labelY,
              textWidth
            });
            if (
              !this.isExistCircle(
                labelX,
                labelY,
                radius,
                xKey,
                yKey,
                yTitleWidth,
                yLabelWidth,
                textWidth,
                text.lineHeight,
                xScale,
                yScale
              )
            ) {
              return {
                ...d,
                key: l.key,
                title: l.title,
                format: format,
                text: text,
                formatVal,
                labelX,
                labelY,
                textWidth
              };
            } else {
              notShowCount++;
            }
            return null;
          })
          .filter((f) => {
            if (!f) {
              return false;
            }
            if (
              f.labelX + f.textWidth >
              this.config.width - yTitleWidth - yLabelWidth - 6 - 2
            ) {
              return false;
            }
            return true;
          });

        let totalHeight = tempList.reduce((a, b) => {
          return a + b.text.lineHeight;
        }, yScale(d[yKey]));
        let len =
          (this.config.height - labelHeight - titleHeight - yScale(d[yKey])) /
          defaultText.lineHeight;

        if (totalHeight >= this.config.height - labelHeight - titleHeight) {
          tempList = tempList.slice(0, len);
        }
        return tempList;
      })
      .enter()
      .append('text')
      .attr('class', 'scatter-labels')
      .attr('transform', (d) => `translate(${d.labelX},${d.labelY})`)
      .attr('fill', (d) => {
        if (this.config.dashboardGrobalCss) {
          return this.config.dashboardGrobalCss.color;
        } else {
          return d.text.fontColor;
        }
      })
      .attr('font-size', (d) => d.text.fontSize)
      .text((d) => d.formatVal);
  }

  draw (xScale, yScale) {
    xScale = xScale || this.xScale;
    yScale = yScale || this.yScale;
    let {
      xAxis: { key: xKey = '' },
      yAxis: { key: yKey = '' },
      colorFeature,
      sizeFeature
    } = this.config;
    this.className = 'scatter-circle-item';
    let { yTitleWidth, yLabelWidth } = this;
    this.geometry = this.svg
      .append('g')
      .attr('class', 'scatter-circle-bundle')
      .attr('transform', `translate(${yTitleWidth + yLabelWidth},${0})`)
      .selectAll('g')
      .data((d) => {
        let {
          xAxis: { key: xKey = '' },
          yAxis: { key: yKey = '' }
        } = this.config;
        return this.data.filter((i) => {
          if (
            xScale(i[xKey]) - 16 <=
            this.yLabelWidth + this.yTitleWidth
          ) {
            // return false;
            // 数据丢失，暂且设为true
            return true;
          } else if (
            yScale(i[yKey]) + 16 >=
            this.config.height - this.labelHeight - this.titleHeight
          ) {
            // return false;
            return true;
          }
          return true;
        });
      })
      .enter()
      .append('g')
      .attr('class', 'scatter-circle-item');
    let colorList = [];
    this.geometry
      .append('circle')
      .attr('cx', (d) => {
        return xScale(d[xKey]) - yTitleWidth - yLabelWidth;
      })
      .attr('cy', (d) => {
        return yScale(d[yKey]);
      })
      .attr('r', (d) => {
        if (this.colorScale) {
          return this.colorScale(d[sizeFeature.feature]);
        }
        if (isMobile()) {
          return 8 * this.config.dpr;
        }
        return 8;
      })
      .attr('fill', (d, idx) => {
        let feature = colorFeature ? colorFeature.feature : undefined;
        let match = null;
        let curIdx = idx;
        if (feature) {
          colorList = colorList.map((i) => {
            if (i.val === d[feature]) {
              i.count++;
              match = i;
            }
            return i;
          });
          curIdx = colorList.length;
        }

        if (match) {
          return match.color;
        }

        let color = this.getItemColor(curIdx, feature && d[feature]);

        colorList.push({
          val: d[feature],
          color,
          index: 1
        });

        return color;
      });
    if (notEmpty(this.config.targetAction) && notEmpty(this.config.targetAction[0].feature)) {
      if (notEmpty(this.config.targetAction[0].actions) && this.config.targetAction[0].actions[0].value) {
        let feature = this.config.targetAction[0].feature[0].feature_name;
        let featureVal = this.config.targetAction[0].actions[0].value;
        let opacity = this.config.opacity || 1;
        this.geometry.attr('opacity', opacity * 0.2);
        let allData = this.geometry.data();
        let curIndex;
        allData.forEach((item, index) => {
          if (item[feature] === featureVal) {
            curIndex = index;
          }
        });
        let curDom = this.geometry._groups[0][curIndex];
        d3.select(curDom).attr('opacity', 1);
      }
    }
    this.colorList = colorList;
    this.setClipPath();
  }

  setClipPath () {
    let bundleBox = this.svg.select('.scatter-circle-bundle').node().getBBox();
    let XBoxHeight = this.svg.select('.x-axis').node().getBBox().height;
    let svgHeight = this.svg.select('.scatter-circle-bundle').node().farthestViewportElement.getClientRects()[0].height;
    let clipX = 0;
    let clipY = 0;
    if (bundleBox.x < 0) {
      clipX = Math.abs(bundleBox.x);
      // this.svg.select('.scatter-circle-bundle').attr('clip-path', `inset(0px 0px ${getX}px ${getX}px)`);
    }
    let addHeight = 7;
    if (isMobile()) {
      addHeight = 17;
    }
    if ((XBoxHeight + bundleBox.height + bundleBox.y + addHeight) > svgHeight) {
      clipY = (XBoxHeight + bundleBox.height + bundleBox.y + addHeight) - svgHeight;
    }
    this.svg.select('.scatter-circle-bundle').attr('clip-path', `inset(0px 0px ${clipY}px ${clipX}px)`);
  }

  // /**
  //  * 画图形
  //  */
  // render () {
  //   this.draw();
  //   this.tooltipConfig();
  //   this.registerEvent('click');
  // }
}
export default Scatter;
