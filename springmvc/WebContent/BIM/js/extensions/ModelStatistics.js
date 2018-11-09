/*
* 首页模型统计插件
* 刘莎
* 2018/7/25
* */
function _ModelStatistics(viewer,options){
    Autodesk.Viewing.Extension.call(this, viewer, options);
    this._viewer = viewer;
}

//插件卸载时执行
_ModelStatistics.prototype.unload = function () {
    return true;
};

//插件加载时执行 入口
_ModelStatistics.prototype.load = function () {
    this.init();
    return this;
};
_ModelStatistics.prototype.init = function () {
    this.initEchartsOfbottom();
};


_ModelStatistics.prototype.initEchartsOfbottom =function () {
    // 调用searchLC函数
    // alert("aa");
    var self = this;
    var option1,option2,option3;
    var dom0 = document.getElementById('powerConsumption');
    var dom1 = document.getElementById('powerConsumption01');
    var dom2 = document.getElementById('powerConsumption02');
    dom0.removeAttribute("_echarts_instance_");
    dom1.removeAttribute("_echarts_instance_");
    dom2.removeAttribute("_echarts_instance_");
    var myCharts = echarts.init(document.getElementById('powerConsumption'), 'dark');
    var myCharts01 = echarts.init(document.getElementById('powerConsumption01'), 'dark');
    var myCharts02 = echarts.init(document.getElementById('powerConsumption02'), 'dark');
    myCharts._theme.backgroundColor='rgba(41,63,69,0.1)';
    myCharts01._theme.backgroundColor='rgba(41,63,69,0.1)';
    myCharts02._theme.backgroundColor='rgba(41,63,69,0.1)';
    myCharts._theme.color =[ '#D7504B','#C6E579','#F4E001','#F0805A'];
    function searchsuccess(array){
        switch (array.name){
            case '楼层':
                // var LC = [];
                // for(var i = 0;i < array.data.length;i++ ){
                //     var seriesDate = new Object({value:array.data[i][1],name:array.data[i][0]});
                //     LC.push(seriesDate);
                // }
                 option1 = {
                        tooltip : {
                            trigger: 'item',
                                formatter: "{b} : {c} ({d}%)"
                        },
                        legend: {
                                x : 'center',
                                y : 'bottom',
                                data:['15号楼','17号楼','21号楼','22号楼']
                        },
                        calculable : true,
                            series : [
                        {
                            name:'面积模式',
                            type:'pie',
                            radius : [40, 60],
                            center : ['50%', '50%'],
                            roseType : 'area',
                            data:[
                                    {value:33, name:'15号楼'},
                                    {value:35, name:'17号楼'},
                                    {value:36, name:'21号楼'},
                                    {value:25, name:'22号楼'}
                                    ]
                        }
                    ]
                    };
                myCharts.setOption(option1);
                break;
            case '房间':
                // var ROOM = [];
                // for(var i = 0;i < array.data.length;i++ ){
                //     var seriesDate = new Object({value:array.data[i][1],name:array.data[i][0]});
                //     ROOM.push(seriesDate);
                // }
                option2 = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c}"
                    },
                    calculable: true,
                    grid: {
                        top: '10%',
                        bottom: '15%',
                        borderWidth: 0
                        // y: 80,
                        // y2: 60
                    },
                    xAxis: [
                        {
                            type: 'category',
                            show: true,
                            data: ['15号楼', '17号楼', '21号楼', '22号楼']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            show: true
                        }
                    ],
                    series: [
                        {
                            // name: 'ECharts例子个数统计',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{b}\n{c}'
                                    }
                                }
                            },
                            // data: [12,21,10,4],
                            data: [3300,5432,3684,4433],
                            markPoint: {
                                tooltip: {
                                    trigger: 'item',
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    formatter: function(params){
                                        return '<img src="'
                                            + params.data.symbol.replace('image://', '')
                                            + '"/>';
                                    }
                                },
                                data: [
                                    {xAxis:0, y: 350, name:'15号楼', symbolSize:20},
                                    {xAxis:1, y: 350, name:'17号楼', symbolSize:20},
                                    {xAxis:2, y: 350, name:'21号楼', symbolSize:20},
                                    {xAxis:3, y: 350, name:'22号楼', symbolSize:20},
                                ]
                            }
                        }
                    ]
                };
                myCharts01.setOption(option2);
                break;
            case '面积':
                // var ROOMAREA = [];
                // for(var i = 0;i < array.data.length;i++ ){
                //     var seriesDate = new Object({value:parseInt(array.data[i][1]),name:array.data[i][0]});
                //     ROOMAREA.push(seriesDate);
                // }

                option3 =  {
                    tooltip : {
                        trigger: 'axis',
                        formatter: "{b} : {c}"
                    },
                    grid : {
                        top: '10%',
                        left: '20%',
                      bottom: '15%'
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : ['15号楼','17号楼','21号楼','22号楼']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}平米'
                            }
                        }
                    ],
                    series :[
                        {
                            name:'楼栋面积',
                            type:'line',
                            data: [7000,2000,1000,3000]
                        }
                    ]
                };
                myCharts02.setOption(option3);
                break;
        }
    }

    self.searchLC(searchsuccess);
    self.searchRoomNum(searchsuccess);
    self.searchRoomArea(searchsuccess);
    window.onresize = function () {
        myCharts.resize();
        myCharts01.resize();
        myCharts02.resize();
    };

    $('#title1').text('楼栋楼层数统计');
    $('#title2').text('楼栋房间数统计');
    $('#title3').text('楼栋住房面积数统计');
    $('#goLd').click(function(){

        if ($('#ldInput').val() != 'ALL'){
            function getOrder(start, end) {
                var length = end - start;
                var myorder = new Array();
                var index = 0;
                while (index < length+1) {
                    var flag = true;
                    var num = parseInt(Math.random() * (length + 1));
                    for (var i in myorder) {
                        if (myorder[i] == num) {
                            flag = false;
                        }
                    }
                    if (flag == true) {
                        myorder[index] = num;
                        index++;
                    }
                }
                return myorder;
            }

            var myorder = getOrder(300, 311);
            self.reDraw(myorder);
            $('#title1').text($("#ldInput").val()+'年度用电量');
            $('#title2').text($("#ldInput").val()+'年度用水量');
            $('#title3').text($("#ldInput").val()+'年度入住人数');

        }else {
            self.initEchartsOfbottom();
        }

    })
}


