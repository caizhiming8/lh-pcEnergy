<template>
    <div id="MaintenancePersonnelSon">
        <div class="MaintenancePersonnelSon">
            <!-- 删除 -->
            <el-dialog title="提示" :visible.sync="dialogVisibledelete"  width="30%">
              <span>确定要删除吗？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibledelete = false" size="small">取 消</el-button>
                <el-button type="primary" @click="deleteSure" size="small">确 定</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default{
    props: ['giveSonData'],
    data() {
        return{
            dialogVisibledelete: false
        }
    },
    methods:{

    },
    mounted() {

    },
    watch: {
        giveSonData(oldData) {
            console.log(oldData);
        }
    }
}
</script>

<style lang="scss" scoped>
#MaintenancePersonnelSon{
    .MaintenancePersonnelSon{

    }

}
</style>
