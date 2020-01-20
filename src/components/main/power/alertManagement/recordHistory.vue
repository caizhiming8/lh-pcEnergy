<template>
    <div id="recordHistory">
        <div class="recordHistory">
			<div class="history-search">
				<span>告警状态</span>
				<el-select v-model="alarmStatus" placeholder="请选择" clearable filterable>
				    <el-option v-for="(item, index) in status" :key="index" :label='item.label' :value="item.value"></el-option>
				</el-select>
				<span style="margin-left: 20px">设备名称</span>
				<el-input v-model="name"></el-input>
				<el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 40px;"  @click="search">搜索</el-button>
			</div>
			<div class="history-table">
				<el-table :data="tableData" :default-sort = "{prop: 'date', order: 'descending'}" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
					<el-table-column type="index" label="序号" align='center'>
					    <template slot-scope="scope">
					        <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
					    </template>
					</el-table-column>
					<el-table-column prop="deviceName" label="设备名称" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="status" label="告警状态" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="typeComment" label="告警类型" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="degree" label="告警级别" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="warningTime" label="告警时间" :show-overflow-tooltip="true" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="warningVal" label="告警值"  sortable align='center' width="120"></el-table-column>
					<el-table-column prop="maxVal" label="最大值" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="minVal" label="最小值" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="personName" label="处理人" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="completeTime" label="处理时间" :show-overflow-tooltip="true" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="reason" label="告警原因" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="solution" label="解决方法" sortable align='center' width="120"></el-table-column>
					<el-table-column prop="result" label="处理结果" sortable align='center' width="120"></el-table-column>
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
			pageSize: 2,
			pageTotal: 1,
			val: 1,
			name:'',
			alarmStatus: ''
        }
    },
    methods: {
		handleCurrentChange(val) {
			this.val = val;
			let param = {
				systemId:2,
				pageSize: this.pageSize,
				currentPage: val,
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
                        duration: 1000,
					})
				}
			});
		},
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
                    }
				}else{
                    this.status = [];
					this.$message.warning({
						message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		search(){
			this.val = 1;
			let param = {
				systemId:2,
				status:this.alarmStatus,
				name:this.name,
			    pageSize: this.pageSize,
			    currentPage: this.currentPage,
                flag: 2
			};
			this.$axios.post(`BMPlatServers/warn/querySystemWarning`,this.$qs.stringify(param)).then((response) => {
				// console.log(response)
				if(response.data.success){
					 this.tableData = response.data.result.array;
			         this.pageTotal = response.data.result.num;
				}else{
					this.$message.warning({
						message: response.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		initTabelData(){
			let param = {
					systemId: 2,
					pageSize: this.pageSize,
					currentPage: this.currentPage,
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
							duration: 1000,
						})
					}
				});
		},
    },
    mounted() {
		this.initData();
		this.initTabelData();
    },
    /* watch: {

    } */
}
</script>

<style lang="scss" scoped>
#recordHistory{
	padding: 25px 15px 30px 15px;
	.recordHistory{
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
