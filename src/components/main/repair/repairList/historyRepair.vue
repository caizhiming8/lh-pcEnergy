<template>
    <div id="historyRepair">
        <div class="historyRepair">
            <div class="placeSearch">
                <span>类型</span>
                <el-cascader v-model="typeObj" :options="options" :props="{ expandTrigger: 'hover' }" clearable></el-cascader>
                <span class="time">时间</span>
                <el-date-picker v-model="timer" type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search" class="btn">搜索</el-button>
            </div>

            <div class="placeRepairs">
                <div class="echarts" ref="Echarts1"></div>
                <div class="echarts" ref="Echarts2"></div>
                <div class="echarts" ref="Echarts3"></div>
                <div class="echarts" ref="Echarts4"></div>
                <div class="echarts" ref="Echarts5"></div>
            </div>

            <el-table :data="tableData" style="width: 100%;margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}" v-loading="loading">
                <el-table-column label="序号" width="80" align='center'>
                    <template slot-scope="scope">
                        <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="buildingName" label="区域" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="roomName" label="地点" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="typeComment" label="类型" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="projectComment" label="维修项目" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="deviceused" label="设备" :show-overflow-tooltip="true" align='center'></el-table-column>
                <el-table-column prop="details" label="详细描述" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="commitPerson" label="报修人" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="commitPhone" label="联系方式" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="repairName" label="维修人" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="repairPersonPhone" label="维修人联系方式" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="warningVal" label="满意度" align='center' show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.result==1">极差</span>
                        <span v-if="scope.row.result==2">失望</span>
                        <span v-if="scope.row.result==3">一般</span>
                        <span v-if="scope.row.result==4">满意</span>
                        <span v-if="scope.row.result==5">惊喜</span>
                    </template>
                </el-table-column>
                <el-table-column prop="evaluation" label="评价结果" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="costTime" label="总时长" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="commitTime" label="时间" align='center' show-overflow-tooltip></el-table-column>
                <el-table-column prop="statusName" label="状态" align='center' show-overflow-tooltip></el-table-column>
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
            tableData: [],
            val: 1,
            pageSize: 10,
            currentPage: 1,
            pageTotal: 0,
            loading: true,
            options: [],
            timer: null,
            typeObj: {},
            type: '',
            project: '',
            startTime: '',
            endTime: '',
            personAll: '0',
            person1: '0',
            person2: '0',
            person3: '0',
            person4: '0',
            person5: '0',
        }
    },
    methods: {
        init() {
            let myChart1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '极差',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: this.person1,
                    subtextStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        // name:'访问来源',
                        type:'pie',
                        radius: ['65%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person1), itemStyle:{normal:{color:'#409EFF'},emphasis:{color:'#409EFF'}}},
                            {value:Number(this.personAll)-Number(this.person1), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart1.setOption(option1);

            let myChart2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                    text: '失望',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: this.person2,
                    subtextStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        // name:'访问来源',
                        type:'pie',
                        radius: ['65%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person2) , itemStyle:{normal:{color:'#409EFF'},emphasis:{color:'#409EFF'}}},
                            {value:Number(this.personAll)-Number(this.person2), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart2.setOption(option2);

            let myChart3 = this.$echarts.init(this.$refs.Echarts3);
            let option3 = {
                title: {
                    text: '一般',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: this.person3,
                    subtextStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        // name:'访问来源',
                        type:'pie',
                        radius: ['65%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person3), itemStyle:{normal:{color:'#409EFF'},emphasis:{color:'#409EFF'}}},
                            {value:Number(this.personAll)-Number(this.person3), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart3.setOption(option3);

            let myChart4 = this.$echarts.init(this.$refs.Echarts4);
            let option4 = {
                title: {
                    text: '满意',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: this.person4,
                    subtextStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        // name:'访问来源',
                        type:'pie',
                        radius: ['65%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person4), itemStyle:{normal:{color:'#409EFF'},emphasis:{color:'#409EFF'}}},
                            {value:Number(this.personAll)-Number(this.person4), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart4.setOption(option4);

            let myChart5 = this.$echarts.init(this.$refs.Echarts5);
            let option5 = {
                title: {
                    text: '惊喜',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: this.person5,
                    subtextStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:12
                    },
                    x: 'center',
                    y: 'center'
                },
                series: [
                    {
                        // name:'访问来源',
                        type:'pie',
                        radius: ['65%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            }
                        },
                        color: ['#409EFF', '#DFDDDA'],
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        hoverAnimation:false,
                        data:[
                            {value:Number(this.person5), itemStyle:{normal:{color:'#409EFF'},emphasis:{color:'#409EFF'}}},
                            {value:Number(this.personAll)-Number(this.person5), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart5.setOption(option5);
        },

        circleResult() {
            this.$axios.post('BMPlatServers/repair/queryRepairStar').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            if(item.result == 'all') { // 总评价的人
                                this.personAll = item.num;
                            }else if(item.result == '1') {
                                this.person1 = item.num;
                            }else if(item.result == '2') {
                                this.person2 = item.num;
                            }else if(item.result == '3') {
                                this.person3 = item.num;
                            }else if(item.result == '4') {
                                this.person4 = item.num;
                            }else if(item.result == '5') {
                                this.person5 = item.num;
                            }else{
                                this.person1=0;
                                this.person2=0;
                                this.person3=0;
                                this.person4=0;
                                this.person5=0;
                            }
                        })
                    }
                    this.init();
                }else{
                    this.init();
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },

        search() {
            this.initData(1);
            this.currentPage = 1;
            this.val = 1;
        },

        // 级联矿查询
        typelist() {
            this.$axios.post('BMPlatServers/repair/queryProjectTree').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.options = res.data.result.list;
                }else{
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
                currentPage: currentPage,
                pageSize: this.pageSize,
                flag: 2,
                type: this.type,
                project: this.project,
                startTime: this.startTime,
                endTime: this.endTime
            };
            this.$axios.post('BMPlatServers/repair/queryRepairList', this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.list;
                    this.pageTotal = res.data.result.num;
                }else{
                    this.tableData = [];
                    this.pageTotal = 0;
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
                this.loading = false;
            })
        },
        handleCurrentChange(val) {
            this.val = val;
            this.loading = true;
            this.initData(val);
        }
    },
    mounted() {
        this.circleResult();
        this.initData(1);
        this.typelist();
    },
    watch: {
        typeObj(item) {
            if(item && item.length) {
                this.type = item[0].substring(4);
                this.project = item[1].substring(7);
            }else{
                this.type = '';
                this.project = '';
            }
        },
        timer(item) {
            if(item!=null) {
                this.startTime = item[0];
                this.endTime = item[1];
            }else{
                this.startTime = '';
                this.endTime = '';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#historyRepair{
    padding: 20px 0;
    .historyRepair{
        width: 98%;
        margin: 0 auto;
        box-shadow: 0 0 6px #ddd;
        -webkit-box-shadow: 0 0 6px #ddd;
        -moz-box-shadow: 0 0 6px #ddd;
        -ms-box-shadow: 0 0 6px #ddd;
        -o-box-shadow: 0 0 6px #ddd;
        padding: 0 10px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -ms-box-sizing: border-box;
        -o-box-sizing: border-box;
        .pagination{
            text-align: right;
            padding: 10px 0;
        }
        .placeSearch{
            padding: 30px 0 20px 10px;
            .time{
                margin-left: 20px;
            }
            .btn{
                margin-left: 40px;
            }
            .repairs{
                margin-left: 50px;
            }
        }
        .placeRepairs{
            display: flex;
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flex;
            display: -o-flex;
            justify-content: space-around;
            -webkit-justify-content: space-around;
            -moz-justify-content: space-around;
            -ms-justify-content: space-around;
            -o-justify-content: space-around;
            .echarts{
                width: 150px;
                height: 150px;
            }
        }
    }
}
</style>
