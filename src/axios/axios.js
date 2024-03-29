import axios from 'axios'
//引入

// 创建一个 axios 实例
const initAxios = axios.create({
	baseURL:'http://localhost:8090/',
	timeout: 60000, // 请求超时时间毫秒
	withCredentials: true, // 异步请求携带cookie
	headers: {
		// 设置后端需要的传参类型
		//'Content-Type': 'application/json',
		//'token': 'your token',
		'X-Requested-With': 'XMLHttpRequest',
		'Access-Control-Allow-Origin':'*',
	},

})
// 添加请求拦截器
initAxios.interceptors.request.use(
	function (config) {
		// 在发送请求之前做些什么
		//var token = store.getToken();
		/*var token = localStorage.getItem("token");
		if(token ==null){
			config.headers.Authorization = token+""
		}*/
		return config
	},
	function (error) {
		// 对请求错误做些什么
		console.log(error)
		return Promise.reject(error)
	}
)

// 添加响应拦截器
initAxios.interceptors.response.use(
	function (response) {
		console.log(response.data)
		// 2xx 范围内的状态码都会触发该函数。
		return response
	},
	function (error) {
		// 超出 2xx 范围的状态码都会触发该函数。
		// 对响应错误做点什么
		console.log(error)
		return Promise.reject(error)
	}
)

export default initAxios

