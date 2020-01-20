<template>
	<div id="application">
		<div class="application">
			<ul class="tabUl">
				<li v-for="(item, index) in List" @click="handleChange(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
			</ul>
			<v-unitQuotaApply v-if="currentIndex==0"></v-unitQuotaApply>
			<v-roomQuotaApply v-if="currentIndex==1"></v-roomQuotaApply>
		</div>
	</div>
</template>

<script>
import unitQuotaApply from './application/unitQuotaApply'
import roomQuotaApply from './application/roomQuotaApply'
export default{
	data(){
		return{
			index: 0,
			activeName: '1',
			List: [{name: '二级单位定额申请'}, {name: '房间定额申请'}],
			currentIndex: 0
		}
	},
	methods:{
		tabs(items) {
		    this.index = items.index;
		},
		handleChange(ins) {
			this.currentIndex = ins;
		}
	},
	mounted() {

	},
	components: {
		'v-unitQuotaApply': unitQuotaApply,
		'v-roomQuotaApply': roomQuotaApply,
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
	#application{
		.application{
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
	                padding: 6px 15px;
	            }
	            li.active{
	                background: #409eff;
	                color: #fff;
	            }
				li:first-child{
					margin-left: 0;
				}
	        }
		}
	}
</style>
