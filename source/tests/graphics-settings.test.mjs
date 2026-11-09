import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GRAPHICS_QUALITY,normalizeGraphicsQuality,graphicsPixelRatio,hudCanvasDue} from '../src/graphics-settings.mjs';

test('graphics profiles are finite, distinct and downgrade invalid stored values',()=>{
 assert.equal(normalizeGraphicsQuality('high'),'high');
 assert.equal(normalizeGraphicsQuality('eco'),'eco');
 assert.equal(normalizeGraphicsQuality('__proto__'),'balanced');
 assert.equal(normalizeGraphicsQuality('garbage'),'balanced');
 assert.ok(GRAPHICS_QUALITY.high>GRAPHICS_QUALITY.balanced);
 assert.ok(GRAPHICS_QUALITY.balanced>GRAPHICS_QUALITY.eco);
 assert.equal(graphicsPixelRatio('high',2),1.7);
 assert.equal(graphicsPixelRatio('balanced',1),1);
 assert.equal(graphicsPixelRatio('eco',1),0.8);
 assert.equal(graphicsPixelRatio('balanced',NaN),1);
});
test('HUD canvas scheduler repaints at 10 Hz and ignores invalid time',()=>{
 let next=0,repaints=0;
 for(let tick=0;tick<120;tick++){
  const clock=tick/60;
  if(hudCanvasDue(clock,next)){repaints++;next=clock+.1;}
 }
 assert.ok(repaints>=16&&repaints<=20,`${repaints} canvas redraws`);
 assert.equal(hudCanvasDue(NaN,0),false);
 assert.equal(hudCanvasDue(1,1),true);
});
