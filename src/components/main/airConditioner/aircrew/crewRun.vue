<template>
    <div id="crewRun">
        <div class="crewRun">
            <ul>
                <li v-for="(item, index) in List" @click="handleClick(index)" :class="currentIndex==index?'active':''">{{item.name}}</li>
            </ul>
            <div v-if="currentIndex==0">
                <v-crewRunReal></v-crewRunReal>
            </div>
            <div v-if="currentIndex==1">
                <v-crewRunHistory></v-crewRunHistory>
            </div>
        </div>
    </div>
</template>

<script>
import crewRunReal from './crewRunReal';
import crewRunHistory from './crewRunHistory';
export default {
    data() {
        return{
            activeName: '1',
            Index: 1,
            List: [{name: '实时运行图'}, {name: '历史数据'}],
            currentIndex: 0
        }
    },
    methods:{
        handleClick(ids) {
            this.Index = ids.name;
            this.currentIndex = ids;
        }
    },
    components: {
        'v-crewRunReal': crewRunReal,
        'v-crewRunHistory': crewRunHistory
    }
}
</script>

<style lang="scss" scoped>
#crewRun{
    .crewRun{
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
