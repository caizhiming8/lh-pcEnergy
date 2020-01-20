<template>
    <div id="login">
        <div class="login"><!-- ref="homePage" -->
            <div class="box">
                <div class="pox">
					<div class="title-div"><span class="title">能源管理系统平台</span></div>
                    <div class="user">
                        <input v-model="user" type="text" placeholder="请输入用户名" class="inp" clearable @keyup.enter="submitForm"></input>
                    </div>
                    <div class="password">
                        <input v-model="password" type="password" placeholder="请输入密码" class="inp" autocomplete="off" clearable @keyup.enter="submitForm"></input>
                    </div>
                    <div class="code">
                        <input v-model="code" class="short inp" placeholder="请输入验证码" type="text" @keyup.enter="submitForm"></input>
                        <span class="code-span" @click="replacement()">{{generateCode}}</span>
                    </div>
                    <div class="submit">
                        <button @click="submitForm" @keyup.enter="submitForm">登录</button>
                        <button @click="resetForm" class="btn">重置</button>
                    </div>
                </div>
            </div>
		</div>
    </div>
</template>

<script>
export default {
	data(){
		return{
			user: '',
            password: '',
            code: '',
            generateCode: ''
		}
	},
	methods:{
        // 随机生成验证码
        createCode() {
			let code = "";
			let codeLength = 4;

			let selectChar = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
			for(let i = 0; i < codeLength; i++) {
				var charIndex = Math.floor(Math.random()*62);
				code += selectChar[charIndex];
			}
            this.generateCode = code;
		},
		/* 重置验证码 */
		replacement(){
			this.createCode()
		},
        handleClick(ev) {
            console.log(ev);
        },
        // 提交按钮
        submitForm() {
            if(!this.user) {
                this.$notify.warning({
                    title: '警告',
                    message: '请输入用户名',
                    duration: 3000
                })
				this.createCode();
                return false;
            }
            if(!this.password) {
                this.$notify.warning({
                    title: '警告',
                    message: '请输入密码',
                    duration: 3000
                })
				this.createCode();
                return false;
            }
            if(this.code.toLowerCase() != this.generateCode.toLowerCase()) {
                this.$notify.warning({
                    title: '警告',
                    message: '请输入正确的验证码',
                    duration: 3000
                })
				this.createCode();
                return false;
            }
            let data = {
				username:this.user,
				password:this.password
            },
            _this = this;
			this.$axios.post(`BMPlatServers/login/userlogin`, this.$qs.stringify(data)).then((res)=>{
                console.log(res);
				if(res.data.success){
                    this.$message.success({
                        message: '登录成功',
                        showClose: true,
                        duration: 1000
                    });
					let a = res.data.result.infolist.list,
						b = res.data.result.pagelist,
						c = res.data.result.userInfo;
                    sessionStorage.setItem('USER_FLOWROUTER',JSON.stringify(b));
                    sessionStorage.setItem('USER_LEFTMENU',JSON.stringify(a));
                    sessionStorage.setItem('USER_INFO',JSON.stringify(c));
					sessionStorage.setItem('USER_TOKEN','fafassa');
					_this.$_globalData.$_flowerRouter = b;
					_this.$_globalData.$_menuShowList = a;
					_this.$_globalData.$_userInfo = c;
					_this.$_globalData.$_userToken = 'fafassa';
                    if(this.$session.get("expires")) {
                        window.location.href = window.location.href.split('#/')[0] +'#/' + this.$session.get("expires");
                    }else{
                        _this.$router.replace({
                            path: '/index'
                        });
                    }
				}else{
                    this.$message.warning({
                        message: res.data.resultMessage,
                        duration: 1000,
                        showClose: true
                    })
					this.createCode();
				}
			})
        },
        // 重置
        resetForm() {
            this.user = '';
            this.password = '';
            this.code = '';
            this.createCode();
        }
	},
	mounted() {
        /* let Height = document.body.clientHeight || document.documentElement.clientHeight;
        this.$refs.homePage.style.height = Height + 'px'; */
        this.createCode();
	}
}
</script>

