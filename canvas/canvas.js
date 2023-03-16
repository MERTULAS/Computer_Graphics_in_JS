function initCanvas (canvasId) {
    let canvas;
    if (!canvasId) {
        canvas = document.getElementsByTagName('canvas')[0];
    } else canvas = document.getElementById(canvasId);

    [canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];
    window.__canvas__ = canvas;
    window.__ctx__ = canvas.getContext('2d');
    return;
}

export {
    initCanvas
}