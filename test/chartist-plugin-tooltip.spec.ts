import {describe, it, before, beforeEach} from 'node:test';
import assert from 'node:assert/strict';
import ChartistPluginTooltip from '../src/scripts/chartist-plugin-tooltip';
import {LineChart} from 'chartist';
import 'global-jsdom/register';

describe('Tooltips plugin', () => {
  let chartElem: HTMLElement;
  let chart: LineChart;

  before(() => {
    // Some polyfills for testing with JSDom.
    window.requestAnimationFrame = (cb: FrameRequestCallback): number =>
      setTimeout(() => cb(Date.now()), 0) as unknown as number;
    window.cancelAnimationFrame = (id: number): void => clearTimeout(id);
    window.matchMedia = (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false
      }) as MediaQueryList;
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      get: function () { return this.parentNode; },
    });
  });

  function createChart(): Promise<LineChart> {
    return new Promise((resolve) => {
      const chart = new LineChart(
        chartElem,
        {
          labels: ['A', 'B', 'C', 'D', 'E'],
          series: [[1, 2, 4, 8, 16]]
        },
        {
          plugins: [
            [ChartistPluginTooltip, {class: 'foo', appendToBody: false}]
          ]
        }
      );

      chart.on('created', () => {
        resolve(chart);
      });
    });
  }

  function getTooltip(): HTMLElement | null {
    return chartElem.querySelector('div.chartist-tooltip');
  }

  function hasClass(el: Element, cls: string): boolean {
    return el.classList.contains(cls);
  }

  beforeEach(async () => {
    document.body.innerHTML = '<div><div id="chart"></div></div>';
    chartElem = document.getElementById('chart')!;

    chart = await createChart();
  });

  it('should append tooltip', () => {
    assert.notEqual(getTooltip(), null);
  });

  it('should not append tooltip twice', () => {
    assert.notEqual(getTooltip(), null);
    ChartistPluginTooltip(chart);
    const all = chartElem.querySelectorAll('div.chartist-tooltip');
    assert.equal(all.length, 1);
  });

  it('should hide tooltip', function () {
    assert.equal(hasClass(getTooltip()!, 'tooltip-show'), false);
  });

  it('should show tooltip on mouse enter', async () => {
    const point = chartElem.querySelector('.ct-point');
    assert.ok(point);
    point.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    assert.equal(hasClass(getTooltip()!, 'tooltip-show'), true);
  });

  it('should hide tooltip on mouse leave', function () {
    const point = chartElem.querySelector('.ct-point');
    assert.ok(point);
    point.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    point.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    assert.equal(hasClass(getTooltip()!, 'tooltip-show'), false);
  });

  it('should set tooltip text', () => {
    let point = chartElem.querySelector('.ct-point');
    assert.ok(point);
    point.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    assert.ok(getTooltip()?.innerHTML.includes('1'));

    point = chartElem.querySelector('.ct-point:last-child');
    assert.ok(point);
    point.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    assert.ok(getTooltip()?.innerHTML.includes('16'));
  });

  it('should set tooltip position', function () {
    const point = chartElem.querySelector('.ct-point');
    assert.ok(point);

    point.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: 100, clientY: 200 }));
    assert.equal(getTooltip()!.style.left, '100px');
    assert.equal(getTooltip()!.style.top, '180px');

    point.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 110, clientY: 210 }));
    assert.equal(getTooltip()!.style.left, '110px');
    assert.equal(getTooltip()!.style.top, '190px');
  });

  it('should set additional class', function () {
    assert.equal(hasClass(getTooltip()!, 'foo'), true);
  });
});
