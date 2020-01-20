<template>
    <div id="dmaList">
        <div class="dmaList">
            <div class="dmaTime">
                <span>选择时间：</span>
                <el-date-picker v-model="TimeChange" value-format="yyyy-MM-dd HH" format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <el-button type="primary" size="small" icon="el-icon-search" @click="search" class="btn">搜索</el-button>
            </div>
            <div class="dmaTable">
                <el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
                    <el-table-column prop="areaComment" label="分区名称" align='center'></el-table-column>
                    <el-table-column prop="inconsume" label="总供水量" align='center'></el-table-column>
                    <el-table-column prop="outconsume" label="总用水量" align='center'></el-table-column>
                    <el-table-column prop="percent" label="漏损率" align='center'></el-table-column>
                    <el-table-column prop="diff" label="漏损量" align='center'></el-table-column>
                    <el-table-column prop="maxNum" label="阈值" align='center'></el-table-column>
                    <el-table-column label="是否告警" align='center'>
                        <template slot-scope="scope">
                            <span v-if="scope.row.maxNum==null?false :  scope.row.diff >= scope.row.maxNum" style="color: red;">是</span>
                            <span v-if="scope.row.maxNum==null? true:  scope.row.diff < scope.row.maxNum">否</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dmaPagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            val: 1,
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            TimeChange: [],
            startTime: '',
            endTime: ''
        }
    },
    methods: {
        initData() {
            let data = {
                startTime: this.startTime,
                endTime: this.endTime,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            };
            // console.log(data);
            this.$axios.post(`BMPlatServers/water/queryWaterAreaInfo`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.result) {
                    this.tableData = res.data.result.array;
                    this.pageTotal = res.data.result.num;
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
            if(!this.TimeChange) {
                this.$notify.warning({
                    titlt: '警告',
                    message: '请选择查询时间',
                    duration: 3000
                })
                return false;
            }
            this.initData();
        },

        handleCurrentChange(val) {
            this.val = val;
            let data = {
                startTime: this.startTime,
                endTime: this.endTime,
                pageSize: this.pageSize,
                currentPage: val
            };
            this.$axios.post(`BMPlatServers/water/queryWaterAreaInfo`,  this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.tableData = res.data.result.array;
                    this.pageTotal = res.data.result.num;
                }else{
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
        let endYear = date.getFullYear();
        let endMonth = date.getMonth() + 1;
        let endDay = date.getDate();
        let endHours = date.getHours();
        let endMinutes = date.getMinutes();
        let endSeconds = date.getSeconds();

        let startdate = new Date(new Date().getTime() - 3*24*60*60*1000);
        let startYear = startdate.getFullYear();
        let startMonth = startdate.getMonth() + 1;
        let startDay = startdate.getDate();
        let startHours = startdate.getHours();
        let startMinutes = startdate.getMinutes();
        let startSeconds = startdate.getSeconds();
        this.startTime = `${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}:${startSeconds}`;
        this.endTime = `${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}:${endSeconds}`;
        this.TimeChange = [];
        this.TimeChange.push(this.startTime);
        this.TimeChange.push(this.endTime);
        this.initData();
    },
    watch: {
        TimeChange(item) {
            if(item == null) {
                this.startTime = '';
                this.endTime = '';
            }else{
                this.startTime = item[0];
                this.endTime = item[1];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#dmaList{
    .dmaList{
        padding: 20px;
        .dmaTime{
            span{
                color: #666;
            }
            .btn{
                margin-left: 20px;
            }
        }
        .dmaTable{

        }
        .dmaPagination{
            padding: 20px;
            text-align: right;
        }
    }
}
</style>
