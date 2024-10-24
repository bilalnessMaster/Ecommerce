import React , {useEffect, useState  }from 'react'
import {motion} from 'framer-motion'
import {Link, useNavigate} from 'react-router-dom'
import {UserPlus  , Mail , Lock  , User , ArrowRight , Loader} from 'lucide-react'
import { useUserStore } from '../stores/useUserStore'
const SignupPage = () => {
  const {signup , user , loading } = useUserStore()
  
  const [formData  , setFormData] = useState({
    name : "", 
    email  : "",
    password  : "" , 
    confirmaPassword  : '',
  })
  
  const handleSubmit = (e) => {
      e.preventDefault()
      signup(formData)
  }
  return (
    <div className='container mx-auto flex flex-col  justify-center items-center '>
          <motion.div 
          className='sm:mx-auto sm:w-full sm:max-w-md'
          initial = {{
            opacity : 0 , 
            y : -20 , 

          }}
          animate ={{ 
            opacity  :1 , 
            y : 0

          }}
          transition = {{ 
            duration : 0.8 , 
          }}
          
          >

            <h1 className='mt-6 text-center  text-3xl font-bold text-neutral-600'>Create your account </h1>

          </motion.div>

          <motion.div  className='mt-8 sm:mx-auto md:max-w-md' initial={{ opacity :  0  , y: 20}}
          animate = {{opacity : 1 , y : 0}}
          transition = {{ duration : 0.8 }}>
          <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 w-[400px] md:w-[500px] '>
            <form action="" onSubmit={handleSubmit} className='space-y-5 w-full' method="post" >
                    <div className='font-semibold flex flex-col  '>
                      <label htmlFor="name  " className='mb-[4px]'>
                        Full name
                      </label>
                      <div className='relative '>
                          <div className='absolute inset-y-0 left-0 flex items-center px-2 '>
                          <User  /> 
                          </div>
                        <input name="name" 
                        id='name'
                        type='text'
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        
                        className='w-[100%] outline outline-2 text-sm font-normal outline-[#c98d51]/65 text-[#d4a373] focus:outline-[#ccd5ae] px-9 py-[8px] rounded-md'
                        placeholder='John doe' />
                      </div>
                    </div>
                    <div className='font-semibold flex flex-col  '>
                      <label htmlFor="name "  className='mb-[4px]'>
                        Email 
                      </label>
                      <div className='relative '>
                          <div className='absolute inset-y-0 left-0 flex items-center px-2 '>
                          <Mail  /> 
                          </div>
                        <input id='email'
                        type='email'
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              
                        placeholder='Email@example.com'
                        className='w-[100%] outline outline-2 text-sm font-normal outline-[#c98d51]/65 text-[#d4a373] focus:outline-[#ccd5ae] px-9 py-[8px] rounded-md' />
                      </div>
                    </div>
                    <div className='font-semibold flex flex-col  '>
                      <label htmlFor="name "  className='mb-[4px]'>
                        Password 
                      </label>
                      <div className='relative '>
                          <div className='absolute inset-y-0 left-0 flex items-center px-2 '>
                          <Lock  /> 
                          </div>
                        <input id='password'
                            type='password'
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        
                        placeholder='********'
                        className='w-[100%] outline outline-2 text-sm font-normal outline-[#c98d51]/65 text-[#d4a373] focus:outline-[#ccd5ae] px-9 py-[8px] rounded-md' />
                      </div>
                    </div>
                    <div className='font-semibold flex flex-col  '>
                      <label htmlFor="name "  className='mb-[4px]'>
                        Confirm Password 
                      </label>
                      <div className='relative '>
                          <div className='absolute inset-y-0 left-0 flex items-center px-2 '>
                          <Lock  /> 
                          </div>
                        <input id='confirmPassword'
                                type='password'
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                           
                        
                        placeholder='********'
                        className='w-[100%] outline outline-2 text-sm font-normal outline-[#c98d51]/65 text-[#d4a373] focus:outline-[#ccd5ae] px-9 py-[8px] rounded-md' />
                      </div>
                    </div>
                    <button
							type='submit'
							className='w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-sm font-medium text-[#818a3b] bg-[#e9edc9]
							 hover:bg-[#d9e19c] focus:outline-none focus:ring-2 focus:ring-offset-2
							  focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
							disabled={loading}
						>
							{loading ? (
								<>
									<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
									Loading...
								</>
							) : (
								<>
									<UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
									Sign up
								</>
							)}
						</button>


            </form>
            <p className='mt-8 text-center text-sm text-gray-400'>
						Already have an account?{" "}
						<Link to='/login' className='font-medium text-neutral-400 hover:text-neutral-300'>
							Login here <ArrowRight className='inline h-4 w-4' />
						</Link>
					</p>
          </div>
          </motion.div>
      
    </div>
  )
}

export default SignupPage
