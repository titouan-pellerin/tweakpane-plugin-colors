# Tweakpane plugin template

Plugin template of an input binding for [Tweakpane][tweakpane].

## Installation

### Browser

```html
<script src="tweakpane.min.js"></script>
<script src="tweakpane-plugin-template.min.js"></script>
<script>
  const pane = new Tweakpane.Pane();
  pane.registerPlugin(TweakpaneColorsPlugin);
</script>
```

### Package

```js
import {Pane} from 'tweakpane';
import * as ColorsPlugin from 'tweakpane-plugin-colors';

const pane = new Pane();
pane.registerPlugin(ColorsPlugin);
```

## Usage

```js
const params = {
    color: {r: 0, g: 1, b: 1},
   };

pane.addInput(params, 'color', {
  view: 'color-2',
});
```

[tweakpane]: https://github.com/cocopon/tweakpane/
