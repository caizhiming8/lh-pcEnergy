<template>
    <div id="nightFlowTime">
        <div class="nightFlow-search">
            <span>选择设备</span>
            <el-select v-model="divice" placeholder="请选择" filterable>
                <el-option  v-for="item in diviceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span class="flow-span">选择时间</span>
            <el-date-picker v-model="searchTime" type="month" value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search" class='btn'>搜索</el-button>
        </div>
        <div class="nightFlow-echarts" v-if="isShowEcharts" v-loading="loading">
            <div class="echarts" ref="Echarts"></div>
        </div>
        <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
        <div class="nightFlow-table">
            <el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading="loading1">
                <el-table-column label="序号" align='center'>
                    <template slot-scope="scope">
                        <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="deviceName" label="设备名称" align='center'></el-table-column>
                <el-table-column prop="maxNum" label="最大阈值" align='center'></el-table-column>
                <el-table-column prop="minNum" label="最小阈值" align='center'></el-table-column>
                <el-table-column prop="startTime" label="开始时间" align='center'></el-table-column>
                <el-table-column prop="endTime" label="结束时间" align='center'></el-table-column>
                <el-table-column prop="dayConsume" label="日流量" align='center'></el-table-column>
                <el-table-column prop="nightConsume" label="夜流量" align='center'></el-table-column>
            </el-table>
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
            searchTime: '',
            divice: '',
            diviceList: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 1,
            year: '',
            month: '',
            loading: true,
            tableData: [],

            deviceTime: [],
            nightConsume: [],
            dayConsume: [],

            loading1: true,
            val: 1,
            isShowEcharts: true
        }
    },
    methods: {
        init() {
            let myEcharts = this.$echarts.init(this.$refs.Echarts);
            let wid = document.body.clientWidth || document.documentElement.clientWidth
            var resize = {
              width: wid - 300,
              height: 300
            };
            myEcharts.resize(resize);
            let option = {
                title : {
                   // text: '某地区蒸发量和降水量'
               },
               tooltip : {
                   trigger: 'axis',
                   formatter: function(params) {
                       return params[0].name + '<br>' + params[0].seriesName + ':' + params[0].data + 'm³' + '<br/>' +
                       params[1].seriesName + ':' + params[1].data + 'm³';
                   }
               },
               legend: {
                   data:['夜间流量','整日流量']
               },
               calculable : true,
               xAxis : [
                   {
                       type : 'category',
                       data : this.deviceTime
                   }
               ],
               yAxis : [
                   {
                       type : 'value',
                       name: 'm³'
                   }
               ],
               series : [
                   {
                       name:'夜间流量',
                       type:'bar',
                       data:this.nightConsume,
                       itemStyle : {
                           normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                   offset: 0,
                                   color: '#29C8B1'
                               }, {
                                   offset: 1,
                                   color: '#78DB95'
                               }]),
                           }
                       }
                   },
                   {
                       name:'整日流量',
                       type:'bar',
                       data:this.dayConsume,
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
            myEcharts.setOption(option);
        },
        search() {
            if(this.searchTime == null) {
                this.$notify.warning({
                    titlt: '警告',
                    message: '请选择查询时间',
                    duration: 3000
                })
                return false;
            }
            this.loading = true;
            this.loading1 = true;
            this.flowDiviceData();
            this.val = 1;
            this.currentPage = 1;
        },
        handleCurrentChange(val) {
            this.val = val;
            this.loading1 = true;
            let data = {
                deviceId: this.divice,
                year: this.year,
                month: this.month,
                pageSize: this.pageSize,
                currentPage: val
            };
            this.$axios.post(`BMPlatServers/water/queryDevcieNightLeak`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.array;
                    this.pageTotal = res.data.result.num;
                    this.loading1 = false;
                }else{
                    this.loading1 = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        //夜间小流量的设备列表
        nigrtFlowDivice() {
            this.$axios.post(`BMPlatServers/water/queryNightDevice`).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            this.diviceList.push({label: item.deviceName, value: item.id})
                        })
                        this.divice = res.data.result[0].id;
                        this.flowDiviceData();
                    }else{
                        this.diviceList = [];
                    }
                }else{
                    // this.$message.warning(res.data.resultMessage);
                }
            })
        },

        flowDiviceData() {
            this.isShowEcharts = true;
            let data = {
                deviceId: this.divice,
                year: this.year,
                month: this.month
            };
            this.$axios.post(`BMPlatServers/water/queryDevcieNightLeak`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.deviceTime = [];
                    this.nightConsume = [];
                    this.dayConsume = [];
                    if(res.data.result.array && res.data.result.array.length) {
                        res.data.result.array.forEach((item)=>{
                            this.deviceTime.push(item.number);
                            this.nightConsume.push(item.nightConsume);
                            this.dayConsume.push(item.dayConsume);
                        })
                    }else{
                        this.isShowEcharts = false;
                    }
                    this.init();
                    this.loading = false;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            });

            // table表格数据
            let data1 = {
                deviceId: this.divice,
                year: this.year,
                month: this.month,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            };
            this.$axios.post(`BMPlatServers/water/queryDevcieNightLeakPage`, this.$qs.stringify(data1)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.array;
                    this.pageTotal = res.data.result.num;
                    this.loading1 = false;
                }else{
                    this.loading1 = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })

        }
    },
    mounted() {
        let date = new Date();
        date = date.getTime();
        date = date - 24*60*60*1000;
        let nowDate = new Date(date);
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1;
        this.searchTime = `${year}-${month}`;
        this.year = year;
        this.month = month;
        this.nigrtFlowDivice();
    },
    watch: {
        searchTime(item) {
            if(item == null) {
                this.year = '';
                this.month = '';
            }else{
                this.year = item.split('-')[0];
                this.month = item.split('-')[1];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#nightFlowTime{
    .nightFlow-search{
        span{
            color: #666;
        }
        .flow-span{
            margin-left: 20px;
        }
        .btn{
            margin-left: 20px;
        }
    }
    .nightFlow-echarts{
        width: 100%;
        height: 300px;
        .echarts{
            width: 100%;
            height: 100%;
        }
    }
    .nightFlow-table{
        .pagination{
            text-align: right;
            margin: 15px;
        }
    }
}
</style>
