<template>
    <div id="commonTree">
        <div class="commonTree">
            <el-tree :data="datas" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick"></el-tree>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return{
            datas: [],
            defaultProps: {
               children: 'children',
               label: 'roomName'
           },
           buildingId: ''
        }
    },
    methods: {
        initTree() {
            let data = {
                buildingId: this.buildingId
            };
            this.$axios.post(`BMPlatServers/common/queryElecRooms`, this.$qs.stringify(data)).then((res)=>{
                if(res.data.success) {
                    this.datas = res.data.result;
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
                }
            })
        }
        ,
        handleNodeClick(id) {
            this.$emit('sonData', id);
        }
    },
    mounted() {
        this.buildingId = window.location.href.split('=')[1];
        this.initTree();
    },
    watch: {
        $route(to, form) {
            this.buildingId = to.fullPath.split('=')[1];
            this.initTree();
        }
    }
}
</script>

<style lang="scss">
#commonTree{
    .commonTree{
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
