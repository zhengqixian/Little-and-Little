<template>
  <div class="favor">
      <header-gray back="true" headerTitle="商品收藏"></header-gray>
      <span class="extent-click header-icon save" @click="edit">{{editBol?'完成':'编辑'}}</span>
      <div class="main" :style="{'bottom':editBol?'4.9rem':'0'}">
          <ul class="products">
              <li class="product-item-wrap" v-for="item in favors" :key="item.id" @click="selectProduct(item)">
                  <div v-if="editBol" class="checkbox" :class="{'selected':item.selected}"></div>
                  <dl class="product-item">
                      <dt>
                          <img v-lazy="item.img">
                      </dt>
                      <dd class="product-name">{{item.name}}</dd>
                      <dd class="product-promotion">&nbsp;</dd>
                    <dd class="product-specifics theme-font-gray">{{item.unit}}g</dd>
                    <dd class="product-price-current theme-font">￥{{item.price}}</dd>
                  </dl>
              </li>
          </ul>
      </div>
      <div class="footer" v-show="editBol">
          <span class="selectAll" :class="{'selectAll-true':selectAllBol}" @click="changeSelectAll">全选</span>
          <span class="theme-btn" @click="del">删除</span>
      </div>
  </div>
</template>
<script>
import HeaderGray from '@/components/Header-gray/Header-gray'
export default {
  components:{
      HeaderGray
  },
  activated(){
      this.editBol = false
      if(this.user.id > 0){
          this.getFavors()
      }else{
          this.$msg('提示','未登录,请登录')
          .then(action =>{
              this.$router.push('/login')
          })
      }
  },
  data(){
      return {
          //当前编辑状态
          editBol:false,
          //收藏列表
          favors:[]
      }
  },
  computed:{
      user(){
          return this.$store.state.user
      },
      //全选按钮的选中状态
      selectAllBol(){
          let resultBol = true
          let favors = this.favors
          for(let i = 0; i < favors.length;i++){
              if(!favors[i].selected){
                  resultBol = false
              }
          }
          return resultBol
      }
  },
  methods:{
      //删除收藏列表
      del(){
          let delFavors = this.favors.filter(item>item.selected)
          if(delFavors.length > 0){
              this.$store.dispath('delFavors',delFavors)
              .then(res =>{
                  this.$msg('提示',res.msg)
                  this.getFavors()
                  this.editBol = false
              })
          }
      },
      //获取收藏列表
      getFavors(){
          let favors = JSON.parse(JSON.stringify(this.$store.state.favors))
          for(let i = 0;i < favors.length;i++){
              favors[i].selected = false
          }
          this.favors = favors
      },
      changeSelectAll(){
          let favors = this.favors
          if(this.selectAllBol){
              for(let i = 0;i < favors.length;i++){
                  favors[i].selected = false
              }
          }else{
              for(let i = 0; i < favors.length;i++){
                  favors[i].selected = true
              }
          }
      },
      edit(){
          this.editBol = !this.editBol
      },
      selectProduct(item){
          if(this.editBol){
              item.selected = !item.selected
          }else{
              this.$router.push('/product-item/'+item.product_id)
          }
      }
  }
}
</script>
<style lang="less" scoped>
@import url("../../styles/var.less");
.footer{
  position: fixed;
  background-color: #fff;
  height: 5rem;
  left: 0;
  right: 0;
  bottom: 0;
  padding-left: 2rem;
}
.products{
  padding-left: 1.4rem;
  background: #fff;
}
.product-item-wrap{
  padding-left: 2rem;
  border-bottom: 1px solid @border-color;
  position: relative;
}
.checkbox{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2rem;
  background: #fff url("./images/checkbox.png") right center no-repeat;
  background-size: 1.8rem 1.8rem;
}
.checkbox.selected{
  background-image: url("./images/checkbox-selectd.png");
}
.product-item{
  padding: 1rem;
  font-size: 1.2rem;
  line-height: 2rem;
  box-sizing: border-box;
}
.product-image{
  float: left;
  margin-right: .5rem;
}
.save{
  position: absolute;
  top: 0;
  right: .6rem;
  text-align: center;
  width: 6rem;
  height: 4.4rem;
  line-height: 4.4rem;
  font-size: 1.4rem;
  z-index: 2;
  color: #777;
}
.selectAll{
  display: inline-block;
  width: 5rem;
  padding-left: 2.5rem;
  font-size: 1.4rem;
  line-height: 5rem;
  -webkit-background-size: 1.8rem 1.8rem;
  background-size: 1.8rem 1.8rem;
  background-repeat: no-repeat;
  background-position: left center;
}
.selectAll-false{
  background-image: url("./images/checkbox.png");
}
.selectAll-true{
  background-image: url('./images/checkbox-selectd.png');
}
</style>

