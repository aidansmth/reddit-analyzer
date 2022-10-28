
daysConfig = {
    type: 'bar',
    data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Posts by Day',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Posts',
                },
                beginAtZero: true,
                suggestedMax: 80
            },
            x: {
                title: {
                    display: true,
                    text: 'Day',
                },
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Posts by Day'
            },
            legend: {
                display: false
            }
        }
    }
};

var ctx = document.getElementById('daysChart').getContext('2d');
var daysChart = new Chart(ctx, daysConfig);

hourlyConfig = {
    type: 'line',
    data: {
        labels: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'],
        datasets: [{
            label: 'Posts by Hour',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            backgroundColor: [
                'rgba(65, 65, 160, 0.8)',
            ],
            borderColor: [
                'rgba(106, 100, 233, 0.8)',
            ],
            borderWidth: 2,
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Posts',
                },
                beginAtZero: true,
                suggestedMax: 30
            },
            x: {
                title: {
                    display: true,
                    text: 'Hour',
                },
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Posts by Hour'
            },
            legend: {
                display: false
            }
        }
    }
};

// Initialize other charts
var hourly = document.getElementById('hourlyChart').getContext('2d');
var hourlyChart = new Chart(hourly, hourlyConfig);

commonWordsConfig = {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [1],
            backgroundColor: [
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(153, 102, 255, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 159, 64, 1)',
            ],
        }]
    },
    options: {
        plugins: {
            legend: {
                title: {
                    display: true,
                    text: 'Most Common Words',
                    font: { weight: 'bold' }
                }
            }
        }
    }
};

var commonWords = document.getElementById('commonWordChart').getContext('2d');
var commonWordsChart = new Chart(commonWords, commonWordsConfig);

lengthsConfig = {
    type: 'line',
    data: {
        datasets: [{
            borderWidth: 1,
            backgroundColor: [
                'rgba(255, 159, 64, 0.8)',
            ],
            borderColor: [
                'rgba(255, 159, 64, 1)',
            ],
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
        }],
    },
    options: {
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Posts',
                },
                beginAtZero: true,
                suggestedMax: 15
            },
            x: {
                title: {
                    display: true,
                    text: 'Length (words)',
                },
                beginAtZero: true,
                suggestedMax: 40
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Title Lengths'
            },
            legend: {
                display: false
            }
        }
    }
}

var lengths = document.getElementById('lengthChart').getContext('2d');
var lengthsChart = new Chart(lengths, lengthsConfig);


