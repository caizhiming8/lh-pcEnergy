<template>
    <div id="processReapir">
        <div class="processReapir">
            <div class="placeBreadcrumb">
                <div class="BreadcrumbBox">
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item>报修管理</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </div>
            <div class="placeSearch">
                <span>类型</span>
                <el-cascader v-model="typeObj" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange" clearable></el-cascader>
                <span class="time">时间</span>
                <el-date-picker v-model="timer" type="daterange" range-separator="至" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search" class="btn">搜索</el-button>
                <el-button type="primary" icon="iconfont icon-baoxiu" size="small" @click="repairs" class="repairs" v-hasMenu="7-2-1">申请报修</el-button>
            </div>
            <div class="placeTable">
                <el-table :data="tableData" ref="multipleTable" row-key="id" style="width: 100%; margin-top: 20px;" :row-style="{height:0}" :cell-style="{padding:'5px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading="loading">
                    <el-table-column label="序号" width="80" align='center'>
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="buildingName" label="区域" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="roomName" label="地点" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="typeComment" label="类型" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="projectComment" label="维修项目" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="deviceId" label="设备" :show-overflow-tooltip="true" align='center'></el-table-column>
                    <el-table-column prop="details" label="详细描述" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commitPerson" label="报修人" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="commitPhone" label="联系方式" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repairName" label="维修人" align='center' show-overflow-tooltip></el-table-column>
                    <el-table-column prop="repairPersonPhone" label="维修人联系方式" align='center' show-overflow-tooltip width="180"></el-table-column>
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
                    <el-table-column label="查看进度" align='center' width="120">
                        <template slot-scope="scope">
                            <el-button type="text" @click="schedule(scope.row, scope.$index)">查看</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align='center' width="100" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="toPerson(scope.row, scope.$index)" v-if="scope.row.status==1" v-hasMenu="7-2-2">指派人员</el-button>
                            <el-button type="primary" size="mini" @click="service(scope.row, scope.$index)" v-if="scope.row.status==2" v-hasMenu="7-2-4">维修</el-button>
                            <el-button type="primary" size="mini" @click="evaluate(scope.row, scope.$index)" v-if="scope.row.status==3" v-hasMenu="7-2-5">回访评价</el-button>
                        </template>
                    </el-table-column>
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
            tableData: [],
            val: 1,
            pageSize: 10,
            currentPage: 1,
            pageTotal: 0,
            typeObj: [],
            options: [],
            timer: null,
            loading: true,
            project: '',
            type: '',
            startTime: '',
            endTime: ''
        }
    },
    methods: {
        repairs() {
            this.$router.push('/addRepairs');
        },

        toPerson(row) {
            this.$router.push({path: '/toPerson', query: {ids: row.id,commitId: row.commitPerson,type_comment: row.type_comment}});
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

        search() {
            this.loading = true;
            let data = {
                currentPage: 1,
                pageSize: 10,
                type: this.type,
                project: this.project,
                startTime: this.startTime,
                endTime: this.endTime
            };
            this.$axios.post('BMPlatServers/repair/queryRepairList', this.$qs.stringify(data)).then((res)=>{
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

            // test
            // this.tableData.forEach((item)=>{
            //     if(item.id == 27) {
            //         this.$refs.multipleTable.toggleRowSelection(item, true);
            //     }
            // })
        },

        handleChange(value) {
            // console.log(value);
        },

        handleCurrentChange(val) {
            this.loading = true;
            this.val = val;
            let data = {
                currentPage: val,
                pageSize: 10,
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
        // 维修
        service(row, index) {
            this.$router.push({path: '/serviceRepair', query: {ids: row.id, deviceId: row.deviceId,commitId: row.commitPerson,type_comment: row.type_comment}});
        },
        // 评价
        evaluate(row, index) {
            this.$router.push({path: '/evaluateRepair', query: {inds: row.id}});
        },
        // 进度
        schedule(row, index) {
            this.$router.push({path: '/scheduleRepair', query: {inds: row.id}});
        }
    },
    mounted() {
        this.typelist();
        this.search();
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
#processReapir{
    padding: 20px 0;
    .processReapir{
        .placeBreadcrumb{
            border-bottom: 2px solid #ddd;
            .BreadcrumbBox{
                padding: 20px;
            }
        }
        .placeSearch{
            padding: 30px 0 0 10px;
            .time{
                margin-left: 20px;
            }
            /deep/ .iconfont{
                font-size: 12px;
            }
            .btn{
                margin-left: 40px;
            }
            .repairs{
                margin-left: 50px;
            }
        }
        .placeTable{
            margin-top: 20px;
            padding: 0 20px;
        }
        width: 98%;
        margin: 0 auto;
        box-shadow: 0 0 6px #ddd;
        -webkit-box-shadow: 0 0 6px #ddd;
        -ms-box-shadow: 0 0 6px #ddd;
        -moz-box-shadow: 0 0 6px #ddd;
        -o-box-shadow: 0 0 6px #ddd;
        .pagination{
            text-align: right;
            padding: 10px 20px;
        }
    }
}
</style>
