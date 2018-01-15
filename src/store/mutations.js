export default {
    SAVE_COMPUTED_CATEGORIES(state,data){
        state.computedCategories = data
    },
    //注册/登录
    LOGIN(state,data){
        state.user = data
    },
    //添加不存在在商品
    ADD_CART(state,data){
        state.carts.push(data)
    },
    //更新已存在商品增加数量
    UPDATA_NUM(state,id){
        for(let i = 0;i <state.carts.length;i++){
            if(state.carts[i].id === id){
                state.carts[i].num++
                break
            }
        }
    },
    //更新本地购物车商品的减少数量
    SUB_CART(state,id){
        for(let i = 0;i < state.carts.length;i++){
            if(state.carts[i].id === id){
                state.carts[i].num--
                break
            }
        }
    },
    //从本地购物车中删除商品
    DEL_CART(state,id){
        for(let i= 0; i <state.carts.length;i++ ){
            if(state.carts[i].id === id){
                state.carts.splice(i,1)
                break
            }
        }
    },
    //保存从数据库中获取的购物车数据
    SAVE_CARTS(state,data){
        //将数据库中的购物车数据添加到本地购物车中
        state.carts = data
        let computedCategories = state.computedCategories
        for(let i = 0; i < computedCategories.length;i++){
            let products = computedCategories[i].products
            for(let j = 0;j < products.length;j++){
                for(let z = 0; z < data.length; z++){
                    if(products[j].id === data[z].product_id){
                        products[j].num === data[z].num
                        break
                    }
                }
            }
        }
    },
    //重置carts中的数量
    RESET_CARTS(state,product){
        let computedCategories = state.computedCategories
        label:for(let i = 0;i < computedCategories.length;i++){
            let products = computedCategories[i].product
            for(let j = 0;j < products.length;j++){
                if(products[j].id === product.product_id){
                    products[j].num = products.num
                    break label
                }
            }
        }
    },
    // 更改全部按钮的选中状态为false
    CHECKED_ALL_FALSE (state) {
    let carts = state.carts
    for (let i = 0; i < carts.length; i++) {
      carts[i].checked = false
    }
  },
  // 更改全部按钮的选中状态为true
  CHECKED_ALL_TRUE (state) {
    let carts = state.carts
    for (let i = 0; i < carts.length; i++) {
      carts[i].checked = true
    }
  }, 
  //更新商品选中状态
  CHANGE_CHECKED(state,product){
      let index =stae.carts.indexOf(product)
      state.carts[index].checked = !state.carts[index].checked
  },
  // 将从数据库中读取的地址列表保存到vuex的sites中
  SAVE_SITES (state, data) {
    state.sites = data
  },
  CART_POS (state, cartPos) {
    state.cartPos = cartPos
  },
  // 保存登陆获取收藏列表
  SAVE_FAVORS (state, favors) {
    state.favors = favors
  },
  // 添加收藏对象(带id的)到收藏列表
  ADD_FAVOR (state, favorObj) {
    state.favors.push(favorObj)
  },
  // 删除收藏对象
  SUB_FAVOR (state, index) {
    state.favors.splice(index, 1)
  },
  DEL_FAVORS(state,favors){
      let localFavors = state.favors
      for(let i = 0;i < localFavors.length;i++){
          for(let j = 0; j < favors.length;j++){
              if(localFavors[i].id === favors[j].id){
                  localFavors.splice(i,1)
                  i--
                  break
              }
          }
      }
  }
}