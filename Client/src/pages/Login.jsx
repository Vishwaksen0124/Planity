import React, { useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import Textbox from '../components/Textbox';
import Button from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';

import { useLoginMutation } from '../redux/slices/api/authApiSlice';
import { toast } from 'sonner';
import { setCredentials } from "../redux/slices/authSlice"
import Loading from '../components/Loader';

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation()

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      if(result?.role == "Admin"){
        navigate('/dashboard');
      }else{
        navigate('/tasks')
      }
      console.log(result)
    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || error.message);

    }
  }


  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
              Manage all your tasks in one place!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Planity</span>
            </p>
            <div className='cell'style={{ display:'flex',justifyContent:'center',alignItems:'center',width: '800px', height: '400px' }}>
              <img src='./image.png'/>
            </div>
          </div>

        </div>
        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div>
              <p className='text-purple-600 text-3xl font-bold text-center'>🖋️ Welcome back 📚</p>
              <p className='text-center text-base text-gray-700 font-bold py-1'>
                Hustle now for a better Tommorow
              </p>
            </div>
            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='email@something.com'
                type='email'
                name='emai'
                label='Email Address'
                className='w-full rounded-full'
                register={
                  register("email", {
                    required: "Email address required!",
                  })
                }
                errors={errors.email ? errors.email.message : ""}

              />

              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='password'
                className='w-full rounded-full'
                register={
                  register("password", {
                    required: "password is required!",
                  })
                }
                errors={errors.password ? errors.password.message : ""}

              />
              {isLoading ? (
                <Loading />
              ) : (
                <Button
                  type='submit'
                  label='Submit'
                  className='w-full h-10 bg-blue-700 text-white'
                />
              )}
              <a href='/register'>Don't have an account</a>
            </div>


          </form>



        </div>
      </div>

    </div>
  )
}

export default Login