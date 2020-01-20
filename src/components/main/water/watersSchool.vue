<template>
    <div id="watersSchool">
        <div class="linePadding">
            <el-tabs type="border-card" @tab-click="tabClick">
                <el-tab-pane label="实时能耗" v-hasTabMenu="2-2-1-1">
                    <div class="top">
                        <v-watersSchoolTop v-if="Index==0"></v-watersSchoolTop>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="历史能耗" v-hasTabMenu="2-2-1-2">
                    <div class="middle"  v-if="Index==1">
                        <div class="middlePadding">
                            <v-watersSchoolmiddle></v-watersSchoolmiddle>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="能耗分布" v-hasTabMenu="2-2-1-3">
                    <div class="bottom" v-if="Index==2">
                        <v-watersSchoolTopBottom></v-watersSchoolTopBottom>
                    </div>
                </el-tab-pane>
				<el-tab-pane label="历史能耗同比" v-hasTabMenu="2-2-1-4">
				    <div class="bottom" v-if="Index==3">
				        <v-energyEfficiencyRatio></v-energyEfficiencyRatio>
				    </div>
				</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import watersSchoolTop from './watersSchool/watersSchoolTop.vue';
import watersSchoolmiddle from './watersSchool/watersSchoolmiddle.vue';
import watersSchoolTopBottom from './watersSchool/watersSchoolTopBottom.vue';
import energyEfficiencyRatio from './watersSchool/energyEfficiencyRatio.vue';

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
        'v-watersSchoolTop': watersSchoolTop,
        'v-watersSchoolmiddle': watersSchoolmiddle,
        'v-watersSchoolTopBottom': watersSchoolTopBottom,
		'v-energyEfficiencyRatio': energyEfficiencyRatio
    }
}
</script>

<style lang="scss">
#watersSchool{
    .linePadding{
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