<style lang="scss" scoped>
#login{
	.login{
		background: url(../../../static/img/backdrop.jpg) no-repeat 0 0 ;
		background-size: 100% 100%;
		width: 100%;
		height: 100vh;
        .box{
            padding-top: 13%;
            width: 480px;
            margin: 0 auto;
            .pox{
                background: rgba(255,255,255,.3);
                padding: 20px 20px 20px 20px;
                -webkit-border-radius: 6px;
                -ms-border-radius: 6px;
                -moz-border-radius: 6px;
                -o-border-radius: 6px;
                border-radius: 6px;
				.title-div{
					text-align: center;
					width: 100%;
					.title{
						color: #ffffff;
						font-size: 28px;
						font-weight: 500;
					}
				}
                .user{
                    margin-top: 32px;
                    margin-left: 82px;
                    .inp{
                        width: 300px;
                        height: 38px;
                        outline: 0;border: 0;
                        padding: 0 10px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        -webkit-border-radius: 4px;
                        -moz-border-radius: 4px;
                        border-radius: 4px;
                        position: relative;
                        left: 50%;
                        margin-left: -200px;
                        background: #fff;
                        color: #666;
                        font-size: 14px;
                        &:focus{
                            border: 1px solid #409eff;
                        }
                        &:hover{
                            background: rgba(255,255,255,0.7);
                        }
                    }
                }
                .password{
                    margin-top: 24px;
                    margin-left: 82px;
                    .inp{
                        width: 300px;
                        height: 38px;
                        outline: 0;border: 0;
                        padding: 0 10px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        -webkit-border-radius: 4px;
                        -moz-border-radius: 4px;
                        border-radius: 4px;
                        position: relative;
                        left: 50%;
                        margin-left: -200px;
                        background: #fff;
                        color: #666;
                        font-size: 14px;
                        &:focus{
                            border: 1px solid #409eff;
                        }
                        &:hover{
                            background: rgba(255,255,255,0.7);
                        }
                    }
                }
                .code{
                    overflow: hidden;
                    margin-top: 24px;
                    margin-left: 52px;
                    .inp{
                        width: 160px;
                        margin-left: 10px;
                        float: left;
                        height: 38px;
                        outline: 0;border: 0;
                        padding: 0 10px;
                        -webkit-box-sizing: border-box;
                        -moz-box-sizing: border-box;
                        box-sizing: border-box;
                        -webkit-border-radius: 4px;
                        -moz-border-radius: 4px;
                        border-radius: 4px;
                        color: #666;
                        font-size: 14px;
                        &:focus{
                            border: 1px solid #409eff;
                        }
                        &:hover{
                            background: rgba(255,255,255,0.7);
                        }
                    }
                    .code-span{
                        width: 120px;
                        float: left;
                        display: block;
                        margin-left: 20px;
                        text-align: center;
                        line-height: 38px;
                        height: 38px;
                        background: #49809F;
                        color: #fff;
                        font-size: 18px;
                        -webkit-border-radius: 4px;
                        -moz-border-radius: 4px;
                        border-radius: 4px;
                        -webkit-user-select:none;
                        -moz-user-select:none;
                        -ms-user-select:none;
                        user-select:none;
                        cursor: pointer;
                        font-style:italic
                    }
                }
                .submit{
                    margin-top: 23px;
                    padding-bottom: 20px;
                    margin-left: 62px;
                    button{
                        width: 120px;
                        height: 38px;
                        line-height: 38px;
                        text-align: center;
                        color: #fff;
                        background: #1296DB;
                        font-size: 16px;
                        outline: 0;
                        border: 0;
                        cursor: pointer;
                        -webkit-border-radius: 4px;
                        -moz-border-radius: 4px;
                        border-radius: 4px;
                        &:hover{
                            background: #129fDB;
                        }
                    }
                    button.btn{
                        margin-left: 55px;
                        background: #fff;
                        color: #0E2750;
                    }
                }
            }
        }
	}
}

</style>
