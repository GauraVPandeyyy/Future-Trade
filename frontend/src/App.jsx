import 'react-toastify/dist/ReactToastify.css';
import { RouterProvider } from 'react-router-dom'
import router from './routes.jsx/router.jsx'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext.jsx';
// import './App.css';
function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </>

  )
}
export default App;