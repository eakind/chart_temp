/* eslint-disable no-useless-constructor */
import { dataProcess, getTextWidth } from '../utils/utils.js';
import { notEmpty } from '../utils/check.js';
import defaultConfig from '../utils/defaultConfig.js';

import Geometry from './Geometry.js';
let { defaultFormat, defaultText } = defaultConfig;
class Bubble extends Geometry {
  constructor (data, config) {
    super(data, config);
    this.init();
    this.colorList = [];
  }

  init () {
    this.createContainer();
  }

  labelsConfig () {
    let list = this.config.labelsList;
    if (list.length === 0) {
      return;
    }
    let dpr = this.config.dpr || 1;
    this.geometry.selectAll('.bubble-labels').remove();
    let textDom = this.geometry
      .append('text')
      .attr('class', 'bubble-labels')
      .attr('text-anchor', 'middle')
      .attr('startOffset', '50%')
      .attr('textLength', (d) => d.radius)
      .attr(
        'transform',
        (d) =>
          `translate(0, -${
            list.slice(0, 2).reduce((a, b) => a + b.text.lineHeight, 0) / 2
          })`
      );
    textDom
      .selectAll('tspan')
      .data((d) => {
        let tempList = list
          .map((l) => {
            let { format = defaultFormat } = l;
            return {
              ...d,
              key: l.key,
              title: l.title,
              format: l.format,
              text: l.text || defaultText,
              formatVal: dataProcess(d[l.key], format)
            };
          })
          .filter(
            (f) =>
              getTextWidth(f.formatVal, f.text.fontSize + 'px') * dpr <
              d.radius * 2 * 0.8
          );
        let totalHeight = tempList.reduce((a, b) => {
          return a + b.text.lineHeight;
        }, 0);

        if (totalHeight > d.radius * 2 * 0.8) {
          tempList = tempList.slice(0, 2);
        }
        return tempList;
      })
      .enter()
      .append('tspan')
      .attr('x', (d) => 0)
      .attr('dy', (d) => `${d.text.lineHeight}px`)
      .attr('fill', (d) => d.text.fontColor)
      .attr('font-size', (d) => d.text.fontSize)
      .text((d) => d.formatVal);
  }

  draw () {
    let { size, width, height, colorFeature, orderStyle } = this.config;
    // 修改移动端展板的气泡大小
    let isDashBoard = window.location.href.indexOf('dashboard') >= 0;
    if (isDashBoard) {
      size = size * 1.4;
    }
    let pack = d3.pack().size([width * size, height * size]);
    let root = d3
      .hierarchy({
        children: this.data
      })
      .sum((d) => {
        return d[this.config.sizeFeature.feature];
      });
    if (orderStyle === -1) {
      root.sort((a, b) => b.value - a.value);
    } else if (orderStyle === 1) {
      root.sort((a, b) => a.value - b.value);
    } else {
      root.sort(() => Math.random() * 2 - 1);
    }
    let colorList = [];
    var nodes = pack(root)
      .leaves()
      .map((d, idx) => {
        let colorVal = colorFeature.feature;
        let val = d.data[colorVal]; // colorFeature.type === 'ordinal' ? d.data[colorVal] : d.value;
        let color = this.getItemColor(idx, val);

        if (colorFeature.feature) {
          let match = colorList.find(
            (i) => i.val === d.data[colorFeature.feature]
          );

          color = match ? match.color : color;

          !match &&
            colorList.push({
              val: d.data[colorFeature.feature],
              color
            });
        }
        return {
          x: d.x,
          y: d.y,
          r: d.r,
          color,
          id: 'bubble-circle' + idx,
          radius: d.r,
          value: d.value,
          ...d.data
        };
      });
    this.colorList = colorList;
    this.className = 'bubble-circle';
    this.geometry = this.svg
      .append('g')
      .attr('class', 'bubble-wrap')
      .attr(
        'transform',
        `translate(${(width - width * size) / 2},${
          (height - height * size) / 2
        })`
      )
      .selectAll('bubble-circle')
      .data(nodes)
      .enter()
      .append('g')
      .attr('id', (d) => d.id)
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
      .attr('opacity', (d) => {
        if (notEmpty(this.config.targetAction) && notEmpty(this.config.targetAction[0].feature)) {
          if (notEmpty(this.config.targetAction[0].actions) && this.config.targetAction[0].actions[0].value) {
            let feature = this.config.targetAction[0].feature[0].feature_name;
            let featureVal = this.config.targetAction[0].actions[0].value;
            if (d[feature] === featureVal) {
              return 1;
            } else {
              return 0.2;
            }
          }
        } else {
          return null;
        }
      });

    this.geometry
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', (d) => d.r)
      .attr('fill', (d) => d.color)
      .attr('fill-opacity', (d) => {
        if (d.color.indexOf('#') > -1) {
          return this.opacity;
        }
        return 1;
      });
  }
}

export default Bubble;
