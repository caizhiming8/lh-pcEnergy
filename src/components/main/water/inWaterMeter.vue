<template>
    <div id="inWaterMeter">
        <div class="inWaterMeter">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="采集器状态" v-hasTabMenu="2-4-2-1">
                    <div class="top">
                        <v-collectorWaterState v-if="Index==0"></v-collectorWaterState>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="水表状态" v-hasTabMenu="2-4-2-2">
                    <div class="middle"  v-if="Index==1">
                        <div class="middlePadding">
                            <v-waterState></v-waterState>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import collectorWaterState from './inWaterMeter/collectorWaterState.vue';
import waterState from './inWaterMeter/waterState.vue';
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
        'v-collectorWaterState': collectorWaterState,
        'v-waterState': waterState
    }
}
</script>

<style lang="scss">
#inWaterMeter{
    .inWaterMeter{
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
