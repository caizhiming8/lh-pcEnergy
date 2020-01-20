<template>
    <div id="buldingRoomSon">
        <div class="buldingRoomSon">
            <el-dialog title="空调控制" :visible.sync="dialogVisible" width="50%">
                <span>这是一段信息</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                    <el-button type="primary" @click="makeSure" size="mini">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    props: ['giveSonData'],
    data() {
        return{
            dialogVisible: false
        }
    },
    methods: {
        makeSure() {

        }
    },
    mounted() {

    },
    watch: {
        giveSonData(item) {
            this.dialogVisible = true;
        }
    }
}
</script>

<style lang="scss" scoped>
#buldingRoomSon{
    .buldingRoomSon{
        .el-dialog__header{
            border-bottom: 1px solid #ddd;
        }
    }
}
</style>
