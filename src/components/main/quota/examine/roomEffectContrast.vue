<template>
<div id="roomEffectContrast">
	<div class="roomEffectContrast">
		<!-- 房间考核 -->
		<!-- <div class="type-search">
			<span class="state">状态选择：</span>
			<el-select v-model="state" placeholder="请选择" clearable style="width: 150px;">
				<el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<!-- <el-button class="btn" type="primary" icon="el-icon-search" @click="search">搜索</el-button> -->
			<!-- <el-button class="btn" type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button> -->
		<!-- </div> -->
		<div class="type-table">
			<span class="table-center">房间定额考核</span>
			<el-table tooltip-effect="light" :data="tableData" stripe class="history_table" border style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
				<el-table-column :show-overflow-tooltip="true" prop="buildName" label="楼宇" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="floor_id" label="楼层" align="center"></el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="room_name" label="房间" align="center"></el-table-column>
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
			pageTotal:1,
			unitString:'',
			state:1,
			// stateList:[{label: '正常', value: 1}, {label: '超值', value: 2}],
			school: ''
		}
	},
	methods:{
		initData(currentPage){
			let data={
				currentPage,
				pageSize: this.pageSize,
				depart_id:this.school
			}
			this.$axios.post(`BMPlatServers/consum/queryallroomscons`, this.$qs.stringify(data)).then((res)=>{
				// console.log(res)
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
		search(){
			this.initData(1)
		},
		handleCurrentChange(val){
			this.initData(val)
		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.initData(1)
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData(1);
		},
	}
}
</script>

<style lang="scss" scoped>
#roomEffectContrast{
	.roomEffectContrast{
		.type-search{
			margin-top: 15px;
			.state{
				color: #434343;
				font-size: 15px;
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
