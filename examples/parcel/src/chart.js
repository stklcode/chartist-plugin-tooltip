import {LineChart} from "chartist";
import TooltipPlugin from "chartist-plugin-tooltips-updated";

import 'chartist/dist/index.css';
import 'chartist-plugin-tooltips-updated/dist/chartist-plugin-tooltip.css';

function randomInRange(min, max) {
  return Math.floor(Math.random() * max) + min;
}

function randomArray(min, max, count) {
  let array = [];
  for (let i = 0; i < count; i++) {
    array.push(randomInRange(min, max));
  }
  return array;
}

new LineChart('#my-chart', {
  labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  series: [
    randomArray(0, 20, 10),
    randomArray(5, 15, 10),
  ]
}, {
  plugins: [
    new TooltipPlugin()
  ]
});
