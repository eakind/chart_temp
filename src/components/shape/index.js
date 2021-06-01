import { isType } from '../../utils/check';

function retValue (xScale, yScale) {
  let tempXScale = xScale;
  let tempYScale = yScale;
  let isArray = isType('Array');
  if (isArray(xScale)) {
    tempXScale = xScale[0];
  }
  if (isArray(yScale)) {
    tempYScale = yScale[0];
  }
  return {
    tempXScale,
    tempYScale,
    xValue (d) {
      return isArray(d) ? tempXScale(d[0]) : tempXScale(d.name);
    },
    yValue (d) {
      return isArray(d) ? tempYScale(d[1]) : tempYScale(d.value);
    }
  };
}

function drawSymbol (config, container, xScale, yScale) {
  let { xValue, yValue } = retValue(xScale, yScale);
  let symbolContainer = container
    .append('g')
    .attr('class', 'symbol')
    .attr('transform', `translate(${config.xOffset},${config.yOffset})`);
  return {
    circle: function (s) {
      let { symbolSize, symbolBorderWidth, symbolColor, symbolOpacity } = s;
      symbolContainer
        .append('g')
        .selectAll('circle')
        .data(s.data)
        .enter()
        .append('circle')
        .attr('stroke-width', symbolBorderWidth)

        .attr('data-data', (d) => d)
        .attr('data-index', (d, index) => index)
        .attr('cx', (d) => xValue(d))
        .attr('cy', (d) => yValue(d))
        .attr('r', symbolSize)
        .attr('fill', symbolColor)
        .attr('fill-opacity', symbolOpacity);
    }
  };
}
export { retValue, drawSymbol };
