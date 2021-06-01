function createTooltip() {
  function CustomTooltip() {}

  CustomTooltip.prototype.init = function (params) {
    var eGui = (this.eGui = document.createElement('div'));
    var isHeader = params.rowIndex === undefined;
    var {
      style,
      header
    } = params;
    // isGroupedHeader = isHeader && !!params.colDef.children,
    var str;
    var valueToDisplay;
    if (!isHeader) {
      isHeader = header;
    }
    eGui.classList.add('custom-tooltip');
    eGui.style['background-color'] = '#fff';
    if (isHeader) {
      let value = params.value;
      if (!style) {
        style = params.colDef.headerComponentParams || {};
      }
      if (typeof value === 'object') {
        value = value.value;
      }
      str = `<p >  ${value}  </p>`;
      eGui.style.fontSize = style.fontSize + 'px';
      eGui.style['font-style'] = style.fontStyle;
      eGui.style.color = style.fontColor||'#6b6b6b';
      eGui.style['text-align'] = style.align;
      eGui.style['text-decoration'] = style.decoration;
      eGui.style['letter-spacing'] = style.letterSpacing + 'px';
      eGui.style['line-height'] = style.lineHeight + 'px';
      eGui.style.display = style.display || 'auto';
      //   eGui.style.padding = '8px';
      eGui.style.borderRadius = '3px';
      eGui.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.4)';

      eGui.innerHTML = str;
    } else {
      if (!params.value.value && params.value.value !== 0) {
        return;
      }
      let {
        context
      } = params;
      let html = '';
      let label = params.value.label;
      if (label.length===0) {
        eGui.innerHTML = '';
        return
      }
      let match=label.filter(i=>i.display==='auto')
      if (match.length===0){
        eGui.innerHTML = '';
        return
      }
      label.map(l => {
        let {
          style,
          tooltipFormat,
          name,
          value
        } = l;
        html += `<div 
                  style="font-size: ${style.fontSize}px;  
                  text-align: ${style.align}; 
                  color: ${style.fontColor||'#6b6b6b'}; 
                  font-style: ${style.fontStyle}; 
                  text-decoration: ${style.decoration}; 
                  letter-spacing: ${style.letterSpacing}px; 
                  background-color:'#fff';
                  line-height: ${style.lineHeight}px; display: ${style.display || 'auto'}">
                  ${name}${name === '' ? '' : ': '}${context.formatNumberFunction(value, tooltipFormat)} 
                </div>`;
      });
      eGui.style.padding = '8px';
      eGui.style.borderRadius = '3px';
      eGui.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.4)';
      eGui.innerHTML = html;
    }
  };
  CustomTooltip.prototype.getGui = function () {
    return this.eGui;
  };
  return CustomTooltip;
}

function createShowCellRenderer() {
  function ShowCellRenderer() {}

  ShowCellRenderer.prototype.init = function (params) {
    var cellBlank = !params.value;
    if (cellBlank) {
      return null;
    }
    let html = '';
    if (typeof params.value === 'object') {
      html = params.value.value || '';
    } else {
      html = params.value || '';
    }
    this.ui = document.createElement('div');
    this.ui.innerHTML = html;
    // let top = params.value.rowSpan * params.data.columnStyle.height / 2

    // this.ui.style.top = top + 'px'
  };

  ShowCellRenderer.prototype.getGui = function () {
    return this.ui;
  };

  return ShowCellRenderer;
}

