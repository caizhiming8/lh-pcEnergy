<template>
    <div id="Money">
        <div class="Money">
            <div class="placeSearch">
                <span class="time">时间</span>
                <el-date-picker v-model="timer" type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <el-button type="primary" size="small" icon="el-icon-search" @click="search" class="btn">搜索</el-button>
                <div class="allmoney">
                    <p>总费用：</p>
                    <v-countup start-value="0" :end-value="totalMoney" :duration="1" :decimals="2" :options="options"></v-countup>
                </div>
            </div>

            <div class="placeEcharts" v-loading="loading1">
                <div class="alarmLeft">
                    <div class="echarts" ref="Echarts1"></div>
                </div>
                <div class="alarmRight">
                    <div class="echarts" ref="Echarts2"></div>
                </div>
            </div>

            <div class="placeTable">
                <el-table :data="tableData" style="width: 100%;margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading="loading">
                    <el-table-column label="序号" width="80" align='center'>
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buildingName" label="区域" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="roomName" label="地点" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="type" label="类型" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="project" label="维修项目" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="维修人" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="costTime" label="总时长（小时）" align='center' show-overflow-tooltip width="150"></el-table-column>
                    <el-table-column prop="commitTime" label="时间" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="money" label="工时费" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="deviceMoney" label="设备费" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="allmoney" label="总费用" align='center' show-overflow-tooltip></el-table-column>
                </el-table>
            </div>

            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            timer: null,
            tableData: [],
            loading: true,
            val: 1,
            pageSize: 10,
            currentPage: 1,
            pageTotal: 0,
            startTime: '',
            endTime: '',
            loading1: true,
            dataValue1: [],
            dataValue2: [],
            dataName1: [],
            dataName2: [],
            totalMoney: 0,
            options: {prefix: '￥'}
        }
    },
    methods: {
        init() {
            let myEcharts1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '按项目类型分析',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} 元 ({d}%)"
                },
                color: ['#FCC667', '#BC8DEE','#F66F6F', '#2DA8E8', '#B5B5B5'],
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: this.dataName1
                },
                series: [
                    {
                        name:'费用',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                formatter:'{b}\n{c}元',
                                position: 'center',
                                lineHeight:18,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.dataValue1
                    }
                ]
            };
            myEcharts1.setOption(option1);

            let myEcharts2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                    text: '按楼宇分析',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} 元 ({d}%)"
                },
                color: ['#FCC667', '#BC8DEE','#F66F6F', '#2DA8E8', '#B5B5B5'],
                legend: {
                    orient: 'vertical',
                    x: '15px',
                    data: this.dataName2
                },
                series: [
                    {
                        name:'费用',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                formatter:'{b}\n{c}元',
                                position: 'center',
                                lineHeight:18,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:this.dataValue2
                    }
                ]
            };
            myEcharts2.setOption(option2);
        },

        // 圆环和总费用接口
        circleData() {
            let data = {
                startTime: this.startTime,
                endTime: this.endTime
            };
            this.$axios.post('BMPlatServers/repair/queryRepairCost', this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.dataName1 = [];
                    this.dataValue1 = [];
                    if(res.data.result.plist && res.data.result.plist.length) {
                        res.data.result.plist.forEach((item)=>{
                            this.dataName1.push(item.name);
                            this.dataValue1.push({name: item.name, value: item.allmonry});
                        })
                    }else{
                        this.dataName1 = ['暂无数据'];
                        this.dataValue1 = [{name: '暂无数据', value: 0}];
                    }

                    this.dataName2 = [];
                    this.dataValue2 = [];
                    if(res.data.result.blist && res.data.result.blist.length) {
                        res.data.result.blist.forEach((item)=>{
                            this.dataName2.push(item.buildingName);
                            this.dataValue2.push({name: item.buildingName, value: item.allmoney});
                        })
                    }else{
                        this.dataName2 = ['暂无数据'];
                        this.dataValue2 = [{name: '暂无数据', value: 0}];
                    }
                    res.data.result.costmap.allmonry ? this.totalMoney = res.data.result.costmap.allmonry : this.totalMoney = 0;
                    this.loading1 = false;
                    this.init();
                }else{
                    this.loading1 = false;
                    this.init();
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        initData(currentPage) {
            let data = {
                flag: 5,
                currentPage,
                pageSize: this.pageSize,
                startTime: this.startTime,
                endTime: this.endTime
            };
            this.$axios.post('BMPlatServers/repair/analyzeRepairItem', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.result;
                    this.pageTotal = res.data.result.num;
                    this.loading = false;
                }else{
                    this.tableData = [];
                    this.pageTotal = 0;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                    this.loading = false;
                }
            })
        },
        search() {
            this.loading = true;
            this.loading1 = true;
            this.currentPage = 1;
            this.val = 1;
            this.initData(1);
            this.circleData();
        },
        handleCurrentChange(val) {
            this.loading = true;
            this.val = val;
            this.initData(val);
        }
    },
    mounted() {
        this.initData(1);
        this.circleData();
    },
    watch: {
        timer(oldData) {
            if(oldData == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = oldData[0];
                this.endTime = oldData[1];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#Money{
    .Money{
        .placeSearch{
            position: relative;
            .btn{
                margin-left: 40px;
            }
            .allmoney{
                position: absolute;
                right: 20px;
                top: 7px;
                font-size: 16px;
                p{
                    display: inline-block;
                }
                span{
                    color: red;
                    font-weight: 700;
                }
            }
        }
        .placeEcharts{
            margin-top: 30px;
            padding:20px 10px;
    		box-shadow: 0 0 6px #ddd;
    		-webkit-box-shadow: 0 0 6px #ddd;
    		-moz-box-shadow: 0 0 6px #ddd;
    		-o-box-shadow: 0 0 6px #ddd;
            overflow: hidden;
            .alarmLeft{
                float: left;
                width: 49%;
                border-right: 1px solid #ddd;
            }
            .alarmRight{
                float: left;
                width: 50%;
            }
            .echarts{
                width: 100%;
                height: 300px;
            }
        }
        .placeTable{
            margin-top: 20px;
        }
        .pagination{
            text-align: right;
            padding: 20px 15px 10px 0;
        }
    }
}
</style>
