<template>
	<div id="powerState">
		<div class="powerState">
			<!-- powerState -->
            <el-row>
                <el-col :span="24">
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="日期区间">
                            <el-date-picker
                                v-model="reqData.time"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="电价">
                            <el-input placeholder="请输入电价" v-model="reqData.price"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="el-button--small" :loading="btnLoading" @click="goQueryPowerData">查询</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" class="el-button--small" @click="goDownTable">导出表格</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
			<div class="placeTable">
			    <el-table tooltip-effect="light" :data="tableData" style="width: 100%; margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
			        <el-table-column :show-overflow-tooltip="true" align='center' label="序号" width="60">
			            <template slot-scope="scope">
			                <span>{{(Number(val) * reqData.pageSize) - (reqData.pageSize-1 - scope.$index)}}</span>
			            </template>
			        </el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="ammeter_name" label="表名称" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="startConsum" label="开始码" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="endConsum" label="结束码" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="diff" label="用水量" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="price" label="单价" align='center'></el-table-column>
			        <el-table-column :show-overflow-tooltip="true" prop="charge" label="水费" align='center'></el-table-column>
				</el-table>
			</div>
			<div class="pagination">
			    <el-pagination background @current-change="handleCurrentChange" :current-page.sync="reqData.currentPage" :page-size='reqData.pageSize'  layout="total, prev, pager, next" :total="pageTotal"></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		var now = new Date();
 		var year = now.getFullYear();
 		var month = now.getMonth() + 1;
 		var tdata = now.getDate();
		return{
			val: 1,
			tableData: [],
			pageTotal: 0,
			btnLoading: false,
            reqData: {
                time: [
					`${year}-${month}-${tdata}`,
					`${year}-${month}-${tdata}`
				],
                price: 0.00,
                startYear: '',
                startMonth: '',
                startday: '',
                endYear: '',
                endMonth: '',
				endDay: '',
				pageSize: 10,
				currentPage: 1,
            }
		}
	},
	methods:{
		initData(){
			let _this = this;
			_this.btnLoading = true;
			 this.$axios.post(`BMPlatServers/water/getwatercharge`, this.$qs.stringify(this.reqData)).then((res)=>{
				_this.btnLoading = false;
			    if(res.data.success) {
			        this.tableData = res.data.result.list;
			        this.pageTotal = res.data.result.count;
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
			            showClose: true,
			            duration: 1000,
					});
			    }
			})
			.catch((err)=>{
				_this.btnLoading = false;
			    console.log(err);
			})
		},
		handleCurrentChange(){
			this.initData()
		},
        goQueryPowerData() {
            let _this = this;
            if(_this.reqData.time) {
                let a = _this.reqData.time[0].split('-');
                let b = _this.reqData.time[1].split('-');
                _this.reqData.startYear = a[0];
                _this.reqData.startMonth = a[1];
                _this.reqData.startday = a[2];
                _this.reqData.endYear = b[0];
                _this.reqData.endMonth = b[1];
				_this.reqData.endDay = b[2];
				if(/^[0-9]+.?[0-9]*/.test(_this.reqData.price)) {
					let c = Number(_this.reqData.price);
					_this.reqData.price = c.toFixed(2);
					_this.initData();
				}else {
					this.$message.warning({
						message: `请输入正确的数字格式`,
						showClose: true,
						duration: 1000,
					});
				}
            }else {
                this.$message.warning({
					message: `时间区间不能为空`,
					showClose: true,
					duration: 1000,
				});
            }
        },
        // 导出数据
        goDownTable() {
			let _this = this;
            if(_this.reqData.time) {
                let a = _this.reqData.time[0].split('-');
                let b = _this.reqData.time[1].split('-');
                _this.reqData.startYear = a[0];
                _this.reqData.startMonth = a[1];
                _this.reqData.startday = a[2];
                _this.reqData.endYear = b[0];
                _this.reqData.endMonth = b[1];
				_this.reqData.endDay = b[2];
				if(/^[0-9]+.?[0-9]*/.test(_this.reqData.price)) {
					let c = Number(_this.reqData.price);
					_this.reqData.price = c.toFixed(2);
					window.location.href = `BMPlatServers/form/downloadElecChargr?type=1&startYear=${_this.reqData.startYear}
						&startMonth=${_this.reqData.startMonth}&startday=${_this.reqData.startday}&endYear=${_this.reqData.endYear}
						&endMonth=${_this.reqData.endMonth}&endDay=${_this.reqData.endDay}&price=${_this.reqData.price}
						&startTime=${_this.reqData.time[0]}&endTime=${_this.reqData.time[1]}`
				}else {
					this.$message.warning({
						message: `请输入正确的数字格式`,
						showClose: true,
						duration: 1000,
					});
				}
            }else {
                this.$message.warning({
					message: `时间区间不能为空`,
					showClose: true,
					duration: 1000,
				});
            }
        }
	},
	mounted() {
		let _this = this;
		if(_this.reqData.time) {
			let a = _this.reqData.time[0].split('-');
			let b = _this.reqData.time[1].split('-');
			_this.reqData.startYear = a[0];
			_this.reqData.startMonth = a[1];
			_this.reqData.startday = a[2];
			_this.reqData.endYear = b[0];
			_this.reqData.endMonth = b[1];
			_this.reqData.endDay = b[2];
		}
		_this.initData()
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
