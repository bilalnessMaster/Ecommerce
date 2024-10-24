import { Minus, Plus, Trash } from 'lucide-react'
import React, { useEffect } from 'react'
import { useCartStore } from '../stores/useCartStore'

const CardCart = ({_id , name , image , category , description , price , quantity}) => {
  const {removeFromcart , updateCartQuantity } = useCartStore()
  
    return (
    <article className='flex items-center h-[150px] bg-white rounded-lg px-4 py-3 justify-between border  '>
      <div className='flex items-center gap-4 h-full '>
        <img src={image} className=' h-full' alt="" />
        <div className='flex flex-col gap-5'>
        <div>
        <p className='font-semibold text-lg'>{name}</p>
        <p className='font-medium text-md text-black/40'>{category}</p>
        </div>
            <button><Trash onClick={() => removeFromcart(_id)} color='red'/></button>
        </div>
      </div>
      <div className='flex  items-center text-xl  gap-16'>
        <label htmlFor="" className='flex gap-2 items-center'>
                <Minus onClick={() => updateCartQuantity(_id ,  quantity - 1)}  className='cursor-pointer text-red-400'/>
                <p>{quantity}</p>
                <Plus onClick={() => updateCartQuantity(_id , quantity + 1)} className='cursor-pointer text-green-400'/>

        </label>
        <p className='text-black/50 text-xl'>${price}</p>
      </div>
    </article>
  )
}

export default CardCart
