
import Link from 'next/link'
import React from 'react'

function AccessDenied() {
  return (
    <div>
      <h2 className='text-4xl font-bold text-red-500'>Content Notfound</h2>
      <Link href={'/dashboard'}>Dashboard</Link>
    </div>
  )
}

export default AccessDenied



























