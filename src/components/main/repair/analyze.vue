<template>
    <div id="analyze">
        <div class="analyze">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="时间段分析" name="1" v-hasTabMenu="7-3-1">
                    <v-TimeQuantum v-if="currentActiveName==1"></v-TimeQuantum>
                </el-tab-pane>
                <el-tab-pane label="维修项目分析" name="2" v-hasTabMenu="7-3-2">
                    <v-MaintenanceTtems v-if="currentActiveName==2"></v-MaintenanceTtems>
                </el-tab-pane>
                <el-tab-pane label="楼宇统计分析" name="3" v-hasTabMenu="7-3-3">
                    <v-buildingSystem v-if="currentActiveName==3"></v-buildingSystem>
                </el-tab-pane>
                <el-tab-pane label="维修人员分析" name="4" v-hasTabMenu="7-3-4">
                    <v-maintainPerson v-if="currentActiveName==4"></v-maintainPerson>
                </el-tab-pane>
                <el-tab-pane label="维修费用分析" name="5" v-hasTabMenu="7-3-5">
                    <v-Money v-if="currentActiveName==5"></v-Money>
                </el-tab-pane>
                <el-tab-pane label="评价统计分析" name="6">
                    <v-evaluate v-if="currentActiveName==6"></v-evaluate>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import TimeQuantum from './analyze/TimeQuantum';
import MaintenanceTtems from './analyze/MaintenanceTtems';
import buildingSystem from './analyze/buildingSystem';
import maintainPerson from './analyze/maintainPerson';
import Money from './analyze/Money';
import evaluate from './analyze/evaluate';
export default {
    data() {
        return{
            activeName: '1',
            currentActiveName: 1
        }
    },
    methods: {
        handleClick(index) {
            this.currentActiveName = index.name;
        }
    },
    components: {
        'v-TimeQuantum': TimeQuantum,
        'v-MaintenanceTtems': MaintenanceTtems,
        'v-buildingSystem': buildingSystem,
        'v-maintainPerson': maintainPerson,
        'v-Money': Money,
        'v-evaluate': evaluate
    }
}
</script>

<style lang="scss" scoped>
#analyze{
    padding: 15px;
    .analyze{

    }
}
</style>
