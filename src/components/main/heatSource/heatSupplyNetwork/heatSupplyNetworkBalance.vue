<template>
    <div id="heatSupplyNetworkBalance">
		<div class="heatSupplyNetworkBalance">
			<div class="building-search">
				<span>系统名称</span>
				<el-select v-model="buildingId" placeholder="请选择" clearable filterable>
					<el-option v-for="(item, index) in buildinglist" :key="index" :label='item.label' :value="item.value"></el-option>
				</el-select>
				<el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 40px;"  @click="search">搜索</el-button>
			</div>
			<div class="building-table">
				<el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column prop="buildingName" label="系统名称"  align='center'></el-table-column>
					<el-table-column prop="dataName" label="名称" show-overflow-tooltip  align='center'></el-table-column>
					<el-table-column prop="time" label="时间" show-overflow-tooltip  align='center'></el-table-column>
                    <el-table-column prop="dataValue" label="温度" show-overflow-tooltip  align='center'></el-table-column>
                    <el-table-column prop="secondtem" label="二次侧回水温度" show-overflow-tooltip  align='center' width="150"></el-table-column>
                    <el-table-column prop="threshold" label="阈值"  align='center'></el-table-column>
                    <el-table-column prop="temperature" label="补偿值"  align='center'></el-table-column>
					<el-table-column  label="状态"  align='center' >
						<template slot-scope="scope">
                            <span v-if="Number(scope.row.dataValue)-Number(scope.row.temperature==undefined?1:scope.row.temperature)-Number(scope.row.secondtem)>=Math.abs(Number(scope.row.threshold==undefined?1:scope.row.threshold))" style="color:red">高</span>
                            <span v-if="Number(scope.row.dataValue)-Number(scope.row.temperature==undefined?1:scope.row.temperature)-Number(scope.row.secondtem)<=-(Math.abs(Number(scope.row.threshold==undefined?1:scope.row.threshold)))" style="color:#4D78CC">低</span>
							<span v-if="Number(scope.row.dataValue)-Number(scope.row.temperature==undefined?1:scope.row.temperature)-Number(scope.row.secondtem)<Math.abs(Number(scope.row.threshold==undefined?1:scope.row.threshold)) && Number(scope.row.dataValue)-Number(scope.row.temperature==undefined?1:scope.row.temperature)-Number(scope.row.secondtem)>-(Math.abs(Number(scope.row.threshold==undefined?1:scope.row.threshold)))">正常</span>
						</template>
					</el-table-column>
                    <el-table-column  label="操作"  align='center' >
						<template slot-scope="scope">
							<el-button type="primary" @click="handleClick(scope.row, scope.$index)" size="mini">设置阈值</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination">
				<el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
			</div>

            <el-dialog title="设置阈值操控" :visible.sync="dialogVisible" width="30%">
                <div class="dialog-body">
                    <el-form label-width="100px">
                        <el-form-item label="阈值">
                            <el-input v-model="threshold" placeholder="阈值" style="width: 200px;"></el-input>
                        </el-form-item>
                        <el-form-item label="补偿值">
                            <el-input v-model="temperature" placeholder="补偿值" style="width: 200px;"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                    <el-button type="primary" @click="makeSure" size="mini">确 定</el-button>
                </span>
            </el-dialog>
		</div>
    </div>
</template>

<script>
export default{
		data(){
			return{
				currentPage: 1,
				pageSize: 10,
				tableData:[],
				pageTotal:0,
				systemId:3,
				subsystemId:4,
				buildinglist:[],
				buildingId:"",
                dialogVisible: false,
                temperature: '',
                threshold: '',
                row: {}
			}
		},
		methods:{
            // 设置阈值
            handleClick(row, index) {
                this.row = row;
                this.dialogVisible = true;
                this.threshold = '';
                this.temperature = '';
            },

			handleCurrentChange(val) {
                let param = {
				    pageSize: this.pageSize,
				    currentPage: val,
					buildingId:this.buildingId
				};
				this.$axios.post(`BMPlatServers/hvacheat/queryHeatGridBalance`,this.$qs.stringify(param)).then((response) => {
					if(response.data.success){
						this.tableData = response.data.result.list;
				        this.pageTotal = response.data.result.num;
					}else{
                        this.$message.warning({
							message: response.data.resultMessage,
							showClose: true,
                            duration: 1000
						})
					}
				});
			},
			initBuildings(){
				let param = {
				    systemId: this.systemId,
				    subsystemId: this.subsystemId
				};
				this.$axios.post(`BMPlatServers/hvacheat/queryBuildings`,this.$qs.stringify(param)).then((response) => {
					if(response.data.success){
						if(response.data.result.list&&response.data.result.list.length){
							this.buildinglist = response.data.result.list;
						}else{
                            this.buildinglist = [];
                            this.$message.warning({
    							message: '暂无子系统',
    							showClose: true,
                                duration: 1000
    						})
						}
					}else{
                        this.buildinglist = [];
                        this.$message.warning({
							message: response.data.resultMessage,
							showClose: true,
                            duration: 1000
						})
					}
				});
			},
			search(){
				let param = {
				    pageSize: this.pageSize,
				    currentPage: this.currentPage,
					buildingId:this.buildingId
				};
				this.$axios.post(`BMPlatServers/hvacheat/queryHeatGridBalance`,this.$qs.stringify(param)).then((response) => {
                    console.log(response);
					if(response.data.success){
						this.tableData = response.data.result.list;
				        this.pageTotal = response.data.result.num;
					}else{
                        this.$message.warning({
							message: response.data.resultMessage,
							showClose: true,
                            duration: 1000
						})
					}
				});
			},

            // 模态框确定按钮
            makeSure() {
                let data = {
                    buildingId: this.row.buildingId,
                    systemId: this.row.systemId,
                    subsystemId: this.row.subsystemId,
                    temperature: this.temperature,
                    threshold: this.threshold
                };
                this.$axios.post(`BMPlatServers/hvacheat/addBuildingTemperature`, this.$qs.stringify(data)).then((res)=>{
                    if(res.data.success) {
                        this.$message.success({
							message: '设置成功',
							showClose: true,
                            duration: 1000
						})
                        this.dialogVisible = false;
                        this.search();
                    }else{
                        this.$message.warning({
							message: res.data.resultMessage,
							showClose: true,
                            duration: 1000
						})
                    }
                })
            }
		},
		mounted(){
			this.initBuildings();
			this.search();
		},
		watch:{
            threshold(newData) {
                this.threshold = (''+this.threshold).replace(/[^\d^\.]+/g, '');
            },
            temperature(newData) {
                this.temperature = (''+this.temperature).replace(/[^\d^\.]+/g, '');
            }
		}
	}
</script>


<style lang="scss" scoped>
	#heatSupplyNetworkBalance{
	    padding: 25px 15px 30px 15px;
	    .heatSupplyNetworkBalance{
	        box-shadow: 0 0 6px #ddd;
			padding:0 10px;
	        .building-search{
	            padding: 25px 0 10px 35px;
	            color: #909393;
	            .el-input{
	                width: 200px;
	            }
	        }
	        .building-table{

	        }
	        .pagination{
	            text-align: right;
	            padding: 20px;
	        }
            /deep/ .el-dialog__header{
                border-bottom: 1px solid #ddd;
            }
	    }
	}
</style>
