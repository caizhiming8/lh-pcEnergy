<template>
	<div id="devciehistory">
		<div class="devicehistory">
			<div class="history-search">
				<b>设备列表</b>
				<el-select v-model="deviceData" placeholder="请选择" clearable class="selects">
					<el-option v-for="(item, index) in devices" :key="index" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<b style="margin-left: 20px;">查询时间</b>
				<el-date-picker  v-model="time" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
				<el-button @click="search" style="margin-left: 40px;" type="primary" size="small" icon="el-icon-search">查询</el-button>
			</div>
			<div class="history-table">
				<el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '5px'}">
					<el-table-column prop="name" label="人员名称" sortable fixed align='center' ></el-table-column>
					<el-table-column prop="sex" label="性别" sortable align='center' ></el-table-column>
					<el-table-column prop="age" label="年龄" sortable align='center' ></el-table-column>
					<el-table-column prop="phone" label="电话号码" sortable align='center' ></el-table-column>
					<el-table-column prop="responsibility" label="职务" :show-overflow-tooltip="true" sortable align='center' ></el-table-column>
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
				startTime:"",
				endTime:"",
				deviceData:""
			}
		},
		methods:{
			initDevice(){
				let param = {
					buildingId:this.buildingId
				}
				this.$axios.post(`BMPlatServers/hvacheat/queryHeatDevice`, this.$qs.stringify(data)).then((res)=>{
				    if(res.data.success) {
						if(res.data.result.list&&res.data.result.list.length){
							console.log(res.data.result);
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
			}
		},
		mounted(){
			var item = window.location.href.split("=")[1];
			this.buildingId = item.split(",")[2];
			initDevice();
		}
	}
</script>

<style>
</style>
