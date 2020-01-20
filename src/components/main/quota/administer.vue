<template>
	<div id="administer">
		<div class="administer">
			<ul class="tabUl">
				<li v-for="(item, index) in List" @click="handleChange(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
			</ul>
			<v-grossQuotaDeploy v-if="currentIndex==0"></v-grossQuotaDeploy>
			<v-roomQuota v-if="currentIndex==1"></v-roomQuota>
			<v-publicRation v-if="currentIndex==2"></v-publicRation>
		</div>
	</div>
</template>
<script>
import grossQuotaDeploy from './administer/grossQuotaDeploy.vue'
import roomQuota from './administer/roomQuota.vue'
import publicRation from'./administer/publicRation.vue'
export default{
	data(){
		return{
			index: 0,
			activeName: '1',
			List: [{name: '定额能耗配置'}, {name: '房间能耗配置'}, {name: '公共能耗配置'}],
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
		'v-grossQuotaDeploy': grossQuotaDeploy,
		'v-roomQuota': roomQuota,
		'v-publicRation':publicRation
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
#administer{
	.administer{
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
