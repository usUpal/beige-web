import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
//import errorImage from '/assets/images/errors/403not_found_image.svg'
import errorCircel from '../../public/assets/images/error/circel.png'
import errosShapeThree from '../../public/assets/images/error/errosShapeThree.svg'

function AccessDenied() {
  return (
    <div className='relative'>
      <div className='h-screen  w-full m-auto flex flex-col justify-center'>
        <h1 className='text-[170px] font-bold text-center leading-[130px] mb-3'>403</h1>

        <h2 className='text-center text-4xl font-bold mt-5'>Access denied</h2>
        <p className='text-center text-lg font-normal mb-4'>You are not eligible for the permission access</p>

        <Link href={'/dashboard'} className='justify-center flex mt-2'>
          <button className='btn btn-danger '>Back to Dashboard</button>
        </Link>
      </div>
      <div className='h-[22px] w-[22px] absolute top-[10%] left-[10%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-12 w-12'
        />
      </div>
      <div className='h-[35px] w-[35px] absolute top-[20%] right-[10%]'>
        <Image
          src={errosShapeThree}
          alt="Access Denied"
          layout="responsive"
          className='h-[35px] w-[35px]'
        />
      </div>
      <div className='h-[35px] w-[35px] absolute top-[30%] left-[10%]'>
        <Image
          src={errosShapeThree}
          alt="Access Denied"
          layout="responsive"
          className='h-[35px] w-[35px]'
        />
      </div>
      <div className='h-[35px] w-[35px] absolute top-[10%] left-[50%]'>
        <Image
          src={errosShapeThree}
          alt="Access Denied"
          layout="responsive"
          className='h-[35px] w-[35px]'
        />
      </div>
      <div className='h-[35px] w-[35px] absolute bottom-[20%] left-[30%]'>
        <Image
          src={errosShapeThree}
          alt="Access Denied"
          layout="responsive"
          className='h-[35px] w-[35px]'
        />
      </div>

      <div className='h-[22px] w-[22px] absolute bottom-[20%] left-[10%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-[22px] w-[22px]'
        />
      </div>
      <div className='h-[22px] w-[22px] absolute bottom-[20%] right-[10%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-[22px] w-[22px]'
        />
      </div>
      <div className='h-[22px] w-[22px] absolute bottom-[20%] right-[50%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-[22px] w-[22px]'
        />
      </div>
      <div className='h-[22px] w-[22px] absolute bottom-[10%] right-[30%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-[22px] w-[22px]'
        />
      </div>
      <div className='h-[22px] w-[22px] absolute top-[30%] left-[30%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-[22px] w-[22px]'
        />
      </div>
      <div className='h-[22px] w-[22px] absolute top-[20%] left-[50%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-[22px] w-[22px]'
        />
      </div>
      <div className='h-[22px] w-[22px] absolute top-[30%] right-[20%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-[22px] w-[22px]'
        />
      </div>
      <div className='h-[22px] w-[22px] absolute top-[10%] right-[10%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-12 w-12'
        />
      </div>
      <div className='h-[22px] w-[22px] absolute top-[5%] left-[5%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-12 w-12'
        />
      </div>
      <div className='h-[22px] w-[22px] absolute top-[10%] left-[10%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-12 w-12'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute bottom-[30%] left-[10%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute top-[20%] right-[20%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[14px] w-[14px] absolute bottom-[20%] right-[40%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-12 w-12'
        />
      </div>
      <div className='h-[14px] w-[14px] absolute bottom-[10%] right-[40%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-12 w-12'
        />
      </div>
      <div className='h-[14px] w-[14px] absolute bottom-[30%] right-[30%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-12 w-12'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute bottom-[20%] right-[20%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute bottom-[0%] right-[20%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute top-[0%] right-[40%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute top-[7%] right-[20%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute top-[7%] left-[20%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute top-[7%] left-[40%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute bottom-[7%] left-[40%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute bottom-[5%] left-[20%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute bottom-[5%] left-[30%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute top-[50%] left-[20%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute bottom-[60%] left-[10%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>
      <div className='h-[16px] w-[16px] absolute bottom-[30%] right-[20%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-14 w-14'
        />
      </div>
      <div className='h-[10px] w-[10px] absolute bottom-[50%] right-[10%]'>
        <Image
          src={errorCircel}
          alt="Access Denied"
          layout="responsive"
          className='h-10 w-10'
        />
      </div>

    </div >
  )
}

export default AccessDenied
