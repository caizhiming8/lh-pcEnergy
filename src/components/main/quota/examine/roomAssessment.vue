<template>
	<div id="roomAssessment">
		<div class="roomAssessment">
			<div class="checkTree">
				<v-checkTree @sonData="sonDatas"></v-checkTree>
			</div>
			<div class="type-room">
				<div class="type-search">
					<span class="cycle-seach">周期查询：</span>
					<el-select v-model="cycle" placeholder="请选择周期" clearable style="width: 150px;margin-left: 10px;">
						<el-option v-for="item in cycleList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<span class="span-history">历史时间    </span>
					<el-select v-model="history" placeholder="请选择" clearable style="width: 200px;">
					    <el-option v-for="item in historyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
					<el-button class="btn" size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
				</div>
				<div class="type-table">
					<span class="table-center">{{name}}定额考核</span>
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
			</div>
		</div>
	</div>
</template>

<script>
import checkTree from './checkTree';
export default{
	data(){
		return{
			name: '',
			tableData: [],
			cycle: '',
			cycleList: [],
			flag:'',
			flags: '',
			year: '',
			history:'0',
			historyList:[],
		}
	},
	methods:{
		/* 树结构 */
		sonDatas(datas){
			this.building_id = datas.buildingId
			this.floor_id = datas.floorId
			this.room_id =datas.id
			if(datas.floorId != ''&&datas.floorId != null){
				if(datas.is_zg == 1){
					this.flags = 1
				}else if(datas.is_zg == 2){
					this.flags = 2
				}
				this.initData();
			}else{
				this.tableData = []
				this.$message.warning({
					message: '请选择房间',
				    showClose: true,
				    duration: 1000,
				})
			}
			this.flag = datas.is_zg
			if(datas.is_zg == 1){
				this.name = '自管'
			}else if(datas.is_zg == 2){
				this.name = '公摊'
			}
		},
		initHistory(){
			let data ={
				periodId: this.cycle
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
						/* this.initData() */
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
		initDataList(){
			this.$axios.post(`BMPlatServers/consum/queryperiod`).then((res)=>{
				console.log(res)
				if(res.data.success) {
					this.cycleList = []
					if(res.data.result.list && res.data.result.list.length) {
						res.data.result.list.forEach((item)=>{
						    this.cycleList.push({label: item.name, value: item.Id});
						});
						this.cycle = this.cycleList[0].value
						/* console.log(this.cycle) */
						this.initHistory()
						this.initData()
					}
				}else{
					this.cycleList = []
				}
			})
		},
		initData(){
			let data ={
				periodId:this.cycle,
				depart_id:this.school,
				building_id:this.building_id,
				floor_id:this.floor_id,
				room_id:this.room_id,
				type_id:this.flag,
				flags:this.flags,
				flag: 'history',
				year:this.year
			}
			this.$axios.post(`BMPlatServers/consum/querydepqurealcons`,this.$qs.stringify(data)).then((res) =>{
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
			})
		},
		search(){
			this.initData()
		}
	},
	mounted() {
		this.initDataList()
		/* this.initHistory() */
		this.school =  window.location.href.split('=')[1];
		/* this.initData() */
	},
	components: {
	    'v-checkTree': checkTree
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
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
#roomAssessment{
	.roomAssessment{
		.checkTree{
			float: left;
			width: 15%;
			height: 550px;
			overflow: auto;
			padding-right: 10px;
			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			-o-box-sizing: border-box;
			border-right: 1px solid #ddd;
			&::-webkit-scrollbar{
			    width: 1px;
			}
		}
		.type-room{
			float: left;
			width: 85%;
			overflow: auto;
			padding-left: 10px;
			box-sizing: border-box;
			-webkit-box-sizing: border-box;
			-moz-box-sizing: border-box;
			-o-box-sizing: border-box;
			&::-webkit-scrollbar{
			    width: 1px;
			}
			.type-search{
				margin-top: 10px;
				margin-left: 10px;
				.cycle-seach{
					margin-left: 5px;
					color: #434343;
					font-size: 14px;
					font-weight: 500;
				}
				.btn{
					margin-left: 18px;
				}
			}
			.type-table{
				margin-top: 20px;
				.table-center{
					margin-left: 5px;
					color: #434343;
					font-size: 15px;
					font-weight: 500;
				}
				.history_table{
					margin-top: 10px;
				}
			}
		}
	}
}
</style>
