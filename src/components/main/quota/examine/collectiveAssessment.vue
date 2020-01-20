<template>
	<div id="collectiveAssessment">
		<div class="collectiveAssessment">
			<div class="type-search">
				<span class="span-period">历史周期    </span>
				<el-select v-model="period" placeholder="请选择" clearable style="width: 200px;">
				    <el-option v-for="item in periodList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="span-history">历史时间    </span>
				<el-select v-model="history" placeholder="请选择" clearable style="width: 200px;">
				    <el-option v-for="item in historyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button type="primary" size="small" @click="search" class="search">搜索</el-button>
			</div>
			<div class="type-table">
				<span class="table-center">总定额考核</span>
				<el-table tooltip-effect="light" :data="tableData" stripe class="history_table" border style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
					<el-table-column :show-overflow-tooltip="true" prop="name" label="项目" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="quota" label="定额值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="consum" label="总能耗值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="能耗差值" align="center">
						<template slot-scope="scope">
						 	<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.diffconsum}}</div>
	   					</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="完成状态" align="center">
						<template slot-scope="scope">
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.status}}</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="type-table">
				<span class="table-center">自管定额考核</span>
				<el-table tooltip-effect="light" :data="tableData1" stripe style="width: 100%;" class="history_table" border>
					<el-table-column :show-overflow-tooltip="true" prop="name" label="名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="quota" label="定额值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="consum" label="总能耗值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="能耗差值" align="center">
						<template slot-scope="scope">
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.diffconsum}}</div>
   						</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="状态" align="center">
						<template slot-scope="scope">
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.status}}</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="type-table">
				<span class="table-center">公共定额考核</span>
				<el-table tooltip-effect="light" :data="tableData2" stripe style="width: 100%;" class="history_table" border>
					<el-table-column :show-overflow-tooltip="true" prop="name" label="名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="quota" label="定额值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="consum" label="总能耗值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="能耗差值" align="center">
						<template slot-scope="scope">
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.diffconsum}}</div>
   						</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="状态" align="center">
						<template slot-scope="scope">
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.status}}</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			period:1,
			periodList:[],
			history:'0',
			historyList:[],
			tableData:[],
			tableData1:[],
			tableData2:[],
			year:'',
			school:''
		}
	},
	methods:{
		initDataList(){
			this.$axios.post(`BMPlatServers/consum/queryperiod`).then((res)=>{
				console.log(res)
				if(res.data.success) {
					this.periodList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						    this.periodList.push({label: item.name, value: item.Id});
						});
					}
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}

			})
			/* this.initHistory() */
		},
		initHistory(){
			let data ={
				periodId: this.period
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/queryyears`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success) {
					this.historyList = [];
					this.year = '';
					if(res.data.result && res.data.result.length) {
						res.data.result.forEach((item)=>{
						    this.historyList.push({label: item.time_year, value: item.id});
						});
						this.year = this.historyList[0].label
						this.initData()
					}
				}else{
					this.historyList = [];
					this.year = '';
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		initData(){
			let data ={
				depart_id:this.school,
				periodId: this.period,
				year: this.year,
				type_id: '',
				flag: 'history'
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/querydepquhiscons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.tableData = res.data.result.quota_csm_list
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
				this.initData1()
			})
		},
		initData1(){
			let data ={
				depart_id:this.school,
				periodId: this.period,
				year: this.year,
				type_id: 1,
				flag: 'history'
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/querydepquhiscons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.tableData1 = res.data.result.quota_csm_list
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
				this.initData2()
			})
		},
		initData2(){
			let data ={
				depart_id:this.school,
				periodId: this.period,
				year: this.year,
				type_id: 2,
				flag: 'history'
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/consum/querydepquhiscons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.tableData2 = res.data.result.quota_csm_list
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		search(){
			this.initData()
		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.initHistory()
		this.initDataList()
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
			this.initData1();
			this.initData2();
		},
		period(){
			this.initHistory()
		},
		history(id){
			for(var i = 0;i<this.historyList.length;i++){
				if(i == id){
					this.year = this.historyList[i].label
				}
			}
			console.log(this.year)
		}
	}
}
</script>

<style lang="scss" scoped>
#collectiveAssessment{
	.collectiveAssessment{
		.type-search{
			margin-top: 10px;
			.span-period{
				margin-left: 20px;
			}
			.span-history{
				margin-left: 20px;
			}
			.search{
				margin-left: 20px;
			}
		}
		.table-center{
			color: #606266;
			font-size: 16px;
			font-weight: 600;
			margin-top: 20px;
			margin-left: 20px;
		}
		.history_table{
			margin-top: 30px;
		}
		.type-table{
			width: 94%;
			margin-left: 3%;
			margin-top: 20px;
		}
		.el-progress-bar__innerText{
			color: #606266;
		}
	}
}
</style>
