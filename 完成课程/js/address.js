var vm = new Vue({
	el:".container",
	data:{
		addressList:[],		//把获取到的jason地址列表储存于此。				
		moreAddressNumber:3,		//默认显示3个设置地址。
		currentIndex:0,		//把第一个地址的样式设为默认地址样式。
		shipmessage:1
	},
	mounted:function(){
		this.$nextTick(function(){
			this.getAddressList();
		})
	},
	computed:{
		//修饰addressList数组，只显示前三项并返回
		addressLimitBy:function(){
			return this.addressList.slice(0,this.moreAddressNumber);
		}
	},
	filters:{
	},
	methods:{
		getAddressList:function(){
			var _this = this;
			this.$http.get('./data/address.json',{'id':123}).then(function(res){
				_this.addressList = res.data.result;
			});
		},
		loadMoreAddress:function(){
			if(this.moreAddressNumber === 3){
				this.moreAddressNumber = this.addressList.length;
			}else {
				this.moreAddressNumber = 3;
			}
		},
		getIndex:function(index){
			//将触发点击事件的元素索引传入函数，把触发点击事件的<li>赋予选中样式。
			this.currentIndex = index;
		},
		setDefault:function(addressId){
			//形参addressId实际上等于参数item.addressId，相当于把出发点击事件的地址的ID传入进来。
			//遍历整个地址数组的每一项，把每一项元素的addressId与触发点击事件的addressId进行对比，
			//一致的元素就是我们点击的那个元素。
			this.addressList.forEach(function(item,addressListIndex){
				if (addressId == item.addressId){
					item.isDefault = true;
				} else {
					item.isDefault = false;
				}
			})
		}
	}
	
})