_ModelStatistics.prototype.reDraw = function(myorder){
    console.log('allS');


    var dom3 = document.getElementById('powerConsumption');
    var dom4 = document.getElementById('powerConsumption01');
    var dom5 = document.getElementById('powerConsumption02');
    dom3.removeAttribute("_echarts_instance_");
    dom4.removeAttribute("_echarts_instance_");
    dom5.removeAttribute("_echarts_instance_");
    var option1,option2,option3;
    var myCharts03 = echarts.init(dom3, 'dark');
    var myCharts04 = echarts.init(dom4, 'dark');
    var myCharts05 = echarts.init(dom5, 'dark');
    myCharts03._theme.backgroundColor='rgba(41,63,69,0.1)';
    myCharts04._theme.backgroundColor='rgba(41,63,69,0.1)';
    myCharts05._theme.backgroundColor='rgba(41,63,69,0.1)';
    myCharts03._theme.color =[ '#D7504B','#C6E579','#F4E001','#F0805A'];

    option1 = {
        tooltip : {
            trigger: 'item',
            formatter: "{用水量} : ({c}吨)"
        },
        legend: {
            x : 'center',
            y : 'bottom',
            data:['第一季度','第二季度','第三季度','第四季度']
        },
        calculable : true,
        series : [
            {
                name:'面积模式',
                type:'pie',
                radius : [40, 60],
                center : ['50%', '50%'],
                roseType : 'area',
                data:[
                    {value:1000, name:'第一季度'},
                    {value:5000, name:'第二季度'},
                    {value:3000, name:'第三季度'},
                    {value:2000, name:'第四季度'}
                ]
            }
        ]
    };
    myCharts03.setOption(option1);


    option2 = {
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
        },
        calculable: true,
        grid: {
            top: '20%',
            bottom: '13%',
            right:'13%',
            borderWidth: 0
            // y: 80,
            // y2: 60
        },
        xAxis: [
            {
                type: 'category',
                show: true,
                name: '(月份)',
                data: ['1', '2', '3', '4','5', '6', '7', '8','9', '10', '11', '12'],
            }
        ],
        yAxis: [
            {
                type: 'value',
                show: true,
                name: '(用电量)'
            }
        ],
        series: [
            {
                // name: 'ECharts例子个数统计',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            // build a color map as your need.
                            var colorList = [
                                '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                            ];
                            return colorList[params.dataIndex]
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}'
                        }
                    }
                },
                data: myorder,
                // data: ROOM,
                markPoint: {
                    tooltip: {
                        trigger: 'item',
                        backgroundColor: 'rgba(0,0,0,0)',
                        formatter: function(params){
                            return '<img src="'
                                + params.data.symbol.replace('image://', '')
                                + '"/>';
                        }
                    },
                    data: [
                        {xAxis:0, y: 350, name:'一月份', symbolSize:20},
                        {xAxis:1, y: 350, name:'二月份', symbolSize:20},
                        {xAxis:2, y: 350, name:'三月份', symbolSize:20},
                        {xAxis:3, y: 350, name:'四月份', symbolSize:20},
                        {xAxis:4, y: 350, name:'五月份', symbolSize:20},
                        {xAxis:5, y: 350, name:'六月份', symbolSize:20},
                        {xAxis:6, y: 350, name:'七月份', symbolSize:20},
                        {xAxis:7, y: 350, name:'八月份', symbolSize:20},
                        {xAxis:8, y: 350, name:'九月份', symbolSize:20},
                        {xAxis:9, y: 350, name:'十月份', symbolSize:20},
                        {xAxis:10, y: 350, name:'十一月份', symbolSize:20},
                        {xAxis:11, y: 350, name:'十二月份', symbolSize:20},
                    ]
                }
            }
        ]
    };
    myCharts04.setOption(option2);


    option3 =  {
        tooltip : {
            trigger: 'axis',
            formatter: "{b} : {c}"
        },
        grid : {
            top: '20%',
            left: '13%',
            right: '13%',
            bottom: '13%'
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['1', '2', '3', '4','5', '6', '7', '8','9', '10', '11', '12'],
                name: '(月份)'
            }
        ],
        yAxis : [
            {
                type : 'value',
                name : '(入住人数)',
                axisLabel : {
                    formatter: '{value}人数'
                }
            }
        ],
        series :[
            {
                name:'入住人数',
                type:'line',
                data: myorder
            }
        ]
    };
    myCharts05.setOption(option3);
};

