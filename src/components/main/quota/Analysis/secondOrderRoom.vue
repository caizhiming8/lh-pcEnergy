<template>
	<div id="secondOrderRoom">
		<div class="secondOrderRoom">
			<div class="secondOrderRoomTree">
				<v-energyTree @sonData="sonDatas"></v-energyTree>
			</div>
			secondOrderRoom
		</div>
	</div>
</template>
<script>
import energyTree from './energyTree.vue'
export default {
	data() {
		return {

		}
	},
	methods:{
		/* 树传值 */
		sonDatas(datas){
			console.log("接收数的参数")
			console.log(datas)
		},
		/* 搜索 */
		search(){

		}
	},
	mounted() {

	},
	watch:{

	},
	components: {
	    'v-energyTree': energyTree
	}
}
</script>
<style  lang="scss" scoped>
	.secondOrderRoomTree{
		float: left;
		width: 18%;
		height: 800px;
		overflow: auto;
		padding-right: 10px;
		box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		-o-box-sizing: border-box;
		border-right: 1px solid #ddd;
		&::-webkit-scrollbar{
		    width: 1px;
		}
	}
	.searchType{
		margin-left: 20px;
	}
	.Time-search{
		margin-left: 20px;
	}
	.btn{
		margin-left: 20px;
	}
</style>
