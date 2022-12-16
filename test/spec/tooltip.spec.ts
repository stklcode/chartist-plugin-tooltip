import {LineChart} from 'chartist';
import {ChartistPluginTooltip} from "../../src/scripts/chartist-plugin-tooltip";

describe('Tooltip Plugin', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  describe('LineChart', () => {
    let chartContainer: HTMLElement;
    let tooltip: HTMLElement | null;
    const listeners: {[key: string]: EventListener} = {};

    beforeAll(() => {
      // Create container DIV.
      chartContainer = document.createElement('div');
      chartContainer.id = 'chart';
      chartContainer.style.height = '100px';
      chartContainer.style.width = '500px';
      (chartContainer as any).addEventListener = (type: string, listener: EventListener) => {
        listeners[type] = listener;
      };
      document.body.innerHTML = '';
      document.body.appendChild(chartContainer);
    });

    it('should initialize with a Tooltip plugin', () => {
      const chart = new LineChart(
        chartContainer,
        {
          labels: [1, 2, 3, 4, 5, 6, 7, 8],
          series: [[5, 9, 7, 8, 5, 3, 5, 4]]
        },
        {
          low: 0,
          showArea: true,
          plugins: [
            ChartistPluginTooltip
          ]
        }
      );

      chart.initialize();

      expect(chartContainer?.innerHTML).not.toEqual('');
    });

    it('should append tooltip element to the chart container', () => {
      tooltip = document.body.querySelector('.chartist-tooltip');
      expect(tooltip).not.toBeNull();
    });

    it('should append the tooltip to body by default', () => {
      expect(tooltip?.parentElement).toBe(document.body);
    });

    it('should hide the tooltip', () => {
      expect(tooltip?.classList).not.toContain('tooltip-show');
    });

    it('should not show tooltip on mouse enter', () => {
      listeners.mouseover({target: (chartContainer as EventTarget)} as MouseEvent);
      expect(tooltip?.classList).not.toContain('tooltip-show');
    });

    it('should show tooltip with mouse over a point', () => {
      listeners.mouseover({
        target: (chartContainer.querySelector('.ct-point') as EventTarget),
        pageX: 100,
        pageY: 200
      } as MouseEvent);
      expect(tooltip?.classList).toContain('tooltip-show');
    });

    it('should generate tooltip content', () => {
      expect(tooltip?.innerHTML).toEqual('<span class="chartist-tooltip-value">5</span>');
    });

    it('should set tooltip position', () => {
      expect(tooltip?.style.left).toBe('100px');
      expect(tooltip?.style.top).toBe('180px');
    });

    it('should hide tooltip on mouse leave', () => {
      listeners.mouseout({target: (chartContainer.querySelector('.ct-point') as EventTarget)} as MouseEvent);
      expect(tooltip?.classList).not.toContain('tooltip-show');
    });
  });
});
