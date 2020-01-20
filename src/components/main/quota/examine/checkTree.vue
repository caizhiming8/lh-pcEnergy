<template>
	<div id="checkTree">
		<div class="checkTree">
			<el-tree :data="data" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick">
				<span class="span-ellipsis" slot-scope="{ node, data }">
					<span :title="node.label"><img src="../../../../../static/img/fangjianguankong.png">{{ node.label }}</span>
				</span>
			</el-tree>
		</div>
	</div>
</template>

<script>
export default{
	data(){
		return{
			data: [],
			 defaultProps: {
			  children: 'children',
			  label: 'label'
			}
		}
	},
	methods:{
		/* 系统选择 */
		system(){
			let data = {
				depart:this.school
			}
			console.log(data)
			this.$axios.post(`BMPlatServers/common/queryzgdepartrooms`,this.$qs.stringify(data)).then((res) =>{
				if(res.data.success){
					if(res.data.result && res.data.result.length) {
						console.log(res)
					    this.data = res.data.result;
					}else{
					    this.data = []
					    this.$message.warning({
							message: '您选择的子系统没有值',
							showClose: true,
							duration: 1000,
						});
					}
				}else{
					this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					})
				}
			});
		},
		handleNodeClick(data) {
			this.$emit('sonData', data);
		},
	},
	mounted() {
		this.school =  window.location.href.split('=')[1];
		this.system()
	},
	watch:{

	}
}
</script>

<style lang="scss" scoped>
#checkTree{
	.checkTree{
		.el-tree-node:focus > .el-tree-node__content {
			background-color: #F0F7FF !important;
			font-weight: 700;
			color: #16A05D;
		}
		.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
			font-weight: 700;
			color: #16A05D;
		}
	}
}
</style>
