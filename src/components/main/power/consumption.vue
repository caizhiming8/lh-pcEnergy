<template>
    <div id="consumption">
        <div class="consumption">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="医院总能效" v-hasTabMenu="1-1-2-1">
                    <div v-if="Index==0">
                        <v-consumptionTop></v-consumptionTop>

                        <!-- <div class="consumption-bottom">
                            <v-consumptionSon></v-consumptionSon>
                        </div> -->
                    </div>
                </el-tab-pane>
                <el-tab-pane label="楼宇能效比对" v-hasTabMenu="1-1-2-2">
                    <v-buildingEfficiency v-if="Index==1"></v-buildingEfficiency>
                </el-tab-pane>
				<el-tab-pane label="用电金额账单" v-hasTabMenu="1-1-2-3">
				    <v-TimeUnitPriceSetting v-if="Index==2"></v-TimeUnitPriceSetting>
				</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import consumptionSon from './consumption/consumptionSon.vue';
import consumptionTop from './consumption/consumptionTop.vue';
import buildingEfficiency from './consumption/buildingEfficiency.vue';
import TimeUnitPriceSetting from './consumption/TimeUnitPriceSetting.vue';
export default {
    data() {
        return{
            Index: 0
        }
    },
    methods: {
        tabClick(tab) {
            this.Index = tab.index;
        },
        init() {

        },
        search() {

        }
    },
    mounted() {

    },
    components: {
        'v-consumptionSon': consumptionSon,
        'v-consumptionTop': consumptionTop,
        'v-buildingEfficiency': buildingEfficiency,
		'v-TimeUnitPriceSetting': TimeUnitPriceSetting
    }
}
</script>

<style lang="scss" scoped>
#consumption{
    .consumption{
        padding: 15px;
    }
}
</style>
