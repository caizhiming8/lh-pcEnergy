<template>
    <div id="heatSource">
        <div class="heatSource">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="运行监控">
                    <v-operationControlling v-if="Index==0"></v-operationControlling>
                </el-tab-pane>
                <el-tab-pane label="运行控制">
                    <v-controllingOperation v-if="Index==1"></v-controllingOperation>
                </el-tab-pane>
                <el-tab-pane label="能耗管理">
                    <v-energyConsumptionManagement v-if="Index==2"></v-energyConsumptionManagement>
                </el-tab-pane>
                <el-tab-pane label="热量">
                    <v-hot v-if="Index==3"></v-hot>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import operationControlling from './heatSource/operationControlling';
import controllingOperation from './heatSource/controllingOperation';
import energyConsumptionManagement from './heatSource/energyConsumptionManagement';
import hot from './heatSource/hot';
export default {
    data() {
        return{
            Index: 0
        }
    },
    methods: {
        tabClick(index) {
            this.Index = index.index;
        }
    },
    components: {
        'v-operationControlling': operationControlling,
        'v-controllingOperation': controllingOperation,
        'v-energyConsumptionManagement': energyConsumptionManagement,
        'v-hot': hot,
    }
}
</script>

<style lang="scss" scoped>
#heatSource{
    .heatSource{
        padding: 15px;
    }
}
</style>
