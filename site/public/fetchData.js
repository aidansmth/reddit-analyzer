
async function getData(fetchString) {
    // console.log(fetchString)
    let serverAddr = 'https://flask-demo-e3oz5uoi7a-uw.a.run.app/'
    let apiEndpoint = 'data'
    let response = await fetch(serverAddr + apiEndpoint + '?' + fetchString);
    let data = await response.json();
    // console.log(data)
    return data
}




function updateDays(data) {
    // First create a list of the days
    var days = [{ x: 'Monday', y: 0 }, { x: 'Tuesday', y: 0 }, { x: 'Wednesday', y: 0 }, { x: 'Thursday', y: 0 }, { x: 'Friday', y: 0 }, { x: 'Saturday', y: 0 }, { x: 'Sunday', y: 0 }]
    // console.log(days[0]['y'])
    max = 0
    maxDay = ''
    for (let i = 0; i < 7; i++) {
        let day = [days[i]['x']]

        // Then add the number of posts for that day
        days[i]['y'] = data['top_days'][day]

        if (data['top_days'][day] > max) {
            max = data['top_days'][day]
            maxDay = day
        }
    }
    // To account for empty data set
    if (max === '') {
        return
    }

    // for (let i = 0; i < 7; i++) {
    //     console.log(days[i]['x'] + " " + days[i]['y'])
    // }
    // Update myChart with top_days data
    daysChart.data.datasets[0].data = days
    // Set suggested max to the max of the data
    daysChart.options.scales.y.suggestedMax = max
    daysChart.update()
    return maxDay
}

function updateHours(data) {
    var hours = [{ x: '12AM', y: 0 }, { x: '1AM', y: 0 }, { x: '2AM', y: 0 }, { x: '3AM', y: 0 }, { x: '4AM', y: 0 }, { x: '5AM', y: 0 }, { x: '6AM', y: 0 }, { x: '7AM', y: 0 }, { x: '8AM', y: 0 }, { x: '9AM', y: 0 }, { x: '10AM', y: 0 }, { x: '11AM', y: 0 }, { x: '12PM', y: 0 }, { x: '1PM', y: 0 }, { x: '2PM', y: 0 }, { x: '3PM', y: 0 }, { x: '4PM', y: 0 }, { x: '5PM', y: 0 }, { x: '6PM', y: 0 }, { x: '7PM', y: 0 }, { x: '8PM', y: 0 }, { x: '9PM', y: 0 }, { x: '10PM', y: 0 }, { x: '11PM', y: 0 }]

    max = 0
    maxHour = ''
    for (let i = 0; i < 24; i++) {
        let hour = [hours[i]['x']]

        // Then add the number of posts for that day
        hours[i]['y'] = data['top_hours'][hour]

        if (data['top_hours'][hour] > max) {
            max = data['top_hours'][hour]
            maxHour = hour
        }
    }

    if (max === '') {
        return
    }
    hourlyChart.data.datasets[0].data = hours
    hourlyChart.options.scales.y.suggestedMax = max
    hourlyChart.options.interaction.mode = 'nearest'
    hourlyChart.options.interaction.intersect = false
    hourlyChart.update()
    return maxHour
}

function updateWords(data) {
    // Add to chart
    for (const [key, value] of Object.entries(data['top_words'])) {
        // console.log(key, value)
        commonWordsChart.data.labels.push(key)
        commonWordsChart.data.datasets[0].data.push(value)
    }
    commonWordsChart.update()
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}



function updateLengths(data) {

    for (const [key, value] of Object.entries(data['top_word_lengths'])) {
        // lengthsChart.data.labels.push(key)
        // lengthsChart.data.datasets[0].data.push(value)
        addData(lengthsChart, key, value)
    }
    lengthsChart.options.interaction.mode = 'nearest'
    lengthsChart.options.interaction.intersect = false
    lengthsChart.update()
    // console.log('length' + lengthsChart.data.datasets[0].data.length)
}




async function submitForm() {

    
    // Get the form data
    document.getElementById('submit-spinner').style.display = "flex"
    // Change text to say fetching
    document.getElementById('submit-text').style.display = "none"
    var form1 = document.getElementById("form1");
    
    var fetchString = '';
    
    let parameters = ['subreddit', 'count', 'startDate', 'endDate', 'startTime', 'endTime']
    for (let i = 0; i < parameters.length; i++) {
        let parameter = parameters[i]
        let value = form1.elements[i].value
        if (value != '') {
            fetchString += parameter + '=' + value + '&'
        }
    }
    
    let data = await getData(fetchString);

    document.getElementById('submit-spinner').style.display = "none"
    // Change text to say fetching
    document.getElementById('submit-text').style.display = "flex"

    // Remove old data from charts who's data isn't flushed
    commonWordsChart.datasets = commonWordsConfig.data.datasets[0].data = []
    commonWordsChart.data.labels = []
    commonWordsChart.update()

    lengthsChart.datasets = lengthsConfig.data.datasets[0].data = []
    lengthsChart.data.labels = []
    lengthsChart.update()
    
    // Update the charts
    bestDay = updateDays(data)
    document.getElementById('best-day').innerHTML = bestDay
    bestHour = updateHours(data)
    document.getElementById('best-time').innerHTML = bestHour
    updateLengths(data)
    updateWords(data)

    // Retrieve the most common element in dictionary data['top_word_lengths']
    var max = 0
    var maxKey = ''
    for (const [key, value] of Object.entries(data['top_word_lengths'])) {
        if (value > max) {
            max = value
            maxKey = key
        }
    }
    document.getElementById('best-length').innerHTML = maxKey

    // Find top 3 best words to use
    const topThreeWords = Object
        .entries(data['top_words']) // create Array of Arrays with [key, value]
        .sort(([, a], [, b]) => b - a) // sort by value, descending (b-a)
        .slice(0, 3) // return only the first 3 elements of the intermediate result
        .map(([n]) => n); // and map that to an array with only the name

    document.getElementById('keywords').innerHTML = topThreeWords.join(', ')
    document.getElementById('queried-posts').innerHTML = data['matching_posts']
}