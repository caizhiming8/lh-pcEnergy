<template>
    <div id="tenant">
        <div class="tenant">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="当前商户" name="1" v-hasTabMenu="8-3-1">
                    <router-view></router-view>
                </el-tab-pane>
                <el-tab-pane label="历史商户" name="2" v-hasTabMenu="8-3-2">
                    <v-tenantHistory v-if="currentActiveName==2"></v-tenantHistory>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import tenantReal from './tenant/tenantReal';
import tenantHistory from './tenant/tenantHistory';
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
    mounted() {

    },
    components: {
        'v-tenantReal': tenantReal,
        'v-tenantHistory': tenantHistory
    }
}
</script>

<style lang="scss" scoped>
#tenant{
    .tenant{
        padding: 15px;
    }
}
</style>
