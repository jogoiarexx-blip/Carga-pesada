// Visual settings do not affect the fixed-step driving physics or career save.
export const GRAPHICS_QUALITY = Object.freeze({high:1.7,balanced:1.2,eco:0.8});
export function normalizeGraphicsQuality(value){return Object.hasOwn(GRAPHICS_QUALITY,value)?value:'balanced';}
export function graphicsPixelRatio(mode,deviceRatio=1){const d=Number.isFinite(deviceRatio)&&deviceRatio>0?deviceRatio:1;return Math.min(d,GRAPHICS_QUALITY[normalizeGraphicsQuality(mode)]);}
// Minimap and speedometer canvases can update at 10 Hz without throttling simulation/UI inputs.
export function hudCanvasDue(now,nextAt){return Number.isFinite(now)&&now>=nextAt;}
