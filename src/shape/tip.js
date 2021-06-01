const tipTpl = (text, flag, textTip) => {
  if (!textTip) return '';
  console.log(textTip);
  textTip.innerText = text;
  textTip.style.display = flag ? '' : 'none';
  textTip.style.left = (d3.event.clientX + 10) + 'px';
  textTip.style.top = (d3.event.clientY + 10) + 'px';
};

export {
  tipTpl
};
