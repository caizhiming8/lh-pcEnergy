<template>
    <div id="NBWaterMeter">
        <div class="NBWaterMeter">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="实时状态" v-hasTabMenu="2-4-1-1">
                    <div class="top">
                        <v-realState v-if="Index==0"></v-realState>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="历史状态" v-hasTabMenu="2-4-1-2">
                    <div class="middle"  v-if="Index==1">
                        <div class="middlePadding">
                            <v-historyState></v-historyState>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import realState from './NBWaterMeter/realState.vue';
import historyState from './NBWaterMeter/historyState.vue';
export default {
    data() {
        return{
            Index: 0
        }
    },
    methods: {
        tabClick(tab) {
            this.Index = tab.index;
        }
    },
    mounted() {
    },
    components: {
        'v-realState': realState,
        'v-historyState': historyState
    }
}
</script>

<style lang="scss">
#NBWaterMeter{
    .NBWaterMeter{
        padding: 15px;
        .top{
            width: 98%;
            margin: 0 auto;
        }
        .middle{
            // width: 98%;
            // margin: 20px auto;
        }
        .bottom{
            width: 98%;
            margin: 0 auto;
        }
        .span{
            // font-weight: 700;
            display: block;
            padding: 15px 0 15px 15px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            width: 100%;
            border-bottom: 1px solid #ddd;
        }
    }
}
</style>
