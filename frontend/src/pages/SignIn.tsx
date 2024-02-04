import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export type SignInFormData = {
    email: string;
    password: string;
}

const SignIn = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {showToast} = useAppContext();
    const location = useLocation();
    const {register,handleSubmit, formState: { errors } } = useForm<SignInFormData>();
    const mutation = useMutation(apiClient.signIn,{
        onSuccess:async ()=>{
            showToast({message:"Sign In successfull!",type:"SUCCESS"})
            await queryClient.invalidateQueries("validateToken")
            navigate(location.state?.from?.pathname || "/") 
        },
        onError:(error:Error)=>{
            showToast({message:error.message,type:"ERROR"})
        }
    });
    const onSubmit = handleSubmit((data)=>{
        mutation.mutate(data);
    })
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <h2 className="text-3xl font-bold">Sign In</h2>

        <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input
                    type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", { required: "This field is required" })}
                ></input>
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {
                        required: "This field is required",
                        minLength: {
                            value: 6,
                            message: "Password must be atleast 6 characters",
                        },
                    })}
                ></input>
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            <span className="flex item-center justify-between">
                <span className="text-sm">
                    Not Registered? <Link to="/register" className="underline">Create an account here</Link>
                </span>
                <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                    Sign In
                </button>
            </span>
    </form>
  )
}

export default SignIn