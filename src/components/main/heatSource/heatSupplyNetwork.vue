<template>
    <div id="heatSupplyNetwork">
        <el-tabs type="border-card" @tab-click="tabClick">
            <el-tab-pane label="运行监控">
                <v-heatSupplyNetworkControl v-if="Index==0"></v-heatSupplyNetworkControl>
            </el-tab-pane>
            <el-tab-pane label="漏损监控">
                <v-heatSupplyNetworkUllage v-if="Index==1"></v-heatSupplyNetworkUllage>
            </el-tab-pane>
            <el-tab-pane label="管网平衡">
                <v-heatSupplyNetworkBalance v-if="Index==2"></v-heatSupplyNetworkBalance>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import heatSupplyNetworkControl from './heatSupplyNetwork/heatSupplyNetworkControl.vue';
import heatSupplyNetworkUllage from './heatSupplyNetwork/heatSupplyNetworkUllage.vue';
import heatSupplyNetworkBalance from './heatSupplyNetwork/heatSupplyNetworkBalance.vue';
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
        'v-heatSupplyNetworkControl': heatSupplyNetworkControl,
        'v-heatSupplyNetworkUllage': heatSupplyNetworkUllage,
        'v-heatSupplyNetworkBalance': heatSupplyNetworkBalance
    }
}
</script>

<style lang="scss" scoped>
#heatSupplyNetwork{
    padding: 15px;
}
</style>
