import { getTxtWidth, drawClipPath } from '../common/containerUtils';
import { showTooltip, hideTooltip } from './tooltip';
/*
decimal: "", // 小数位数
isPercent: false
negative: -1
prefix: ""
selectFormat: -1
setFlag: true
suffix: ""
unit: ""
useThousandMark: true // 是否使用千分位
zone: "¥ 人民币" 货币格式
*/
const setTxtFormat = (text, format) => {
  if (!format) return text;
  if (JSON.stringify(format) === '{}') return text;
  if (text === null) return '';
  if (isNaN(text)) return '';
  let {
    decimal,
    negative,
    prefix,
    selectFormat,
    suffix,
    unit,
    useThousandMark,
    zone
  } = format;
  let isOriginal = false;
  if (decimal < 0) decimal = 0;
  if (decimal === '') isOriginal = true;
  let thousandMark = useThousandMark ? ',' : '';
  if (selectFormat !== 'percent') {
    const unitMap = {
      K: 1e+3,
      M: 1e+6,
      G: 1e+9,
      T: 1e+12
    };
    // 单位换算
    if (unit) {
      let unitKey = unit.split(' ')[0] || 1;
      text /= unitMap[unitKey];
    };
    // 负值显示
    if (negative === '(1234)') negative = 0;
    if (negative === '1234-') negative = 1;
    if (parseFloat(text) < 0) {
      if (negative === 0) {
        let textFormat = isOriginal ? d3.format(thousandMark) : d3.format(`${thousandMark}.${decimal}f`);
        text = `(${textFormat(Math.abs(text))})`;
      } else if (negative === 1) {
        let textFormat = isOriginal ? d3.format(thousandMark) : d3.format(`${thousandMark}.${decimal}f`);
        text = `${textFormat(Math.abs(text))}-`;
      } else {
        // 整数
        let textFormat = isOriginal ? d3.format(`${thousandMark}`) : d3.format(`${thousandMark}.${decimal}f`);
        text = textFormat(text);
      }
    } else {
      // 整数
      let textFormat = isOriginal ? d3.format(`${thousandMark}`) : d3.format(`${thousandMark}.${decimal}f`);
      text = textFormat(text);
    }
    text += unit || '';
  } else {
    text *= 100;
    let textFormat = isOriginal ? d3.format(`${thousandMark}`) : d3.format(`${thousandMark}.${decimal}f`);
    let num = textFormat(Math.abs(text));
    if (text < 0) {
      if (negative === 0) text = `(${num})`;
      else if (negative === 1) text = `${num}-`;
      else text = `-${num}`;
    } else {
      text = num;
    }
  }

  if (selectFormat === 'currency') {
    zone = zone || '';
    let zoneMap = {
      '': '',
      CN: '¥',
      JP: '￥',
      HK: 'HK$',
      US: '＄',
      EUR: '€',
      GBP: '£'
    };
    let prefix = zoneMap[zone];
    if (!prefix) {
      zoneMap = {
        '': '',
        '¥ 人民币': '¥',
        '￥ 日元': '￥',
        'HK$ 港元': 'HK$',
        '＄ 美元': '＄',
        '€ 欧元': '€',
        '£ 英镑': '£'
      };
      prefix = zoneMap[zone];
    }
    text = `${prefix}${text}`;
  }
  return `${prefix}${text}${suffix}`;
};

