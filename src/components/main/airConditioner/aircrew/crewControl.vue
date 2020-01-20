<template>
    <div id="crewControl">
        <div class="crewControl">
            <ul>
                <li v-for="(item, index) in List" @click="handleClick(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
            </ul>
            <div v-if="currentIndex==0">
                <v-deviceControl></v-deviceControl>
            </div>
            <div v-if="currentIndex==1">
                <v-record></v-record>
            </div>
        </div>
    </div>
</template>

<script>
import deviceControl from './deviceControl';
import record from './record';
export default {
    data() {
        return{
            activeName: '1',
            Index: 1,
            List: [{name: '设备控制'}, {name: '操作记录'}],
            currentIndex: 0
        }
    },
    methods:{
        handleClick(ids) {
            this.currentIndex = ids;
        }
    },
    components: {
        'v-deviceControl': deviceControl,
        'v-record': record
    }
}
</script>

<style lang="scss" scoped>
#crewControl{
    .crewControl{
        ul{
            overflow: hidden;
            padding-bottom: 30px;
            padding-top: 10px;
            li{
                float: left;
                padding: 5px 15px;
                border: 1px solid #409eff;
                border-radius: 3px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                -ms-border-radius: 3px;
                -o-border-radius: 3px;
                color: #409eff;
                margin: 0 10px;
                cursor: pointer;
                &.active{
                    background: #409EFF;
                    color: #fff;
                    font-weight: normal;
                }
            }
            li:first-child{
                margin-left: 0;
            }
        }
    }
}
</style>
