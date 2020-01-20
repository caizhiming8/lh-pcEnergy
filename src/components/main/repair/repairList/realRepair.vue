<template>
    <div id="realRepair">
        <div class="realRepair">
            <ul>
                <li v-for="(item, index) in List" @click="handleClick(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
            </ul>
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
            </div>
            <el-table :data="tableData" style="width: 100%; margin-top:20px;" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading="loading">
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
                <el-table-column prop="repairPersonPhone" label="维修人联系方式" align='center' show-overflow-tooltip width="150"></el-table-column>
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
            person1: '0',
            person2: '0',
            person3: '0',
            personAll: '0',
            personAll1: '0',
            person0: 0,
            List: [{name: '全部报修'}, {name: '新申请'}, {name: '已委派'}, {name: '维修中'}, {name: '已评价'}],
            currentIndex: 0
        }
    },
    methods:{
        init() {
            let myChart1 = this.$echarts.init(this.$refs.Echarts1);
            let option1 = {
                title: {
                    text: '报修总量',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.personAll1,
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
                        type:'pie',
                        radius: ['60%', '70%'],
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
                            {value:Number(this.person0), itemStyle:{normal:{color:'#08A9FE'},emphasis:{color:'#08A9FE'}}},
                            {value:Number(this.personAll) - Number(this.person0), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart1.setOption(option1);

            let myChart2 = this.$echarts.init(this.$refs.Echarts2);
            let option2 = {
                title: {
                    text: '新申请',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.person1,
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
                        radius: ['60%', '70%'],
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
                            {value:Number(this.person1), itemStyle:{normal:{color:'#FF908F'},emphasis:{color:'#FF908F'}}},
                            {value:Number(this.personAll)-Number(this.person1), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart2.setOption(option2);

            let myChart3 = this.$echarts.init(this.$refs.Echarts3);
            let option3 = {
                title: {
                    text: '已委派',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.person2,
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
                        radius: ['60%', '70%'],
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
                            {value:Number(this.person2), itemStyle:{normal:{color:'#8693F3'},emphasis:{color:'#8693F3'}}},
                            {value:Number(this.personAll)-Number(this.person2), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart3.setOption(option3);

            let myChart4 = this.$echarts.init(this.$refs.Echarts4);
            let option4 = {
                title: {
                    text: '维修中',
                    textStyle:{
                        color:'#666',
                        fontStyle:'normal',
                        fontWeight:'bold',
                        fontSize:14
                    },
                    subtext: ''+this.person3,
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
                        radius: ['60%', '70%'],
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
                            {value:Number(this.person3), itemStyle:{normal:{color:'#FFA740'},emphasis:{color:'#FFA740'}}},
                            {value:Number(this.personAll)-Number(this.person3), itemStyle:{normal:{color:'#DFDDDA'},emphasis:{color:'#DFDDDA'}}}
                        ]
                    }
                ]
            };
            myChart4.setOption(option4);
        },

        // 点击变色
        handleClick(n) {
            this.currentIndex = n;
            this.initData(1);
            this.val = 1;
            this.currentPage = 1;
        },

        // 查询圆环的方法
        circleData() {
            this.$axios.post('BMPlatServers/repair/queryRepairStatus').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.personAll = item.num;
                            this.person0 = item.num;
                            if(item.status==0) {   // 总报修的人数
                                if(item.num == 0) {
                                    this.personAll = 1;
                                    this.personAll1 = 0;
                                    this.person0 = 0;
                                }else{
                                    this.personAll1 = this.personAll;
                                }
                            }
                            if(item.status==1) {  // 已申请的人数
                                this.person1 = item.num;
                            }
                            if(item.status==2) {  // 已审核的人数
                                this.person2 = item.num;
                            }
                            if(item.status==3) {  // 已派工的人数
                                this.person3 = item.num;
                            }
                        })
                    }else{

                    }
                    this.init();
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                    this.init();
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
                currentPage,
                pageSize: this.pageSize,
                flag: 1,
                type: this.type,
                project: this.project,
                startTime: this.startTime,
                endTime: this.endTime,
                status: this.currentIndex == 0 ? '' : this.currentIndex
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
        this.circleData();
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
#realRepair{
    padding: 20px 0;
    .realRepair{
        width: 98%;
        margin: 0 auto;
        box-shadow: 0 0 6px #ddd;
        -webkit-box-shadow: 0 0 6px #ddd;
        -moz-box-shadow: 0 0 6px #ddd;
        -ms-box-shadow: 0 0 6px #ddd;
        -o-box-shadow: 0 0 6px #ddd;
        ul{
            background: #F6F7FB;
            color: #666;
            li{
                display: inline-block;
                width: 100px;
                height: 50px;
                text-align: center;
                line-height: 50px;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                user-select: none;
            }
            li.active{
                color: #409EFF;
                background: #fff;
            }
        }
        .placeSearch{
            padding-left: 20px;
            margin-top: 18px;
            .time{
                margin-left: 20px;
            }
            .btn{
                margin-left: 40px;
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
        .pagination{
            text-align: right;
            padding: 10px 0;
        }
    }
}
</style>
