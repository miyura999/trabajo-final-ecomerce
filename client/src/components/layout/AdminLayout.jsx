import Sidebar from './Sidebar'
import Header from './Header'

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      <Sidebar />

      {/* Contenedor vertical */}
      <div className="flex-1 flex flex-col min-h-screen">

        <Header />

        {/* Contenido que crece */}
        <main className="flex-1 container mx-auto px-6 py-8">

            Aqui va todo
        </main>


      </div>

    </div>
  )
}

export default AdminLayout
