<template>
    <div id="efficiency">
        <!-- <div class="efficiency">
			<div class="seach">
				<span class="searchType">查询方式</span>
				<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
					<el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="Time-search">查询时间</span>
				<el-date-picker v-model="timeData" v-if="this.types == 1" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 2" type="month" value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 3" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				<el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search1">搜索</el-button>
			</div>
            <div class="placeEcharts">
            	<div class="place-Echarts" v-if="isShowEcharts == 1" v-loading="loading">
            		<div class="echarts" ref="Echarts1"></div>
            	</div>
            	<div class="noDataEcharts" v-if="isShowEcharts == 2">暂无数据</div>
            </div>
            <div class="placeEcharts">
            	<div class="place-Echarts" v-if="isShowEcharts1 == 1" v-loading="loading1">
            		<div class="echarts" ref="Echarts2"></div>
            	</div>
            	<div class="noDataEcharts" v-if="isShowEcharts1 == 2">暂无数据</div>
            </div>
        </div> -->

        <div class="efficiency-history">
			<div class="seach">
				<span class="searchType">查询方式</span>
				<el-select v-model="choiceTime1" placeholder="请选择" clearable style="width: 110px;">
					<el-option v-for="item in TimeList1" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="Time-search">查询时间</span>
				<el-date-picker v-model="timeData2" v-if="this.types2 == 1" type="year" disabled value-format="yyyy" placeholder="选择日期"></el-date-picker>
				<el-date-picker v-model="timeData2" v-if="this.types2 == 2" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
				<el-date-picker v-model="timeData2" v-if="this.types2 == 3" type="month" value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
				<el-date-picker v-model="timeData2" v-if="this.types2 == 4" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
				<el-button class="btn" type="primary" icon="el-icon-search" size="small" @click="search2">搜索</el-button>
			</div>
            <div class="placeEcharts">
            	<div class="place-Echarts" v-if="isShowEcharts2 == 1" v-loading="loading2">
            		<div class="echarts" ref="Echarts3"></div>
            	</div>
            	<div class="noDataEcharts" v-if="isShowEcharts2 == 2">暂无数据</div>
            </div>
            <div class="placeEcharts">
            	<div class="place-Echarts" v-if="isShowEcharts3 == 1" v-loading="loading3">
            		<div class="echarts" ref="Echarts4"></div>
            	</div>
            	<div class="noDataEcharts" v-if="isShowEcharts3 == 2">暂无数据</div>
            </div>
        </div>

        <div class="bottomSearch">
            <span class="searchType">查询方式</span>
            <el-select v-model="choiceTime3" placeholder="请选择" clearable style="width: 110px;">
                <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="Time-search">查询时间</span>
            <el-date-picker v-model="timeData3" v-if="this.types3 == 1" type="year" value-format="yyyy" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData3" v-if="this.types3 == 2" type="month" value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
            <el-date-picker v-model="timeData3" v-if="this.types3 == 3" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            <el-button class="btn" type="primary" icon="el-icon-search" size="small" @click="search3">搜索</el-button>
        </div>
        <div class="placeTable">
            <div class="placeTablePerson">
                <p>人均</p>
                <el-table tooltip-effect="light" border :data="tableDataPerson" class="elTabel" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
                    <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
                        <template slot-scope="scope">
                            <span>{{(Number(valPerson) * pageSizePerson) - (pageSizePerson-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="roomName" label="房间名" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="rate" label="能效值" align='center'></el-table-column>
    			</el-table>
                <div class="paginition">
                    <el-pagination background @current-change="handleCurrentChangePerson" :current-page.sync="currentPagePerson" :page-size='pageSizePerson'  layout="total, prev, pager, next" :total="pageTotalPerson"></el-pagination>
                </div>
            </div>

            <div class="placeTableArea">
                <p>单位面积</p>
                <el-table tooltip-effect="light" border :data="tableDataArea" class="elTabel" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
                    <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
                        <template slot-scope="scope">
                            <span>{{(Number(valArea) * pageSizeArea) - (pageSizeArea-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="roomName" label="房间名" align='center'></el-table-column>
                    <el-table-column :show-overflow-tooltip="true" prop="rate" label="能效值" align='center'></el-table-column>
    			</el-table>
                <div class="paginition">
                    <el-pagination background @current-change="handleCurrentChangeArea" :current-page.sync="currentPageArea" :page-size='pageSizeArea'  layout="total, prev, pager, next" :total="pageTotalArea"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            building3: '',
            choiceTime1: 2,
            types2: 2,
            choiceTime3: 1,
            timeData3: '',
            types3: 1,
            building: '',
            buildingList: [],
            choiceTime: 1,
            TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
            TimeList1: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            timeData: '2018',
            timeData2: '',
            types: 1,
            val: 1,
            pageSize: 10,
            tableDataPerson: [],
            tableDataArea: [],
            year: '',
            month: '',
            day: '',
            year3: '',
            month3: '',
            day3: '',
            year2: '',
            month2: '',
            day2: '',
            Xvalue: [],
            dataValue: [],
            dataValueArea: [],
            XvalueArea: [],
            XvaluePeoson: [],
            dataValuePerson: [],
            areaValue: [],
            areaValue2: [],
            valPerson: 1,
            pageSizePerson: 10,
            currentPagePerson: 1,
            pageTotalPerson: 0,
            valArea: 1,
            pageSizeArea: 10,
            currentPageArea: 1,
            pageTotalArea: 0,
			loading: true,
			loading1: true,
			loading2: true,
			loading3: true,
			isShowEcharts: 1,
			isShowEcharts1: 1,
			isShowEcharts2: 1,
			isShowEcharts3: 1,
        }
    },
    methods: {
        init1() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                color: ['#3398DB'],
                title: {
                    left: 'center',
                    text: '楼宇房间能效top项',
                    subtext: '人均'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    },
                    formatter: "{a} <br/>{b}: {c} kw·h/人"
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '7%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.XvaluePeoson,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            interval:0,
                            rotate:-40
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
						name : 'kw·h/人'
                    }
                ],
                series : [
                    {
                        name:'人均',
                        type:'bar',
                        barWidth: '60%',
                        data:this.dataValuePerson,
                        itemStyle : {
                            normal: {
                                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#08A9FE'
                                }, {
                                    offset: 1,
                                    color: '#5C63F6'
                                }]),
                            }
                        }
                    }
                ]
            };
            myEcharts1.setOption(option1);

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                color: ['#3398DB'],
                title: {
                    left: 'center',
                    text: '楼宇房间能效top项',
                    subtext: '单位面积'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: "{a} <br/>{b}: {c} kw·h/m²"
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '7%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : this.areaValue,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            interval:0,
                            rotate:-40
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
						name : 'kw·h/m²'
                    }
                ],
                series : [
                    {
                        name:'单位面积',
                        type:'bar',
                        barWidth: '60%',
                        data:this.areaValue2,
                        itemStyle : {
                            normal: {
                                 color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#08A9FE'
                                }, {
                                    offset: 1,
                                    color: '#5C63F6'
                                }]),
                            }
                        }
                    }
                ]
            };
            myEcharts2.setOption(option2);
        },
        init2() {
            let myEcharts3 = this.$echarts.init(this.$refs.Echarts3);
            let option3 = {
                title: {
                    text: '楼宇历史能效',
                    left: 'center',
                    subtext: '人均'
                },
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c} kW·h/人"
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '7%',
                    containLabel: true
                },
                color: '#8EF6D2',
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.Xvalue,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
                },
                yAxis: {
                    type: 'value',
					name : 'kW·h/人'
                },
                series: [
                    {
                        name:'历史用电',
                        type:'line',
                        data:this.dataValue,
                        /* lineStyle: {
                            normal: {
                                width: '1'
                            }
                        },
                        areaStyle: {
                            color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                                colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                                global: false
                            }
                        }, */
						areaStyle: {normal: {
						    color: new echarts.graphic.LinearGradient(
						        0, 0, 0, 1,
						        [
						            {offset: 0, color: '#8EF6D2'},
						            {offset: 1, color: '#E7FAF5'}
						        ]
						    )
						}},
                    }
                ]
            };
            myEcharts3.setOption(option3);

            let myEcharts4 = this.$echarts.init(this.$refs.Echarts4);
            let option4 = {
                color: ['#8EF6D2'],
                title: {
                    text: '楼宇历史能效',
                    left: 'center',
                    subtext: '单位面积'
                },
                tooltip : {
                    trigger: 'axis',
                    formatter: "{a} <br/>{b}: {c} kW·h/m²"
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '7%',
                    containLabel: true
                },
                xAxis: {
                    boundaryGap: false,
                    type: 'category',
                    data: this.XvalueArea,
                    axisLabel: {
                        interval:0,
                        rotate:-40
                    }
                },
                yAxis: {
                    type: 'value',
					name : 'kW·h/m²'
                },
                series: [{
                    name:'单位面积',
                    data: this.dataValueArea,
                    type: 'line',
                    /* lineStyle: {
                        normal: {
                            width: '1'
                        }
                    },
                    areaStyle: {
                        color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                            global: false
                        }
                    }, */
					areaStyle: {normal: {
					    color: new echarts.graphic.LinearGradient(
					        0, 0, 0, 1,
					        [
					            {offset: 0, color: '#8EF6D2'},
					            {offset: 1, color: '#E7FAF5'}
					        ]
					    )
					}},
                }]
            };
            myEcharts4.setOption(option4);
        },

        // top值
        topData() {
            let data = {
                queryFlag: this.choiceTime,
                year: this.year,
                month: this.month,
                day: this.day,
                building_id: this.building
            };
            this.$axios.post(`BMPlatServers/electricity/queryroomsenereffitop`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    // 房间top人均
                    this.XvaluePeoson = [];
                    this.dataValuePerson = [];
                    if(res.data.result.rommsTopByPepleList && res.data.result.rommsTopByPepleList.length) {
                        res.data.result.rommsTopByPepleList.forEach((item)=>{
                            this.XvaluePeoson.push(item.roomName);
                            this.dataValuePerson.push(item.rate);
                        });
                    }else{
						this.isShowEcharts = 2;
					}
                    // 房间top单位面积
                    this.areaValue = [];
                    this.areaValue2 = [];
                    if(res.data.result.rommsTopByArerList && res.data.result.rommsTopByArerList.length) {
                        res.data.result.rommsTopByArerList.forEach((item)=>{
                            this.areaValue.push(item.roomName);
                            this.areaValue2.push(item.rate);
                        })
                    }else{
						this.isShowEcharts1 = 2;
					}
                    this.init1();
                   this.loading = false;
                   this.loading1 = false;
                }else{
                    this.loading = false;
                    this.loading1 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },

        // 楼宇历史能效
        histoInitData() {
            let data = {
                queryFlag: this.choiceTime1,
                year: this.year2,
                month: this.month2,
                day: this.day2,
                building_id: this.building
            };
            this.$axios.post(`BMPlatServers/electricity/querybuildenergyefficiency`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    // 人均
                    this.Xvalue = [];
                    this.dataValue = [];
                    if(res.data.result.BuildByPepleList && res.data.result.BuildByPepleList.length) {
                        res.data.result.BuildByPepleList.forEach((item)=>{
                            this.Xvalue.push(item.time);
                            this.dataValue.push(item.rate);
                        });
                    }else{
						this.isShowEcharts2 = 2;
					}

                    // 单位面积
                    this.XvalueArea = [];
                    this.dataValueArea = [];
                    if(res.data.result.buildByArerList && res.data.result.buildByArerList.length) {
                        res.data.result.buildByArerList.forEach((item)=>{
                            this.XvalueArea.push(item.time);
                            this.dataValueArea.push(item.rate);
                        });
                    }else{
						this.isShowEcharts3 = 2;
					}
                    this.init2();
					this.loading2 = false;
					this.loading3 = false;
                }else{
                    this.loading2 = false;
                    this.loading3 = false;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },

        // table单位面积
        tablePersonData() {
            let data = {
                building_id: this.building,
                year: this.year3,
                month: this.month3,
                day: this.day3,
                queryFlag: this.choiceTime3,
                currentPage: this.currentPageArea,
                pageSize: this.pageSizeArea
            };
            this.$axios.post(`BMPlatServers/electricity/queryroomsenerefficompforare`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableDataArea = res.data.result.rommsByArerList;
                    this.pageTotalArea = res.data.result.count;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },
        // table单位面积分页
        handleCurrentChangeArea(val) {
            this.valArea = val;
            let data = {
                building_id: this.building,
                year: this.year3,
                month: this.month3,
                day: this.day3,
                queryFlag: this.choiceTime3,
                currentPage: val,
                pageSize: this.pageSizeArea
            };
            this.$axios.post(`BMPlatServers/electricity/queryroomsenerefficompforare`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableDataArea = res.data.result.rommsByArerList;
                    this.pageTotalArea = res.data.result.count;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },

        // table人均
        tableAreaData() {
            let data = {
                building_id: this.building,
                year: this.year3,
                month: this.month3,
                day: this.day3,
                queryFlag: this.choiceTime3,
                currentPage: this.currentPagePerson,
                pageSize: this.pageSizePerson
            };
            this.$axios.post(`BMPlatServers/electricity/queryroomsenerefficompforpel`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableDataPerson = res.data.result.rommsByPepleList;
                    this.pageTotalPerson = res.data.result.count;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },
        // table人均分页
        handleCurrentChangePerson(val) {
            this.valPerson = val;
            let data = {
                building_id: this.building,
                year: this.year3,
                month: this.month3,
                day: this.day3,
                queryFlag: this.choiceTime3,
                currentPage: val,
                pageSize: this.pageSizePerson
            };
            this.$axios.post(`BMPlatServers/electricity/queryroomsenerefficompforpel`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableDataPerson = res.data.result.rommsByPepleList;
                    this.pageTotalPerson = res.data.result.count;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },
        search1() {

            if(!this.choiceTime) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            if(this.timeData == '' || this.timeData == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.topData();
            this.isShowEcharts = 1;
            this.isShowEcharts1 = 1;
            this.loading = true;
            this.loading1 = true;
        },
        search2() {
            if(!this.choiceTime1) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            if(this.choiceTime1 != 1) {
                if(this.timeData2 =='' || this.timeData2 == null) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择时间',
                        duration: 3000
                    })
                    return false;
                }
            }
            this.histoInitData();
            this.isShowEcharts2 = 1;
            this.isShowEcharts3 = 1;
			this.loading2 = true;
			this.loading3 = true;
        },
        search3() {
            if(!this.choiceTime3) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            if(this.timeData3 == '' || this.timeData3 == null) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择时间',
                    duration: 3000
                })
                return false;
            }
            this.tablePersonData();
            this.tableAreaData();
        }
    },
    mounted() {
		let dates = new Date();
		dates = dates.getTime();
		dates = dates - 24*60*60*1000;
		let yesToday = new Date(dates);
		let year = yesToday.getFullYear();
		let month = yesToday.getMonth() + 1;
		let day = yesToday.getDate();
		this.timeData2 = `${year}-${month}-${day}`;
		this.timeData3 = `${year}-${month}-${day}`;
		this.year2 = year;
		this.year3 = year;
        this.building = window.location.href.split('=')[1];
        this.topData();
        this.histoInitData();
        this.tablePersonData();
        this.tableAreaData();
    },
    watch: {
        $route(to,from) {
            this.building = to.fullPath.split('=')[1];
        },
        choiceTime(olds) {
            if(olds == 1) {
                this.types = 1
            }else if(olds == 2) {
                this.types = 2
            }else if(olds == 3) {
                this.types = 3
            }else if(olds == 4) {
                this.types = 4
            };
            this.timeData = ''
        },
        choiceTime1(olds) {
            if(olds == 1) {
                this.types2 = 1
            }else if(olds == 2) {
                this.types2 = 2
            }else if(olds == 3) {
                this.types2 = 3
            }else if(olds == 4) {
                this.types2 = 4
            };
            this.timeData2 = ''
        },
        choiceTime3(item) {
            if(item==1) {
                this.types3 = 1;
            }else if(item==2) {
                this.types3 = 2;
            }else if(item==3) {
                this.types3 = 3;
            }
            this.timeData3 = '';
        },
        timeData(item) {
            if(item) {
                this.year = item.split('-')[0];
                this.month = item.split('-')[1];
                this.day = item.split('-')[2];
            }else{
                this.year = '';
                this.month = '';
                this.day = '';
            }
        },
        timeData2(item) {
            if(item) {
                this.year2 = item.split('-')[0];
                this.month2 = item.split('-')[1];
                this.day2 = item.split('-')[2];
            }else{
                this.year2 = '';
                this.month2 = '';
                this.day2 = '';
            }
        },
        timeData3(item) {
            if(item) {
                this.year3 = item.split('-')[0];
                this.month3 = item.split('-')[1];
                this.day3 = item.split('-')[2];
            }else{
                this.year3 = '';
                this.month3 = '';
                this.day3 = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#efficiency{
    .efficiency{
		.seach{
			.searchType{
				margin-left: 20px;
                margin-top: 30px;
			}
			.Time-search{
				margin-left: 20px;
                margin-top: 30px;
			}
			.btn{
				margin-left: 20px;
                margin-top: 30px;
			}
		}
        .placeEcharts{
            padding-top: 20px;
            padding-bottom: 20px;
            border-bottom: 3px solid #ddd;
            overflow: hidden;
        	width: 50%;
        	float: left;
        	.place-Echarts{
        		width: 100%;
        		height: 300px;
        		/* float: left; */
        		.echarts{
        			width: 100%;
        			height: 300px;
        			/* float: left; */
        		}
        	}
        }
    }
    .efficiency-history{
        overflow: hidden;
        .placeEcharts{
            padding-top: 20px;
            padding-bottom: 20px;
            border-bottom: 3px solid #ddd;
            overflow: hidden;
        	width: 50%;
        	float: left;
        	.place-Echarts{
        		width: 100%;
        		height: 300px;
        		/* float: left; */
        		.echarts{
        			width: 100%;
        			height: 300px;
        			/* float: left; */
        		}
        	}
        }

    }
    .bottomSearch{
        margin-top: 30px;
    }
    .placeTable{
        overflow: hidden;
        margin-top: 20px;
        .placeTablePerson{
            float: left;
            width: 50%;
            p{
                font-size: 18px;
                font-weight: 700;
                text-align: center;
            }
            .paginition{
                text-align: right;
                margin: 15px;
            }
        }
        .placeTableArea{
            float: left;
            width: 50%;
            p{
                font-size: 18px;
                font-weight: 700;
                text-align: center;
            }
            .paginition{
                text-align: right;
                margin: 15px;
            }
        }
    }

}
</style>
