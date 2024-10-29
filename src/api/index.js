import request from '../utils/requests'

export default {
    login(data){
        return request.post('/login',data)
    },

    //首页数据
    index(){
        return request.get('/Index/index')
    },
    
    h5Companion(){
        return request.get('/h5/companion')

    },

    createOrder(data){
        return request.post('/createOrder',data)
    },

    orderList(params){
        return request.get('/order/List',{params})
    },

    orderDetail(params){
        return request.get('/order/Detail',{params})
    },
}