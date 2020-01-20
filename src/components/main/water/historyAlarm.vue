<template>
    <div id="historyAlarm">
        <div class="historyAlarm">
            <div class="history-search">
                <span>告警状态</span>
                <el-select v-model="alarmStatus" placeholder="请选择" clearable filterable>
                    <el-option v-for="(item, index) in status" :key="index" :label='item.label' :value="item.value"></el-option>
                </el-select>
                <span style="margin-left: 20px">设备名称</span>
                <!--<el-input v-model="alart.equipment"></el-input>-->
				<el-input v-model="name"></el-input>
                <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 40px;"  @click="search">搜索</el-button>
            </div>
            <div class="history-table">
                <el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
                    <el-table-column prop="deviceName" label="设备名称" fixed align='center' show-overflow-tooltip width="120"></el-table-column>
                    <el-table-column prop="status" label="告警状态" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="typeComment" label="告警类型" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="degree" label="告警级别" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="warningTime" label="告警时间" :show-overflow-tooltip="true" align='center' width="120"></el-table-column>
                    <el-table-column prop="warningVal" label="告警值" align='center' :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="maxVal" label="最大值" align='center' :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="minVal" label="最小值" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="personName" label="处理人" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="completeTime" label="处理时间" :show-overflow-tooltip="true" align='center' width="120"></el-table-column>
                    <el-table-column prop="reason" label="告警原因" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="solution" label="解决方法" align='center' :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="result" label="处理结果" align='center' :show-overflow-tooltip="true"></el-table-column>
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
            status: [],
            alart: {status: '', equipment: ''},
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            pageTotal: 0,
			name:'',
			alarmStatus: ''
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.initTabelData(val);
        },
        // 告警状态下拉列表
		initData(){
            let data = {
                flag: 2
            }
			this.$axios.post(`BMPlatServers/warn/queryAllStatus`, this.$qs.stringify(data)).then((response) => {
				if(response.data.success){
                    this.status = [];
					if(response.data.result && response.data.result.length) {
                        response.data.result.forEach((item)=>{
    						this.status.push({value:item.status,label:item.message});
    					})
                    }else{
                        this.status = [];
                    }
				}else{
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
				}
			});
		},
		search(){
			let param = {
				systemId:1,
				status:this.alarmStatus,
				name:this.name,
                pageSize: this.pageSize,
                currentPage: 1,
                flag: 2
			};
			this.$axios.post(`BMPlatServers/warn/querySystemWarning`,this.$qs.stringify(param)).then((response) => {
				if(response.data.success){
					this.tableData = response.data.result.array;
                    this.pageTotal = response.data.result.num;
				}else{
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
				}
			});
		},
        initTabelData(currentPage) {
            let param = {
                systemId: 1,
                pageSize: this.pageSize,
                currentPage: currentPage,
                flag: 2
            }
            this.$axios.post(`BMPlatServers/warn/querySystemWarning`,this.$qs.stringify(param)).then((response) => {
                if(response.data.success){
                    this.tableData = response.data.result.array;
                    this.pageTotal = response.data.result.num;
                }else{
                    this.$message.warning({
                        message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            });
        }
    },
    mounted() {
		this.initData();
        this.initTabelData(1);
    }
}
</script>

<style lang="scss" scoped>
#historyAlarm{
    padding: 25px 15px 30px 15px;
    .historyAlarm{
        box-shadow: 0 0 6px #ddd;
        .history-search{
            padding: 25px 0 10px 35px;
            color: #909393;
            .el-input{
                width: 200px;
            }
        }
        .history-table{

        }
        .pagination{
            text-align: right;
            padding: 20px;
        }
    }
}
</style>
