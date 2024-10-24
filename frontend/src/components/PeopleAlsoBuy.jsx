import React, { useEffect, useState } from 'react'
import { useProductStore } from '../stores/useProductStore'
import CategoryCard from './CategoryCard'
const PeopleAlsoBuy = () => {
    const {recommendation , getRecommendation } = useProductStore()
    useEffect(()=>{

        getRecommendation()
    },[getRecommendation])
   
    
  return (
    <div className='bg-white rounded-lg px-4 py-3'>
      <h1 className='text-2xl font-semibold capitalize'>people also bought</h1>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            {recommendation.map((item , index)=>(
                <CategoryCard key={item._id} {...item} /> 
            ))}
        </div>
    </div>
  )
}

export default PeopleAlsoBuy
