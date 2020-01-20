<template>
	<div id="unitAssessment">
		<div class="unitAssessment">
			<div class="cycle-tetle">
				<span>当前周期：{{cycle}}</span>
			</div>
			<div class="type-table">
				<span class="table-center">总定额考核</span>
				<el-table tooltip-effect="light" :data="tableData"  v-loading="loading" stripe class="history_table" border style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
					<el-table-column :show-overflow-tooltip="true" prop="name" label="项目" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="quota" label="定额值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="consum" label="总能耗值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="能耗差值" align="center">
						<template slot-scope="scope" >
						 	<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.diffconsum}}</div>
	   					</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="完成状态" align="center">
						<template slot-scope="scope" >
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.status}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="percentage" label="进度"  width="400">
						<template slot-scope="scope">
							<el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.rate" :color="customColors"></el-progress>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="type-table">
				<span class="table-center">自管定额考核</span>
				<el-table tooltip-effect="light" :data="tableData1"  v-loading="loading1" stripe class="history_table" border style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
					<el-table-column :show-overflow-tooltip="true" prop="name" label="名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="quota" label="定额值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="consum" label="总能耗值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="能耗差值" align="center">
						<template slot-scope="scope" >
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.diffconsum}}</div>
   						</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="状态" align="center">
						<template slot-scope="scope" >
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.status}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="percentage" label="进度"  width="400">
						<template slot-scope="scope">
							<el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.rate" :color="customColors"></el-progress>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="type-table">
				<span class="table-center">公共定额考核</span>
				<el-table tooltip-effect="light" :data="tableData2"  v-loading="loading2" stripe class="history_table" border style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
					<el-table-column :show-overflow-tooltip="true" prop="name" label="名称" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="quota" label="定额值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="consum" label="总能耗值" align="center"></el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="能耗差值" align="center">
						<template slot-scope="scope" >
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.diffconsum}}</div>
   						</template>
					</el-table-column>
					<el-table-column :show-overflow-tooltip="true" label="状态" align="center">
						<template slot-scope="scope" >
							<div :style="{'color':scope.row.status=='超值'?'red':'#333'}">{{scope.row.status}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="percentage" label="进度"  width="400">
						<template slot-scope="scope">
							<el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.rate" :color="customColors"></el-progress>
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
			customColors: '#409eff',
			customColors: [
				{color: '#2fb7e0', percentage: 20},
				{color: '#e6a23c', percentage: 40},
				{color: '#5cb87a', percentage: 60},
				{color: '#fa7619', percentage: 80},
				{color: '#f56c6c', percentage: 100}
			],
			tableData:[],
			tableData1:[],
			tableData2:[],
			school: '',
			cycle:'',
			loading: true,
			loading1: true,
			loading2: true
		}
	},
	methods:{
		/* 总能耗 */
		initData(){
			let data ={
				depart_id:this.school,
				type_id: '',
				flag: 'real'
			}
			this.$axios.post(`BMPlatServers/consum/querydepqurealcons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.tableData = res.data.result.quota_csm_list
					this.loading = false;
				}else{
					this.loading = false;
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
				type_id: 1,
				flag: 'real'
			}
			this.$axios.post(`BMPlatServers/consum/querydepqurealcons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.cycle = res.data.result.cruPeriodName
					this.tableData1 = res.data.result.quota_csm_list
					this.loading1 = false;
				}else{
					this.loading1 = false;
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
				type_id: 2,
				flag: 'real'
			}
			this.$axios.post(`BMPlatServers/consum/querydepqurealcons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.tableData2 = res.data.result.quota_csm_list
					this.loading2 = false;
				}else{
					this.loading2 = false;
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
	},
	mounted() {
		if(this.$route.query.schoolId != ''){
			this.school = this.$route.query.schoolId
		}
		this.school =  window.location.href.split('=')[1];
		this.initData()
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
			this.initData1();
			this.initData2();
		},
	}
}
</script>

<style lang="scss" scoped>
#unitAssessment{
	.unitAssessment{
		.cycle-tetle{
			float: right;
			margin-right: 10%;
			color: #dc2323;
			font-size: 16px;
			font-weight: 600;
		}
		.type-table{
			width: 94%;
			margin-left: 3%;
			margin-top: 20px;
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
		}
		.el-progress-bar__innerText{
			color: #606266;
		}
		/deep/ .el-progress-bar__inner{
			text-align: left;
		}
	}
}
</style>
