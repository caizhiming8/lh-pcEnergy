<template>
	<div id="unitEffectContrast">
		<div class="unitEffectContrast">
			<!-- 考核对比 -->
			<div class="type-search">
				<span class="state">单位选择</span>
				<el-input v-model="unitString" placeholder="请输入" class="unitString"></el-input>
				<span class="state">状态选择</span>
				<el-select v-model="state" placeholder="请选择" clearable style="width: 150px;">
					<el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="type-table">
				<span class="table-center">单位定额考核</span>
				<el-table tooltip-effect="light" :data="tableData" stripe style="width: 100%;" class="history_table" border >
					<el-table-column :show-overflow-tooltip="true" label="单位名称" align="center">
						<template slot-scope="scope">
							<a :title="scope.row.name" @click="passValue(scope.row.Id)" style="color: #3194F8; cursor: pointer;" >{{scope.row.departName}}</a>
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
			tableData:[],
			currentPage: 1,
			pageSize: 10,
			pageTotal:0,
			unitString:'',
			state:1,
			stateList:[{label: '正常', value: 1}, {label: '超值', value: 2}]
		}
	},
	methods:{
		initData(){
			let data={
				currentPage: this.currentPage,
				pageSize: this.pageSize
			}
			this.$axios.post(`BMPlatServers/consum/queryalldepcons`, this.$qs.stringify(data)).then((res)=>{
				console.log(res)
				if(res.data.success){
					this.pageTotal = res.data.result.count
					this.tableData = res.data.result.quotaList
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			})
		},
		handleCurrentChange(){
			this.initData()
		},
		passValue(id){
			this.$router.push({path:'/unitAssessment',query:{id:id}});
		}
	},
	mounted() {
		this.initData()
	},
	search(){
		this.initData()
	},
	watch:{

	}
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
		}
	}
}
</style>
