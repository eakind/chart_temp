const createContainer = (id, canvasHeight, index, colorList, click) => {
  return d3.select(`#${id}`).append('div').attr('class', `chart-container-${index}`)
    .style('display', 'flex')
    .style('position', 'relative')
    .style('box-sizing', 'border-box')
    .style('width', '100%')
    .style('height', `${canvasHeight}px`)
    .on('click', () => {
      let main = d3.select(`#${id}`);
      for (let i = 0; i < colorList.length; i++) {
        let keyId = colorList[i].keyId;
        let opacity = colorList[i].opacity / 100;
        main.selectAll(`.shape-${keyId}`).selectAll('.bar').attr('opacity', opacity);
        main.selectAll(`.shape-${keyId}`).selectAll('.line-path').attr('opacity', opacity);
        main.selectAll(`.shape-${keyId}`).selectAll('.line-dot').attr('opacity', opacity);
      }
      click(null);
      main.selectAll('.label').attr('opacity', 1);
    }, true);
};

const createLeftAxis = (container, leftMaxWidth, canvasHeight, index) => {
  return container.append('div').attr('class', `left-axis-${index}`)
    .style('display', 'flex')
    .style('flex-direction', 'row-reverse')
    .append('svg')
    .attr('width', leftMaxWidth)
    .attr('height', canvasHeight);
};

const createMiddle = (container, shapeWidth, canvasHeight, index) => {
  return container.append('div').attr('class', `mc-middle middle-${index}`)
    .style('flex', 1)
    .style('width', 0)
    .style('overflow-x', 'auto')
    .style('overflow-y', 'hidden')
    .append('svg')
    .style('display', 'block')
    .attr('width', shapeWidth)
    .attr('height', canvasHeight);
};

const createRightAxis = (container, rightMaxWidth, canvasHeight, index) => {
  return container.append('div').attr('class', `right-axis-${index}`)
    .style('display', 'flex')
    .append('svg')
    .style('display', 'block')
    .attr('width', rightMaxWidth)
    .attr('height', canvasHeight);
};

const createRotatedContainer = (id, canvasHeight, index, colorList, click) => {
  return d3.select(`#${id}`).append('div').attr('class', `chart-container-${index}`)
    .style('position', 'relative')
    .style('box-sizing', 'border-box')
    .style('width', `${canvasHeight}px`)
    .style('height', '100%')
    .on('click', () => {
      let main = d3.select(`#${id}`);
      for (let i = 0; i < colorList.length; i++) {
        let keyId = colorList[i].keyId;
        let opacity = colorList[i].opacity / 100;
        main.selectAll(`.shape-${keyId}`).selectAll('.bar').attr('opacity', opacity);
      }
      click(null);
      main.selectAll('.label').attr('opacity', 1);
    }, true);
};

const createRotatedLeftAxis = (container, leftMaxWidth, canvasHeight, index) => {
  return container.append('div').attr('class', `right-axis-${index}`)
    .style('display', 'flex')
    .append('svg')
    .style('display', 'block')
    .attr('width', canvasHeight)
    .attr('height', leftMaxWidth);
};

const createRotatedMiddle = (container, height, leftMaxWidth, rightMaxWidth, canvasHeight, shapeWidth, index) => {
  return container.append('div').attr('class', `mc-middle middle-${index}`)
    .style('flex', 1)
    .style('height', `${height - (leftMaxWidth + rightMaxWidth)}px`)
    .style('overflow-y', 'auto')
    .style('overflow-x', 'hidden')
    .append('svg')
    .style('display', 'block')
    .attr('width', canvasHeight)
    .attr('height', shapeWidth);
};

const createRotatedRightAxis = (container, rightMaxWidth, canvasHeight, index) => {
  return container.append('div').attr('class', `left-axis-${index}`)
    .style('display', 'flex')
    .style('flex-direction', 'row-reverse')
    .append('svg')
    .style('display', 'block')
    .attr('width', canvasHeight)
    .attr('height', rightMaxWidth);
};

const filterColor = (colorList, index) => {
  let arr = [];
  for (let i = 0; i < colorList.length; i++) {
    let num = Number(colorList[i].keyId.split('-')[0]);
    if (num === index) {
      arr.push(colorList[i]);
    }
  }
  return arr;
};

const createClipPath = (middle, keyId, width, height, topAxisHeight) => {
  middle.append('defs').append('clipPath').attr('id', `clip-${keyId}`)
    .attr('transform', `translate(0,${topAxisHeight})`)
    .append('rect').attr('width', width).attr('height', height);
  return `url(#clip-${keyId})`;
};

export {
  createContainer,
  createLeftAxis,
  createMiddle,
  createRightAxis,
  createRotatedContainer,
  createRotatedLeftAxis,
  createRotatedMiddle,
  createRotatedRightAxis,
  filterColor,
  createClipPath
};
