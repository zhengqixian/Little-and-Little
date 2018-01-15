import http from 'axios'
import api from '@/api'
export default {
  // 对提交的手机号进行处理
  submit ({commit}, userObj) {
    // 验证手机号在数据库是否存在
    return http.get(api.host + '/users?phone=' + userObj.phone)
      .then(res => {
        // 判断这个接口是否返回了数据，如果返回就是存在，没返回就是没有这个手机号
        if (res.data.length > 0) {
          // 提取该用户的购物车数据
          http.get(api.host + '/users/' + res.data[0].id + '/carts')
            .then(res => {
              commit('SAVE_CARTS', res.data)
            })
          // 提取该用户的地址列表
          http.get(api.host + '/users/' + res.data[0].id + '/sites')
            .then(res => {
              commit('SAVE_SITES', res.data)
            })
          // 提取该用户的收藏列表
          http.get(api.host + '/users/' + res.data[0].id + '/favors')
            .then(res => {
              commit('SAVE_FAVORS', res.data)
            })
          // 登陆成功，将用户信息保存到vuex的user状态下
          commit('LOGIN', res.data[0])
          return {"msg": "登陆成功"}
        } else {
          // 注册
          // 追加一个selectSite(所选地址)的属性
          userObj.selectSite = {}
          return http.post(api.host + '/users', userObj)
            .then(res => {
              if (res.data.id > 0) {
                // 注册成功将数据保存到vuex的state中，以备后用
                commit('LOGIN', res.data)
                return { "msg": "注册成功" }
              } else {
                return { "msg": "注册失败" }
              }
            })
        }
      })
  },
  //添加数量到购物车
  addCart(store,product){
    let localCarts = store.state.localCarts
    let user = store.state.user
    //判断商品是否存在
    let addBol = true
    for(let i = 0;i < localCarts.length;i++){
      if(localCarts[i].product_id === product.product.id){
        //存在
        addBol = false
        //克隆本地购物车对应的商品的id
        let newLocalCartProduct = Object.assign({},localCarts[i])
        newLocalCartProduct.num++
        //更新数据库
        return http.patch(api.host+'/carts/'+newLocalCartProduct.id,{
          num:newLocalCartProduct.num
        })
        .then(res=>{
          //更新成功
          if(res.data.id>0){
            store.commit('UPDATA_NUM',res.data.id)
            return {"msg":"更新数量成功"}
          }else{
            return {"msg":"更新数量失败"}
          }
        })
      }
    }
    if(addBol){
        //不存在,添加商品对象
        let productToCartObj = {
          product_id:product.product_id,
          userId:user.id,
          product_img:product.imgs.min,
          product_name:product.name,
          product_price:product.price,
          checked:true,
          num:1
        }
        //添加到数据库中的购物车
        return http.post(api.host + 'carts',productToCartObj)
        .then(res=>{
          //添加到本地购物车成功
          if(res.data.id>0){
            store.commit('ADD_CART',res.data)
            return {"msg":"添加成功"}
          }else{
            return {"msg":"添加失败"}
          }
        })
    }
  },
  subCart(store,product){
    let localCarts = store.state.carts
    let cartObj = {}
    for(let i = 0; i < localCarts.length;i++){
      if(product.product_id === localCarts[i].product_id){
        cartObj = localCarts[i]
      }
    }
    if(cartObj.num>1){
      return http.patch(api.host+'/carts/'+cartObj.id,{
        num:cartObj.num
      })
      .then(res =>{
        if(res.data.id>0){
          store.commit('SUB_CART',res.data.id)
          return {"msg":"减少数量成功","del":0}
        }else{
          return {"msg":"减少数量失败"}
        }
      })
    }else{
      return http.delete(api.host+'/carts/'+cartObj.id)
      .then(res=>{
        store.commit('DEL_CART',cartObj.id)
        return {"msg":"删除商品成功","del":1}
      })
    }
  },
  //购物车商品勾选状态全部取消
  checkedAllFales(store){
    let carts = store.state.carts
    let completeNum = 0
    function promiseCheckedAllFalse(){
      return new Promise(function(resolve,reject){
        for(let i = 0; i < carts.length;i++){
          http.patch(api.host + '/carts/' + carts[i].id,{
            checked:false
          }) 
          .then(res =>{
            completeNum++
            if(completeNum >=carts.lemgth -1){
              resolve({
                "msg":"全部取消成功"
              })
            }
          })
        }
      })
    }
   return promiseCheckedAllFalse()
        .then(res =>{
          store.commit('CHECKED_ALL_FALSE')
          return res
        })
      },
  //购物车商品勾选状态全部选中
  chenckedAllTrue(store){
        let carts = store.state.carts
        let completeNum = 0
        function promiseCheckedAllTrue(){
          return new Promise(function(resolve,reject){
            for(let i = 0; i < carts.length;i++){
              http.patch(api.host + '/carts/' +carts[i].id,{
                checked:true
              })
              .then(res =>{
                completeNum++
                if(completeNum>=carts.length -1){
                  resolve({"msg":"全部勾选成功"})
                }
              })
            }
          })
        }
        return promiseCheckedAllTrue()
          .then(res =>{
            store.commit('CHECKED_ALL_TRUE')
            return res
          })
      },
      //更改购物车中的商品的选中状态
      changeChecked(store,product){
        return http.patch(api.host+'/carts/'+product.id,{
          checked:!product.checked
        })
        .then(res =>{
          if(res.data.id>0){
            store.commit('CHANGE_CHECKED',product)
            return {"msg":"切换状态成功"}
          }else{
            return {"msg":"切换状态失败"}
          }
        })
      },
      saveSite(store,siteObj){
        return http.post(api.host+'/sites',siteObj)
        .then(res =>{
          if(res.data.id>0){
            http.patch(api.host+'/users/'+store.state.user.id,{
              selectSite:res.data
            })
            .then(res=>{
              store.commit('UPDATA_USER',res.data)
            })
            store.commit('SAVE_SITE',res.data)
            return {'msg':'添加成功'}
          }else{
            return {'msg':'添加失败'}
          }
        })
      },
      //删除勾选的商品收藏
      delFavor(store,favors){
        function promiseDelFavors(){
          //删除列表的数量
          let delNum = 0
          return new Promise (function(resolve,reject){
            for(let i = 0; i < favors.length;i++){
              http.delete(api.host+'/favors/'+favors[i].id)
              .then(res=>{
                delNum++
                if(delNum >= favors.length){
                  resolve({'msg':'删除收藏列表成功'})
                }
              })
            }
          })
        }
        return promiseDelFavors()
        .then(res=>{
          storecommit('DEL_FAVORS',favors)
          return res
        })
      },
      addFavor(store,product){
        let favorObj = {
          user_id:store.state.user.id,
          product_id:product.id,
          img:product.imgs.min,
          name:product.name,
          unit:product.unit,
          price:product.price
        }
        return http.post(api.host+'/favors',favorObj)
        .then(res =>{
          if(res.data.id>0){
          store.commit('ADD_FAVOR',res.data)
          return {"msg":"添加收藏成功"}
          }else{
            return {"msg":"添加收藏失败"}
          }
        })
      },
      subFavor(store,poductId){
        let favors = store.state.favors
        let favorId = 0
        let favorIndex  = 0
        for (let i = 0; i < favors.length;i++){
          if(favors[i].product_id === product_id){
            favorIndex = i
            favorId = favor[i].id
            break
          }
        }
        return http.delete(api.host+'/favors/'+favorId)
        .then(res=>{
          store.commit('SUB_FAVOR',favorIndex)
          return {"msg":"删除收藏成功"}
        })
      },
}