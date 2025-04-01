import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes/routes'
import { Provider } from 'react-redux'
import { store } from './helpers/store'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes />
      <ToastContainer />
    </BrowserRouter>
  </Provider>


)
