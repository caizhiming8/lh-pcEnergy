<template>
	<div id="powerState">
		<div class="powerState">
			<!-- powerState -->
			<div class="placeTable">
			    <el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
			        <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
			            <template slot-scope="scope">
			                <span>{{(Number(val) * pageSize) - (pageSize-1 - scope.$index)}}</span>
			            </template>
			        </el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="ammeter_name" label="电表名称" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="collect_time" label="上次上数时间" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="device_status" label="连接状态" align='center'>
			            <template slot-scope="scope">
			                <span v-if="scope.row.device_status==1">在线</span>
			                <span v-if="scope.row.device_status==0" style="color: red;">离线</span>
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
			tableData: [],
		}
	},
	methods:{
		initData(){
			let data = {
				currentPage: this.currentPage,
				pageSize: this.pageSize
			}
			 this.$axios.post(`BMPlatServers/electricity/queryElecStatus`, this.$qs.stringify(data)).then((res)=>{
			    console.log(res);
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
			})/* .catch((err)=>{
			    console.log(err);
			}) */
		},
		handleCurrentChange(){
			this.initData()
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
#powerState{
    padding: 15px;
    .powerState{
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
