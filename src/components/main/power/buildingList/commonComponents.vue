<template>
    <div id="commonComponents">
		<el-tree :data="data" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick"></el-tree>
    </div>
</template>

<script>
export default {
	data() {
		return{
			data: [],
            subSystemId: '',
			defaultProps: {
			    children: 'children',
			    label: 'label'
			}
		}
	},
	methods: {
		handleNodeClick(ids) {
			this.$emit('getSonData', ids);
		},
		initData() {
            let param = {
                subsystemId: this.subSystemId
            };
			this.$axios.post(`BMPlatServers/common/querySubsystemBuildings`, this.$qs.stringify(param)).then((res)=>{
				if(res.data.success){
                    if(res.data.result && res.data.result.length) {
                        res.data.result.forEach((item)=>{
                            item.children = '';
                        })
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
					});
				}
			})
		}
	},
	mounted() {
        this.subSystemId = window.location.href.split('=')[1];
		this.initData()
	},
	watch: {
        $route(to, from) {
            this.subSystemId = to.fullPath.split('=')[1];
            this.initData();
        }
	}
}
</script>

<style lang="scss">
#commonComponents{
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
</style>
