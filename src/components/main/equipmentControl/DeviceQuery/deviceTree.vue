<template>
	<div id="deviceTree">
		<div class="deviceTree">
			<el-tree :data="data" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick">
				<span class="span-ellipsis" slot-scope="{ node, data }">
					<span :title="node.label"><img src="../../../../../static/img/fangjianguankong.png">{{ node.label }}</span>
				</span>
			</el-tree>
		</div>
	</div>
</template>
<script>
export default {
	data(){
		return{
			data: [],
			 defaultProps: {
			  children: 'children',
			  label: 'name'
			},
			treeClick: true
		}
	},
	methods:{
		/* 系统选择 */
		system(){
			this.$axios.post(`BMPlatServers/common/querySystemTree`).then((res) =>{
				if(res.data.success){
					console.log(res)
					if(res.data.result && res.data.result.length) {
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
		/* handleNodeExpand(data) {
			console.log(data);
		} */
	},
	mounted() {
	   this.system()
	},
	watch:{

	}
}
</script>
<style lang="scss" scoped>
#deviceTree{
	.deviceTree{
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
