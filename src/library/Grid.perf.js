const {processPerimeter}  = require('./Grid');
const { PerformanceObserver, performance } = require('node:perf_hooks');

/** @TODO Measure performance! */

var A = "A";
var B = "B";

var testPerformance = () => {
  const testStartingColumn = 1;
  const testStartingRow = 2;
  performance.mark(A);

  const expectedTotal = processPerimeter({
      previousTotal: 0,
      currentPerimeterLength: perimeterLength * perimeterLength,
      currentColumn: testStartingColumn + offset,
      currentRow: testStartingRow + offset,
      startingRow: testStartingRow + offset,
      startingColumn: testStartingColumn + offset,
      origArray: testData,
      perimeterSize: perimeterLength
  });

  performance.mark(B);
}

const perfResult = performance.measure("measure a to b", markerNameA, markerNameB);
console.log(perfResult);
