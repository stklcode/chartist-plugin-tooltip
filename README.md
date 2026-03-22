# Tooltips for Chartist
[![npm](https://img.shields.io/npm/v/@stklcode/chartist-plugin-tooltips.svg)](https://www.npmjs.com/package/@stklcode/chartist-plugin-tooltips)

This plugin provides quick and easy tooltips for your [Chartist](https://github.com/chartist-js/chartist#readme) charts.
It's published on npm as [@stklcode/chartist-plugin-tooltips](https://www.npmjs.com/package/@stklcode/chartist-plugin-tooltips).

## Configuration Options

The following options can be configured when the plugin is loaded.
Their default values are as shown.

```javascript
const defaultOptions = {
  // Tooltip offset in pixels
  tooltipOffset: { x: 0,y: -20 },

  // Custom function to generate tooltip HTML ( (meta, value) => html )
  tooltipFnc: undefined,

  // Custom function to generate tooltip text ( value => text )
  transformTooltipTextFnc: undefined, // Accepts function

  // Add class(es) to the tooltip wrapper (string or array of strings)
  class: undefined,

  // If true, the tooltips will not follow mouse movement and be anchored to the target point or bar
  anchorToPoint: false,

  // Appends tooltips to body instead of chart container,
  appendToBody: true,

  // Should the meta content be parsed as HTML?
  metaIsHTML: false,

  // Custom point class to append tooltips to (uses Chartist's default point class if not specified)
  pointClass: undefined
};
```

## Sample Usage

### 1. Install the plugin

```shell
npm add @stklcode/chartist-plugin-tooltip`
```

### 2. Include JS

Include the JavaScript script file of the plugin either using one of two options:

1. Include it using a `<script>` tag:
```html
<script src="node_modules/chartist/dist/index.umd.js"></script>
<script src="node_modules/chartist-plugin-tooltip/dist/chartist-plugin-tooltip.umd.js"></script>

<script>
  const chart = new Chartist.LineChart('.ct-chart', data, {
    plugins: [
      ChartistPluginTooltip
    ]
  });
</script>

```

2. Include it using an import:
```javascript
import { LineChart } from 'chartist';
import ChartistTooltip from 'chartist-plugin-tooltip';

const chart = new LineChart('.ct-chart', data, {
  plugins: [
    ChartistPluginTooltip
  ]
});
```

### 3. Include CSS
Include the two CSS files in your project:
- `node_modules/chartist/dist/index.css`
- `node_modules/chartist-plugin-tooltip/dist/chartist-plugin-tooltip.css`

Either using one of two options:
1. Include them in the `<head>` of your HTML file
```html
<link rel="stylesheet" href="node_modules/chartist/dist/index.css">
<link rel="stylesheet" href="node_modules/chartist-plugin-tooltip/dist/chartist-plugin-tooltip.css">
```
2. Include them as [Webpack](https://webpack.js.org/loaders/style-loader/) CSS imports
```javascript
import 'chartist/dist/index.css';
import 'chartist-plugin-tooltip/dist/chartist-plugin-tooltip.css';
```

### 4. Configure Labels

Without a descriptive text:
```javascript
const chart = new Chartist.LineChart('.ct-chart', {
  labels: [1, 2, 3, 4, 5, 6, 7],
  series: [
    [1, 5, 3, 4, 6, 2, 3],
    [2, 4, 2, 5, 4, 3, 6]
  ]
}, {
  plugins: [
    ChartistPluginTooltip
  ]
});
```

With a descriptive text:
```javascript
const chart = new Chartist.LineChart('.ct-chart', {
  labels: [1, 2, 3],
  series: [
    [
      {meta: 'description', value: 1},
      {meta: 'description', value: 5},
      {meta: 'description', value: 3}
    ],
    [
      {meta: 'other description', value: 2},
      {meta: 'other description', value: 4},
      {meta: 'other description', value: 2}
    ]
  ]
}, {
  plugins: [
    ChartistPluginTooltip
  ]
});
```

With a custom formatted descriptive text:
```javascript
var chart = new Chartist.LineChart('.ct-chart', {
  labels: [1, 2, 3],
  series: [
    [
      {meta: 'description', value: 1},
      {meta: 'description', value: 5},
      {meta: 'description', value: 3}
    ],
    [
      {meta: 'other description', value: 2},
      {meta: 'other description', value: 4},
      {meta: 'other description', value: 2}
    ]
  ]
}, {
  plugins: [
    [
      ChartistPluginTooltip,
      {
        transformTooltipTextFnc: (value) => `${value} $`,
        class: ['class1', 'class2'],
        appendToBody: true
      }
    ]
  ]
});
```

If you change the CSS properties of the tooltip, you shouldn't change the `display` property,
otherwise the tooltip may be incorrectly positioned.

## Custom Point Element

This guide is a bit outdated and may not work with new versions of the plugin.

In Chartist, you can replace the default point element with a custom element.
There is a pretty [demo](https://gionkunz.github.io/chartist-js/examples.html#example-line-modify-drawing)
which uses events to replace the default point graphics.
If you want the tooltip to work fine with a new element, you need to include two more properties to your custom element:

```javascript
  'ct:value': data.value.y,
  'ct:meta':  data.meta,
```

And you have to add the following CSS rule to the new element by using the `style` option
or by adding this rule to your css class:

```css
pointer-events: all !important;
```

(If you want to read more about, why you have to add this css rule take a look at [chartist-plugin-tooltip#72](https://github.com/tmmdata/chartist-plugin-tooltip/pull/72))

So the final code could look like this. Here is a [live demo](https://jsfiddle.net/9gzqnrd8/9/)
```javascript
chart.on('draw', (data) => {
  // If the draw event was triggered from drawing a point on the line chart
  if (data.type === 'point') {
    // We are creating a new path SVG element that draws a triangle around the point coordinates

    const circle = new Chartist.Svg('circle', {
      cx: [data.x],
      cy: [data.y],
      r: [5],
      'ct:value': data.value.y,
      'ct:meta': data.meta,
      style: 'pointer-events: all !important',
      class: 'my-cool-point',
    }, 'ct-area');

    // With data.element we get the Chartist SVG wrapper and we can replace the original point drawn by Chartist with our newly created triangle
    data.element.replace(circle);
  }
});
```

```javascript
plugins: [
  [
    ChartistPluginTooltip,
    {
      appendToBody: true,
      pointClass: 'my-cool-point'
    }
  ]
]
```

## Credits

This repository is a fork of "chartist-plugin-tooltip-updated" ([lukbukkit/chartist-plugin-tooltip](https://github.com/lukbukkit/chartist-plugin-tooltip))
which was itself a fork of the original "chartist-plugin-tooltips" ([gionkunz/chartist-plugin-tooltip](https://github.com/gionkunz/chartist-plugin-tooltip)).

Many thanks to the authors and all contributors for their great work.

Both projects are no longer maintained.
Please do not expect any major functional updates here either (PRs welcome though), mainly smaller maintenance updates
to keep things running.
