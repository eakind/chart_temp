import { setTxtFormat } from './label';
const initTooltip = () => {
  let dom = document.querySelector('#tooltipChart');
  if (!dom) {
    dom = document.createElement('div');
    let styleStr1 = 'position: fixed;min-width: 120px;padding:8px;background-color:white;font-size:14px;color:#424242;';
    let styleStr2 = 'border-radius:4px;box-shadow:rgba(0, 0, 0, 0.4) 0px 1px 3px;transfrom:translateX(-50%)';
    dom.id = 'tooltipChart';
    dom.style.cssText = styleStr1 + styleStr2;
    document.body.appendChild(dom);
  }
  return dom;
};

const setContent = (dataObj, list) => {
  let content = '';
  for (let i = 0; i < list.length; i++) {
    if (list[i].display === 'auto') {
      let { key, text, format, title } = list[i];
      let value = setTxtFormat(dataObj[key], null);
      if (list[i].type !== 'ordinal') {
        value = setTxtFormat(dataObj[key], format);
      }
      if (!value && value !== 0) continue;
      let style = `color:${text.fontColor}; text-align:${text.align}; font-size:${text.fontSize}px`;
      content += `<div style="${style}">
                    <span>${title}：</span><span>${value}</span>
                  </div>`;
    }
  }
  return content;
};

const showTooltip = (dataObj, tooltipList) => {
  let clientLeft = d3.event.clientX;
  let clientTop = d3.event.clientY;
  let list = tooltipList.filter(item => item.display === 'auto');
  if (!list.length) return;
  let dom = document.querySelector('#tooltipChart');
  dom.style.display = 'inline-block';
  dom.innerHTML = setContent(dataObj, list);
  let domWidth = dom.clientWidth / 2;
  let domHeight = dom.clientHeight + 10;
  dom.style.left = `${clientLeft - domWidth}px`;
  dom.style.top = `${clientTop - domHeight}px`;
  if (clientTop < domHeight) {
    dom.style.top = `${clientTop + 10}px`;
  };
  if (clientLeft < domWidth) {
    dom.style.left = `${clientLeft}px`;
  };
};

const hideTooltip = () => {
  let dom = document.querySelector('#tooltipChart');
  dom.innerHTML = '';
  dom.style.display = 'none';
};

export {
  initTooltip,
  showTooltip,
  hideTooltip
};
