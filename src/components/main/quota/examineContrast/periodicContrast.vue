<template>
	<div id="periodicContrast">
		<div class="periodicContrast">
			<div class="top-search">
				<!-- <span class="cycle-seach">查询时间</span>
				<el-date-picker v-model="timeData" value-format="yyyy" type="year" placeholder="选择日期" style="width: 200px;"></el-date-picker> -->
				<span class="cycle-seach">查询周期</span>
				<el-select v-model="cycle" placeholder="请选择" clearable style="width: 200px; margin-left: 8px;">
					<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="span-history">历史时间</span>
				<el-select v-model="history" placeholder="请选择" clearable style="width: 200px; margin-left: 8px;">
				    <el-option v-for="item in historyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="periodicContrast-center">
				<span class="table-span">周期总能效比对</span>
				<div class="type-table">
					<el-table :data="tableData" style="width: 100%" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
						<el-table-column prop="departName" label="单位名称" align='center' show-overflow-tooltip></el-table-column>
						<el-table-column prop="ratebyarea" label="单位面积能效" align='center' show-overflow-tooltip></el-table-column>
						<el-table-column prop="ratebypep" label="人均能效" align='center' show-overflow-tooltip></el-table-column>
					</el-table>
					<div class="pagination">
					    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
					</div>
				</div>
				<span class="table-span">周期自管能效比对</span>
				<div class="type-table">
					<el-table :data="tableData1" style="width: 100%" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
						<el-table-column prop="departName" label="单位名称" align='center' show-overflow-tooltip></el-table-column>
						<el-table-column prop="zgRateForArea" label="单位面积能效" align='center' show-overflow-tooltip></el-table-column>
						<el-table-column prop="zgRateForPeo" label="人均能效" align='center' show-overflow-tooltip></el-table-column>
					</el-table>
					<div class="pagination">
					    <el-pagination background @current-change="handleCurrentChange1" :current-page.sync='currentPage1' :page-size='pageSize1' layout="total, prev, pager, next"  :total="pageTotal1"></el-pagination>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			cycle: 1,
			cycleList: [],
			history:'0',
			historyList:[],
			year: '',
			tableData:[],
			tableData1:[],
			pageSize: 10,
			currentPage: 1,
			pageTotal: 0,
			pageSize1: 10,
			currentPage1: 1,
			pageTotal1: 0,
		}
	},
	methods:{
		/* 周期 */
		initDataList(){
			this.$axios.post(`BMPlatServers/consum/queryperiod`).then((res)=>{
				// console.log(res)
				if(res.data.success) {
					this.cycleList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						    this.cycleList.push({label: item.name, value: item.Id});
						});
					}
				}else{
					this.cycleList = [];
				}
			})
		},
		initHistory(){
			let data ={
				periodId: this.cycle
			}
			this.$axios.post(`BMPlatServers/consum/queryyears`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success) {
					this.historyList = []
					this.year = 2018;
					if(res.data.result && res.data.result.length) {
						res.data.result.forEach((item)=>{
						    this.historyList.push({label: item.time_year, value: item.id});
						});
						this.year = this.historyList[0].label
					}
				}else{
					this.historyList = []
					this.year = 2018;
				}
			})
		},
		/* 总能效分页 */
		handleCurrentChange(val){
			this.initData(val)
		},
		/* 自管分页 */
		handleCurrentChange1(val){
			this.initDatas(val)
		},
		/* 查询信息  (总能耗）)*/
		initData(currentPage){
			let data ={
				flags: 1,
				periodId: this.cycle,
				year: this.year,
				currentPage,
				pageSize: this.pageSize,
			}
			this.$axios.post(`BMPlatServers/consum/querydephisenereffibypro`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.tableData = res.data.result.resultList
					this.pageTotal = res.data.result.count
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		/* 查询信息 （自管） */
		initDatas(currentPage){
			let data ={
				periodId: this.cycle,
				year: this.year,
				currentPage,
				pageSize: this.pageSize1,
			}
			this.$axios.post(`BMPlatServers/consum/querydepzgenereffibypro`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.tableData1 = res.data.result.zgList
					this.pageTotal1 = res.data.result.zgcount
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
				}
			})
		},
		/* 搜索 */
		search(){
			this.initData(1)
			this.initDatas(1)
		}
	},
	mounted() {
		this.initDataList()
		this.initHistory()
		this.school =  window.location.href.split('=')[1];
		this.initData(1)
		this.initDatas(1)
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData(1)
			this.initDatas(1);
		},
		cycle(){
			this.initHistory()
		},
		history(id){
			for(var i = 0;i<this.historyList.length;i++){
				if(i == id){
					this.year = this.historyList[i].label
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
#periodicContrast{
	.periodicContrast{
		padding: 10px 0;
		.top-search{
			margin-top: 15px;
			.cycle-seach{
				margin-left: 10px;
				color: #434343;
				font-size: 15px;
				font-weight: 500;
			}
			.span-history{
				margin-left: 10px;
				color: #434343;
				font-size: 15px;
				font-weight: 500;
			}
		}
		.periodicContrast-center{
			margin-top: 15px;
			.table-span{
				margin-top: 5px;
				margin-left: 10px;
				color: #434343;
				font-size: 16px;
				font-weight: 500;
			}
			.type-table{
				margin-top: 15px;
			}
		}
		.pagination{
		    text-align: right;
		    padding: 10px 20px;
		}
	}
}
</style>
