<template>
	<div id="collectorWaterState">
		<div class="collectorWaterState">
			<!-- collectorWaterState -->
			<div class="placeTable">
			    <el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
			        <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
			            <template slot-scope="scope">
			                <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
			            </template>
			        </el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="name" label="采集器名称" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="deviceId" label="采集器编码" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="ip" label="ip" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="addr" label="地址" align='center'></el-table-column>
					<el-table-column :show-overflow-tooltip="true" prop="father_device" label="所属采集器" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="status" label="连接状态" align='center'>
			            <template slot-scope="scope">
			                <span v-if="scope.row.status==1">在线</span>
			                <span v-if="scope.row.status==0" style="color: red;">离线</span>
			            </template>
			        </el-table-column>
				</el-table>
			</div>
			<div class="pagination">
			    <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size='pageSize'  layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			 val: 1,
			pageSize: 10,
			currentPage: 1,
			pageTotal: 10,
			tableData: []
		}
	},
	methods:{
		initData() {
		    let data = {
		        currentPage: 1,
		        pageSize: this.pageSize,
				flag: 2
		    }
		    this.$axios.post(`BMPlatServers/electricity/queryDeviceStatus`, this.$qs.stringify(data)).then((res)=>{
		        // console.log(res);
		        if(res.data.success) {
		            this.tableData = res.data.result.StatusList;
		            this.pageTotal = res.data.result.count;
		        }else{
		            this.$message.warning({
						message: res.data.resultMessage,
		                showClose: true,
		                duration: 1000,
					});
		        }
		    }).catch((err)=>{
		        console.log(err);
		    })
		},
		handleCurrentChange(val) {
		    this.val = val;
		    let data = {
		        currentPage: val,
		        pageSize: this.pageSize,
				flag: 2
		    }
		    this.$axios.post(`BMPlatServers/electricity/queryDeviceStatus`, this.$qs.stringify(data)).then((res)=>{
		        // console.log(res);
		        if(res.data.success) {
		            this.tableData = res.data.result.StatusList;
		            this.pageTotal = res.data.result.count;
		        }else{
		            this.$message.warning({
						message: res.data.resultMessage,
		                showClose: true,
		                duration: 1000,
					});
		        }
		    }).catch((err)=>{
		        console.log(err);
		    })
		}
	},
	mounted() {
		this.initData()
	},
	watch:{
		
	}
}
</script>

<style lang="scss" scoped>
	#collectorWaterState{
		padding: 15px;
		.collectorWaterState{
			 box-shadow: 0 0 6px #ddd;
			padding: 8px;
			.placeTable{
			
			}
			.pagination{
			    text-align: right;
			    margin: 15px;
			}
		}
	}
</style>
