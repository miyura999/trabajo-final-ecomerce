import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <h1 className="text-4xl font-bold text-center">404 - Página No Encontrada</h1>
      <p className="text-center mt-4 text-gray-600">Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="block text-center mt-6 text-blue-600 hover:underline">
        Volver a la página principal
      </Link>

    </div>
  )
}

export default PageNotFound
