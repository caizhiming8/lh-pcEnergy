<template>
    <div id="nightFlow">
        <div class="nightFlow">
            <el-tabs type="border-card" @tab-click="Tabs">
                <el-tab-pane label="设备间比" v-hasTabMenu="2-5-2-1">
                    <v-nightFlowDivice v-if="index==0"></v-nightFlowDivice>
                </el-tab-pane>
                <el-tab-pane label="夜间小流量同设备之比" v-hasTabMenu="2-5-2-2">
                    <v-nightFlowTime v-if="index==1"></v-nightFlowTime>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import nightFlowDivice from './nightFlow/nightFlowDivice.vue';
import nightFlowTime from './nightFlow/nightFlowTime.vue';
export default {
    data() {
        return{
            index: 0
        }
    },
    components: {
        'v-nightFlowDivice': nightFlowDivice,
        'v-nightFlowTime': nightFlowTime
    },
    methods: {
        Tabs(items) {
            this.index = items.index;
        }
    },
    mounted() {

    }
}
</script>

<style lang="scss" scoped>
#nightFlow{
    .nightFlow{
        padding: 20px 15px;
    }
}
</style>
