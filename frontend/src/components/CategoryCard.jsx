import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { useUserStore } from '../stores/useUserStore'
import toast from 'react-hot-toast'
import { useCartStore } from '../stores/useCartStore'

const CategoryCard = ({_id , name , image , category , description , price}) => {
    
    const {addTocart , CartItems} = useCartStore()
    const {user} = useUserStore()
    const AddTocart = () => { 
        if(!user){
            toast.error("please login first", {id : "loginerror"})
        }else { 
            addTocart({_id})
        
            
        }
    }
  
    
  
    return (
    <div key={_id} className=' px-2 py-4  border bg-white rounded-lg space-y-2'>
        <div className='w-full border-b pb-2'>
            <img src={image} className='object-fit h-[200px] mx-auto' alt="" />
        </div>
        <div className='flex justify-between items-center text-lg '>
            <p className=' text-neutral-600'>
                {name?.charAt(0).toUpperCase()+name?.slice(1)}
            </p>
            <p className='text-neutral-400 text-lg'>${price}</p>
        </div>
        <div className='text-neutral-600 w-full bg-green-400  font-medium flex justify-center items-center py-3 rounded'>
           
            <div className='cursor-pointer flex rounded ' onClick={AddTocart}> 
                Add to cart
            <ShoppingCart />
            </div>
        </div>
    </div>
  )
}

export default CategoryCard
