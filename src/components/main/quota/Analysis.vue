<template>
	<div id="Analysis">
		<div class="Analysis">
			<el-tabs type="border-card" @tab-click="Tabs" v-model="activeName">
			    <el-tab-pane label="实时总能耗" name="1">
					<v-secondOrder v-if="index==0"></v-secondOrder>
				</el-tab-pane>
			    <el-tab-pane label="历史总能耗" name="2">
					<v-secondOrderHistory v-if="index==1"></v-secondOrderHistory>
			    </el-tab-pane>
				<el-tab-pane label="历史能效对比" name="3">
					<v-unitEffect v-if="index==2"></v-unitEffect>
				</el-tab-pane>
				<el-tab-pane label="房间能耗分析" name="4">
					<v-secondOrderRoom v-if="index==3"></v-secondOrderRoom>
				</el-tab-pane>
				<!-- <el-tab-pane label="自管房间能效" name="5">
					<v-selfRoomEffect v-if="index==4"></v-selfRoomEffect>
				</el-tab-pane> -->
			</el-tabs>
		</div>
	</div>
</template>
<script>
import secondOrder from './Analysis/secondOrder.vue'
import secondOrderHistory from './secondOrderHistory.vue'
import secondOrderRoom from './secondOrderRoom.vue'
import unitEffect from './unitEffect.vue'
import selfRoomEffect from './Analysis/selfRoomEffect.vue'
export default {
    data() {
        return{
            index: 0,
			activeName: '1'
        }
    },
    methods: {
        Tabs(items) {
            this.index = items.index;
        }
    },
    mounted() {

    },
	computed: {

	},
    components: {
		'v-secondOrder': secondOrder,
        'v-secondOrderHistory': secondOrderHistory,
		'v-secondOrderRoom': secondOrderRoom,
		'v-unitEffect': unitEffect,
		'v-selfRoomEffect': selfRoomEffect
    },
	watch:{
		$route(to,from) {
			this.activeName = '1'
			this.index = 0
		}
	}
}
</script>
<style lang="scss" scoped>
#Analysis{
    .Analysis{
        .el-tabs{
            width: 98%;
            margin: 20px auto 20px;
        }
    }
}
</style>
