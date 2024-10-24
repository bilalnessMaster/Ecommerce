import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";

const CouponValidate = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } =useCartStore();
  
  useEffect(() => {
    getMyCoupon()
  },[getMyCoupon])
  useEffect(() => {
    if(coupon) setUserInputCode(coupon.code)
  },[coupon])
  const handleCoupon  = ()=>  { 

    if (!userInputCode) return;

      
      applyCoupon(userInputCode);
      
    
  }
  const handleRemoveCoupon = async  () => {
    await removeCoupon();
		setUserInputCode("");
    
  }


  return (
    
   <>
   <div className="w-[300px] bg-white rounded-md px-2 py-3 ">
       <div className="space-y-3 ">
        <label htmlFor="coupon" className="text-lg font-medium">Do you have Coupon?</label>
        <input value={userInputCode} onChange={(e)=>setUserInputCode(e.target.value) } type="text " className="focus:outline-none py-2 w-full h-9 rounded-md border px-2" id="coupon" />
        <button 
        onClick={handleCoupon}
        className="w-full bg-[#faedcd]/45 font-semibold text-[#9e5f1f] px-2 py-2 rounded-md">	Apply Code</button>
       
       </div>
       {isCouponApplied && coupon && (
        <div className='mt-4'>
        <h3 className='text-lg font-medium text-gray-300'>Applied Coupon</h3>

        <p className='mt-2 text-sm text-gray-400'>
          {coupon.code} - {coupon.discountPercentage}% off
        </p>

        <motion.button
          type='button'
          className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
          px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
           focus:ring-4 focus:ring-red-300'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRemoveCoupon}
        >
          Remove Coupon
        </motion.button>
      </div>
       )}
       {coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Your Available Coupon:</h3>
					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>
				</div>
			)}
   </div>
   </>
  );
};

export default CouponValidate;
