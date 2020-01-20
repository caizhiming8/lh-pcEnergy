<template>
    <div id="controllingOperation">
        <div class="controllingOperation">
            <el-tabs @tab-click="tabClicks">
                <el-tab-pane label="设备控制">
                    <div class="placeEcharts" v-if="Index==0">
                        <v-controllingOperationDevice></v-controllingOperationDevice>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="运行记录">
                    <div v-if="Index==1" class="p">
                        <v-controllingOperationRecord></v-controllingOperationRecord>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import controllingOperationDevice from './controllingOperation/controllingOperationDevice';
import controllingOperationRecord from './controllingOperation/controllingOperationRecord';
export default {
    data() {
        return{
            Index: 0
        }
    },
    methods: {
        init() {

        },
        tabClicks(index) {
            this.Index = index.index;
        }
    },
    mounted() {

    },
    components: {
        'v-controllingOperationDevice': controllingOperationDevice,
        'v-controllingOperationRecord': controllingOperationRecord
    }
}
</script>

<style lang="scss" scoped>
#controllingOperation{
    .controllingOperation{

    }
}
</style>
