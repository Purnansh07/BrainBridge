import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Landing from './components/Landing';
import Footer from './components/Footer';
import GeminiPro from './components/GeminiPro';
import Autism from './components/Autism';
import SearchBar from './components/YoutubeSearch';
import AutismTherapy from './components/AutismTherapy';
import NoAutism from './components/NoAutism';
import OCD from './components/OCD';
import Dyslexia from './components/Dyslexia';
import Chatbot from './components/Chatbot';
import { ClerkProvider } from '@clerk/clerk-react';

// Get Clerk publishable key from environment variable
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_YWRhcHRlZC1qYWNrYWwtNTMuY2xlcmsuYWNjb3VudHMuZGV2JA";

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Landing />} />
        <Route path="/gemini" exact element={<GeminiPro />} />
        <Route path="/autism" exact element={<Autism/>} />
        <Route path={`/yt/:id`} exact element={<SearchBar/>} />
        <Route path='/autismTherapy' element={<AutismTherapy/>}/>
        <Route path='/noAutism' element={<NoAutism/>}/>
        <Route path="/yt" exact element={<SearchBar/>} />
        <Route path="/ocd" exact element={<OCD/>} />
        <Route path="/game1Instructions" exact element={<Dyslexia/>} />
      </Routes>
      <Chatbot />
      <Footer/>
    </ClerkProvider>
  )
}

export default App
