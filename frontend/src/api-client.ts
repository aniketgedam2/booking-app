import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {hotelType} from "../../backend/src/shared/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||"";

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials:"include",// to set the incomming cookies in browser.
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const reponseBody = await response.json();

  if(!response.ok){
    throw new Error(reponseBody.message)
  }
};


export const signIn = async (formData:SignInFormData)=>{
  const response = await fetch(`${API_BASE_URL}/api/auth/login`,{
    method:"POST",
    credentials:"include",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(formData)
  })
  const body = await response.json();
  if(!response.ok){
    throw new Error(body.message);
  }
  return body;
}

export const validateToken = async()=>{
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`,{
    credentials:"include"
  })

  if(!response.ok){
    throw new Error("Token Invalid");
  }
  return response.json();
}

export const signOut = async ()=>{
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`,{
    credentials:"include",
    method:"POST",
  });

  if(!response){
    throw new Error("Error during sign Out")
  }
}

export const addMyHotel = async (hotelFormData:FormData)=>{
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
    method:"POST",
    credentials:"include",
    body:hotelFormData
  })
  if(!response.ok){
    throw new Error("Failed to add hotel")
  }
  return response.json();
}

export const fetchMyHotels = async():Promise<hotelType[]>=>{
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`,{
    credentials:"include"
  })

  if(!response.ok){
    throw new Error("Error fetching hotels");
  }

  return response.json();
}

export const fetchMyhotelById = async(hotelId:string):Promise<hotelType>=>{
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`,{
    credentials:"include"
  })

  if(!response.ok){
    throw new Error("Error fetching hotel")
  }

  return response.json();

}

export const updateMyHotelById = async (hotelFormData:FormData)=>{
  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,{
      method:"PUT",
      body:hotelFormData,
      credentials:"include"
    }
  );
  if(!response.ok){
    throw new Error ("Failed to update hotel");
  }

  return response.json();
}