function createCustomHeader() {
  function CustomHeader() {}
  CustomHeader.prototype.init = function (params) {
    let {
      show,
      style,
      maxHeight,
      cellBorderWidth,
      borderTopShow,
      innerBorderColor,
      hasSpace
    } = params;
    this.ui = document.createElement('div');
    if (show) {
      this.ui.style.fontSize = style['font-size'] + 'px';
      this.ui.style.fontStyle = style['font-style'];
      this.ui.style.letterSpacing = style['letter-spacing'] + 'px';
      this.ui.style.lineHeight = style['line-height'] + 'px';
      this.ui.style.color = style.color;
      this.ui.style.textAlign = style['text-align'];
      this.ui.style.width = '100%';
      this.ui.style.padding = '8px';
      this.ui.style.textDecoration = style['text-decoration'];
      this.ui.style.height = '100%';
      this.ui.style.borderRight = cellBorderWidth + 'px solid ' + innerBorderColor;
      if (borderTopShow !== '1') {
        this.ui.style.borderTop = cellBorderWidth + 'px solid ' + innerBorderColor;
      }
      this.ui.style.overflow = 'hidden';
      this.ui.style.textOverflow = 'ellipsis';
      this.ui.style.whiteSpace = 'nowrap';
      // this.ui.style.borderBottom = cellBorderWidth + 'px solid '+innerBorderColor
      this.ui.style.boxSizing = 'border-box';
      this.ui.innerHTML = params.displayName;
    } else {
      if (hasSpace !== '1') {
        this.ui.style.height = '100%';
        this.ui.style.width = '100%';
        this.ui.style.borderRight = cellBorderWidth + 'px solid ' + innerBorderColor;
        this.ui.style.padding = '8px';
        if (borderTopShow !== '1') {
          this.ui.style.borderTop = cellBorderWidth + 'px solid ' + innerBorderColor;
        }
        // this.ui.style.borderBottom = cellBorderWidth + 'px solid '+innerBorderColor
        this.ui.style.boxSizing = 'border-box';
        this.ui.innerHTML = '';
      }
    }
  };
  CustomHeader.prototype.getGui = function (params) {
    return this.ui;
  };

  return CustomHeader;
}

function createHeaderGroupComponent() {
  function CustomHeaderGroup() {}
  CustomHeaderGroup.prototype.init = function (params) {
    let {
      show,
      style,
      maxHeight,
      cellBorderWidth,
      borderTopShow,
      borderBottomShow,
      innerBorderColor
    } = params;
    this.ui = document.createElement('div');
    if (show) {
      this.ui.style.fontSize = style['font-size'] + 'px';
      this.ui.style.fontStyle = style['font-style'];
      this.ui.style.letterSpacing = style['letter-spacing'] + 'px';
      this.ui.style.height = '100%';
      this.ui.style.lineHeight = style['line-height'] + 'px';
      this.ui.style.color = style.color;
      this.ui.style.textAlign = style['text-align'];
      this.ui.style.width = '100%';
      this.ui.style.padding = '8px';
      this.ui.style.textDecoration = style['text-decoration'];
      this.ui.style.borderRight = cellBorderWidth + 'px solid ' + innerBorderColor;
      if (borderTopShow !== '1') {
        this.ui.style.borderTop = cellBorderWidth + 'px solid ' + innerBorderColor;
      }
      if (borderBottomShow !== '1') {
        this.ui.style.borderBottom = cellBorderWidth + 'px solid ' + innerBorderColor;
      }
      this.ui.style.overflow = 'hidden';
      this.ui.style.textOverflow = 'ellipsis';
      this.ui.style.whiteSpace = 'nowrap';
      this.ui.style.boxSizing = 'border-box';
      this.ui.innerHTML = params.displayName;
    } else {
      // this.ui.style.height = maxHeight?maxHeight + 'px':'100%'
      // this.ui.style.width = '100%'
      // if (borderTopShow!=='1'){
      //     this.ui.style.borderTop = cellBorderWidth + 'px solid '+innerBorderColor
      // }
      // if (borderBottomShow!=='1'){
      //     this.ui.style.borderBottom = cellBorderWidth + 'px solid '+innerBorderColor
      // }
      // this.ui.style.borderRight = cellBorderWidth + 'px solid '+innerBorderColor
      // this.ui.style.boxSizing='border-box'
      // this.ui.innerHTML = '';
    }
  };
  CustomHeaderGroup.prototype.getGui = function (params) {
    return this.ui;
  };
  return CustomHeaderGroup;
}