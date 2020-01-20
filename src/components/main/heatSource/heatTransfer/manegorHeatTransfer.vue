<template>
    <div id="manegorHeatTransfer">
        <div class="manegorHeatTransfer">
            <div class="search">
                <span>设备名称</span>
                <el-select v-model="deviceName" placeholder="请选择" clearable filterable style="width: 300px;">
                    <el-option v-for="item in deviceNameList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>

                <span class="spans">时间段查询</span>
                <el-date-picker v-model="datetimeranges" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                <el-button type="primary" icon="el-icon-search" size="small" @click="search" class="btn">搜索</el-button>
            </div>
            <el-table tooltip-effect="light" :data="tableData" style="width: 100%;" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" v-loading="loading">
                <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
                    <template slot-scope="scope">
                        <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="deviceName" label="设备名称" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="dataName" label="操作" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="deviceType" label="设备类型" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="dataType" label="数据类型" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="dataValue" label="数据值" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="startTime" label="开始时间" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="endTime" label="结束时间" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="operatorName" label="操作人" align='center'></el-table-column>
                <el-table-column :show-overflow-tooltip="true" prop="success" label="是否成功" align='center'></el-table-column>
              </el-table>

              <div class="pagination">
                  <el-pagination background @current-change="handleCurrentChange" :page-size='pageSize' :current-page.sync="currentPage"  layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
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
            buildingId: '',
            loading: true,
            deviceNameList: [],
            deviceName: '',
            datetimeranges: [],
            deviceId: '',
            dataType: '',
            startTime: '',
            endTime: ''
        }
    },
    methods:{
        // 设备列表
        deviceList() {
            let data = {
                buildingId: this.buildingId
            };
            this.$axios.post(`BMPlatServers/hvacheat/queryControlHeatDevice`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.deviceNameList = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.deviceNameList.push({label: item.dataName, value: `${item.dataType},${item.deviceId}`})
                        })
                    }
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
                buildingId: this.buildingId,
                system: 3,
                subsystemId: 3,
                currentPage: currentPage,
                pageSize: this.pageSize,
                dataType: this.dataType,
                deviceId: this.deviceId,
                startTime: this.startTime,
                endTime: this.endTime
            };
            // console.log(data);
            this.$axios.post(`BMPlatServers/hvacheat/queryCityControlHistory`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.list && res.data.result.list.length) {
                        this.tableData = res.data.result.list;
                        this.pageTotal = res.data.result.num;
                        this.loading = false;
                    }else{
                        this.tableData = [];
                        this.loading = false;
                    }
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                    this.loading = false;
                }
            })
        },
        handleCurrentChange(val) {
            this.val = val;
            this.initData(val);
            this.loading = true;
        },
        search() {
            this.val = 1;
            this.currentPage = 1;
            this.loading = true;
            this.initData(this.val);
        }
    },
    mounted() {
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.initData('1');
        this.deviceList();
    },
    watch: {
        $route(to, from) {
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
            this.initData('1');
            this.deviceList();
            this.deviceName = '';
            this.loading = true;
        },
        deviceName(item) {
            if(item) {
                this.dataType = item.split(',')[0];
                this.deviceId = item.split(',')[1];
            }else{
                this.dataType = '';
                this.deviceId = '';
            }
        },
        datetimeranges(items) {
            if(items == null) {
                this.startTime = '';
                this.endtTime = '';
            }else{
                this.startTime = items[0];
                this.endtTime = items[1];
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#manegorHeatTransfer{
    .manegorHeatTransfer{
        background: #fff;
        border-radius: 4px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        -o-border-radius: 4px;
        .search{
            padding: 20px;
            .spans{
                margin-left: 20px;
            }
            .btn{
                margin-left: 20px;
            }
        }
        .pagination{
            text-align: right;
            padding: 15px;
        }
    }
}
</style>
