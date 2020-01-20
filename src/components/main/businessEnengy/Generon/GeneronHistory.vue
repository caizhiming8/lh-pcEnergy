<template>
    <div id="GeneronHistory">
        <div class="GeneronHistory">
            <ul>
                <li v-for="(item, index) in manaList" @click="handleClick(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
            </ul>
            <div class="placeSearch">
                <span>选择商户</span>
                <el-select v-model="manaName" placeholder="请选择" clearable filterable>
                    <el-option v-for="item in manaNameList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                </el-select>
                <span class="searchType">查询方式</span>
                <el-select v-model="type" placeholder="请选择" clearable style="width: 140px;">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="searchTime">查询时间</span>
                <el-date-picker v-model="dataTime" v-if="Type==1" disabled value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="dataTime" v-if="Type==2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="dataTime" v-if="Type==3" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search" class="btn">搜索</el-button>
            </div>

            <div class="placeEcharts" v-loading="loading">
                <div v-show="flagtop==1" class="placeEcharts-top">
                    <div class="echarts" ref="Echarts1"></div>
                    <div class="echarts" ref="Echarts2"></div>
                </div>
				<div v-show="marktop==1" class="placeEcharts-top">
				    <div class="echarts" ref="Echarts7"></div>
				    <div class="echarts" ref="Echarts8"></div>
				</div>
                <div v-show="flag==1" class="placeEcharts-bottom">
                    <div class="echarts" ref="Echarts3"></div>
                    <div class="echarts" ref="Echarts4"></div>
                </div>
				<div v-show="mark==1" class="placeEcharts-bottom">
				    <div class="echarts" ref="Echarts5"></div>
				    <div class="echarts" ref="Echarts6"></div>
				</div>
    		</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            manaNameList: [],
            manaName: '',
            manaList: [{name: '当前商户', id: 1}, {name: '历史商户', id: 2}],
            currentIndex: 0,
            typeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            type: 3,
            dataTime: '2018-10',
            Type: 3,
            loading: true,
            watchXvalue: [],
            watchDataValue: [],

            waterXRoom: [],
            waterDataRoom: [],
			waterDataRoomm: [],
            powerXvalue: [],
            powerDataValue: [],
            powerXValue: [],
            powerDataValueRoom: [],
			powerDataValueRoomm: [],
			elength:0,
			flag:2,
			mark:2,
			flagtop:2,
			marktop:2,
            k: 2
        }
    },
    methods:{
        init() {
            let myChart3 = this.$echarts.init(this.$refs.Echarts3);
			let wid3 = document.body.clientWidth || document.documentElement.clientWidth;
			var resize3 = {
			  width: wid3/2 - 180,
			  height: 300
			};
			myChart3.resize(resize3);
            let option3 = {
                title: {
                    left: 'center',
                    text: '商户总用电',
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: '#8EF6D2',
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.powerXvalue,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'kWh'
                },
                series: [
                    {
                        name:'商户总用电',
                        type:'line',
                        lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        },
                       data: this.powerDataValue
                    }
                ]
            }
            myChart3.setOption(option3);

            let myChart4 = this.$echarts.init(this.$refs.Echarts4);
			let wid4 = document.body.clientWidth || document.documentElement.clientWidth;
			var resize4 = {
			  width: wid4/2 - 180,
			  height: 300
			};
			myChart4.resize(resize4);
            let option4 = {
                title: {
                    text: '商户各房间用电',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#FC9493', '#86D5FF', '#8EF6D2'],
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.powerXValue,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'kWh'
                },
                series: this.powerDataValueRoom
            };
            myChart4.setOption(option4);
        },

		init1() {
		    let myChart5= this.$echarts.init(this.$refs.Echarts5);
			let wid5 = document.body.clientWidth || document.documentElement.clientWidth;
			var resize5 = {
			  width: wid5/2 - 180,
			  height: 300
			};
			myChart5.resize(resize5);
		    let option5 = {
		        title: {
		            left: 'center',
		            text: '商户总用电',
		        },
                color: '#8EF6D2',
		        tooltip: {
		            trigger: 'axis'
		        },
		        grid: {
		            left: '3%',
		            right: '4%',
		            bottom: '10%',
		            containLabel: true
		        },
		        xAxis: {
		            type: 'category',
		            boundaryGap: false,
		            data: this.powerXvalue,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
		        },
		        yAxis: {
		            type: 'value',
                    name: 'kWh'
		        },
		        series: [
		            {
		                name:'商户总用电',
		                type:'line',
		                //stack: '总量',
                        lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        },
		               data: this.powerDataValue
		            }
		        ]
		    }
		    myChart5.setOption(option5);

		    let myChart6 = this.$echarts.init(this.$refs.Echarts6);
			let wid6 = document.body.clientWidth || document.documentElement.clientWidth;
			var resize6 = {
			  width: wid6/2 - 180,
			  height: 300
			};
			myChart6.resize(resize6);
		    let option6 = {
		        title: {
		            text: '商户各房间用电',
		            left: 'center'
		        },
                color: ['#FC9493', '#86D5FF', '#8EF6D2'],
		        tooltip: {
		            trigger: 'axis'
		        },
		        grid: {
		            left: '3%',
		            right: '4%',
		            bottom: '10%',
		            containLabel: true
		        },
		        xAxis: {
		            type: 'category',
		            boundaryGap: false,
		            data: this.powerXValue,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
		        },
		        yAxis: {
		            type: 'value',
                    name: 'kWh'
		        },
		        series: this.powerDataValueRoomm
		    };
		    myChart6.setOption(option6);
		},
		init3() {
		    let myChart1 = this.$echarts.init(this.$refs.Echarts1);
			let wid1 = document.body.clientWidth || document.documentElement.clientWidth;
			var resize1 = {
			  width: wid1/2 - 180,
			  height: 300
			};
			myChart1.resize(resize1);
		    let option1 = {
		        title: {
		            left: 'center',
		            text: '商户总用水',
		        },
		        tooltip: {
		            trigger: 'axis'
		        },
                color: '#8EF6D2',
		        grid: {
		            left: '3%',
		            right: '4%',
		            bottom: '10%',
		            containLabel: true
		        },
		        xAxis: {
		            type: 'category',
		            boundaryGap: false,
		            data: this.watchXvalue,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
		        },
		        yAxis: {
		            type: 'value',
                    name: 'm³'
		        },
		        series: [
		            {
		                name:'商户总用水',
		                type:'line',
		                //stack: '总量',
                        lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        },
		               data: this.watchDataValue
		            }
		        ]
		    }
		    myChart1.setOption(option1);

		    let myChart2 = this.$echarts.init(this.$refs.Echarts2);
			let wid2 = document.body.clientWidth || document.documentElement.clientWidth;
			var resize2 = {
			  width: wid2/2 - 180,
			  height: 300
			};
			myChart2.resize(resize2);
		    let option2 = {
		        title: {
		            left: 'center',
		            text: '商户各房间用水',
		        },
		        tooltip: {
		            trigger: 'axis'
		        },
                color: ['#FC9493', '#86D5FF', '#8EF6D2'],
		        grid: {
		            left: '3%',
		            right: '4%',
		            bottom: '10%',
		            containLabel: true
		        },
		        xAxis: {
		            type: 'category',
		            boundaryGap: false,
		            data: this.waterXRoom,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
		        },
		        yAxis: {
		            type: 'value',
                    name: 'm³'
		        },
		        series: this.waterDataRoom
		    }
		    myChart2.setOption(option2);
		},
		init4() {
		    let myChart7 = this.$echarts.init(this.$refs.Echarts7);
			let wid7 = document.body.clientWidth || document.documentElement.clientWidth;
			var resize7 = {
			  width: wid7/2 - 180,
			  height: 300
			};
			myChart7.resize(resize7);
		    let option7 = {
		        title: {
		            left: 'center',
		            text: '商户总用水',
		        },
		        tooltip: {
		            trigger: 'axis'
		        },
                color: '#8EF6D2',
		        grid: {
		            left: '3%',
		            right: '4%',
		            bottom: '10%',
		            containLabel: true
		        },
		        xAxis: {
		            type: 'category',
		            boundaryGap: false,
		            data: this.watchXvalue,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
		        },
		        yAxis: {
		            type: 'value',
                    name: 'm³'
		        },
		        series: [
		            {
		                name:'商户总用水',
		                type:'line',
                        lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        },
		               data: this.watchDataValue
		            }
		        ]
		    }
		    myChart7.setOption(option7);

		    let myChart8 = this.$echarts.init(this.$refs.Echarts8);
			let wid8 = document.body.clientWidth || document.documentElement.clientWidth;
			var resize8 = {
			  width: wid8/2 - 180,
			  height: 300
			};
			myChart8.resize(resize8);
		    let option8 = {
		        title: {
		            left: 'center',
		            text: '商户各房间用水',
		        },
		        tooltip: {
		            trigger: 'axis'
		        },
                color: ['#FC9493', '#86D5FF', '#8EF6D2'],
		        grid: {
		            left: '3%',
		            right: '4%',
		            bottom: '10%',
		            containLabel: true
		        },
		        xAxis: {
		            type: 'category',
		            boundaryGap: false,
		            data: this.waterXRoom,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
		        },
		        yAxis: {
		            type: 'value',
                    name: 'm³'
		        },
		        series: this.waterDataRoomm
		    }
		    myChart8.setOption(option8);
		},

        initData(Id, flag, time, now) {
            let data = {userId: Id, flag: flag, time: time, now: now};
            this.powerXValue = [];
            this.powerDataValueRoom = [];
            this.waterXRoom = [];
            this.waterDataRoom = [];
            this.$axios.post(`BMPlatServers/commercial/queryUserHistoryConsume`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    // 水表数组
                    this.watchDataValue = [];
                    this.watchXvalue = [];
                    if(res.data.result.wlist && res.data.result.wlist.length) {
                        res.data.result.wlist.forEach((item1)=>{
                            this.watchDataValue.push(item1.consume);
                            this.watchXvalue.push(item1.number);
                        })
                    }else{
                        // this.$message.warning('水表暂无数据');
                    };

                    // 水表房间
                    let waterArr = [];
                    this.waterXRoom = [];
                    this.waterDataRoom = [];
                    if(res.data.result.wresultlist && res.data.result.wresultlist.length) {
                        // 外层循环
                        res.data.result.wresultlist.forEach((item2)=>{
                            waterArr.push(item2.list.length)
                            let ArrAys = [];
                            if(item2.list && item2.list.length) {
                                // 内层循环
                                item2.list.forEach((innerItem1)=>{
                                    ArrAys.push(innerItem1.consume);
                                });

                                this.waterDataRoom.push({
                                    name: item2.roomname,
                                    type: 'line',
                                    data: ArrAys,
                                    lineStyle: {
                                        normal: {
                                            width: '1'
                                        }
                                    }
                                })
                            }
                        })
                        if(this.waterDataRoom[0] != undefined) {
                            this.waterDataRoom[0].areaStyle = {
                                color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [{offset: 0, color: '#FC9493'}, {offset: 1, color: '#FDEDED'}],
                                    global: false
                                }
                            }
                        }
                        if(this.waterDataRoom[1] != undefined) {
                            this.waterDataRoom[1].areaStyle = {
                                color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [{offset: 0, color: '#86D5FF'}, {offset: 1, color: '#D8F2FF'}],
                                    global: false
                                }
                            }
                        }
                        if(this.waterDataRoom[2] != undefined) {
                            this.waterDataRoom[2].areaStyle = {
                                color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                    global: false
                                }
                            }
                        }
                        // 判断数组中最大值的索引
                        waterArr = waterArr.indexOf(Math.max.apply(Math, waterArr));
                        res.data.result.wresultlist[waterArr].list.forEach((datas)=>{
                            this.waterXRoom.push(datas.number);
                        })
                    }
					if(this.waterDataRoom.length==0){
						this.init4();
						this.flagtop = 2;
						this.marktop = 1;
						this.loading = false;
					}else {
						this.init3();
						this.flagtop = 1;
						this.marktop = 2;
						this.loading = false;
					}

                    // 电表数据
                    this.powerDataValue = [];
                    this.powerXvalue = [];
                    if(res.data.result.elist && res.data.result.elist.length) {
                        res.data.result.elist.forEach((item3)=>{
                            this.powerDataValue.push(item3.consume);
                            this.powerXvalue.push(item3.number);
                        })
                    }

                    // 电表房间
                    this.powerXValue = [];
                    this.powerDataValueRoom = [];
                    let arrLength = [];
                    if(res.data.result.eresultlist && res.data.result.eresultlist.length) {
						this.elength = res.data.result.eresultlist.length;
                        res.data.result.eresultlist.forEach((item4)=>{
                            arrLength.push(item4.list.length);
                            let newList = [];

                            if(item4.list && item4.list.length) {
                                item4.list.forEach((innerItem)=>{
                                    newList.push(innerItem.consume)
                                })
                            }
                            this.powerDataValueRoom.push(
                                {
                                    name: item4.roomname,
                                    type: 'line',
                                    data: newList,
                                    lineStyle: {
                                        normal: {
                                            width: '1'
                                        }
                                    }
                                }
                            )
                        })
                        if(this.powerDataValueRoom[0] != undefined) {
                            this.powerDataValueRoom[0].areaStyle = {
                                color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [{offset: 0, color: '#FC9493'}, {offset: 1, color: '#FDEDED'}],
                                    global: false
                                }
                            }
                        }
                        if(this.powerDataValueRoom[1] != undefined) {
                            this.powerDataValueRoom[1].areaStyle = {
                                color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [{offset: 0, color: '#86D5FF'}, {offset: 1, color: '#D8F2FF'}],
                                    global: false
                                }
                            }
                        }
                        if(this.powerDataValueRoom[2] != undefined) {
                            this.powerDataValueRoom[2].areaStyle = {
                                color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                    global: false
                                }
                            }
                        }
                        arrLength = arrLength.indexOf(Math.max.apply(Math, arrLength))
                        res.data.result.eresultlist[arrLength].list.forEach((item5)=>{
                            this.powerXValue.push(item5.number);
                        })
                    }else{
                        this.powerDataValueRoom = [];
                        this.powerXValue = [];
                    }
					if(this.powerDataValueRoom.length==0){
						this.init1();
						this.flag = 2;
						this.mark = 1;
						this.loading = false;
					}else {
						this.init();
						this.flag = 1;
						this.mark = 2;
						//this.flagtop = 1;
						//this.marktop = 1;
						this.loading = false;
						//this.init();
					}


					//this.loading = false;
					//this.init();
                }else{
                    this.loading = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        // 商户下拉列表
        manaNamelist(flag) {
            let data = {
                flag: flag
            };
            this.$axios.post('BMPlatServers/commercial/queryUserList', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.manaNameList = res.data.result.list;
                    this.manaName = res.data.result.list[0].userId;
                    if(this.k == 2) {
                        this.initData(res.data.result.list[0].userId, 3, '2018-10', 1);
                    }else{
                        this.initData(this.manaName, this.type, this.dataTime, this.k);
                    }
                }
            })
        },

        // 点击变色
        handleClick(i) {
            this.manaNamelist(i);
            this.loading = true;
            let k = 0;
            this.currentIndex = i;
            if(i == 0) {
                k = 1;
            }else{
                k = 0;
            };
            this.k = k;
        },

        search() {
            if(!this.manaName) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择商户',
                    duration: 2000,
                })
                return false;
            }
            if(!this.type) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择查询方式',
                    duration: 2000
                })
                return false;
            }
            if(this.type != 1) {
                if(!this.dataTime) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择查询时间',
                        duration: 2000
                    })
                    return false;
                }
            }
            this.loading = true;
            this.initData(this.manaName, this.type, this.dataTime, this.k);
        }
    },
    mounted() {
        this.manaNamelist(0);
    },
    watch: {
        type(item) {
            this.dataTime = '';
            if(item) {
                if(item == 1) {
                    this.Type = 1;
                }else if(item == 2) {
                    this.Type = 2;
                }else if(item == 3) {
                    this.Type = 3;
                }
            }else{
                this.Type = 3;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#GeneronHistory{
    .GeneronHistory{
        ul{
            overflow: hidden;
            li{
                float: left;
                padding: 6px 15px;
                border: 1px solid #409eff;
                border-radius: 3px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                -ms-border-radius: 3px;
                -o-border-radius: 3px;
                color: #409eff;
                margin: 0 10px;
                cursor: pointer;
                &.active{
                    background: #409EFF;
                    color: #fff;
                    font-weight: normal;
                }
            }
        }
        .placeSearch{
            margin-top: 20px;
            .searchType{
                margin-left: 20px;
            }
            .searchTime{
                margin-left: 20px;
            }
            .btn{
                margin-left: 40px;
            }
        }
        .placeEcharts{
            margin-top: 30px;
            .placeEcharts-top{
                overflow: hidden;
                .echarts{
                    width: 50%;
                    height: 300px;
                    float: left;
                }
            }
            .placeEcharts-bottom{
                overflow: hidden;
                margin-top: 30px;
                .echarts{
                    width: 50%;
                    height: 300px;
                    float: left;
                }
            }
        }
        span{
            color: #666;
        }
    }
}
</style>
