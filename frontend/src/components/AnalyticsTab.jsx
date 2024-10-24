import React, { useEffect, useState } from 'react'
import {motion} from 'framer-motion'
import axios from '../lib/axios'
import {Users ,Package ,ShoppingCart, DollarSign, X} from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
const AnalyticsTab = () => {
  const [analyticsData , setAnalytics] = useState({
    users : 0 , 
    products : 0 , 
   totalSales : 0 , 
   totalRevenue : 0  
  })
  const [isloading  ,setIsloading] = useState(true);
  const [dailySalesData , setDailySales] = useState([]);
  useEffect(() => {
    const getAnalytics = async () => {
      try{
        const {data} = await axios.get("/analytics")
        setAnalytics(data.analytics)
        setDailySales(data.dailySalesData)
      }catch(error){
        console.log(error)
      }finally{
        setIsloading(false)
      }
    }
    getAnalytics()
  }, [])

  
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xl:grid-cols-4'>
        <AnalyticsCard
					title='Total Users'
					value={analyticsData.users.toLocaleString()}
					icon={Users}
					color='from-emerald-500 to-teal-700'
				/>
        <AnalyticsCard
					title='Total Products'
					value={analyticsData.products.toLocaleString()}
					icon={Package}
					color='from-emerald-500 to-green-700'
				/>    
      <AnalyticsCard
					title='Total Sales'
					value={analyticsData.sales}
					icon={ShoppingCart}
					color='from-emerald-500 to-cyan-700'
				/>
        	<AnalyticsCard
					title='Total Revenue'
					value={`$${analyticsData.revenue}`}
					icon={DollarSign}
					color='from-emerald-500 to-lime-700'
				/>
        </div>
        <div className='bg-white mt-7 py-5 rounded-md'>
        <ResponsiveContainer width='100%' height={400}>
					<LineChart data={dailySalesData}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' stroke='#D1D5DB' />
						<YAxis yAxisId='left' stroke='#D1D5DB' />
						<YAxis yAxisId='right' orientation='right' stroke='#D1D5DB' />
						<Tooltip />
						<Legend />
						<Line
							yAxisId='left'
							type='monotone'
							dataKey='sales'
							stroke='#10B981'
							activeDot={{ r: 8 }}
							name='Sales'
						/>
						<Line
							yAxisId='right'
							type='monotone'
							dataKey='revenue'
							stroke='#3B82F6'
							activeDot={{ r: 8 }}
							name='Revenue'
						/>
					</LineChart>
				</ResponsiveContainer>
        </div>
    </div>
  )
}
const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
	<motion.div
		className={`bg-white rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className='flex justify-between items-center'>
			<div className='z-10'>
				<p className='text-neutral-900 text-sm mb-1 font-semibold'>{title}</p>
				<h3 className='text-neutral-900 text-3xl font-bold'>{value}</h3>
			</div>
		</div>
		<div className='absolute inset-0 bg-gradient-to-br from-white to-emerald-200 opacity-30' />
		<div className='absolute -bottom-4 -right-4 text-emerald-800 opacity-50'>
			<Icon className='h-32 w-32' />
		</div>
	</motion.div>
);
export default AnalyticsTab
