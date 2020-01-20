<template>
    <div id="deviceHeatTransfer">
        <div class="deviceHeatTransfer">
            <div class="title">
                <el-button type="primary" size="small" @click="getPermissions" v-if="permissions==0">获取权限</el-button>
                <el-button type="success" size="small" disabled v-if="permissions==1">已获取权限</el-button>
                <el-button type="success" size="small" disabled v-if="permissions==0">当前没有权限</el-button>
                <el-button type="warning" size="small" @click="canclePermissions" v-if="permissions==1">取消权限</el-button>
            </div>
            <ul>
                <li v-for="(item, index) in list" @click="handleClick(index)" :class="Index==index?'active': ''">{{item.name}}</li>
            </ul>
            <div v-if="Index==0">
                <v-deviceHeatTransferPump :permissions="permissions"></v-deviceHeatTransferPump>
            </div>
            <div v-if="Index==1">
                <v-deviceHeatTransferAdjust :permissions="permissions"></v-deviceHeatTransferAdjust>
            </div>
            <div v-if="Index==2">
                <v-deviceHeatTransferPressure :permissions="permissions"></v-deviceHeatTransferPressure>
            </div>
            <div v-if="Index==3">
                <v-devicepressure :permissions="permissions"></v-devicepressure>
            </div>
        </div>
    </div>
</template>

<script>
import deviceHeatTransferPump from './deviceHeatTransfer/deviceHeatTransferPump';
import deviceHeatTransferAdjust from './deviceHeatTransfer/deviceHeatTransferAdjust';
import deviceHeatTransferPressure from './deviceHeatTransfer/deviceHeatTransferPressure';
import devicepressure from './deviceHeatTransfer/devicepressure';
export default {
    data() {
        return{
            list: [{name: '循环泵'}, {name: '温控阀'}, {name: '补水泵'}, {name: '泄压阀'}],
            Index: 0,
            permissions: 0,
            buildingId: '',
            deviceId: '',
            roomId: '',
            floorId: '',
            obj: {},
            timer: null
        }
    },
    methods:{
        initData() {
            let params = {
                buildingId: this.buildingId
            }
            this.$axios.post("BMPlatServers/hvacheat/queryHeatControlAuthority", this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    let obj = res.data.result.allmap
                    this.deviceId = obj.deviceId;
                    this.floorId = obj.floorId;
                    this.roomId = obj.roomId;
                    this.obj = obj;
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        handleClick(i) {
            this.Index = i;
        },
        getPermissions() {
            let obj = {data38: {}};
            obj.buildingId = this.buildingId;
            obj.deviceId = this.deviceId;
            obj.floorId = this.floorId;
            obj.roomId = this.roomId;
            obj.data38.name = this.obj.data38.name;
            obj.data38.value = 1;
            obj.data38.isPulse = this.obj.data38.isPulse;
            let data = {
                map: JSON.stringify(obj)
            }
            this.$axios.post("BMPlatServers/hvacheat/commitHeatControl", this.$qs.stringify(data)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.loop();
                    this.timer = setInterval(()=>{
                        this.loop();
                    }, 3000);
                    this.$message.success({
                        message: '已下达获取权限命令，请稍等...',
                        showClose: true,
                        duration: 3000
                    })
                }else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000
                    })
                }
            })
        },
        loop() {
            let params = {
                buildingId: this.buildingId
            }
            this.$axios.post("BMPlatServers/hvacheat/queryHeatStationAuthority", this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    if(res.data.result.list[0].dataValue == 1) {
                        this.permissions = 1;
                        clearInterval(this.timer);
                        this.$message.success({
                            message: '获取权限成功',
                            showClose: true,
                            duration: 1000
                        })
                    }else{
                        this.permissions = 0;
                    }
                }
            })
        },
        canclePermissions() {
            this.$confirm('是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.permissions == 0) {
                    this.$message.success({
                        message: '没有权限，不需要操作',
                        duration: 3000,
                        showClose: true
                    })
                    return false;
                }
                let obj = {data39: {}};
                obj.buildingId = this.buildingId;
                obj.deviceId = this.deviceId;
                obj.floorId = this.floorId;
                obj.roomId = this.roomId;
                obj.data39.name = this.obj.data39.name;
                obj.data39.value = 1;
                obj.data39.isPulse = this.obj.data39.isPulse;
                let params = {
                    map: JSON.stringify(obj)
                }
                this.$axios.post("BMPlatServers/hvacheat/commitHeatControl", this.$qs.stringify(params)).then((res)=>{
                    // console.log(res);
                    if(res.data.success) {
                        this.permissions = 0;
                    }else{
                        this.$message.warning({
                            message: res.data.resultMessage,
                            showClose: true,
                            duration: 1000
                        })
                    }
                })
            }).catch(() => {})
        }
    },
    mounted() {
        this.buildingId = window.location.href.split(",")[2];
        this.initData();
    },
    beforeDestroy() {
        clearInterval(this.timer);
        if(this.permissions == 1) {
            let obj = {data39: {}};
            obj.buildingId = this.buildingId;
            obj.deviceId = this.deviceId;
            obj.floorId = this.floorId;
            obj.roomId = this.roomId;
            obj.data39.name = this.obj.data39.name;
            obj.data39.value = 1;
            obj.data39.isPulse = this.obj.data39.isPulse;
            let params = {
                map: JSON.stringify(obj)
            }
            this.$axios.post("BMPlatServers/hvacheat/commitHeatControl", this.$qs.stringify(params)).then((res)=>{
                // console.log(res);
                if(res.data.success) {
                    this.permissions = 0;
                }
            })
        }
        this.permissions = 0;
    },
    watch: {
    },
    components: {
        'v-deviceHeatTransferPump': deviceHeatTransferPump,
        'v-deviceHeatTransferAdjust': deviceHeatTransferAdjust,
        'v-deviceHeatTransferPressure': deviceHeatTransferPressure,
        'v-devicepressure': devicepressure
    }
}
</script>

<style lang="scss" scoped>
#deviceHeatTransfer{
    .deviceHeatTransfer{
        ul{
            margin-top: 40px;
            li{
                display: inline-block;
                background: #F1F1F1;
                margin: 0 10px;
                border-radius: 2px;
                -webkit-border-radius: 2px;
                -moz-border-radius: 2px;
                padding: 5px 10px;
                color: #666;
                cursor: pointer;
                &.active{
                    background: #409EFF;
                    font-weight: 700;
                    color: #fff;
                }
            }
            li:first-child{
                margin-left: 0;
            }
        }
    }
}
</style>
