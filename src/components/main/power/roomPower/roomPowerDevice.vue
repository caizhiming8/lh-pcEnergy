<template>
    <div id="roomPowerDevice">
        <div class="roomPowerDevice">
            <div class="device-right">
                <div class="roomDevice">
					<div class="condition">
						<el-tag class="spanBlue" size="mini">设备开</el-tag>
						<el-tag class="spanRed" size="mini">设备关</el-tag>
						<el-tag class="spanGray" size="mini">设备不可用</el-tag>
					</div>
					<span class="room-span">房间设备</span>
                    <!-- <template>

                            <ul class="roo-ul">
                                <li class="liBlue" v-for="(item, index) in menuList"  @click="handleClick(item)" v-if="stateColor && item.STATUS == 1"><i class="el-icon-document" style="color: #FFFFFF"></i>{{item.ammeter_name}}</li>
								<li class="liRed" v-for="(item, index) in menuList"  @click="handleClick(item)" v-if="stateColor && item.STATUS == 0"><i class="el-icon-document" style="color: #FFFFFF"></i>{{item.ammeter_name}}</li>
							</ul>
                    </template> -->
                </div>
				<div class="roomPowerDeviceDetil-mian" v-for="(item,index) in menuList"> <!-- v-if="displayStatus" -->
					<span class="span-device" v-if="item.value == 1"><i class="el-icon-document" style="color: #FFFFFF"></i>  {{item.ammeter_name}}</span>
					<span class="span-devices"v-if="item.value == 0"><i class="el-icon-document" style="color: #FFFFFF"></i>  {{item.ammeter_name}}</span>
					<ul>
						<li>{{item.name}}用电主线路：{{item.consum}}kwh</li>
						<li>功率：{{item.power}}w</li>
						<li>更新时间：{{item.ontime}}</li>
						<li v-if="item.value == 1">开关状态：<span>{{isOpen}}</span> </li>
						<li v-if="item.value == 0">开关状态：<span>{{isOpens}}</span> </li>
					</ul>
					<p>
						<span style="padding-bottom: 5px;">
							<el-button type="danger" round size="mini" @click="cancle(item)">断</el-button>
							<el-button type="warning" round size="mini" @click="makeSure(item)">通</el-button>
						</span>
					</p>
				</div>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../../../../../static/js/bus.js'
import session from '../../../../../static/js/session.js';
export default {
	props: ["giveData"],
    data() {
        return{
            Id: '',
			id: '',
			buildingId: '',
			floorId: '',
            menuList: [],
			stateColor: true,
			ammeter_id: '',
			powerState: '',
			conmount: '',
			isOpen: '开',
			isOpens: '关',
			power: '',
			ontime: '',
			displayStatus: false,
			deviceState: '',
			available: '',
			control_id: ''
        }
    },
    methods: {
        // 子组件传过来的值
       /* getSnData(id) {
            if(!(id.children && id.children.length)) {
                this.Id = id;
				this.floorId = id.floorId;
				this.id = id.roomId;
            }
			console.log(this.Id)
			this.initData()
        }, */
        initData() {
            let data = {
				building_id: this.buildingId,
				floor_id: this.floorId,
				room_id: this.id,
				type: 1,
            };
			console.log(data)
            this.$axios.post(`BMPlatServers/electricity/finddeviceofroom`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
                if(res.data.success) {
					this.menuList = []
					this.menuList = res.data.result.deviceInfo
                }else{
                    this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
					this.menuList = []
                }
            }).catch((err)=>{
                console.log(err);
            })
        },

        // 点击li标签的响应事件, 传给父组件roomPower
        handleClick(items) {
			this.deviceState = items.STATUS
			this.displayStatus = true
			this.available = items.available
			this.ammeter_id = items.ammeter_id;
			let data = {
				building_id: this.buildingId,
				floor_id: this.floorId,
				room_id: this.id,
				type: 1,
				ammeter_id: this.ammeter_id,
			};
			// console.log(data)
			this.$axios.post(`BMPlatServers/electricity/qcsmcontrollistroom`, this.$qs.stringify(data)).then((res)=>{
			    // console.log(res);
			    if(res.data.success) {
					this.ontime = res.data.result.status.s1111.ontime
					this.conmount = res.data.result.status.s1111.consum
					this.power = res.data.result.status.s1111.power
					this.control_id = res.data.result.status.s1111.control_id
					if(res.data.result.status.s1111.value == 0){
						this.isOpen = false
					}else{
						this.isOpen = true
					}
			        // console.log(this.ontime)
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
			    }
			})
        },
		/* 取消 */
		cancle(item) {
			/* this.displayStatus = false */
			let data = {
				building: this.buildingId,
				id: item.control_id,
				rooms: this.floorId+'f'+this.id,
				value: 0,
				ammeter: item.ammeter_id,
				status: item.value
			}
			// console.log(data)
			this.$axios.post(`BMPlatServers/electricity/econtrol`, this.$qs.stringify(data)).then((res)=>{
			    // console.log(res);
			    if(res.data.success) {
					this.$message.warning({
                        message: '下控成功',
						showClose: true,
						duration: 1000,
                    });
					this.initData();
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
			    }
			})
		},
		/* 确定 */
		makeSure(item) {
			let data = {
				building: this.buildingId,
				id: item.control_id,
				rooms: this.floorId+'f'+this.id,
				value: 1,
				ammeter: item.ammeter_id,
				status: item.value
			}
			// console.log(data)
			this.$axios.post(`BMPlatServers/electricity/econtrol`, this.$qs.stringify(data)).then((res)=>{
			    // console.log(res);
			    if(res.data.success) {
					this.$message.success({
						message: '下控成功',
                        showClose: true,
                        duration: 1000,
					});
					this.initData();
			    }else{
			        this.$message.warning({
						message: res.data.resultMessage,
                        showClose: true,
                        duration: 1000,
					});
			    }
			})
		},
    },
    mounted() {
		this.buildingId = window.location.href.split('=')[1];
		 if(session.get('dataString')) {
		    this.floorId = session.get('dataString').floorId;
		    this.id = session.get('dataString').roomId;
		}
        this.initData();
    },
    watch: {
		$route(item) {
		    this.buildingId = item.fullPath.split('=')[1]
		},
		giveData(item) {
		    if(typeof(item.chidren) == 'undefined') {
		        session.set('dataString', item);
		        this.floorId = item.floorId;
		        this.id = item.roomId;
		        this.loading = true;
		        this.initData();
		    }
		}
    },
}
</script>

