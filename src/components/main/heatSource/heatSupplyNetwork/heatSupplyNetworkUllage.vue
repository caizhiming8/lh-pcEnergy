<template>
    <div id="heatSupplyNetworkUllage">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="实时漏损数据" name="1" v-hasTabMenu="3-5-2-1">
                <v-heatSupplyNetworkUllageReal v-if="Index==0"></v-heatSupplyNetworkUllageReal>
            </el-tab-pane>
            <el-tab-pane label="历史漏损数据" name="2" v-hasTabMenu="3-5-2-2">
                <v-heatSupplyNetworkUllageHistory v-if="Index==1"></v-heatSupplyNetworkUllageHistory>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import heatSupplyNetworkUllageReal from './heatSupplyNetworkUllage/heatSupplyNetworkUllageReal.vue';
import heatSupplyNetworkUllageHistory from './heatSupplyNetworkUllage/heatSupplyNetworkUllageHistory.vue';
export default {
    data() {
        return{
            Index: 0,
            activeName: '1'
        }
    },
    methods: {
        handleClick(index) {
            this.Index = index.index;
        }
    },
    components: {
        'v-heatSupplyNetworkUllageReal': heatSupplyNetworkUllageReal,
        'v-heatSupplyNetworkUllageHistory': heatSupplyNetworkUllageHistory
    },
    mounted() {

    },
    watch: {

    }
}
</script>

<style lang="scss" scoped>
#heatSupplyNetworkUllage{
    padding: 15px;
}
</style>
