function initCanvas (canvasId, width, height) {
    let canvas;
    if (!canvasId) {
        canvas = document.getElementsByTagName('canvas')[0];
    } else canvas = document.getElementById(canvasId);

    [canvas.width, canvas.height] = [width, height];
    window.__canvas__ = canvas;
    window.__ctx__ = canvas.getContext('2d');
    window.__canvas__ = canvas;

    console.log("canvas initialized");
    return;
}

export {
    initCanvas
}