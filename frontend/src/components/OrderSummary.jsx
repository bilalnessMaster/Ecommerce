import React, { useEffect } from 'react'
import { useCartStore } from '../stores/useCartStore'
import { Link } from 'react-router-dom'
import { MoveRight } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import axios from '../lib/axios'
const stripePromise  = loadStripe(
    'pk_test_51Q30hZRqUULSUOP6RhfE0tx1wKizvGW0EJ1zwsccj5nJ7PuR6QmmmnNEwbcmjcRNmNWe63Ru3ciXhHXYViYKHZ8h00q74eutGS'
)

const OrderSummary = () => {
    const  {total , subTotal ,coupon , CartItems} = useCartStore()
    
    const handlePayment = async()=>{
        const stripe = await stripePromise;
        const {data} = await axios.post("/payments/create-checkout-session" , {
            products : CartItems , 
            couponCode  : coupon ? coupon.code : null})
        const session = data
        const result = await stripe.redirectToCheckout({
            sessionId : data.id
        })
        
        if(result.error){       
         console.log(result.error);
         
        
        }

    
    }
  return (
       <div className='bg-white rounded-lg     space-y-2 h-[200px] p-3 w-[300px]'>
            <h1>Order Summary</h1>
            <div className='border-b pb-2'>
            <p >Total : ${total? total : 0}</p>
            {subTotal ? <p className='text-green-400 flex justify-between'><span>SubTotal :</span> <span> -${subTotal}</span></p> : ''}
            </div>
            <div>
                <p className='font-semibold'>total price : ${total }</p>
            </div>
            <div>
                <button className='w-full bg-[#faedcd]/45 font-semibold text-[#9e5f1f] px-2 py-2 rounded-md' 
                
                onClick={handlePayment}
                >checkout</button>
            </div>
            <div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
        </div>
  )
}

export default OrderSummary
