import React, { useEffect } from 'react'
import { useCartStore } from '../stores/useCartStore'
import CardCart from '../components/CardCart'
import OrderSummary from '../components/OrderSummary'
import PeopleAlsoBuy from '../components/PeopleAlsoBuy'
import CouponValidate from '../components/CouponValidate'
import { ShoppingBag } from 'lucide-react'

const CartPage = () => {
    const {CartItems  ,total ,getCartItems} = useCartStore()

    // useEffect(() => {
    //     getCartItems()
    // },[getCartItems])
    

  return (
    <div className='container mx-auto py-16 relative  '>
        <div className='flex items-start w-full gap-2 h-screen'>
        <div className='w-full flex flex-col gap-4'>
         {CartItems.length === 0 ? <h1 className='font-semibold text-3xl h-screen w-full flex flex-col items-center justify-center'><ShoppingBag size={70} />Cart is empty</h1> : CartItems.map((item) => (
         <CardCart {...item} key={item._id} />
            ))}
            
        <div>
        {
            CartItems.length >  0 && <PeopleAlsoBuy />
        }    
            
        </div>   
        </div>
       {  CartItems.length >  0 &&  <div className=' sticky top-4 space-y-4'>
           <OrderSummary  />
           <CouponValidate />
         
        </div>}
        </div>
    </div>
  )
}

export default CartPage
