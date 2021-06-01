const createZoom = (scaleY) => {
  let zoomHandler = d3.zoom().scaleExtent([0.1, 64])
    .on('zoom', () => {
      scaleY = d3.event.transform.rescaleY(scaleY);
    });
  return zoomHandler;
};
export {
  createZoom
};
