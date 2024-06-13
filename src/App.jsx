import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import Login from '~/pages/Auth/login'
import Register from '~/pages/Auth/register'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/" element={<Login />} />
        <Route path="/home" element={<Board />} />
      </Routes>
    </Router>
  )
}

export default App
