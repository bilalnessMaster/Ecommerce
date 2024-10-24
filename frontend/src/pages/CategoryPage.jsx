import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import CategoryCard from '../components/CategoryCard';

const CategoryPage = () => {
    const {category} = useParams()
    const {getCategoryProducts , products} = useProductStore()

    useEffect(() => {
        getCategoryProducts(category)
    }, [getCategoryProducts ])

    
  return (
    <div className='container mx-auto py-24'>
        <div>
            <h1 className='text-3xl text-center font-bold'>{category.charAt(0).toUpperCase()+category.slice(1)}</h1>
        </div>
     <div  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4'
     >

{
        products.length === 0 ? "products not found" : 
        products.map( product =>  { 
            return <CategoryCard key={product._id} {...product} /> 
        })
      }
     </div>
    </div>
  )
}

export default CategoryPage
