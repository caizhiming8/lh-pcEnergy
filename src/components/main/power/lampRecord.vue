<template>
    <div id="lampRecord">
        <div class="lampRecord">
            <div class="search">
                <span>设备名称：</span>
                <el-select placeholder="设备名称" clearable v-model="deviceName">
                    <el-option v-for="(item, index) in deviceNameList" :key="index" :value="item.deviceId" :label="item.deviceName"></el-option>
                </el-select>
                <span class="span1">时间：</span>
                <el-date-picker v-model="timeRange" value-format="yyyy-MM-dd hh:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" size="small" class="btn" @click="search">查询</el-button>
            </div>
            <el-table tooltip-effect="light" :data="tableData" v-loading="loading" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
                <el-table-column :show-overflow-tooltip="true" prop="deviceName" label="设备名称" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="dataType" label="设备类型" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="startTime" label="开始时间" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="endTime" label="结束时间" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="dataValue" label="操作值" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="operatorName" label="操作人" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="success" label="是否成功" align='center'></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size='pageSize'  layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            tableData: [],
            loading: true,
            pageSize: 10,
            currentPage: 1,
            pageTotal: 0,
            deviceNameList: [],
            deviceName: '',
            timeRange: null,
            startTime: '',
            endTime: ''
        }
    },
    methods: {
        initList() {
            this.$axios.post('BMPlatServers/conditioner/queryLampDevice').then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.deviceNameList = res.data.result.list;
                }else{
                    this.deviceNameList = [];
                }
            })
        },
        initData(currentPage) {
            let data = {
                currentPage,
                pageSize: this.pageSize,
                deviceId: this.deviceName,
                startTime: this.startTime,
                endTime: this.endTime
            };
            this.$axios.post(`BMPlatServers/conditioner/queryLampControlHistory`, this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.tableData = res.data.result.list;
                    this.pageTotal = res.data.result.num;
                    this.loading = false;
                }else{
                    this.loading = false;
                    this.tableData = [];
                    this.pageTotal = 0;
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        },
        handleCurrentChange(val) {
            this.loading = true;
            this.initData(val);
        },
        search() {
            this.initData(1);
        }
    },
    mounted() {
        this.initData(1);
        this.initList();
    },
    watch: {
        timeRange(oldData) {
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
#lampRecord{
    .lampRecord{
        .search{
            .span1{
                margin-left: 20px;
            }
            .btn{
                margin-left: 50px;
            }
        }
        .pagination{
            text-align: right;
            padding-top: 15px;
        }
    }
}
</style>
