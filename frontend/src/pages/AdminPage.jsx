import React, { useEffect, useState } from 'react'
import {motion } from 'framer-motion'
import AnalyticsTab from '../components/AnalyticsTab'
import CreateProductForm from '../components/CreateProductTab'
import ProductsTab from '../components/ProductsTab'
import { BarChart, PlusCircle, ShoppingBasket } from 'lucide-react'
import { useProductStore } from '../stores/useProductStore'

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab , setActiveTab] = useState('create')
  const {getAllProducts , products} = useProductStore()
  useEffect(() => {
		getAllProducts()  
  },[getAllProducts])

  
  return (
    <div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-neutral-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				<div className='flex justify-center mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-[#faedcd]/45  text-[#c4aa69]"
									: "bg-[#f0f5cf] text-[#7b922d] hover:bg-gray-600"
							}`}
						>
							<tab.icon className='mr-2 h-5 w-5' />
							{tab.label}
						</button>
					))}
				</div>
				{activeTab === "create" && <CreateProductForm />}
				{activeTab === "products" && <ProductsTab />}
				{activeTab === "analytics" && <AnalyticsTab />}
			</div>
		</div>
  )
}

export default AdminPage
 