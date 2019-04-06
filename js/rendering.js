const gfx = {
    canvas: {},  ctx: {}, tintContext: null, 
    canvasWidth: 0, canvasHeight: 0, isPortrait: false, 
    spritesheets: [], frameBottomHeight: 42, goodSize: 200, 
    SetCanvases: function(canvas, ctx) {
        gfx.canvas = canvas;
        gfx.ctx = ctx;
        gfx.canvasWidth = window.innerWidth;
        gfx.canvasHeight = window.innerHeight;
        gfx.isPortrait = gfx.canvasHeight > gfx.canvasWidth;
        gfx.GetGoodFontSize();
        for(const key in gfx.canvas) {
            gfx.canvas[key].width = gfx.canvasWidth;
            gfx.canvas[key].height = gfx.canvasHeight;
        }
        const tintCanvas = document.createElement("canvas");
        tintCanvas.width = 400;
        tintCanvas.height = 400;
        gfx.tintContext = tintCanvas.getContext("2d");
    },
    LoadSpriteSheets: function(source, paths, callback) {
        count = 0;
        const loadText = document.getElementById("loadText2");
        paths.forEach(function(path) {
            const f = function(path, len) {
                const img = new Image();
                img.onload = function() {
                    gfx.spritesheets[path] = this;
                    count += 1;
                    loadText.innerText = "Assets(" + count + "/" + paths.length + ")";
                    if(count === len) { callback(); }
                };
                img.src = `${source}/${path}.png`;
            };
            f(path, paths.length);
        });
        loadText.innerText = "Assets(0/" + paths.length + ")";
    },

    ClearLayer: key => gfx.ctx[key].clearRect(0, 0, gfx.canvasWidth, gfx.canvasHeight),
    ClearSome: keys => keys.forEach(e => gfx.ClearLayer(e)),
    ClearAll: function(includingTutorial) {
        for(const key in gfx.ctx) {
            if(key === "tutorial" && !includingTutorial) { continue; } 
            gfx.ClearLayer(key);
        }
    },

    GetPixelX: function(percent) { return percent * gfx.canvasWidth; },
    GetPixelY: function(percent) { return percent * gfx.canvasHeight; },

    GetSizeFromScale: function(scale) { return scale * (gfx.isPortrait ? gfx.canvasWidth : gfx.canvasHeight); },
    DrawGachaToScale: function(gacha, x, y, scale, fromBottom, tintColor, tintOpacity, layer) {
        layer = layer || "characters";
        const size = gfx.GetSizeFromScale(scale);
        if(tintColor === undefined || tintOpacity <= 0) {
            gfx.DrawImage(gfx.ctx[layer], gfx.spritesheets[gacha.file], gacha.x * 400, gacha.y * 400, 400, 400, x, y - (fromBottom ? size : 0), size, size);
        } else {
            gfx.DrawTintedImage(gfx.ctx[layer], gfx.spritesheets[gacha.file], gacha.x * 400, gacha.y * 400, 400, 400, x, y - (fromBottom ? size : 0), size, size, tintColor, tintOpacity);
        }
    },
    DrawGachaFrame: function(x, y, scale, fromBottom, sx, sy) {
        sx = sx || 0; sy = sy || 0;
        const size = gfx.GetSizeFromScale(scale);
        const acty = y - (fromBottom ? size : 0);
        const dframe = fromBottom ? (size - scale * (gfx.frameBottomHeight * 2 + 20)) : 1;
        gfx.DrawImage(gfx.ctx["characters"], gfx.spritesheets["charframe"], sx * 400, sy * 400, 400, 400, x, acty, size, size);
        if(fromBottom) {
            gfx.DrawImage(gfx.ctx["HUD"], gfx.spritesheets["charframebottom"], sx * 400, sy * gfx.frameBottomHeight, 400, gfx.frameBottomHeight, x, acty + dframe, size, size * 0.105);
        } else {
            gfx.DrawImage(gfx.ctx["HUD"], gfx.spritesheets["charframebottom"], sx * 400, sy * gfx.frameBottomHeight, 400, gfx.frameBottomHeight, x, acty + size - gfx.frameBottomHeight / 2, size, size * 0.105);
        }
    },
    DrawEffect: function(x, y, sx, sy, size, layer) {
        layer = layer || "HUD";
        gfx.DrawImage(gfx.ctx[layer], gfx.spritesheets["effects"], sx * 40, sy * 40, 40, 40, x, y - size, size, size);
    },
    DrawRarity: function(x, y, size, rare, layer) {
        layer = layer || "HUD";
        gfx.DrawImage(gfx.ctx[layer], gfx.spritesheets["effects"], 160 + (rare ? 20 : 0), 40, 20, 40, x, y - size, size / 2, size);
    },
    DrawCrosshair: function(x, y, scale, fromBottom, rotation, sizeMult) {
        const size = gfx.GetSizeFromScale(scale);
        const acty = y - (fromBottom ? size : 0);
        const ctx = gfx.ctx["characters"];
        ctx.save();
        const delta = 0.5 * ((sizeMult * size) - size);
        const halfsize = size / 2;
        const multsize = sizeMult * size;
        ctx.translate(x + halfsize, acty + halfsize);
        ctx.rotate(rotation);
        gfx.DrawImage(ctx, gfx.spritesheets["crosshair"], 0, 0, 400, 400, -halfsize - delta, -halfsize - delta, multsize, multsize);
        ctx.restore();
    },
    DrawSparkle: function(x, y, scale, fromBottom, rotation, sizeMult) {
        const size = gfx.GetSizeFromScale(scale);
        const acty = y - (fromBottom ? size : 0);
        const ctx = gfx.ctx["characters"];
        ctx.save();
        const delta = 0.5 * ((sizeMult * size) - size);
        const halfsize = size / 2;
        const multsize = sizeMult * size;
        ctx.translate(x + halfsize, acty + halfsize);
        ctx.rotate(rotation);
        gfx.DrawImage(ctx, gfx.spritesheets["sparkle"], 0, 0, 600, 600, -halfsize - delta, -halfsize - delta, multsize, multsize);
        ctx.restore();
    },
    GetHex: function(r, g, b) {
        const arr = [r, g, b];
        let hex = "#";
        for(let i = 0; i < 3; i++) {
            const hc = Math.floor(arr[i]).toString(16);
            hex += ((hc.length < 2) ? "0" : "") + hc;
        }
        return hex;
    },
    DrawHealthbar: function(x, y, w, h, hp, mhp) {
        const ctx = gfx.ctx["HUD"];
        if(hp > 0) {
            const hppercent = hp / mhp;
            const amt = w * hppercent;
            ctx.fillStyle = gfx.GetHex(255 - (255 * hppercent), 255 * hppercent, 0);
            ctx.fillRect(x, y, amt, h);
            ctx.fillStyle = "#000000";
            ctx.fillRect(x + amt, y, w - amt, h);
        } else {
            ctx.fillStyle = "#000000";
            ctx.fillRect(x, y, w, h);
        }
        gfx.DrawImage(ctx, gfx.spritesheets["meter"], 0, 0, 200, 20, x, y, w, h);
    },
    DrawAttackMeter: function(x, y, w, h, current, max) {
        const ctx = gfx.ctx["HUD"];
        if(current > 0) {
            const percent = current / max;
            const amt = w * percent;
            ctx.fillStyle = gfx.GetHex(100 * percent, 165 * percent, 255 * percent);
            ctx.fillRect(x, y, amt, h);
            ctx.fillStyle = "#000000";
            ctx.fillRect(x + amt, y, w - amt, h);
        } else {
            ctx.fillStyle = "#000000";
            ctx.fillRect(x, y, w, h);
        }
        gfx.DrawImage(ctx, gfx.spritesheets["meter"], 0, 0, 200, 20, x, y, w, h);
    },

    DrawChest: function(x, y, sx, sy, size, layer) {
        layer = layer || "characters";
        gfx.DrawImage(gfx.ctx[layer], gfx.spritesheets["chest"], sx * 750, sy * 500, 750, 500, x, y, size, size);
    },
    DrawMapIcon: function(x, y, sx, sy, size, layer) {
        layer = layer || "HUD";
        gfx.DrawImage(gfx.ctx[layer], gfx.spritesheets["mapicons"], sx * 600, sy * 400, 600, 400, x, y, size, size * 0.666);
    },
    DrawStillImage: function(x, y, sheet, w, h, size, layer) {
        layer = layer || "characters";
        gfx.DrawImage(gfx.ctx[layer], gfx.spritesheets[sheet], 0, 0, w, h, x, y - size, size, size);
    },

    DrawButton: function(x, y, w, h, text, pressed, disabled, textShrink) {
        gfx.DrawImage(gfx.ctx["HUD"], gfx.spritesheets["buton"], 0, (pressed || disabled) ? 40 : 0, 180, 40, x, y, w, h);
        gfx.DrawTextToFit(text, x + w / 2, y + h / 2, w, (pressed && !disabled) ? "#FFFFFF" : "#000000", textShrink);
    },
    DrawTextbox: function(x, y, w, h, text, textShrink) {
        const useBigTB = ((w / 5) < h);
        gfx.DrawImage(gfx.ctx["HUD"], gfx.spritesheets[useBigTB ? "bigtextbox" : "textbox"], 0, 0, 180, useBigTB ? 140 : 40, x, y, w, h);
        gfx.DrawTextToFit(text, x + w / 2, y + h / 2, w, "#000000", textShrink, h);
    },

    DrawTextToFit: function(t, x, y, maxWidth, color, textShrink, maxHeight) {
        const ctx = gfx.ctx["menutext"];
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;
        let size = (maxHeight === undefined ? 200 : maxHeight);
        ctx.font = size + "px PressStart2P";
        let tWidth = ctx.measureText(t).width;
        while(tWidth >= maxWidth) {
            size -= 2;
            ctx.font = size + "px PressStart2P";
            tWidth = ctx.measureText(t).width;
        }
        if(textShrink === undefined) {
            size = Math.ceil(size * 0.8);
        } else {
            size = Math.ceil(size * textShrink);
        }
        ctx.font = size + "px PressStart2P";
        ctx.fillText(t, x, y);
    },
    GetGoodFontSize: function() {
        const ctx = gfx.ctx["menutext"];
        while(gfx.goodSize > 10) {
            ctx.font = gfx.goodSize + "px PressStart2P";
            const textInfo = ctx.measureText("It's very important to save the bees.");
            if(textInfo.width > gfx.canvasWidth) {
                gfx.goodSize -= 1;
            } else {
                console.log("GOOD SIZE IS " + gfx.goodSize);
                return;
            }
        }
    },
    DrawWrappedText: function(t, x, y, maxWidth, maxHeight, centerAlign, forcedSize) {
        const ctx = gfx.ctx["menutext"];
        ctx.textAlign = centerAlign ? "center" : "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "#000000";
        let size = forcedSize || gfx.goodSize, height = 0;
        while(size > 1) {
            ctx.font = size + "px PressStart2P";
            const ddy = size * 1.25, ts = t.split(" ");
            let row = ts[0], dy = 0;
            for(let i = 1; i < ts.length; i++) {
                const textInfo = ctx.measureText(row + " " + ts[i]);
                if(textInfo.width > maxWidth || row.indexOf("\n") >= 0) {
                    ctx.fillText(row, x, (y + dy));
                    dy += ddy;
                    height += ddy;
                    row = ts[i];
                } else {
                    row += " " + ts[i];
                }
            }
            ctx.fillText(row, x, (y + dy));
            height += ddy;
            if(height <= maxHeight) { return; } // || forcedSize !== undefined
            gfx.ClearLayer("menutext");
            height = 0;
            size -= 2;
        }
    },

    DrawBackground: function(img, isBattle) {
        gfx.DrawImage(gfx.ctx["background"], gfx.spritesheets[img], 0, 0, gfx.spritesheets[img].width, gfx.spritesheets[img].height, 0, (isBattle ? -gfx.GetPixelY(0.25) : 0), gfx.canvasWidth, gfx.canvasHeight);
    },
    DrawImage: function(ctx, image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH) {
        ctx.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    },
    /* Modified from canvas-tint-image at https://github.com/dmnsgn/canvas-tint-image
    Copyright (C) 2018 the internet and Damien Seguin
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*/
    DrawTintedImage: function(ctx, image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH, color, opacity) {
        const context = gfx.tintContext;
        context.canvas.width = image.width;
        context.canvas.height = image.height;
        context.save();
        context.fillStyle = color;
        context.globalAlpha = opacity;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        context.globalCompositeOperation = "destination-atop";
        context.globalAlpha = 1;
        context.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
        context.restore();
        ctx.drawImage(context.canvas, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
    }
};