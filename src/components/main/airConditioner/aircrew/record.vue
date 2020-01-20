<template>
    <div id="record">
        <div class="record">
            <div class="history-search">
				<b>设备列表</b>
				<el-select v-model="deviceData" placeholder="请选择" clearable class="selects">
					<el-option v-for="(item, index) in devicesList" :key="index" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<b style="margin-left: 20px;">查询时间</b>
				<el-date-picker  v-model="time" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				<el-button @click="search" style="margin-left: 40px;" size="small" type="primary" icon="el-icon-search">查询</el-button>
			</div>
			<div class="history-table" style="margin-top: 20px">
				<el-table :data="tableData" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}" style="100%" v-loading="loading">
                    <el-table-column align='center' label="序号" width="60">
                        <template slot-scope="scope">
                            <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
                        </template>
                    </el-table-column>
					<el-table-column prop="deviceName" label="设备名称" align='center' :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="dataName" label="操作" align='center' :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="deviceType" label="设备类型" align='center' :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="dataType" label="数据类型" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column label="数据值" align='center' prop="dataValue" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="startTime" label="开始时间" :show-overflow-tooltip="true"  align='center' ></el-table-column>
                    <el-table-column prop="endTime" label="结束时间" :show-overflow-tooltip="true"  align='center' ></el-table-column>
                    <el-table-column prop="operatorName" label="操作人" :show-overflow-tooltip="true"  align='center' ></el-table-column>
                    <el-table-column label="是否成功" align='center' prop="success" :show-overflow-tooltip="true"></el-table-column>
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
            devicesList: [],
            deviceData: '',
            time: [],
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
            val: 1,
            endTime: '',
            startTime: '',
            buildingId: '',
            buildingIds: '',
            deviceId: '',
            dataType: '',
            loading: true
        }
    },
    methods: {
        // 设备列表
        devicelist() {
            let data = {
                buildingId:this.buildingId
            };
            this.$axios.post(`BMPlatServers/conditioner/queryControlDeviceList`, this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.devicesList = [];
                    if(res.data.result.list && res.data.result.list.length) {
                        res.data.result.list.forEach((item)=>{
                            this.devicesList.push({label: item.dataName, value: `${item.dataType},${item.deviceId},${item.buildingId}`})
                        });
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

        // 初始化数据
        initData(buildingId, deviceId, dataType, startTime, endTime, currentPage) {
            let data = {
                buildingId,
                deviceId,
                dataType,
                startTime,
                endTime,
                currentPage,
                pageSize:this.pageSize
            };
            this.$axios.post(`BMPlatServers/conditioner/queryControlHistory`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
                    this.tableData = res.data.result.list;
                    this.pageTotal = res.data.result.num;
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
        },

        search() {
            this.val= 1;
            this.currentPage = 1;
            this.loading = true;
            this.initData(this.buildingIds, this.deviceId, this.dataType, this.startTime, this.endTime, this.val);
        },
        handleCurrentChange(val) {
            this.val = val;
            this.loading = true;
            this.initData(this.buildingIds, this.deviceId, this.dataType, this.startTime, this.endTime, val);
        }
    },
    mounted() {
        this.buildingId = window.location.href.split('=')[1].split(',')[2];
        this.devicelist();
        this.initData('', '', '', '', '', 1);
    },
    watch: {
        time(item) {
            if(item) {
                this.startTime = item[0];
                this.endTime = item[1];
            }else{
                this.startTime = '';
                this.endTime = '';
            }
        },
        deviceData(item) {
            if(item) {
                this.dataType = item.split(',')[0];
                this.deviceId = item.split(',')[1];
                this.buildingIds = item.split(',')[2];
            }else{
                this.dataType = '';
                this.deviceId = '';
                this.buildingIds = '';
            }
        },
        $route(to, from) {
            this.buildingId = to.fullPath.split('=')[1].split(',')[2];
        }
    }
}
</script>

<style lang="scss" scoped>
#record{
    .record{
        .history-search{

        }
        .pagination{
            text-align: right;
            margin: 15px;
        }
    }
}
</style>
