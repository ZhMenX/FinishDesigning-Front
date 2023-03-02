import {defineStore} from 'pinia';

export const mainStore = defineStore('main',{
    state:()=>{
        return{
            msg: 'Hello World!',
            userInfo:{
                username:'',
                token:'',
            }
        }
    },
    getters:{
        getToken(){
            return this.userInfo.token;
        }
    },
    actions:{
        changeToken(token){
            this.userInfo.token=token;
        }
    }
})