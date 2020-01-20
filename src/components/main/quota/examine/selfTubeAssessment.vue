<template>
	<div id="selfTubeAssessment">
		<div class="selfTubeAssessment">
			<div class="checkTree">
				<v-checkTree @sonData="sonDatas"></v-checkTree>
			</div>
			<div class="type-room">
				<div class="type-table">
					<span class="table-center">{{name}}定额考核</span>
					<el-table tooltip-effect="light" :data="tableData" stripe class="history_table" border style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
						<el-table-column :show-overflow-tooltip="true" prop="name" label="单位名称" align="center"></el-table-column>
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
			school: '',
			building_id: '',
			floor_id: '',
			room_id: '',
			flag: 1,
			flags: ''
		}
	},
	methods:{
		/* 树结构 */
		sonDatas(datas){
			this.building_id = datas.buildingId
			this.floor_id = datas.floorId
			this.room_id =datas.id
			this.flag = datas.is_zg
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
			if(datas.is_zg == 1){
				this.name = '自管'
			}else if(datas.is_zg == 2){
				this.name = '公摊'
			}
		},
		initData(){
			let data ={
				depart_id:this.school,
				building_id:this.building_id,
				floor_id:this.floor_id,
				room_id:this.room_id,
				type_id:this.flag,
				flags:this.flags,
				flag: 'history'
			}
			this.$axios.post(`BMPlatServers/consum/querydepqurealcons`,this.$qs.stringify(data)).then((res) =>{
				// console.log(res)
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
		}
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.initData()
	},
	components: {
	    'v-checkTree': checkTree
	},
	watch:{
		$route(to,from) {
		    this.school = to.fullPath.split('=')[1];
			this.initData();
		},
	}
}
</script>

<style lang="scss" scoped>
#selfTubeAssessment{
	.selfTubeAssessment{
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
