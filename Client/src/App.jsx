
import './App.css'
import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {


 

  return (
    <div className='App'>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/chats' element={<ChatPage/>}/>
      <Route path='*' element={<NotFoundPage/>}/>
    </Routes>
   

 
    </div>
  )
}

export default App
