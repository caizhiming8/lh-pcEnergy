<template>
	<div id="controlhistory">
		<div class="controlhistory">
			<div class="history-search">
				<b>设备列表</b>
				<el-select v-model="deviceData" placeholder="请选择" clearable class="selects">
					<el-option v-for="(item, index) in devices" :key="index" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<b style="margin-left: 20px;">查询时间</b>
				<el-date-picker  v-model="time" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				<el-button @click="search" size="small" style="margin-left: 40px;" type="primary" icon="el-icon-search">查询</el-button>
			</div>
			<div class="history-table">
				<el-table :data="tableData" style="width: 100%; margin-top: 20px;" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column prop="deviceName" label="设备名称" fixed align='center' ></el-table-column>
					<el-table-column prop="dataName" label="操作" align='center' ></el-table-column>
					<el-table-column prop="deviceType" label="设备类型" align='center' ></el-table-column>
					<el-table-column prop="dataType" label="数据类型" align='center' ></el-table-column>
					<el-table-column prop="dataValue" label="数据值" align='center' ></el-table-column>
					<el-table-column prop="startTime" label="开始时间" :show-overflow-tooltip="true" align='center' ></el-table-column>
					<el-table-column prop="endTime" label="结束时间" :show-overflow-tooltip="true" align='center' ></el-table-column>
					<el-table-column prop="operatorName" label="操作人" :show-overflow-tooltip="true" align='center' ></el-table-column>
					<el-table-column prop="success" label="是否成功" :show-overflow-tooltip="true" align='center' ></el-table-column>
				</el-table>
			</div>
			<div class="pagination">
			    <el-pagination background @current-change="handleCurrentChange" :current-page.sync='currentPage' :page-size='pageSize' layout="total, prev, pager, next"  :total="pageTotal"></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				devices:[],
				buildingId:"",
				dataType:"",
				deviceId:"",
				time:[],
				startTime:"",
				endTime:"",
				deviceData:"",
				tableData:[],
				currentPage:1,
				pageSize:10,
				pageTotal:0,
				subsystemId: '',
				systemId: ''
			}
		},
		methods:{
			handleCurrentChange(val) {
				this.initData(val);
			},
			initDevice(){
				let data={
					buildingId:this.buildingId,
					systemId: this.systemId,
					subsystemId: this.subsystemId
				}
				this.$axios.post(`BMPlatServers/hvacheat/queryControlHeatDevice`, this.$qs.stringify(data)).then((res)=>{
				    if(res.data.success) {
						this.devices = [];
						if(res.data.result.list&&res.data.result.list.length){
							res.data.result.list.forEach((item)=>{
								this.devices.push({
									label:item.dataName,
									value:item.deviceId+','+item.dataType
								})
							})
						}else {
							this.$message.warning({
		                        message: '暂无数据',
		                        showClose: true,
								duration: 1000
		                    })
						}
				    }else{

				    }
				});
			},
			initData(currentPage){
				let data={
					buildingId:this.buildingId,
					deviceId:this.deviceId,
					dataType:this.dataType,
					startTime:this.startTime,
					endTime:this.endTime,
					currentPage,
					pageSize:this.pageSize,
					systemId: this.systemId,
					subsystemId: this.subsystemId
				}
				this.$axios.post(`BMPlatServers/hvacheat/queryCityControlHistory`, this.$qs.stringify(data)).then((res)=>{
					// console.log(res);
				    if(res.data.success) {
						this.tableData = [];
						this.pageTotal = 0;
						if(res.data.result.list&&res.data.result.list.length){
							this.tableData = res.data.result.list;
							this.pageTotal = res.data.result.num;
						}else {
							this.$message.warning({
		                        message: '暂无数据',
		                        showClose: true,
								duration: 1000
		                    })
						}
				    }else{

				    }
				});
			},
			search() {
				this.initData(1);
			}
		},
		mounted(){
			var item = window.location.href.split("=")[1];
			this.buildingId = item.split(",")[2];
			this.systemId = item.split(',')[0];
			this.subsystemId = item.split(',')[1];
			this.initDevice();
			this.initData(1);
		},
		watch:{
			$route(item){
				var item = item.fullPath.split("=")[1];
				this.buildingId = item.split(",")[2];
				this.initDevice();
				this.initData(1);
			},
			deviceData(item){
				if(item) {
					this.deviceId = item.split(",")[0];
					this.dataType = item.split(",")[1];
				}else{
					this.deviceId = '';
					this.dataType = '';
				}
			},
			time(item){
				if(item == null) {
					this.startTime = '';
					this.endTime = '';
				}else{
					this.startTime = item[0];
					this.endTime = item[1];
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
#controlhistory{
	.controlhistory{
		.pagination{
			text-align: right;
			margin: 10px;
		}
	}
}
</style>