const drawLabel = (
  middle,
  data,
  scaleY,
  bandwidth,
  topAxisHeight,
  height,
  size,
  num,
  total,
  key,
  keyId,
  labelList,
  tooltipList,
  isStack,
  isLine,
  click,
  colorObj,
  id,
  shapeWidth,
  yAxisHeight,
  index,
  start
) => {
  if (!labelList || !labelList.length) return;
  let labelsList = JSON.parse(JSON.stringify(labelList.reverse()));
  let list = labelsList.filter(item => item.key === key && item.display === 'auto' && item.keyId === keyId);
  let labelContainer = middle.append('g')
    .attr('transform', `translate(0,${topAxisHeight})`);
  drawClipPath(labelContainer, shapeWidth, yAxisHeight, index, start, id);
  labelContainer.append('g');
  let label = '';
  let labelTotal = 0;
  data = data.filter(item => item);
  if (isStack) {
    let grouplabel = labelContainer.selectAll('group-label').data(data).enter();
    label = grouplabel.selectAll('category-label')
      .data(d => {
        if (!d) return '';
        return d;
      })
      .enter().append('g')
      .attr('class', (d, index) => `label-${index}`);
    labelTotal = label._groups[0].length;
  } else {
    label = labelContainer.selectAll(`label_${num}`).data(data).enter().append('g');
    labelTotal = label._groups[0].length;
  }
  for (let i = 0, len = list.length; i < len; i++) {
    let { text, format } = list[i];
    let barWidth = (bandwidth / total) * size;
    let gap = (bandwidth - barWidth * total) / 2;
    let labelGroup = label.append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', text.fontColor)
      .attr('font-size', text.fontSize)
      .style('line-height', `${text.lineHeight}`)
      .attr('class', 'label')
      .attr('index', (d, index) => {
        if (isStack) {
          return `${start}-${index}-${num}-${d.data[colorObj.feature]}`;
        }
        if (isLine) {
          return `${start}-${index}-${num}-${d[colorObj.feature || colorObj.key]}`;
        }
        return `${start}-${index}-${num}`;
      })
      .attr('x', (d, index) => {
        return (index * bandwidth) + (num * (barWidth + 2)) + gap + (barWidth / 2);
      })
      .on('mouseout', (d) => {
        hideTooltip();
      })
      .on('mouseenter', (d) => {
        if (d === null) return '';
        showTooltip(isStack ? d.data : d, tooltipList);
      })
      .on('click', function (d, index) {
        if (isStack) {
          click(d.data);
        } else {
          click(d);
        }
      });
    if (isStack) {
      labelGroup.attr('y', d => {
        if (d === null) return '';
        if (isLine) {
          let totalHeight = 20 * len;
          return scaleY(d[1] - Math.max(d[0], 0)) - 12 - totalHeight * i / len;
        } else {
          let totalHeight = 20 * len;
          let height = Math.max(scaleY(d[1]) - scaleY(d[0]), 0);
          if (d[1] > 0) {
            height = Math.max(scaleY(d[0]) - scaleY(d[1]), 0);
            return scaleY(d[1]) + height / 2 + totalHeight * (i) / len;
          }
          return scaleY(d[1]) - height / 2 + totalHeight * (i) / len;
        };
      })
        .text(d => {
          if (d === null) return '';
          return setTxtFormat(d.data[list[i].title], format);
        })
        .attr('fill-opacity', (d) => {
          if (d === null) return 0;
          if (isLine) return 1;
          let height = Math.max(scaleY(d[1]) - scaleY(d[0]), 0);
          if (d[1] > 0) {
            height = Math.max(scaleY(d[0]) - scaleY(d[1]), 0);
          }
          let totalHeight = 20 * len;
          if (height > totalHeight) {
            return 1;
          } else {
            return 0;
          }
        });
    } else {
      labelGroup.attr('y', d => {
        if (d === null) return '';
        if (!d[key]) return '';
        let y = scaleY(d[key]) - 25 * i - 5;
        if (d[key] < 0) {
          y = scaleY(d[key]) + 25 * i + 20;
        }
        if (isLine) {
          y = scaleY(d[key]) - 25 * i - 15;
        }
        return y;
      })
        .text(function (d, index) {
          if (d === null) return '';
          let text = setTxtFormat(d[list[i].title], format);
          return text;
        })
        .attr('fill-opacity', function (d) {
          return 1;
          // if (d === null) return 0;
          // if (d[key] === null) return 0;
          // if (isLine) return 1;
          // let position = scaleY(d[key]) - 25 * i - 10;
          // if (d[key] < 0) {
          //   position = scaleY(d[key]) + 25 * i + 20;
          // }
          // if (isLine) {
          //   position = scaleY(d[key]) - 25 * i - 15;
          // }
          // if (d[key] > 0) {
          //   let max = scaleY.domain()[1];
          //   if (position < scaleY(max)) {
          //     return scaleY.domain()[1];
          //   }
          // } else {
          //   let min = scaleY.domain()[0];
          //   if (position > scaleY(min)) {
          //     return 0;
          //   }
          // }
          // return 1;
        });
    }
  };
  filterShowLabel(id, labelTotal, bandwidth, false, isLine);
};

