
async function getData() {
    let response = await fetch('https://flask-demo-e3oz5uoi7a-uw.a.run.app/data?subreddit=politics&count=100');
    let data = await response.json();
    console.log(data)
    return data
}

async function main() {
    let data = await getData();
    console.log(data['top_days'])

    // First create a list of the days
    var days = [{x: 'Monday', y: 0}, {x: 'Tuesday', y: 0}, {x: 'Wednesday', y: 0}, {x: 'Thursday', y: 0}, {x: 'Friday', y: 0}, {x: 'Saturday', y: 0}, {x: 'Sunday', y: 0}]
    // console.log(days[0]['y'])
    max = 0
    for (let i = 0; i < 7; i++) {
        let day = [days[i]['x']]

        // Then add the number of posts for that day
        days[i]['y'] = data['top_days'][day]

        if (data['top_days'][day] > max) {
            max = data['top_days'][day]
        }
    }
    // To account for empty data set
    if (max == 0) {
        max = 100
    }

    for (let i = 0; i < 7; i++) {
        console.log(days[i]['x'] + " " + days[i]['y'])
    }
    // Update myChart with top_days data
    myChart.data.datasets[0].data = days
    // Set hidden to false
    // myChart.data.datasets[0].hidden = false
    // Set suggested max to the max of the data
    myChart.options.scales.y.suggestedMax = max

    myChart.update()
}

main().catch(console.log);