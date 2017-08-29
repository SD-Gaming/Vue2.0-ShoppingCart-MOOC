var vm = new Vue({
	el:'#app',
	data:{
		productList:[],
		totalMoney:0,
		selectedAll:false,
		deleteClass:false,
		currentClass:''
	},
	filters:{
		//Vue 2.0瘦身了很多自带filter,能用原生写的全部清理掉
		chineseYuan:function(val){
			if(!val) return '0';
			return '¥ ' + val.toFixed(2);//真正项目中需要后代反馈金额，JS会导致金额误差
		}
	},
	computed:{
		
	},
	//钩子函数，当所有DOM挂载在页面上时，加载此方法，相当于window.onload=function(){}
	mounted:function(){
		//需要用$nextTick来保证所有节点挂载后才执行方法
		this.$nextTick(function(){
			this.cartView();
		})
	},
	methods:{
		cartView:function(){
			var _this = this;
			//Vue.source插件，目前已经被axios代替
			this.$http.get('./data/cartData.json',{'id':123}).then(function(res){
				_this.productList = res.data.result.list;
				//_this.totalMoney = res.data.result.totalMoney;
			});
		},
		changeQuantity:function(product,type){
			if (type>0) {
				//加号增加数量
				product.productQuantity++;
				this.calcTotalmoney();//数量变动重新计算总金额
			} else{
				//减号减少数量，但是因为有删除按钮所以最小数量为1
				if(product.productQuantity < 2){
					product.productQuantity = 1;
				}else{
					product.productQuantity--;
					this.calcTotalmoney();//数量变动重新计算总金额
				}
			}
		},
		selectedItem:function(item){
			if(typeof item.ischecked === 'undefined'){
				//局部$set方法，在item里注册ischecked属性，赋值为true
				this.$set(item,'ischecked',true);
			}else {
				//点击反转属性值
				item.ischecked = !item.ischecked;
			};
			this.calcTotalmoney();//选择商品重新计算总金额
		},
		checkAll:function(statu){
			//根据传参决定是全选还是取消全选
			this.selectedAll = statu;
			var _this = this;//用ES5方法解决this指向问题
			//forEach()，val为数据的每一项，index为每一项的索引
			this.productList.forEach(function(val,index){
				//同样的，因为json内没有确定是否选择的属性，我们需要自己创建一个表示每一项商品是否被选择的属性，
				//通过局部注册来注册data里的每一项商品的ischecked属性。
				if(typeof val.ischecked === 'undefined'){
					_this.$set(val,'ischecked',_this.selectedAll);
				}else {
					val.ischecked = _this.selectedAll;
				}
			});
			this.calcTotalmoney();// 全选/非全选 商品重新计算总金额
		},
		calcTotalmoney:function(){
			var _this = this;//用ES5方法解决this指向问题
			//每次计算前必须清理，防止出现累计计算
			this.totalMoney = 0;
			this.productList.forEach(function(val,index){
				if(val.ischecked){
					_this.totalMoney += val.productPrice * val.productQuantity;
				}
			});
		},
		removeConfirm:function(item){
			this.deleteClass = true;
			this.currentClass = item;
		},
		removeClass:function(){
			//indexOf方法接受一个值，在数组中进行检索这个值是否存在，这个值可以使字符串、数字、和对象
			var index = this.productList.indexOf(this.currentClass);
			this.productList.splice(index,1);
			this.deleteClass = false;
			this.calcTotalmoney();//删除商品后重新计算总金额
		}
	}
})


