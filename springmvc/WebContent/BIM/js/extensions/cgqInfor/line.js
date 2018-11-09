/**
 *
 * Created by zxl on 2018/7/13.
 */

function addLine(preTime,currentTime){
    var dom = document.getElementById("cgq_more_info");
    dom.removeAttribute("_echarts_instance_");
    var myChart = echarts.init(dom, 'dark');

    myChart.on('datarangeselected',function(){
        $( "#cgq_info_more").resizable();
    });
    $( "#cgq_info_more").resizable();
    myChart.showLoading({
        text: '正在加载',
        color: 'rgba(255, 255, 255, 0.76)',
        textColor: 'white',
        maskColor: 'rgba(37, 37, 37, 0)'
    });
    var  option = null;
    window.onresize = function () {
        myChart.resize();
    };

    function get(preTime,currentTime,bol){
        option = {
            title: {
                text: '',//温度湿度统计图
                textStyle: {
                    fontSize: 13,
                    fontWeight: 100
                }
            },
            backgroundColor: "",
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['温度', '湿度'],
                x: 'right'
            },
            grid: {
                x: 35,
                y: 50,
                x2: 50,
                y2: 50,
                borderWidth: 1
            },
            xAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                data: []
            },
            dataZoom: {
                show: true,
                start: 90,
                type: 'slider',
                bottom: "1%",
                showDataShadow: true
            },
            yAxis: [
                {
                    type: 'value',
                    name: '温度',
                    axisLabel: {
                        formatter: '{value}°C'
                    }
                },
                {
                    type: 'value',
                    name: '湿度',
                    axisLabel: {
                        formatter: '{value}%RH'
                    }
                }
            ],
            series: [
                {
                    name: '温度',
                    type: 'line',
                    yAxisIndex: 0,
                    data: [11, 11, 15, 13, 12, 13, 10., 15, 3, 5, 8, 12, 15]
                },
                {
                    name: '湿度',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [1, -2, 2, 5, 3, 2, 0, 3, 7, 9, 15, 20, 2]
                }
            ]
        };

        $.ajax({
            url: "a/bim/bimJzxx/getCgqLsxx",
            type: 'GET',
            data:{
                startTime:  preTime,
                currentTime: currentTime
            },
            dataType: "jsonp",
            async: true,
            success: function (res) {
                option.xAxis.data.length=0;
                option.series[0].data.length = 0;
                option.series[1].data.length = 0;
                res.map(function (item) {
                    option.xAxis.data.push(item.TM);
                    option.series[0].data.push(item.TEMPERATURE);
                    option.series[1].data.push(item.HUMIDITY);
                });
                if (option && typeof option === "object") {
                    myChart.hideLoading();
                    myChart.setOption(option, true);
                }
                if(bol){
                    JHCYW['timer'] = setTimeout(function(){
                        var  timeObj =  getTime();
                        get(timeObj.preTime,timeObj.currentTime,true);
                    },5000);
                }
            },
            error: function (res) {
                console.log(res);
            }
        });
    }

    function getTime(){
        var date = new Date();
        var timeObj  = {};
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1< 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        this.date = date.getDate()< 10 ? "0" + date.getDate() : date.getDate();
        this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var preTime = this.year.toString() + this.month.toString() + this.date.toString() + "000001";
        var currentTime = this.year.toString() + this.month.toString() + this.date + this.hour.toString() + this.minute.toString() + this.second.toString();
        var curDate = this.year + '-' + this.month + '-' + this.date;

        timeObj.preTime = preTime;
        timeObj.currentTime = currentTime;
        timeObj.curDate = curDate;

        return timeObj;
    }

    if(currentTime){
        JHCYW.timer && clearTimeout(JHCYW.timer);
        get(preTime,currentTime,false);
    }else{
        var  timeObj =  getTime();
        get(timeObj.preTime,timeObj.currentTime,true);

    }
}
