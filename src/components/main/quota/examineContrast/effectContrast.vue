<template>
	<div id="effectContrast">
		<div class="effectContrast">
			<div class="top-search">
				<span class="searchType">查询方式</span>
				<el-select v-model="choiceTime" placeholder="请选择" clearable style="width: 110px;">
				    <el-option v-for="item in TimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<span class="Time-search">查询时间</span>
				<el-date-picker v-model="timeData" v-if="this.types == 1" value-format="yyyy" type="year" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 2" value-format="yyyy-MM" type="month" placeholder="选择日期" style="width: 150px;"></el-date-picker>
				<el-date-picker v-model="timeData" v-if="this.types == 3" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
				<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
			</div>
			<div class="periodicContrast-center">
				<span class="table-span">总能效比对</span>
				<div class="type-table">
					<el-table :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
						<el-table-column prop="departName" label="单位名称" align='center' show-overflow-tooltip></el-table-column>
						<el-table-column prop="ratebyarea" label="单位面积能效" align='center' show-overflow-tooltip></el-table-column>
						<el-table-column prop="ratebypep" label="人均能效" align='center' show-overflow-tooltip></el-table-column>
					</el-table>
					<div class="pagination">
					    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
					</div>
				</div>
				<span class="table-span">自管能效比对</span>
				<div class="type-table">
					<el-table :data="tableData1" stripe style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
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
			choiceTime: 1,
			TimeList: [{label: '按年查询', value: 1}, {label: '按月查询', value: 2}, {label: '按日查询', value: 3}],
			timeData: '2018',
			types: '1',
			year: '',
			month: '',
			day: '',
			tableData: [],
			tableData1: [],
			pageSize: 10,
			currentPage: 1,
			pageTotal: 0,
			pageSize1: 10,
			currentPage1: 1,
			pageTotal1: 0,
		}
	},
	methods:{
		/* 查询信息 (总能耗)*/
		initData(currentPage){
			let data ={
				flags: 2,
				queryFlag:this.choiceTime,
				year:this.year,
				month:this.month,
				day:this.day,
				pageSize: this.pageSize,
				currentPage
			}
			console.log(data)
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
				queryFlag:this.choiceTime,
				year:this.year,
				month:this.month,
				day:this.day,
				pageSize: this.pageSize1,
				currentPage,
			}
			this.$axios.post(`BMPlatServers/consum/querydepzgenereffi`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
				if(res.data.success){
					this.tableData1 = res.data.result.zgList
					this.pageTotal1 =res.data.result.zgcount
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
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
		/* 搜索 */
		search(){
			if(this.choiceTime != ''&&this.choiceTime != null&&this.timeData != ''&&this.timeData != null){
				this.initData(1)
				this.initDatas(1)
			}else{
				this.$message.warning({
					message: '请添加搜索条件及时间',
					showClose: true,
					duration: 1000,
				});
			}
		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		if(this.timeData == '2018'){
			this.year = this.timeData
		}
		this.initData(1)
		this.initDatas(1)
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData(1);
			this.initDatas(1);
		},
		choiceTime(olds) {
		    if(olds == 1) {
		        this.types = 1
		    }else if(olds == 2) {
		        this.types = 2
		    }else if(olds == 3) {
		        this.types = 3
		    };
		    this.timeData = ''
		},
		timeData(item) {
			if(item) {
				this.year = item.split('-')[0];
			    this.month = item.split('-')[1];
			    this.day = item.split('-')[2];
			}else{
				this.year = '';
				this.month = '';
				this.day = '';
			}
		}
	}

}
</script>

<style lang="scss" scoped>
#effectContrast{
	.effectContrast{
		padding:10px;
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
