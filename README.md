# Tooltip plugin for Chartist.js

[![Build Status](https://github.com/stklcode/chartist-plugin-tooltip/actions/workflows/nodejs.yml/badge.svg)](https://github.com/stklcode/chartist-plugin-tooltip/actions/workflows/nodejs.yml)

This plugin provides quick and easy tooltips for your chartist charts.

Please visit http://gionkunz.github.io/chartist-js/plugins.html for more information.

NPM package: (not yet released)


## Why this fork?
This repository is a fork of [LukBukkit/chartist-plugin-tooltip](https://github.com/LukBukkit/chartist-plugin-tooltip)
which is again a fork of the original [tmmdata/chartist-plugin-tooltip](https://github.com/tmmdata/chartist-plugin-tooltip). 

Thanks for the great work to all contributors so far!

The original repository seems unmaintained for quite a while and the updated fork is not yet compatible with the changes
introduced in Chartist v1.

Maybe one day, the fork will be merged again...


## Available options and their defaults

* **currency**: `string`

  Currency or unit suffix, e.h. '$', '€' or '%' to be appended to the value.

* **currencyFormatCallback**: `(value: string, options: Options) => string`

  Transformation function to be applied in combination with "currency".

* **tooltipOffset**: `{ x: number, y: number }`

  Tooltip offset in px. Default: `{ x: 0, y: -20 }`

* **anchorToPoint**: `boolean`

  If set true, the tooltips will not follow mouse movement and be anchored to the target point or bar.
  Default: `false`

* **appendToBody**: `boolean`

  Append tooltip container to body.
  If not, the tooltip element will be added to the chart container.
  Default: `true`

* **class**: `string | string[]`

  Add custom class(es) to the tooltip.
  Can be a single class `"my-class"` or a list `["class-1", "class-2"]`.

* **pointClass**: `string`

  Custom point class to append tooltips to.
  If none is specified, the default class will be used depending on the chart type (e.g. "ct-point" for line charts).

* **tooltipFnc**: `(meta: string, value: string) => string`

  Custom function to generate tooltip (entire HTML markup).

* **transformTooltipTextFnc**: `(value: string) => string`

  Custom function to generate tooltip text (content only).

* **metaIsHTML**: `boolean`

  Should the meta content be parsed as HTML (`true`) or plain text (`false`, default).


## Sample usage in Chartist.js

#### First you have to install the plugin via Yarn:

`yarn add chartist-plugin-tooltips-updated`

#### Then you can include this plugin...
1. via `<script>` tags loading the UMD versions of Chartist and the plugin:
```html
<html>
  <head>
    <script src="node_modules/chartist/dist/index.umd.js"></script>
    <script src="node_modules/chartist-plugin-tooltip/dist/chartist-plugin-tooltip.umd.js"></script>
    <script>
      var chart = new Chartist.LineChart(
        '#chart',
        data,
        {
          plugins: [ ChartistPluginTooltip ]
        }
      );
    </script>
  </head>
  <body>
    <div id="chart"></div> 
  </body>
</html>
```

2. or via imports as ES module:
```js
import { LineChart } from 'chartist';
import { ChartistPluginTooltip } from 'chartist-plugin-tooltips';

const chart = new LineChart(
  '.ct-chart',
  data,
  {
    plugins: [ ChartistPluginTooltip ]
  }
);
```

Don't forget to include the CSS files, if you want default styling...

1. in the `<head>` of your HTML file
```html
<link rel="stylesheet" href="node_modules/chartist/dist/index.css">
<link rel="stylesheet" href="node_modules/chartist-plugin-tooltips/dist/chartist-plugin-tooltip.css">
```
2. as [Webpack](https://webpack.js.org/loaders/style-loader/) CSS imports
```js
import 'chartist/dist/index.css';
import 'chartist-plugin-tooltips/dist/chartist-plugin-tooltip.css';
```

#### And now you can use the different options for labels:

With descriptive text:
```js
var chart = new LineChart('.ct-chart', {
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

Without descriptive text:
```js
var chart = new LineChart('.ct-chart', {
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

With options text:
```js
var chart = new Chartist.Line('.ct-chart', {
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
        currency: '$',
        class: 'class1 class2',
        appendToBody: true
      }
    ]
  ]
});
```

If you change the css properties of the tooltip, you shouldn't change the `display` property, 
otherwise the position of the tooltip will be wrong!

## Custom point element.

In ChartistJS you can replace default element with smth different.
There is a pretty [demo](https://gionkunz.github.io/chartist-js/examples.html#example-line-modify-drawing) 
(*USING EVENTS TO REPLACE GRAPHICS*).
And if you want the tooltip to work fine with a new element, you need to include **two more properties**:

```javascript
'ct:value': data.value.y,
'ct:meta': data.meta,
```

And you have to add the following **CSS rule** to the new element by using the `style` option 
or by adding this rule to your css class: 

```css
pointer-events: all!important;
```

So the final code could look like this.
```javascript
chart.on('draw', function(data) {
  // If the draw event was triggered from drawing a point on the line chart
  if (data.type === 'point') {
    // We are creating a new path SVG element that draws a triangle around the point coordinates

    var circle = new Chartist.Svg('circle', {
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
