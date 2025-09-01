export function initCanvas(id, w, h) {
    const canvas = id ? document.getElementById(id) : document.getElementsByTagName('canvas')[0];

    if (!canvas) throw new Error('Canvas not found');
    
    const dpr = window.devicePixelRatio || 1;
    const cssW = w ?? (canvas.clientWidth || 800);
    const cssH = h ?? (canvas.clientHeight || 600);
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    const ctx = canvas.getContext('2d');
    window.__canvas__ = canvas; 
    window.__ctx__ = ctx;
    
    const clearCanvas = () => ctx.clearRect(0, 0, cssW, cssH);

    const resize = (nw, nh) => {
        cssW = nw;
        cssH = nh;
        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
    };

    return { canvas, ctx, dpr, clearCanvas, resize };
};