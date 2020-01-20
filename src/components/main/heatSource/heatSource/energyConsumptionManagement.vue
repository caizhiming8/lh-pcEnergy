<template>
    <div id="energyConsumptionManagement">
        <el-tabs>
            <el-tab-pane label="实时数据">
                <div class="placeEcharts">
                    <v-energyConsumptionManagementReal></v-energyConsumptionManagementReal>
                </div>
            </el-tab-pane>
            <el-tab-pane label="历史数据">
                <div class="p">
                    <v-energyConsumptionManagementHistory></v-energyConsumptionManagementHistory>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import energyConsumptionManagementReal from './energyConsumptionManagement/energyConsumptionManagementReal';
import energyConsumptionManagementHistory from './energyConsumptionManagement/energyConsumptionManagementHistory';
export default {
    data() {
        return{

        }
    },
    methods: {
     
    },
    components: {
        'v-energyConsumptionManagementReal': energyConsumptionManagementReal,
        'v-energyConsumptionManagementHistory': energyConsumptionManagementHistory,
    }
}
</script>

<style lang="scss" scoped>
</style>
