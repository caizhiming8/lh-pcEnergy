<template>
    <div id="nightFlowDivice">
        <div class="nightFlow-search">
            <span>选择时间</span>
            <el-date-picker v-model="searchTime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search" class='btn'>搜索</el-button>
        </div>
        <div class="nightFlow-echarts" v-if="isShowEcharts" v-loading="loading">
            <div class="echarts" ref="Echarts"></div>
        </div>
        <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>

        <div class="nightFlow-table">
            <el-table :data="tableData" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" style="margin-top: 20px" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading="loading1">
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
import axios from 'axios';
export default {
    data() {
        return{
            searchTime: '',
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            year: '',
            month: '',
            day: '',
            deviceName: '',
            dayConsume: '',
            nightConsume: '',
            loading: true,
            loading1: true,
            isShowEcharts: true
        }
    },
    methods: {
        init() {
            let myEcharts = this.$echarts.init(this.$refs.Echarts);
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
               xAxis : [
                   {
                       type : 'category',
                       data : this.deviceName
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
        handleCurrentChange(val) {
            this.loading1 = true;
            let data = {
                year: this.year,
                month: this.month,
                day: this.day,
                pageSize: this.pageSize,
                currentPage: val
            };
            this.$axios.post(`BMPlatServers/water/queryNightLeakPage`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
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
            });
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
            this.currentPage = 1;
            this.nieghtFlowData();
        },

        // 所有设备夜间小流量
        nieghtFlowData() {
            this.isShowEcharts = true;
            // 折线图数据
            let data = {
                year: this.year,
                month: this.month,
                day: this.day
            };
            this.$axios.post(`BMPlatServers/water/queryNightLeak`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.deviceName = [];
                    this.dayConsume = [];
                    this.nightConsume = [];
                    if(res.data.result.array && res.data.result.array.length) {
                        res.data.result.array.forEach((item)=>{
                            this.deviceName.push(item.deviceName);
                            this.dayConsume.push(item.dayConsume);
                            this.nightConsume.push(item.nightConsume);
                        })
                    }else{
                        this.isShowEcharts = false;
                    }
                    this.loading = false;
                    this.init();
                }else{
                    this.loading = false;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            });


            // tabel表格数据
            let data1 = {
                year: this.year,
                month: this.month,
                day: this.day,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            };
            this.$axios.post(`BMPlatServers/water/queryNightLeakPage`, this.$qs.stringify(data1)).then((res)=>{
                // console.log(res);
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
            });

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
        this.searchTime = `${year}-${month}-${day}`;
        this.year = year;
        this.month = month;
        this.day = day;
        this.nieghtFlowData();
    },
    watch: {
        searchTime(item) {
            if(item == null) {
                this.year = '';
                this.month = '';
                this.day = '';
            }else{
                this.year = item.split('-')[0];
                this.month = item.split('-')[1];
                this.day = item.split('-')[2];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#nightFlowDivice{
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
            margin: 10px;
        }
    }
}
</style>
