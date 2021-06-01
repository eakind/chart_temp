import { isType, getTextWidth } from '../utils/check';

const drawXAxis = (xAxisConfig, container, config) => {
  let isObject = isType('Array');
  let { minWidth, maxWidth, maxHeight, minHeight } = retRange(config);
  if (isObject(xAxisConfig)) {
    return xAxisConfig.map((c) => {
      return axisXProcess(c);
    });
  } else {
    return axisXProcess(xAxisConfig);
  }

  function axisXProcess (conf) {
    let isFunExist = isType('Function');
    if (!isFunExist(scaleFun[conf.type])) {
      return;
    }
    let xScale = scaleFun[conf.type]()
      .domain(conf.data)
      .range([minWidth + 30, maxWidth + 30]);
    if (!isFunExist(axisFun[conf.position])) {
      return;
    }
    let axisX = axisFun[conf.position]().scale(xScale);

    let x = 0;
    let y = 0;
    if (conf.position === 'bottom') {
      y = maxHeight - minHeight + +config.yOffset;
    }
    if (conf.position === 'right') {
      x = maxWidth - minWidth + config.xOffset;
    }
    drawAxis(container, conf, axisX, x, y, config);
    // 画name
    if (conf.name) {
      let offsetX =
        conf.nameLocation === 'end'
          ? maxWidth - minWidth
          : conf.nameLocation === 'middle'
            ? (maxWidth - minWidth) / 2
            : minWidth;
      let strLen = getTextWidth(conf.name, '12pt');
      offsetX = offsetX - strLen + 50;
      container
        .append('foreignObject')
        .attr('class', 'x-name')
        .attr('width', strLen + 30)
        .attr('height', 22)
        .attr('transform', `translate(${offsetX},${maxHeight + 15})`)
        .attr('style', 'text-overflow:ellipsis;white-space:nowrap')
        .attr('font-size', 12)
        .attr('color', '#424242')

        .text(conf.name);
    }
    if (!conf.splitLine || !conf.splitLine.show || conf.type === 'category') {
      return xScale;
    }
    drawYGridLine({
      container,
      xScale,
      minHeight: minHeight,
      maxHeight: maxHeight - minHeight,
      config
    });
    return xScale;
  }
};

