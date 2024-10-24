import Product from "../models/Product.js"
import User from "../models/User.js"
import Order from "../models/Order.js"

export const getAnalyticsData = async ()=>{
    try { 
        const TotalUser = await User.countDocuments();
        const TotalProducts = await Product.countDocuments();
        const sales = await Order.aggregate([
            {
                $group : {
                    _id : null , 
                    totalSales : {$sum  : 1},
                    totalRevenue : {$sum : "$totalAmount"}

                }
            }
        ]);
        
        const {totalSales , totalRevenue} = sales[0] || { totalSales : 0 , totalRevenue :  0} ;
        
        return {
            users : TotalUser , 
            products : TotalProducts ,
            sales : totalSales ,
            revenue : totalRevenue
        }
    }catch(error){
        console.log("error occured in getAnalyticsData"+ error);
        return {message : "server error" , error : error.message}
    }

}


export const  getdailySalesData = async (startDate ,endDate)=>{

        try  { 
            const dailySalesData  = await Order.aggregate([
                {
                    $match : {
                        createdAt : { 
                            $gte  : startDate, 
                            $lte : endDate,
                        },
                    },
                },
                {
                    $group : {
                        _id  : { $dateToString : {format : "%Y-%m-%d" , date : "$createdAt"}},
                            sales  : {$sum  :1}, 
                            revenue : {$sum : "$totalAmount"}
                        }
                },
                { $sort : {_id : 1}}
            ])
            
            // example of dailySalesData
            // [
            // 	{
            // 		_id: "2024-08-18",
            // 		sales: 12,
            // 		revenue: 1450.75
            // 	},
            // ]
    
            const dateArray  =   getDatesInRange(startDate , endDate)
            // console.log(dateArray) // ['2024-08-18', '2024-08-19', ... ]
            return dateArray.map(date => {
                const foundData = dailySalesData.find(item => item._id === date);
                 return {
                    date :date , 
                    sales : foundData?.sales ||  0 , 
                    revenue : foundData?.revenue || 0
                 }
            })
        }catch(error){
            console.log("error occured in getdailySalesData"+ error);
            return {message : "server error" , error : error.message}
        }
}
 function getDatesInRange(startDate , endDate){
    const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0]);
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;


}