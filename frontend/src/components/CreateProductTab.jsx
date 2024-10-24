import React, { useState } from 'react'
import  {motion} from 'framer-motion'
import { useProductStore } from '../stores/useProductStore';
import { Loader, PlusCircle } from 'lucide-react';


const categories = ["jeans", "t-shirts", "shoes", "glasses", "jackets", "suits", "bags"];
const CreateProductTab = () => {
    const {createProduct ,loading} = useProductStore ()
    const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",
	});

	

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(loading);
		
		
		try {
			await createProduct(newProduct);
			setNewProduct({ name: "", description: "", price: "", category: "", image: "" });
		} catch(error) {
			console.log("error creating a product" + error);
		}
		console.log(loading);
	};
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file){ 
			const reader = new FileReader() ; 
			reader.onload = () => {
				setNewProduct({...newProduct , image  : reader.result})
			}
			reader.readAsDataURL(file)
		}
	}
	

	

	return (
			<div className='flex justify-center items-center flex-col'>
				<h1 className='text-center text-2xl font-bold'>Create Product</h1>
				<div>
					<form action="" method="post" onSubmit={handleSubmit} className='space-y-1 '>
						<div className='flex justify-start items-start gap-1 flex-col py-1 w-full'>
							<label htmlFor="name">
								Product name
							</label>
							<input
							className='w-96  text-lg outline outline-[1px] border-gray-300 px-2 py-1 rounded-md'
							
							type="text" name="name" id="name" required  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
						</div>
						<div className='flex justify-start items-start gap-1 flex-col w-full'>
						<label htmlFor='description' >
						Description
						</label>
						<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='3'
						className='w-96  text-lg outline outline-[1px] border-gray-300 px-2 py-1 rounded-md'
						required
					/>
					</div>
					<div className='flex justify-start items-start gap-1 flex-col w-full'>
					<label htmlFor='price' className=''>
						Price
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='0.01'
						className='w-96  text-lg outline outline-[1px] border-gray-300 px-2 py-1 rounded-md'
						
						required
					/>
					</div>
					<div className='flex justify-start items-start gap-1 flex-col w-full'>
					<label htmlFor='category' >
						Category
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='w-96  text-lg outline outline-[1px] border-gray-300 px-2 py-1 rounded-md'
						required
					>
						<option value=''>Select a category</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
					</div>
					<div className='flex justify-start items-start gap-1 py-2 flex-col w-full'>
						
					<label htmlFor="image" className='w-96 border h-14 flex justify-center items-center text-lg outline outline-[1px] border-gray-300 px-2  py-1 rounded-md'>
							<h1>upload an image</h1>
							<input type="file" name="image" id="image" onChange={handleImageChange}   className='hidden'/>						
						
						
						</label>	
						
						
					</div>	
					<button
					type='submit'
					className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-gray-300  
					focus:outline-none focus:ring-2 focus:ring-offset-2'
					
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Loading...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Create Product
						</>
					)}
				</button>	
					</form>
				</div>
			</div>
  )
}

export default CreateProductTab
