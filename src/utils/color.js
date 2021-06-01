import colorConfig from './defaultConfig.js';
import { hexToRgba } from '../utils/utils.js';
let { colorSet } = colorConfig;
let getItemColor = function (
  index,
  colorList,
  colorFeatureType = 'ordinal',
  minVal,
  maxVal,
  curVal,
  feature,
  flag,
  opacity
) {
  let colorProcess = (function () {
    return {
      getOrdinalItemColor: function () {
        if (!feature) {
          return colorSet.category[0];
        }
        if (colorList && colorList.length > 0) {
          let match = colorList.find((i) => i.val === curVal);
          if (match) {
            return match.color;
          }
        }
        // if (colorList.length > 0) {
        //   colorList = colorSet.category.filter(
        //     (m) =>
        //       !colorList.find((i) => {
        //         if (i.color && i.color.indexOf('#') > -1) {
        //           return i.color === m;
        //         }
        //         return hexToRgba(m, opacity * 100) === i.color;
        //       })
        //   );
        // }

        // // 数据量大的时候，获取数据时由于量的限制，所以可能出现数据不同的情况，这时候需要对数据进行重新计算
        // if (colorList.length === 0) {
        //   colorList = colorSet.category;
        // }

        // 每次更改数据都重新计算颜色；这样可以保证更改前后数据是一样的，比如过滤器
        colorList = colorSet.category;

        if (colorList.length <= index) {
          return hexToRgba(colorList[index % colorList.length], opacity * 100);
        }
        return hexToRgba(colorList[index], opacity * 100);
      },
      getLinearItemColor: function () {
        let tempColorList = colorSet.numeric;
        let curColorList = colorList.map((i) => i.color || i);
        let opacity1 = opacity;
        let opacity2 = opacity;
        if (curColorList && curColorList.length > 0) {
          opacity1 = colorList[0].opacity
            ? (colorList[0].opacity / 100).toFixed(2)
            : opacity;
          opacity2 = colorList[1].opacity
            ? (colorList[1].opacity / 100).toFixed(2)
            : opacity;
          if (!(curColorList[0] === curColorList[1] && flag)) {
            tempColorList = curColorList;
          }
        }
        let startColor = d3.rgb(tempColorList[0]);
        let endColor = d3.rgb(tempColorList[1]);
        startColor.opacity = opacity1;
        endColor.opacity = opacity2;
        let compute = d3.interpolate(startColor, endColor);
        if (maxVal === minVal) {
          return tempColorList[0];
        }
        if (!flag) {
          return tempColorList[0];
        }
        if (curVal < minVal) {
          return compute(0);
        }
        if (curVal - minVal > maxVal - minVal) {
          return compute(1);
        }
        return compute((curVal - minVal) / (maxVal - minVal));
      }
    };
  })();
  let funName =
    'get' +
    colorFeatureType.slice(0, 1).toUpperCase() +
    colorFeatureType.slice(1) +
    'ItemColor';

  if (typeof colorProcess[funName] === 'function') {
    return colorProcess[funName]();
  }
  return ''; // 随便
};

export { getItemColor };
