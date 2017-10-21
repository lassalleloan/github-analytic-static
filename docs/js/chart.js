/**
 * Generates a chart and
 * This is called in generate.js
 *
 * @author Loan Lassalle (loan.lassalle@heig-vd.ch)
 * @since 13.09.2017
 */
/* eslint-disable semi */

// eslint-disable-next-line no-unused-vars
function BarChartStacked (xAxesLabel, xAxesData, yAxesLabel, data) {
  this._xAxesLabel = xAxesLabel;
  this._xAxesData = xAxesData;
  this._yAxesLabel = yAxesLabel;

  this._yAxesData = (function () {
    let yAxesData = [];

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        yAxesData.push(data[key])
      }
    }

    return yAxesData
  }());

  this._yAxesDataLabels = (function () {
    let yAxesDataLabels = [];

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        yAxesDataLabels.push(key)
      }
    }

    return yAxesDataLabels
  }());

  // Add a chart to context
  // eslint-disable-next-line no-unused-vars
  this.addToContext = function (context) {
    // eslint-disable-next-line
    new Chart(document.getElementById(context).getContext('2d'), this.barChartStacked)
  };

  // Return random colors array
  let getRandomColors = function (size) {
    let randomColors = [];

    for (let i = 0; i < size; ++i) {
      // eslint-disable-next-line no-undef
      randomColors.push(randomColor())
    }

    return randomColors
  };

  let getDatasets = function (yAxesDataLabels, yAxesData) {
    let datasets = [];
    let colors = getRandomColors(yAxesDataLabels.length);

    for (let i = 0; i < yAxesDataLabels.length; ++i) {
      datasets.push({
        label: yAxesDataLabels[i],
        data: yAxesData[i],
        backgroundColor: colors[i],
        hoverBackgroundColor: colors[i],
        hoverBorderWidth: 2,
        hoverBorderColor: 'lightgrey'
      })
    }

    return datasets
  };

  this.barChartStacked = {
    type: 'bar',
    data: {
      labels: this._xAxesData,
      datasets: getDatasets(this._yAxesDataLabels, this._yAxesData)
    },
    options: {
      animation: {
        duration: 10
      },
      tooltips: {
        mode: 'label',
        callbacks: {
          label: function (tooltipItem, data) {
            if (tooltipItem.yLabel > 0) {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel
            }
          }
        }
      },
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: {display: false},
          scaleLabel: {
            display: true,
            labelString: this._xAxesLabel
          }
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            callback: function (value) {
              return value
            }
          },
          scaleLabel: {
            display: true,
            labelString: this._yAxesLabel
          }
        }]
      }, // scales
      legend: {
        display: true
      }
    } // options
  }
}
