
const initTip = () => {
  let tipTpl = document.createElement('div');
  tipTpl.style.padding = '4px';
  tipTpl.style.backgroundColor = 'white';
  tipTpl.style.fontSize = '14px';
  tipTpl.style.color = '#424242';
  tipTpl.style.borderRadius = '4px';
  tipTpl.style.boxShadow = 'rgba(0, 0, 0, 0.4) 0px 1px 3px';
  tipTpl.style.position = 'fixed';
  document.body.appendChild(tipTpl);
  return tipTpl;
};

export {
  initTip
};
