import axios from 'axios'

const http = axios.create({
    baseURL: 'https:/v3pz.itndedu.com/v3pz',
    timeout: 10000,
    headers: {'terminal': 'h5'}
  });

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('h5_token')
    //不需要添加token的api
    const whiteUrl = ['/login']
    if(token && !whiteUrl.includes(config.url)){
        config.headers['h-token'] = token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    
    //对接口异常的数据，给用户提示
    if(response.data.code === -1){
        alert(response.data.message)
    }
    //token异常，清除信息，跳转到登录页
    if(response.data.code === -2){
      localStorage.removeItem('h5_token')
      localStorage.removeItem('h5_userInfo')
      window.location.href = '#/login'
    }
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });

export default http