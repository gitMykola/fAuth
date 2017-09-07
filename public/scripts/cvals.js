$('#chartETH').on('click',function(e)
{
    e.preventDefault();
    let chartData = null,ref = '30day';

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.dir(this.responseText);
            chartData = JSON.parse(this.responseText);
            console.dir(chartData);
            //chart.options.data.dataPoints = chartData;
            let chart = new CanvasJS.Chart("chartETH",
                {title:{
                    text: "ETH"
                },
                    axisX: {
                        //valueFormatString: "MMM",
                        interval:1,
                        //intervalType: "day"
                    },
                    axisY:{
                        includeZero: false

                    },
                    data: [
                        {
                            type: "line",

                            dataPoints: chartData.map(function(el){return {x:new Date(el.x),y:el.y}}),
                        }
                    ]
                });
            chart.render();
        }
    };
    xhttp.open("GET", '/eth/' + ref, true);
    //xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();


});
$('#chartBTC').on('click',function(e)
{
    e.preventDefault();
    let chartData = null,ref = '30day';

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.dir(this.responseText);
            chartData = JSON.parse(this.responseText);
            console.dir(chartData);
            //chart.options.data.dataPoints = chartData;
            let chart = new CanvasJS.Chart("chartBTC",
                {title:{
                    text: "BTC"
                },
                    axisX: {
                        //valueFormatString: "MMM",
                        interval:1,
                        //intervalType: "day"
                    },
                    axisY:{
                        includeZero: false

                    },
                    data: [
                        {
                            type: "line",

                            dataPoints: chartData.map(function(el){return {x:new Date(el.x),y:el.y}}),
                        }
                    ]
                });
            chart.render();
        }
    };
    xhttp.open("GET", '/btc/' + ref, true);
    //xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();


});