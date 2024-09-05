import React from 'react'

type ButtonProps = {
  children: string,
}

const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button
      // className=" rounded-md border-2 border-[#b7aa85] px-4 py-1 text-[#b7aa85]"
      className='capitalize bg-black px-4 py-1 rounded text-white text-[14px]'
      type='submit'
    > {children}</button>
  )
}

export default Button
