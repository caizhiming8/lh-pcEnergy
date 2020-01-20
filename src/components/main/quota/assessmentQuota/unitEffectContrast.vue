<template>
	<div id="unitEffectContrast">
		<div class="unitEffectContrast">
			<!-- 考核对比 -->
			<div class="type-search">
				<span class="state">单位选择</span>
				<el-input v-model="unitString" placeholder="请输入" class="unitString"></el-input>
				<!-- <span class="state">状态选择</span>
				<el-select v-model="state" placeholder="请选择" clearable style="width: 150px;">
					<el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select> -->
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="type-table">
				<span class="table-center">单位定额考核</span>
				<el-table tooltip-effect="light" :data="tableData" stripe class="history_table" border style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}"  v-loading="loading">
					<el-table-column :show-overflow-tooltip="true" label="单位名称" align="center">
						<template slot-scope="scope">
							<a :title="scope.row.name" @click="passValue(scope.row.depart_id)" style="color: #3194F8; cursor: pointer;" >{{scope.row.departName}}</a>
						</template>
						<!-- cursor: pointer -->
					</el-table-column>
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
					<el-table-column prop="percentage" label="进度"  width="400">
						<template slot-scope="scope">
							<el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.rate" :color="customColors"></el-progress>
						</template>
					</el-table-column>
				</el-table>
				<div class="bottom-pagnation">
				    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
				</div>
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
			currentPage: 1,
			pageSize: 10,
			pageTotal:1,
			unitString:'',
			state:1,
			stateList:[{label: '正常', value: 1}, {label: '超值', value: 2}],
			depart_id: '',
			pid:'',
			loading:true
		}
	},
	methods:{
		initData(currentPage){
			let data={
				depart: this.unitString,
				currentPage,
				pageSize: this.pageSize
			}
			this.$axios.post(`BMPlatServers/consum/queryalldepcons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.pageTotal = res.data.result.count
					this.tableData = res.data.result.quotaList
					this.loading = false;
				}else{
					this.loading = false;
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		handleCurrentChange(val){
			this.initData(val)
		},
		search(){
			this.initData(1)
		},
		passValue(item){
			let data={
				depart_id:item
			}
			this.$axios.post(`BMPlatServers/consum/querygroupid`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				this.depart_id = res.data.result.depart_id;
				this.pid = res.data.result.pid
				if(this.depart_id !=''&&this.pid != ''){
					this.$router.push({
						path:'/unitAssessment',
						query:{
							schoolId:this.depart_id,
							school_id:this.pid
						}
					});
				}
			})
		}
	},
	mounted() {
		this.initData(1)
	},
	watch:{

	},
}
</script>

<style lang="scss" scoped>
#unitEffectContrast{
	.unitEffectContrast{
		.type-search{
			margin-top: 15px;
			.state{
				color: #434343;
				font-size: 16px;
				font-weight: 500;
				margin-left: 10px;
			}
			.unitString{
				width: 200px;
			}
			.btn{
				margin-left: 10px;
			}
		}
		.type-table{
			margin-top: 20px;
			.table-center{
				color: #434343;
				font-size: 16px;
				font-weight: 500;
				margin-left: 10px;
			}
			.history_table{
				margin-top: 15px;
			}
			.bottom-pagnation{
				float: right;
				text-align: right;
				padding: 20px;
			}
			/deep/ .el-progress-bar__inner{
				text-align: left;
			}
		}
	}
}
</style>
