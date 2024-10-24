import {create} from 'zustand'
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { Navigate } from 'react-router-dom';


export const useUserStore = create((set , get) => ({
        user : null , 
        loading : false , 
        checkingAuth : false , 
        signup : async ({name , email , password , confirmPassword}) =>{
            set({loading : true})
            if(password !== confirmPassword){
                 set({loading : false})
                toast.error("passwords do not match")
                return
            }
            try{

                const {data} = await axios.post("/auth/signup" , {name , email , password})
                if(!data) return    
                
                set({user : data.user ,loading : false})
          
                toast.success("user created successfully")
             }catch(error){
                set({loading : false})
                toast.error(error.response.data.message || "something went wrong")
             }
        
    }, 
    login : async ({email , password}) =>{
        set({loading : true})
        try{
            const {data} = await axios.post("/auth/login" , {email , password})
            if(!data) return
            set({user : data.user , loading  : false})
           
            toast.success("login successfully")
        }catch(error){
            set({loading : false})
            toast.error(error.response.data.message || "something went wrong")
        }


    } , 
    checkAuth : async () =>{
        set({checkingAuth : true})
        try { 
            const {data} = await axios.get("/auth/profile")
            set({user : data ,checkingAuth : false})
            
        }catch(error){
            set({checkingAuth : false})

        }

    },
    logout : async () =>{
            try { 
                const log = await axios.post("/auth/logout")
                set({user : null})
                toast.success("logged out successfully")
            }catch(error){
                    toast.error(error.response.data.message || "something went wrong")
            }


    },
    refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},

}))
   


let refreshPromise = null; 

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
                console.log("refreshPromise: "+ refreshPromise);
                
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);