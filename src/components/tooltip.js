const drawTooltip = (target, config, data, index) => {
  let dom = document.querySelector(config.id);
  let clientLeft = target.clientX; // d3.event.clientX;
  let clientTop = target.clientY; // d3.event.clientY;
  let parentRight = dom.getBoundingClientRect().right;
  let parentLeft = dom.getBoundingClientRect().left;
  let parentTop = dom.getBoundingClientRect().top;
  let parentBottom = dom.getBoundingClientRect().bottom;
  let tooltipLeft = clientLeft - parentLeft;
  let tooltipTop = clientTop - parentTop;

  // 生成tooltip,以及设置tooltip样式
  let styleStr1 = 'position:absolute;min-width:100px;min-height:30px;border: 1px solid #e1e1e1;z-index:100;background-color:white;transform:translateX(-50%);';
  let styleStr2 = 'border-radius: 3px;padding: 3px 5px;';
  let tooltipDiv = document.createElement('div');
  tooltipDiv.className = 'tooltip-container';
  tooltipDiv.style.cssText = styleStr1 + styleStr2;
  tooltipDiv.innerHTML = retTooltipContent(config.legend.data || [], data);
  dom.style.position = 'relative';
  dom.appendChild(tooltipDiv);
  /*
    鼠标位置小于父元素高度的一半时，tooltip显示在鼠标下方
    鼠标位置大于父元素高度的一半时, tooltip显示在鼠标上方
  */
  if (clientTop < parentBottom / 2) {
    tooltipTop = tooltipTop + 20 + 'px';
  } else {
    tooltipTop = tooltipTop - tooltipDiv.clientHeight - 10 + 'px';
  }
  /*
    鼠标位置靠近父元素左边位置100px时，tooltip显示在鼠标右边
    鼠标位置靠近父元素右边位置100px时, tooltip显示在鼠标的左边
  */
  if (clientLeft < parentLeft + 100) {
    tooltipLeft = tooltipLeft + tooltipDiv.clientWidth / 2 + 10 + 'px';
  } else if (clientLeft > parentRight - 100) {
    tooltipLeft = tooltipLeft - tooltipDiv.clientWidth / 2 - 10 + 'px';
  } else {
    tooltipLeft = tooltipLeft + 'px';
  }
  tooltipDiv.style.left = tooltipLeft;
  tooltipDiv.style.top = tooltipTop;
};

const hideTooltip = (config) => {
  let dom = document.querySelector(config.id);
  let tooltipDiv = dom.querySelector('.tooltip-container');
  tooltipDiv && dom.removeChild(tooltipDiv);
};

function retTooltipContent (legend, data) {
  let contentArr = data.split(',');
  let result = '';
  legend.map((i, idx) => {
    result += `<div><span>${i}</span> <span>${contentArr[idx]}</span>  </div>`;
  });
  return result;
}

export {
  drawTooltip,
  hideTooltip
};
