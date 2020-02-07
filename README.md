# canvas-morph
canvas-morph

# Demo

- <https://frogcat.github.io/dist/canvas-morph/>

# Usage

```html
<!-- import canva-morph.min.js to extend HTMLCanvasElement -->
<script src='https://frogcat.github.io/canvas-morph/dist/canvas-morph.min.js' />

<script>
  // call getContext('morph') to get custom context
  var context = canvas.getContext("morph");
  // call drawImage with control points
  context.drawImage(image,[...]);
</script>

```

# API

TBD

## drawImage(image,controlPoints)

draw image with control points.

control points is Array of `[image_x, image_y, canvas_x, canvas_y]` .


## clear()

clear canvas

## getTexturePointAt(canvas_x,canvas_y)

returns corresponding texture point, `[image_x, image_y]` .
