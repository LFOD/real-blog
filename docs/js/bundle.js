(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Calculates e^x using the series expression.

var seq = exports.seq = function seq(n) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return Array.from(new Array(n), function (d, i) {
    return i + start;
  });
};

var factorial = function factorial(x) {
  return seq(x).reduce(function (prod, cur) {
    return prod * cur;
  }, 1);
};

var calcStep = exports.calcStep = function calcStep(x, i) {
  return Math.pow(x, i) / factorial(i);
};

var showSteps = exports.showSteps = function showSteps(x, m) {
  return seq(m, 0).map(function (d) {
    return calcStep(x, d);
  });
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var drawSeries = exports.drawSeries = function drawSeries(steps, c) {
  var svg = c.svg,
      height = c.height,
      x = c.x,
      y = c.y,
      xAxis = c.xAxis,
      yAxis = c.yAxis,
      drawAxis = c.drawAxis,
      width = c.width;

  var numberSteps = steps.length;
  var barWidth = width / numberSteps * 0.9;

  x.range([barWidth / 1.9, width]).domain([0, numberSteps - 1]);
  y.domain([0, d3.max(steps)]);

  // ------------------------------------------------------//
  // Draw - Update Axes
  // ------------------------------------------------------//
  xAxis.ticks(numberSteps);
  yAxis.ticks(5);

  var xAxisSel = svg.selectAll('.x.axis').data([1]);
  xAxisSel.enter().append('g').attr('class', 'x axis').attr("transform", "translate(0," + height + ")").merge(xAxisSel).transition(d3.transition('axisMove').duration(500)).call(xAxis);

  var yAxisSel = svg.selectAll('.y.axis').data([1]);
  yAxisSel.enter().append('g').attr('class', 'y axis').merge(yAxisSel).transition(d3.transition('axisMove').duration(500)).call(yAxis);

  // ------------------------------------------------------//
  // Draw bars for each step
  // ------------------------------------------------------//
  // I could use the rangeband scale but I'm too lazy and want to keep
  // using jetpacks scales instead.

  var stepBars = svg.selectAll('.stepBars').data(steps, function (d, i) {
    return i;
  });

  stepBars.exit().transition(d3.transition('barmove').duration(500)).at({ y: c.height, height: 0 });

  stepBars.enter().append('rect').attr('class', 'stepBars').at({ //constant attributes
    fill: 'orangered',
    y: c.height,
    height: 1e-6,
    x: function x(d, i) {
      return c.x(i) - barWidth / 2;
    }
  }).merge(stepBars) // update all bars with this.
  .transition(d3.transition('barmove').duration(500)).at({
    x: function x(d, i) {
      return c.x(i) - barWidth / 2;
    },
    y: function y(d, i) {
      return c.y(d);
    },
    width: barWidth,
    height: function height(d, i) {
      return c.height - c.y(d);
    }
  });
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawStacked = drawStacked;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function drawStacked(steps, expon, c) {
  var barHeight = 10;
  var trans = d3.transition('barMove').duration(400);
  var width = c.width,
      height = c.height;


  var svg = c.svg.selectAppend('g.stackedViz').translate([0, -35]);

  // current estimate of e^x
  var trueValue = Math.exp(expon);

  var sumScale = d3.scaleLinear().range([0, width]).domain([0, trueValue]);

  var colorScale = d3.scaleSequential(d3.interpolatePiYG).domain([0, 30]);

  var stackData = steps.reduce(function (series, step, i) {
    var curSum = i > 0 ? series[i - 1].end : 0;
    return [].concat(_toConsumableArray(series), [{ start: curSum, end: curSum + step }]);
  }, []);

  var estimate = stackData[stackData.length - 1].end;

  var trueLine = svg.selectAppend('g.trueLine');

  trueLine.selectAppend('line').at({
    x1: 0,
    x2: 0,
    y1: -26,
    y2: barHeight,
    strokeWidth: 1,
    stroke: 'black'
  });

  trueLine.selectAppend('text').at({
    y: -15,
    x: -2,
    textAnchor: 'end'
  }).html('\n      <tspan>\n        e\n        <tspan baseline-shift = \'super\' font-size = 12>\n         ' + expon + '\n        </tspan>\n        = ' + d3.round(trueValue, 3) + '\n      </tspan>\n    ');

  trueLine.transition(trans).translate([sumScale(trueValue), 0]);

  var estimatedLine = svg.selectAppend('g.estimatedLine');

  estimatedLine.selectAppend('line').at({
    x1: 0,
    x2: 0,
    y1: -barHeight / 2,
    y2: 20 + barHeight,
    strokeWidth: 1,
    stroke: 'black'
  });

  estimatedLine.selectAppend('text').at({
    y: 15 + barHeight,
    x: -2,
    textAnchor: 'end'
  }).text('series estimate = ' + d3.round(estimate, 3));

  estimatedLine.transition(trans).translate([sumScale(estimate), 0]);

  var bars = svg.selectAppend('g.stackedBars').selectAll('.bar').data(stackData, function (d, i) {
    return i;
  });

  bars.enter().append('rect.bar').at({
    y: -barHeight / 2,
    x: function x(d) {
      return sumScale(d.start);
    },
    height: barHeight,
    width: 0,
    fill: function fill(d, i) {
      return colorScale(i);
    },
    stroke: 'white'
  }).merge(bars).transition(trans).at({
    x: function x(d) {
      return sumScale(d.start);
    },
    width: function width(d) {
      return sumScale(d.end) - sumScale(d.start);
    },
    fill: function fill(d, i) {
      return colorScale(i);
    }
  });

  bars.exit().remove();
}

},{}],4:[function(require,module,exports){
'use strict';

var _calculateEx = require('./calculateEx.js');

var _drawStacked = require('./drawStacked.js');

var _drawSeries = require('./drawSeries.js');

powerSeriesViz('#viz', 6, 10); // import d3 from 'https://d3js.org/d3.v4.min.js';
// import slid3r from './libs/slid3r.js';


function powerSeriesViz() {
  var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#viz';
  var startExpon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var startNumberSteps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

  var sliderWidth = 200;

  // setup svg for drawing.
  var sel = d3.select(target).html('');

  var c = d3.conventions({
    parentSel: sel,
    totalWidth: sel.node().offsetWidth,
    height: 400,
    margin: { left: 50, right: 50, top: 130, bottom: 30 }
  });

  function runViz(config) {
    var expon = config.expon,
        numberSteps = config.numberSteps;


    var exponSlider = slid3r().width(sliderWidth).font('garamond').range([0, 20]).label('Exponent').onDone(function (pos) {
      return redraw(pos, 'expon');
    });

    var stepsSlider = slid3r().width(sliderWidth).font('garamond').range([0, 30]).label('Number of Steps').onDone(function (pos) {
      return redraw(pos, 'numSteps');
    });

    function redraw(pos, type) {
      expon = type === 'expon' ? pos : expon;
      numberSteps = type === 'numSteps' ? pos : numberSteps;

      // calculate the value at each step in the series.
      var steps = (0, _calculateEx.showSteps)(expon, numberSteps);
      (0, _drawSeries.drawSeries)(steps, c);
      (0, _drawStacked.drawStacked)(steps, expon, c);
    }

    var drawIt = function drawIt() {
      sel.select('svg').remove();

      //update c
      c = d3.conventions({
        parentSel: sel,
        totalWidth: sel.node().offsetWidth,
        height: 400,
        margin: { left: 50, right: 50, top: 130, bottom: 30 }
      });

      exponSlider = exponSlider.loc([c.width * 0.4 - sliderWidth, -100]).startPos(expon);

      stepsSlider = stepsSlider.loc([c.width * 0.6, -100]).startPos(numberSteps);

      c.svg.append('g').attr('class', 'exponSlider').call(exponSlider);
      c.svg.append('g').attr('class', 'stepsSlider').call(stepsSlider);

      redraw();
    };

    // Kickoff viz w/ default values.
    drawIt();

    // redraw on resize
    window.onresize = drawIt;
  }

  runViz({ expon: startExpon, numberSteps: startNumberSteps });
}

},{"./calculateEx.js":1,"./drawSeries.js":2,"./drawStacked.js":3}]},{},[4]);
