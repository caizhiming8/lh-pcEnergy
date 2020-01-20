<template>
	<div id="unitEffect">
		<div class="unitEffect">
			<div class="tabs">
				<ul class="tabUl">
					<li v-for="(item, index) in List" @click="handleChangeColor(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
				</ul>
				<div v-if="currentIndex==0">
					<v-historicalContrast></v-historicalContrast>
				</div>
				<div v-if="currentIndex==1">
					<v-historicalCycleContrast></v-historicalCycleContrast>
				</div>
				<div v-if="currentIndex==2">
					<v-roomEffectContrast></v-roomEffectContrast>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import effectContrast from './unitEffect/effectContrast'
import periodicContrast from './unitEffect/periodicContrast'
import historicalContrast from './unitEffect/historicalContrast'
import historicalCycleContrast from './unitEffect/historicalCycleContrast'
import roomEffectContrast from './unitEffect/roomEffectContrast'
export default{
	data(){
		return{
			Index: 0,
			activeName:'1',
			List: [{name: '历史能效'}, {name: '周期历史能效'}, {name: '自管房间Top能效'}],
			currentIndex: 0
		}
	},
	methods:{
		 tabClick(items) {
		    this.Index = items.index;
		},
		handleChangeColor(ins) {
			this.currentIndex = ins;
		}
	},
	mounted() {

	},
	components:{
		'v-effectContrast': effectContrast,
		'v-periodicContrast': periodicContrast,
		'v-historicalContrast': historicalContrast,
		'v-historicalCycleContrast': historicalCycleContrast,
		'v-roomEffectContrast': roomEffectContrast,
	},
	watch:{
		$route(to,from) {
			this.activeName = '1'
			this.Index = 0
		}
	}
}
</script>

<style lang="scss" scoped>
	#unitEffect{
		overflow: hidden;
		.unitEffect{
			.el-tabs{
			    width: 98%;
			    margin: 20px auto 20px;
			}
			.tabUl{
	            overflow: hidden;
	            padding-bottom: 20px;
				padding-top: 20px;
	            li{
	                float: left;
	                margin: 0 20px;
	                cursor: pointer;
	                border: 1px solid #409eff;
	                -webkit-border-radius: 3px;
	                -moz-border-radius: 3px;
	                border-radius: 3px;
	                color: #409eff;
	                font-size: 12px;
	                padding: 7px 15px;
	            }
	            li.active{
	                background: #409eff;
	                color: #fff;
	            }
	        }
		}
	}
</style>