function drawAxis (container, conf, axis, x, y, config, type) {
  let { axisTick, axisLabel, axisLine } = conf;
  let {
    color: lineColor = '#a4a4a4',
    width: lineWidth = 1,
    // type: lineType = 'solid',
    opacity: lineOpacity = 1
  } = axisLine.lineStyle;
  // 刻度加样式
  if (axisTick) {
    axis.tickSize(axisTick.length || 6).tickPadding(axisTick.padding || 8);
    if (typeof axisTick.interval === 'number') {
      axis.ticks(axisTick.interval);
    }
  }
  let axisG = container
    .append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${x},${y})`)
    .attr('fill', 'none')
    .call(axis.tickSizeOuter(0));
  axisG.call((g) =>
    g
      .selectAll('path')
      .attr('transform', `translate(${config.xOffset},${config.yOffset})`)
  );
  if (!axisLabel.show) {
    axisG.call((g) => g.selectAll('text').remove());
  }
  // 标签加样式
  if (axisLabel && axisLabel.style) {
    axisG.call((g) =>
      g
        .selectAll('text')
        .attr('text-anchor', 'middle')
        .attr('fill', axisLabel.style.color)
        .attr(
          'transform',
          `translate(${type !== 'y' ? config.xOffset : 10},${config.yOffset})`
        )
        .attr(
          'style',
          `font-size:${axisLabel.style.fontSize}px;transform:translate(${config.xOffset},${config.yOffset}) rotate(${axisLabel.style.rotate}deg)`
        )
    );
  }
  if (!axisTick.show) {
    axisG.call((g) => g.selectAll('line').remove());
  } else {
    axisG.call((g) =>
      g
        .selectAll('line')
        .attr('stroke', lineColor)
        .attr('stroke-width', lineWidth)
        .attr('stroke-opacity', lineOpacity)
        .attr('transform', `translate(${config.xOffset},${config.yOffset})`)
    );
  }
  if (!axisLine.show) {
    axisG.selectAll('path').attr('style', 'display:none');
  }
}

const drawYAxis = (yAxisConfig, container, config) => {
  let isObject = isType('Array');
  let { minWidth, maxWidth, maxHeight, minHeight } = retRange(config);
  if (isObject(yAxisConfig)) {
    return yAxisConfig.map((c) => {
      return axisYProcess(c);
    });
  } else {
    return axisYProcess(yAxisConfig);
  }

  function axisYProcess (conf) {
    let isFunExist = isType('Function');
    if (!isFunExist(scaleFun[conf.type])) {
      return;
    }
    let yScale = scaleFun[conf.type]()
      .domain(conf.data)
      .range([maxHeight - minHeight, minHeight]);
    if (!isFunExist(axisFun[conf.position])) {
      return;
    }
    let tickValues = calculateTickValues(conf.data);
    let axisY = axisFun[conf.position]()
      .scale(yScale)
      .tickValues(tickValues)
      .tickFormat(d3.format('.2f'));
    let x = minWidth + config.xOffset;
    let y = 0;
    if (conf.position === 'right') {
      x = maxWidth - minWidth + config.xOffset;
    }
    drawAxis(container, conf, axisY, x, y, config, 'y');

    if (conf.name) {
      let offsetY =
        conf.nameLocation === 'end'
          ? maxHeight - minHeight - 30
          : conf.nameLocation === 'middle'
            ? (maxHeight - minHeight) / 2
            : minHeight;
      container
        .append('g')
        .attr('class', 'y-name')
        .attr('transform', `translate(5,${offsetY + 4})`)
        .append('text')
        .attr('writing-mode', 'tb')
        .attr('font-size', 12)
        .attr('color', '#424242')
        .text(conf.name);
    }

    if (!conf.splitLine || !conf.splitLine.show) {
      return yScale;
    }
    drawXGridLine({
      container,
      yScale,
      minWidth: minWidth + 30,
      maxWidth: maxWidth + 30,
      tickValues,
      config
    });
    return yScale;
  }
};

const drawYGridLine = function ({
  container,
  xScale,
  minHeight,
  maxHeight,
  config
}) {
  container
    .append('g')
    .attr('class', 'x-grid-line-box')
    .attr('transform', `translate(${config.xOffset},${config.yOffset})`)
    .selectAll('line')
    .data(xScale.ticks())
    .enter()
    .append('line')
    .attr('stroke', 'rgba(0,0,0,.2)')
    .attr('fill', 'none')
    .attr('x1', (d) => 0.5 + xScale(d)) // + config.xOffset
    .attr('x2', (d) => 0.5 + xScale(d))
    .attr('y1', minHeight)
    .attr('y2', maxHeight);
};

const drawXGridLine = function ({
  container,
  yScale,
  minWidth,
  maxWidth,
  tickValues,
  config
}) {
  container
    .append('g')
    .attr('class', 'y-grid-line-box')
    .attr('transform', `translate(${config.xOffset},${config.yOffset})`)
    .selectAll('line')
    .data(tickValues)
    .enter()
    .append('line')
    .attr('stroke', 'rgba(0,0,0,.2)')
    .attr('fill', 'none')
    .attr('y1', (d) => 0.5 + yScale(d))
    .attr('y2', (d) => 0.5 + yScale(d))
    .attr('x1', minWidth) // + config.xOffset
    .attr('x2', maxWidth);
};
let retRange = function (config) {
  let {
    width,
    height,
    grid = {
      x: 20,
      y: 20
    }
  } = config;
  let minWidth = grid.x;
  let maxWidth = width;
  let minHeight = grid.y;
  let maxHeight = height;
  return {
    minHeight,
    maxHeight,
    minWidth,
    maxWidth
  };
};

let scaleFun = (function () {
  return {
    value: () => d3.scaleLinear(),
    category: () => d3.scaleBand(),
    time: () => d3.scaleTime()
  };
})();
let axisFun = (function () {
  return {
    bottom: () => d3.axisBottom(),
    top: () => d3.axisTop(),
    left: () => d3.axisLeft(),
    right: () => d3.axisRight()
  };
})();

const calculateTickValues = function (domain, tickCounts) {
  if (!tickCounts) {
    tickCounts = 9;
  }

  let tickArray = [];
  let interval = (domain[1] - domain[0]) / tickCounts;
  for (let i = 0; i <= tickCounts; i++) {
    let num = domain[0] + interval * i;
    tickArray.push(num);
  }
  return tickArray;
};

export { drawXAxis, drawYAxis, drawYGridLine, drawXGridLine };