const drawRotatedLabel = (
  middle,
  data,
  scaleY,
  bandwidth,
  size,
  topAxisHeight,
  height,
  num,
  total,
  key,
  keyId,
  labelList,
  tooltipList,
  isStack,
  click,
  colorObj,
  id,
  shapeWidth,
  yAxisHeight,
  index,
  start
) => {
  if (!labelList || !labelList.length) return;
  let labelsList = JSON.parse(JSON.stringify(labelList.reverse()));
  let barWidth = (bandwidth / total) * size;
  let list = labelsList.filter(item => item.key === key && item.keyId === keyId);
  let labelContainer = middle.append('g').attr('transform', `translate(${topAxisHeight},0)`);
  drawClipPath(labelContainer, yAxisHeight, shapeWidth, index, start, id);
  labelContainer = labelContainer.append('g');
  let label = '';
  let labelTotal = 0;
  if (isStack) {
    let grouplabel = labelContainer.selectAll('group-label').data(data).enter();
    label = grouplabel.selectAll('category-label')
      .data(d => {
        return d;
      })
      .enter().append('g')
      .attr('class', (d, index) => `label-${index}`);
    labelTotal = label._groups[0].length;
  } else {
    label = labelContainer.selectAll(`label_${num}`).data(data).enter().append('g');
    labelTotal = label._groups[0].length;
  }
  let len = list.length;
  for (let i = 0; i < len; i++) {
    let { text, format } = list[i];
    let labelGroup = label.append('text')
      .attr('text-anchor', 'start')
      .attr('fill', text.fontColor)
      .attr('font-size', text.fontSize)
      .attr('class', 'label')
      .attr('index', (d, index) => {
        if (isStack) {
          return `${start}-${index}-${num}-${d.data[colorObj.feature]}`;
        }
        return `${start}-${index}-${num}`;
      })
      .attr('y', (d, index) => {
        let start = index * bandwidth + bandwidth / 4;
        let barStart = barWidth * num;
        let center = barWidth / 2 + 5;
        let position = start + barStart + center + ((i - len / 2)) * 20 + 9;
        return position;
      })
      .on('mouseout', (d) => {
        hideTooltip();
      })
      .on('mouseenter', (d) => {
        showTooltip(isStack ? d.data : d, tooltipList);
      })
      .on('click', function (d, index) {
        if (isStack) {
          click(d.data);
        } else {
          click(d);
        }
      });
    if (isStack) {
      labelGroup.attr('x', (d) => {
        let height = scaleY(d[0]) + (scaleY(d[1]) - scaleY(d[0])) / 2;
        if (d[0] < 0) {
          height = scaleY(d[1]) + (scaleY(d[0]) - scaleY(d[1])) / 2;
        }
        return height;
      }).text(d => {
        let text = setTxtFormat(d.data[list[i].title], format);
        return text;
      }).attr('fill-opacity', (d) => {
        let len = (scaleY(d[1]) - scaleY(d[0])) / 2;
        if (d[1] < 0) {
          len = (scaleY(d[0]) - scaleY(d[1])) / 2;
        }
        let txt = setTxtFormat(d.data[list[i].title], format);
        let txtLen = getTxtWidth(txt, text.fontSize);
        if (len >= txtLen) {
          return 1;
        } else {
          return 0;
        };
      }).attr('text-anchor', 'middle');
    } else {
      labelGroup.attr('x', (d) => {
        if (!d[key]) return 4;
        let position = scaleY(d[key]) + 4;
        if (d[key] < 0) {
          position = scaleY(d[key]) - 5;
        }
        return position;
      }).attr('fill-opacity', (d) => {
        return 1;
      }).text(d => {
        return setTxtFormat(d[list[i].title], format);
      }).attr('text-anchor', (d) => {
        if (!d[key]) return 'start';
        return d[key] > 0 ? 'start' : 'end';
      });
    };
  };
  filterShowLabel(id, labelTotal, bandwidth, true);
};

const filterShowLabel = (id, labelTotal, bandwidth, isRotated, isLine) => {
  let domList = document.querySelector(`#${id}`).querySelectorAll('.label[fill-opacity="1"]');
  domList = [].slice.apply(domList);
  let indexList = [];
  let width = bandwidth * labelTotal;
  for (let i = 0, len = domList.length; i < len; i++) {
    if (!isRotated) {
      let text = domList[i].textContent;
      let fontSize = domList[i].getAttribute('font-size');
      let txtLen = getTxtWidth(text, fontSize) / 2;
      let x = +domList[i].getAttribute('x');
      if (x - txtLen < 0 || x + txtLen >= width) {
        domList[i].style.display = 'none';
      };
    }
    if (i === 0) continue;
    if (!mixedLabel(domList[i], domList.slice(0, i))) {
      let index = domList[i].getAttribute('index');
      domList[i].style.display = 'none';
      indexList.push(index);
    };
  }
  indexList = [...new Set(indexList)];
  for (let i = 0, labelLen = indexList.length; i < labelLen; i++) {
    let domList = document.querySelector(`#${id}`).querySelectorAll(`.label[index='${indexList[i]}']`);
    for (let j = 0; j < domList.length; j++) {
      domList[j].style.display = 'none';
    }
  }
  let hideList = document.querySelector(`#${id}`).querySelectorAll('.label[fill-opacity="0"]');
  for (let i = 0; i < hideList.length; i++) {
    let index = hideList[i].getAttribute('index');
    let domList = document.querySelector(`#${id}`).querySelectorAll(`.label[index='${index}']`);
    for (let j = 0; j < domList.length; j++) {
      domList[j].style.display = 'none';
    }
  }
};

const mixedLabel = (dom, list) => {
  let rect = dom.getBoundingClientRect();
  if (dom.style.display === 'none') return true;
  for (let i = 0; i < list.length; i++) {
    if (collision(rect, list[i].getBoundingClientRect())) {
      return false;
    }
  }
  return true;
};

const collision = (rect, temp) => {
  var ax = rect.left - 1;
  var ay = rect.top - 1;
  var aw = rect.width + 2;
  var ah = rect.height + 2;
  var bx = temp.left - 1;
  var by = temp.top - 1;
  var bw = temp.width + 2;
  var bh = temp.height + 2;
  return (ax + aw > bx && ax < bx + bw && ay + ah > by && ay < by + bh);
};

const filterLabel = (id) => {
  let domList = document.querySelector(`#${id}`).querySelectorAll('.label[fill-opacity="1"]');
  let dotList = document.querySelector(`#${id}`).querySelectorAll('.line-dot');
  for (let i = 0, len = domList.length; i < len; i++) {
    if (!mixedLabel(domList[i], dotList)) {
      domList[i].style.display = 'none';
    };
  }
};

export {
  drawLabel,
  drawRotatedLabel,
  setTxtFormat,
  filterLabel
};
