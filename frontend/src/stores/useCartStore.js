import {create} from 'zustand' ; 
import axios from "../lib/axios";
import toast from "react-hot-toast";
export const useCartStore = create( (set, get)=>  ({
    CartItems: [] , 
    coupon : null , 
    total: 0,
	subtotal: 0,
    isCouponApplied: false,
    getCartItems : async () => { 
        try { 
            const {data} = await axios.get("/cart")
            // log(data)
            set({CartItems : [...data] })
           
            get().calculateTotals();
        }catch(error){
            console.log(error)
            toast.error( "something went wrong" , {id : "id"})
        }
    },


    addTocart: async (product) => {
        try { 
            const {CartItems , total} = get()
            console.log(get().CartItems , get().total);
            
            await  axios.post("/cart" , {productId:product._id})
            set((prevState) => {
                const existingItem = CartItems.find(item => item._id === product._id)
                const newCart  = existingItem 
                ? CartItems.map(item => item._id === product._id ? {...item , quatity : item.quantity + 1}: item) : [...CartItems , {...product , quantity : 1}] 
                return {CartItems : newCart }
            })
     
           
            toast.success('Product added to cart')
        }catch(error){
            console.log(error)
            toast.error( "something went wrong" ,  {id : "id"})
        }
    }, 
    calculateTotals : ()=>{ 
        const { CartItems, coupon } = get();
		const subtotal = CartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}
     
		set({ subtotal, total });
    },
    removeFromcart : async (id)=> { 
        const { CartItems} = get()
        try { 
            await axios.delete(`cart/${id}`);
            set({CartItems : CartItems.filter(item => item._id !== id)})
            get().calculateTotals();
        }catch(error){
            console.log(error)
            toast.error("something went wrong" , {id : "id"})
        }
    },
    updateCartQuantity : async (id , quantity) => {
        try  {
            if(quantity === 0 ){
                    get().removeFromcart(id)
                    return
            }
            await axios.put(`cart/${id}` , {quantity})
        
		    set((prevState) => ({
			CartItems: prevState.CartItems.map((item) => (item._id === id ? { ...item, quantity } : item)),
		    }));
		    get().calculateTotals();
        }catch(error){
            console.log(error)
            toast.error("something went wrong" , {id : "id"})
        }
    }, 
    ClearCart : async () => { 
        set({CartItems : [] , total : 0 , subtotal : 0 , coupon : null})
    }, 
    getMyCoupon : async (code) => {
            try {
                const {data} = await axios.get(`/coupons`)
            set({coupon : data.coupon})

            }catch(error){
                console.log(error)
            }
    
    }, 
    applyCoupon : async (code) =>{
        try {
            const {data} = await axios.post(`/coupons/validation` , {code})
            set({coupon : data , isCouponApplied : true})
            get().calculateTotals();
            toast.success(data.message)

       
        }catch(error){
            console.log(error)
            toast.error(error.response.data.message || "something went wrong")
        }
    },
    removeCoupon : async () => { 
        set({coupon : null , isCouponApplied : false})
        get().calculateTotals();
        toast.success("coupon removed")
    }
}))