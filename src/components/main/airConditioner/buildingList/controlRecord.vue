<template>
    <div id="controlRecord">
        <div class="controlRecord">
            <div class="history-search">
				<b>设备列表</b>
				<el-select v-model="deviceData" placeholder="请选择" clearable class="selects">
					<el-option v-for="(item, index) in devices" :key="index" :label="item.name" :value="item.deviceId"></el-option>
				</el-select>
				<b style="margin-left: 20px;">查询时间</b>
				<el-date-picker  v-model="time" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				<el-button @click="search" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
			</div>
			<div class="history-table">
				<el-table :data="tableData" style="width: 100%; margin-top: 20px;" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column prop="deviceName" label="设备名称" fixed align='center' ></el-table-column>
					<el-table-column prop="dataName" label="操作" align='center' ></el-table-column>
					<el-table-column prop="deviceType" label="设备类型" align='center' ></el-table-column>
					<el-table-column prop="dataType" label="数据类型" align='center' ></el-table-column>
					<el-table-column prop="startTime" label="开始时间" :show-overflow-tooltip="true" align='center' ></el-table-column>
                    <el-table-column prop="endTime" label="结束时间" :show-overflow-tooltip="true" align='center' ></el-table-column>
					<el-table-column prop="operatorName" label="操作人" :show-overflow-tooltip="true" align='center' ></el-table-column>
					<el-table-column prop="success" label="是否成功" :show-overflow-tooltip="true" align='center' ></el-table-column>
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
            devices: [],
            deviceData: '',
            time: null,
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            buildingId: '',
            systemId: '',
            subsystemId: '',
            startTime: '',
            endTime: ''
        }
    },
    methods: {
        deviceList() {
            let data = {
                buildingId: this.buildingId
            }
            this.$axios.post('BMPlatServers/conditioner/queryRoomDeviceList', this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.devices = res.data.result.list;
                }else{
                    this.devices = [];
                }
            })
        },
        initData(currentPage) {
            let data = {
                buildingId: this.buildingId,
                systemId: this.systemId,
                subsystemId: this.subsystemId,
                currentPage,
                pageSize: this.pageSize,
                startTime: this.startTime,
                endTime: this.endTime,
                deviceType: 10,
                deviceId: this.deviceData
            }
            this.$axios.post('BMPlatServers/hvacheat/queryCityControlHistory', this.$qs.stringify(data)).then((res)=>{
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
            })
        },
        search() {
            this.initData(1);
        },
        handleCurrentChange(val) {
            this.initData(val);
        }
    },
    mounted() {
        this.systemId = window.location.href.split('=')[1].split(',')[0];
        this.subsystemId = window.location.href.split('=')[1].split(',')[1];
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.initData(1);
        this.deviceList();
    },
    watch: {
        time(oldData) {
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
#controlRecord{
    .controlRecord{
        .history-search{

        }
        .pagination{
            text-align: right;
            padding-top: 15px;
        }
    }
}
</style>
