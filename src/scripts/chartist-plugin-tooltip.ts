import * as Chartist from 'chartist';
import { BarChart, BaseChart, PieChart } from 'chartist';

/**
 * Tooltip plugin options.
 */
export interface Options {
  currency?: string;
  currencyFormatCallback?: (value: string, options?: Options) => string;
  tooltipOffset: {
    x: number;
    y: number;
  };
  anchorToPoint: boolean;
  appendToBody: boolean;
  class?: string;
  pointClass: string;
  tooltipFnc?: (meta: string, value: string) => string;
  transformTooltipTextFnc?: (value: string) => string;
  metaIsHTML: boolean;
}

/**
 * Chartist.js plugin to display a data label on top of the points in a line chart.
 */
export default function ChartistPluginTooltip<T extends BaseChart<any>>(
  chart: T,
  options?: Partial<Options>
): void {
  const defaultOptions = {
    currency: undefined,
    currencyFormatCallback: undefined,
    tooltipOffset: {
      x: 0,
      y: -20
    },
    anchorToPoint: false,
    appendToBody: true,
    class: undefined,
    pointClass: 'ct-point'
  };

  const $options = Chartist.extend({}, defaultOptions, options) as Options;

  // Warning: If you are using npm link or yarn link, these instanceof checks will fail and you won't any tooltips
  let tooltipSelector = $options.pointClass || '';
  if (chart instanceof BarChart) {
    tooltipSelector = 'ct-bar';
  } else if (chart instanceof PieChart) {
    // Added support for donut graph
    if ((chart as any).options.donut) {
      // Added support for the solid donut graph
      tooltipSelector = (chart as any).options.donutSolid
        ? 'ct-slice-donut-solid'
        : 'ct-slice-donut';
    } else {
      tooltipSelector = 'ct-slice-pie';
    }
  }

  const chartElem = (chart as any).container;
  let toolTipIsShown = false;
  let tooltipOffsetParent = chartElem.offsetParent as HTMLElement;
  let toolTip: HTMLElement;

  {
    let tt: HTMLElement | null;
    if ($options.appendToBody) {
      // searching for existing tooltip in the body, because appendToBody is enabled
      tt = document.querySelector('.chartist-tooltip');
    } else {
      // searching for existing tooltip in the chart, because appendToBody is disabled
      tt = chartElem.querySelector('.chartist-tooltip');
    }
    if (!tt) {
      tt = document.createElement('div');
      tt.className = $options.class
        ? 'chartist-tooltip ' + $options.class
        : 'chartist-tooltip';
      if ($options.appendToBody) {
        document.body.appendChild(tt);
      } else {
        chartElem.appendChild(tt);
      }
    }
    toolTip = tt;
  }

  let height = toolTip.offsetHeight;
  let width = toolTip.offsetWidth;

  hide(toolTip);

  chartElem.addEventListener('mouseover', (event: MouseEvent) => {
    if (!(event.target as HTMLElement).classList.contains(tooltipSelector)) {
      return;
    }
    const point = event.target as HTMLElement;
    let tooltipText = '';

    let seriesName = '';
    if (chart instanceof Chartist.BarChart) {
      seriesName =
        (point.parentNode as HTMLElement).getAttribute('ct:meta') ||
        (point.parentNode as HTMLElement).getAttribute('ct:series-name') ||
        '';
    }

    let meta = point.getAttribute('ct:meta') || seriesName || '';
    const hasMeta = !!meta;
    let value = point.getAttribute('ct:value') || '';

    if (
      $options.transformTooltipTextFnc &&
      typeof $options.transformTooltipTextFnc === 'function'
    ) {
      value = $options.transformTooltipTextFnc(value);
    }

    if ($options.tooltipFnc && typeof $options.tooltipFnc === 'function') {
      tooltipText = $options.tooltipFnc(meta, value);
    } else {
      if ($options.metaIsHTML) {
        const txt = document.createElement('textarea');
        txt.innerHTML = meta;
        meta = txt.value;
      }

      meta = '<span class="chartist-tooltip-meta">' + meta + '</span>';

      if (hasMeta) {
        tooltipText += meta + '<br>';
      } else if (chart instanceof PieChart) {
        // For Pie Charts also take the labels into account
        // Could add support for more charts here as well!
        const label = next(point, 'ct-label');
        if (label) {
          tooltipText += text(label) + '<br>';
        }
      }

      if (value) {
        if ($options.currency) {
          if ($options.currencyFormatCallback !== undefined) {
            value = $options.currencyFormatCallback(value, $options);
          } else {
            value =
              $options.currency +
              value.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
          }
        }
        value = '<span class="chartist-tooltip-value">' + value + '</span>';
        tooltipText += value;
      }
    }

    if (toolTip && tooltipText) {
      toolTip.innerHTML = tooltipText;

      // Calculate new width and height, as toolTip width/height may have changed with innerHTML change
      height = toolTip.offsetHeight;
      width = toolTip.offsetWidth;

      if (!$options.appendToBody) {
        tooltipOffsetParent = chartElem.offsetParent as HTMLElement;
      }
      if (toolTip.style.display !== 'absolute') {
        toolTip.style.display = 'absolute';
      }
      setPosition(event);
      show(toolTip);

      // Remember height and width to avoid wrong position in IE
      height = toolTip.offsetHeight;
      width = toolTip.offsetWidth;
    }
  });

  chartElem.addEventListener('mouseout', () => {
    hide(toolTip);
  });

  chartElem.addEventListener('mousemove', (event: MouseEvent) => {
    if (!$options.anchorToPoint && toolTipIsShown) {
      setPosition(event);
    }
  });

  function setPosition(event: MouseEvent): void {
    height = height || toolTip.offsetHeight;
    width = width || toolTip.offsetWidth;
    const offsetX = -width / 2 + $options.tooltipOffset.x;
    const offsetY = -height + $options.tooltipOffset.y;

    const anchor =
      $options.anchorToPoint &&
      (event.target as any).x2 &&
      (event.target as any).y2;

    if ($options.appendToBody) {
      if (anchor) {
        const box = chartElem.getBoundingClientRect();
        const left =
          (event.target as any).x2.baseVal.value + box.left + window.scrollX;
        const top =
          (event.target as any).y2.baseVal.value + box.top + window.scrollY;

        toolTip.style.left = left + offsetX + 'px';
        toolTip.style.top = top + offsetY + 'px';
      } else {
        toolTip.style.left = event.pageX + offsetX + 'px';
        toolTip.style.top = event.pageY + offsetY + 'px';
      }
    } else {
      const offsetBox = tooltipOffsetParent.getBoundingClientRect();
      const allOffsetLeft = -offsetBox.left - window.scrollX + offsetX;
      const allOffsetTop = -offsetBox.top - window.scrollY + offsetY;

      if (anchor) {
        const box = chartElem.getBoundingClientRect();
        const left =
          (event.target as any).x2.baseVal.value + box.left + window.scrollX;
        const top =
          (event.target as any).y2.baseVal.value + box.top + window.scrollY;

        toolTip.style.left = left + allOffsetLeft + 'px';
        toolTip.style.top = top + allOffsetTop + 'px';
      } else {
        toolTip.style.left = event.pageX + allOffsetLeft + 'px';
        toolTip.style.top = event.pageY + allOffsetTop + 'px';
      }
    }
  }

  /**
   * Shows the tooltip element, if not shown
   * @param element
   */
  function show(element: HTMLElement): void {
    toolTipIsShown = true;
    element.classList.add('tooltip-show');
  }

  /**
   * Hides the tooltip element
   * @param element
   */
  function hide(element: HTMLElement): void {
    toolTipIsShown = false;
    element.classList.remove('tooltip-show');
  }

  function next(element: HTMLElement, className: string) {
    do {
      element = element.nextSibling as HTMLElement;
    } while (element && !element.classList.contains(className));
    return element;
  }

  /**
   *
   * @param element
   * @return {string | string}
   */
  function text(element: HTMLElement): string {
    return element.innerText || element.textContent;
  }
}
