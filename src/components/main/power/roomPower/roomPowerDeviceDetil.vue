<template>
    <div id="roomPowerDeviceDetil">
        <div class="roomPowerDeviceDetil">
            <div class="roomPowerDeviceDetil-mian">
                <ul>
                    <li>室内照明与插座用电主线路：{{conmount}}kwh</li>
                    <li>功率：{{power}}w</li>
                    <li>更新时间：{{ontime}}</li>
                    <li>开关状态：<el-switch v-model="isOpen"></el-switch> </li>
                </ul>
                <p>
                    <span>
                        <el-button type="danger" round size="mini" @click="cancle">返回</el-button>
                        <el-button type="warning" round size="mini" @click="makeSure">确定</el-button>
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import bus from '../../../../../static/js/bus.js'
/* import roomPowerDevice from './roomPowerDevice'; */
export default {
    data() {
        return{
            conmount: '',
            isOpen: true,
			power: '',
			ontime: '',
        }
    },
    methods: {
		getSnData(id) {
		    if(!(id.children && id.children.length)) {
				console.log('传值')
				console.log(id)
		    }
			console.log(this.Id)
		},
        cancle() {
            this.$emit('detailEmits');
        },
        makeSure() {
			let data = {
				building: 106,
				type: 1111,
				rooms: '1f106',
				value: 1,
				ammeter: 1,
			}
			this.$axios.post(`BMPlatServers/electricity/econtrol`, this.$qs.stringify(data)).then((res)=>{
			    // console.log(res);
			    if(res.data.success) {
					/* alert('下控成功') */
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
					/* alert("下控失败") */
			    }
			})
        }
    },
	mounted() {
		bus.$on('powerState',(item)=>{
			console.log(item)
		})
	}
}
</script>

<style lang="scss" scoped>
#roomPowerDeviceDetil{
    .roomPowerDeviceDetil{
        width: 80%;
        margin: 0 auto;
        padding: 10px;
        .roomPowerDeviceDetil-mian{
            box-shadow: 0 0 6px #ddd;
            -webkit-box-shadow: 0 0 6px #ddd;
            -moz-box-shadow: 0 0 6px #ddd;
            -o-box-shadow: 0 0 6px #ddd;
            padding: 10px;
            border-radius: 3px;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            -o-border-radius: 3px;
            overflow: hidden;
            ul{
                float: left;
                li{
                    color: #636600;
                    margin: 10px;
                }
            }
            p{
                float: right;
                position: relative;
                height: 128px;
                display: block;
                span{
                    display: block;
                    position: absolute;
                    width: 150px;
                    top: 50%;
                    right: 0;
                    margin-top: -10px;
                }
            }
        }
    }
}
</style>