<style lang="scss" scoped>
#roomPowerDevice{
    .roomPowerDevice{
        .device-right{
            width: 100%;
            height: 600px;
            overflow: auto;
            padding-left: 10px;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            -o-box-sizing: border-box;
            &::-webkit-scrollbar{
                width: 1px;
            }
            .roomDevice{
				.room-span{
					margin-top: 10px;
					margin-left: 20px;
					font-size: 18px;
					color: #434343;
					font-weight: 600;
				}
                ul{
					margin-top: 20px;
                    li{
                        display: inline-block;
                        margin: 0 10px;
                        cursor: pointer;
                    }
                }
				.liBlue{
					border-radius: 5px;
					background: #409eff;
					padding: 3px;
					color: #ffffff;
				}
				.liRed{
					border-radius: 5px;
					background: #f08080;
					padding: 3px;
					color: #ffffff;
				}
				.condition{
					float: right;
					margin-right: 30px;
					margin-top: 0%;
					.spanBlue{
						background: #409eff;
						color: #ffffff;
						border: none;
					}
					.spanRed{
						background: #f08080;
						color: #ffffff;
						border: none;
					}
					.spanGray{
						background: #c5c5c5;
						color: #ffffff;
						border: none;
					}
				}
            }
			.roomPowerDeviceDetil-mian{
				/* width: 30%; */
				margin-top: 40px;
				border: 1px solid #e6e6e6;
				border-left: 8px solid #62a541;
				border-radius: 5px;
				padding: 5px;
				box-shadow: 7px 4px 14px #e6e6e6;
				.span-device{
					float: right;
					padding: 5px;
					margin-right: 40px;
					margin-top: 10px;
					border-radius: 5px;
					background: #409eff;
					color: #ffffff;
					font-size: 14px;
					font-size: 16px;
				}
				.span-devices{
					/* float: right; */
					padding: 5px;
					/* margin-right: 40px; */
					margin-top: 10px;
					border-radius: 5px;
					/* background: #f08080; */
					color: #ffffff;
					font-size: 14px;
					font-size: 16px;
				}
				ul{
					margin-top: 10px;
				    li{
				        margin: 0 10px;
						margin-top: 10px;
				        cursor: pointer;
						color: #434343;
						font-size: 16px;
						font-weight: 400;
				    }
				}
				p{
					margin-top:10px;
					margin-left:10px;
				}
			}
        }
    }
}
</style>
