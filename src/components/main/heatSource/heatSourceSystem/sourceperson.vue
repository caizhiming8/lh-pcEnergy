<template>
	<div id ="sourceperson">
		<div class="sourceperson">
			<div class="person-search">
				<span>性别</span>
				<el-select v-model="sex" placeholder="请选择" clearable filterable>
					<el-option v-for="(item, index) in sexs" :key="index" :label='item.label' :value="item.value"></el-option>
				</el-select>
				<span style="margin-left: 20px">人员名称</span>
				<el-input v-model="personName"></el-input>
				<el-button type="primary" size="small" icon="el-icon-search" style="margin-left: 40px;"  @click="search">搜索</el-button>
			</div>
			<div class="person-table">
				<el-table :data="tableData" style="margin-top: 20px" :row-style="{height:0}" :cell-style="{padding:'8px 0'}" :header-cell-style="{background:'#F5F7FA',color:'#606266', height: '0px', padding: '15px 0'}">
					<el-table-column prop="name" label="人员名称" fixed align='center' ></el-table-column>
					<el-table-column prop="sex" label="性别" align='center' ></el-table-column>
					<el-table-column prop="age" label="年龄" align='center' ></el-table-column>
					<el-table-column prop="phone" label="电话号码" align='center' ></el-table-column>
					<el-table-column prop="responsibility" label="职务" :show-overflow-tooltip="true" align='center' ></el-table-column>
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
			return{
				personName:"",
				sex:"",
				sexs:[{label:"男",value:1},{label:"女",value:2}],
				currentPage: 1,
				pageSize: 10,
				tableData:[],
				pageTotal: 0
			}
		},
		methods:{
			handleCurrentChange(val) {
				this.initData(val);
			},
			search() {
				this.initData(1);
			},
			initData(currentPage){
				let param = {
					sex:this.sex,
					personName:this.personName,
				    pageSize: this.pageSize,
				    currentPage: currentPage
				};
				this.$axios.post(`BMPlatServers/hvacheat/queryCityPerson`,this.$qs.stringify(param)).then((response) => {
					// console.log(response);
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
			}
		},
		mounted(){
			this.initData(1);
		},
		watch:{

		}
	}
</script>

<style lang="scss" scoped>
	#sourceperson{
	    .sourceperson{
	        .person-search{
	            padding: 25px 0 10px 0px;
	            color: #909393;
	            .el-input{
	                width: 200px;
	            }
	        }
	        .person-table{
				margin-top: 10px;
	        }
	        .pagination{
	            text-align: right;
	            padding: 20px;
	        }
	    }
	}
</style>
