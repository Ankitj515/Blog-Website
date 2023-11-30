
import './App.css';
import Header from './header';
import Layout from './layout';
import IndexPages from './pages/IndexPages';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePost from './pages/CreatePost';
import Post from './post';
import {Route, Routes} from 'react-router-dom';
import { UserContextProvider } from './usercontext';
import PostPage from './pages/PostPage';
import EditPost from './pages/EditPost';
function App() {
  return (
    <main>

      <UserContextProvider>
      <Routes>
      <Route path="/" element={<Layout />}> 
      <Route index element={<IndexPages />}></Route>
      <Route path="/login" element= {<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/post/:id" element={<PostPage/>} />
      <Route path="/edit/:id" element={<EditPost></EditPost>} />
      </Route>
      
      
      </Routes> 

      </UserContextProvider>
     
     
     
         
    </main>
    
  );
}

export default App;
