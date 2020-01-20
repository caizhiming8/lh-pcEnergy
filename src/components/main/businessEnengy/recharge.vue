<template>
    <div id="recharge">
        <div class="recharge">
            <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="充值" name="1" v-hasTabMenu="8-2-1">
                    <v-rechargeOperation v-if="currentActiveName==1"></v-rechargeOperation>
                </el-tab-pane>
                <el-tab-pane label="充值记录" name="2" v-hasTabMenu="8-2-2">
                    <v-rechargeRecord v-if="currentActiveName==2"></v-rechargeRecord>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

import rechargeOperation from './recharge/rechargeOperation';
import rechargeRecord from './recharge/rechargeRecord';

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
        'v-rechargeOperation': rechargeOperation,
        'v-rechargeRecord': rechargeRecord
    }
}
</script>

<style lang="scss" scoped>
#recharge{
    padding: 15px;
}
</style>
