const drawLabel = (container, data, xScale, yScale, labelConfig, config) => {
  let {
    position = 'top',
    distance = 5,
    fontStyle = 'normal',
    color = '#a4a4a4',
    rotate = 0,
    fontSize = 12
  } = labelConfig;
  let translate = '';
  let labelContainer = container
    .append('g')
    .attr('class', 'label')
    .attr('transform', `translate(${config.xOffset},${config.yOffset})`);
  if (position === 'top' || position === 'bottom') {
    position === 'top' ? (translate = `translate(0, -${distance})`) : (translate = `translate(0, ${distance})`);
  } else {
    position === 'left' ? (translate = `translate(-${distance}, 0)`) : (translate = `translate(${distance}, 0)`);
  }
  labelContainer.append('svg')
    .attr('class', 'label')
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('transform', `${translate} rotate(${rotate})`)
    .attr('stroke', color)
    .attr('style', `font-style:${fontStyle};left:50%`)
    .attr('x', d => xScale(d) - 8)
    .attr('y', d => yScale(d))
    .attr('font-size', fontSize)
    .append('tspan')
    .text(d => {
      return d.value ? d.value : d[1];
    });
};

export {
  drawLabel
};
