<template>
    <div id="deviceHistory">
        <div class="deviceHistory">
            <div class="placeTag">
                <p v-for="(item, index) in itemList" @click="handleClick(index)" :class="currentIndex==index?'active': ''">{{item.name}}</p>
            </div>
            <div class="placeSearch">
                <span>查询方式</span>
                <el-select v-model="type" placeholder="请选择" clearable style="width: 140px;">
                    <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <span class="span">查询时间</span>
                <el-date-picker v-model="dataTime" v-if="Type==1" disabled value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="dataTime" v-if="Type==2" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="dataTime" v-if="Type==3" value-format="yyyy-MM" type="month" placeholder="选择日期"></el-date-picker>
                <el-date-picker v-model="dataTime" v-if="Type==4" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
                <el-button type="primary" size="small" icon="el-icon-search" @click="search" class="btn">搜索</el-button>
            </div>
            <div class="placeEcharts" v-loading="loading" v-if="isShowEcharts">
    		    <div class="echarts" ref="Echarts"></div>
    		</div>
            <div class="noDataEcharts" v-if="!isShowEcharts">暂无数据</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            itemList: [{name: '用水量'}, {name: '用电量'}],
            currentIndex: 0,
            loading: true,
            type: 4,
            typeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}, {label: '按时查询', value: 4}],
            dataTime: '',
            Type: 4,
            systemId: '',
            subsystemId: '',
            buildingId: '',
            Xvalue: [],
            dataValue: [],
            isShowEcharts: true,
            monad: 'm³'
        }
    },
    methods: {
        init() {
            let myChart = this.$echarts.init(this.$refs.Echarts);
            let option = {
               tooltip: {
                   trigger: 'axis',
                   formatter: "{a} <br/>{b}: {c} " + this.monad
               },
               title: {
                  text: '历史数据',
                  left: 'center'
               },
               grid: {
                   left: '3%',
                   right: '4%',
                   bottom: '3%',
                   containLabel: true
               },
                color: '#8EF6D2',
               xAxis: {
                   type: 'category',
                   boundaryGap: false,
                   data: this.Xvalue
               },
               yAxis: {
                   type: 'value',
                   name: this.monad
               },
               series: [
                   {
                       name:'历史数据',
                       type:'line',
                       stack: '总量',
                       areaStyle: {
                           color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                               colorStops: [{offset: 0, color: '#8EF6D2'}, {offset: 1, color: '#E7FAF5'}],
                               global: false
                           }
                       },
                       data: this.dataValue
                   }
               ]
            }
            myChart.setOption(option);
        },
        handleClick(i) {
            this.currentIndex = i;
            if(i == 0) {
                this.monad = 'm³';
            }else if(i ==1) {
                this.monad = 'kWh';
            }
            this.search();
        },
        search() {
            if(!this.type) {
                this.$notify.warning({
                    title: '警告',
                    message: '请选择查询方式',
                    duration: 3000
                })
                return false;
            }
            if(this.type != 1) {
                if(this.dataTime == '' || this.dataTime == null) {
                    this.$notify.warning({
                        title: '警告',
                        message: '请选择时间',
                        duration: 3000
                    })
                    return false;
                }
            }
            this.loading = true;
            this.initData( this.type, this.currentIndex, this.dataTime);
        },
        // 初始化数据
        initData(flag, query, dataTime) {
            this.isShowEcharts = true;
            let data = {
                systemId: this.systemId,
                subsystemId: this.subsystemId,
                buildingId: this.buildingId,
                flag,
                query,
                time: dataTime
            };
            this.$axios.post(`BMPlatServers/conditioner/queryHistoryConsume`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.Xvalue = [];
                    this.dataValue = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.Xvalue.push(item.number);
                            this.dataValue.push(item.consume);
                        })
                    }else{
                        this.isShowEcharts = false;
                    }
                    this.init();
                    this.loading = false;
                }else{
                    this.loading = false;
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
        let start = new Date(new Date().getTime());
        let Year = start.getFullYear();
        let Month = start.getMonth() + 1;
        let Dates = start.getDate();
        this.dataTime = `${Year}-${Month}-${Dates}`;
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.initData(this.type, this.currentIndex, this.dataTime);
    },
    watch: {
        $route(to, from) {
            this.systemId = to.fullPath.split('=')[1].split(',')[0];
            this.subsystemId = to.fullPath.split('=')[1].split(',')[1];
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
        },
        type(item) {
            this.dataTime = '';
            if(item) {
                if(item == 1) {
                    this.Type = 1;
                }else if(item == 2) {
                    this.Type = 2;
                }else if(item == 3) {
                    this.Type = 3;
                }else if(item == 4) {
                    this.Type = 4;
                }
            }else{
                this.Type = 1;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#deviceHistory{
    .deviceHistory{
        .placeTag{
            overflow: hidden;
            padding-top: 10px;
            p{
                float: left;
                padding: 5px 15px;
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
            margin-top: 30px;
            padding-left: 20px;
            .span{
                margin-left: 20px;
            }
            .btn{
                margin-left: 40px;
            }
        }
        .placeEcharts{
            margin-top: 40px;
            .echarts{
                width: 100%;
                height: 400px;

            }
        }
    }
}
</style>