_ModelStatistics.prototype.searchLC = function (_fn) {
    _fn({name:'楼层',data:[33,35,36,34]});
    // var self = this;
    // //model.search('搜索的关键词','搜索完成之后执行的函数','关键词所在的字段')
    // var index=0;
    // //存储结果的数组
    // var  array_lc=[];
    // searchBuilding(index);
    // function searchBuilding(index){
    //     var louceng = [];//['1F','2F'] 不重复
    //     if(index>=4 && index==4)  {
    //         _fn({name:'楼层',data:array_lc});
    //     }else{
    //         var thatModel=Object.values(JHCYW.models_obj[index])[0];
    //         var thatModelName=Object.keys(JHCYW.models_obj[index])[0];
    //         var instanceTree = thatModel.getData().instanceTree;
    //         thatModel.search("A_", function (item) {
    //             var len = item.length-1;
    //             item.map(function (res,_index) {
    //                 if (instanceTree.getNodeParentId(res) == self._viewer.model.getRootId()) {
    //                     var nodeFinalName = instanceTree.getNodeName(res);
    //                     var arr = nodeFinalName.split("_");
    //                     if (arr.length == 3) {
    //                         louceng.push(arr[1]);
    //                     }
    //                 }
    //                 if (_index == len){
    //                     array_lc.push([thatModelName,louceng.length]);
    //                     index++;
    //                     searchBuilding(index);
    //                 }
    //             });
    //         }, "名称");
    //     }
    // }
};

_ModelStatistics.prototype.searchRoomNum = function(_fn01){
    _fn01({name:'房间',data:[1700,4896,670,2133]});
    // var self = this;
    // var index = 0;
    // var array_room =[];
    // searchRoom(index);
    // function searchRoom(index){
    //     var fangjian = [];
    //     if (index>=4 && index==4){
    //         _fn01({name:'房间',data:array_room});
    //     } else{
    //         var theModel=Object.values(JHCYW.models_obj[index])[0];
    //         var theModelName=Object.keys(JHCYW.models_obj[index])[0];
    //         var instanceTree = theModel.getData().instanceTree;
    //
    //         theModel.search("房间",function (item) {
    //             if(item.length>0){
    //                 var len =item.length-1;
    //                 item.map(function (res,_index) {
    //                     var nodeFinalName = instanceTree.getNodeName(res);
    //                     var arr = nodeFinalName.split("#");
    //                     if (arr.length == 6||arr.length == 4) {
    //                         fangjian.push(arr[3]);
    //                     }
    //                     if (_index == len){
    //                         array_room.push([theModelName,fangjian.length]);
    //                         index++;
    //                         searchRoom(index);
    //                     }
    //                 });
    //             }else{
    //                 array_room.push([theModelName,fangjian.length]);
    //                 index++;
    //                 searchRoom(index);
    //             }
    //         }," 类别");
    //     }
    // }
};

_ModelStatistics.prototype.searchRoomArea = function(_fn02){
    _fn02({name:'面积',data:[7000,4000,3000,5000]});
    // var self = this;
    // var index = 0;
    // var array_area =[];
    // searchRoomA(index);
    // function searchRoomA(index){
    //     // var fangjianArea = [];
    //     if (index>=4 && index==4){
    //         _fn02({name:'面积',data:array_area});
    //     } else{
    //         var theModel=Object.values(JHCYW.models_obj[index])[0];
    //         var theModelName=Object.keys(JHCYW.models_obj[index])[0];
    //     theModel.search('房间',function(dbIds){
    //         theModel.getBulkProperties(dbIds, '面积',
    //                 function(elements){
    //                     var totalMass = 0;
    //                     for(var i=0; i<elements.length; i++){
    //                         totalMass += elements[i].properties[1].displayValue;
    //                         if (i==elements.length-1) {
    //                             array_area.push([theModelName,totalMass]);
    //                             index++;
    //                             searchRoomA(index);
    //                         }
    //                     }
    //                     console.log(totalMass);
    //                 });
    //         },null, '类别');
    //     }
    // }
};

Autodesk.Viewing.theExtensionManager.registerExtension('ModelStatistics', _ModelStatistics);
