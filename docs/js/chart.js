function BarChartStacked(barContext, dataLabels, datasets, xAxesLabelString, yAxesLabelString) {
    this.barContext = barContext;
    this.dataLabels = dataLabels;
    this.datasets = datasets;
    this.xAxesLabelString = xAxesLabelString;
    this.yAxesLabelString = yAxesLabelString;

    // Return with commas in between
    let numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    let bar_ctx = document.getElementById(this.barContext);
    let bar_chart = new Chart(bar_ctx, {
            type: 'bar',
            data: {
                labels: this.dataLabels,
                datasets: this.datasets
            },
            options: {
                animation: {
                    duration: 10,
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            if (numberWithCommas(tooltipItem.yLabel) > 0) {
                                return data.datasets[tooltipItem.datasetIndex].label + ": " + numberWithCommas(tooltipItem.yLabel);
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
                            labelString: this.xAxesLabelString
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        ticks: {
                            callback: function (value) {
                                return numberWithCommas(value);
                            },
                        },
                        scaleLabel: {
                            display: true,
                            labelString: this.yAxesLabelString
                        }
                    }],
                }, // scales
                legend: {
                    display: true
                }
            } // options
        }
    );
}