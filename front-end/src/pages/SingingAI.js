import React from "react";
import { Link } from "react-router-dom"
import Header from "../components/commonUse/Header"
import Footer from '../components/commonUse/Footer';
import AISearchBar from "../components/AI/AISearchBar";

const SearchResult = () =>{
    return(
      <>
        <Header/>
        <button><Link to="/mypage">뒤로가기</Link></button>
        <AISearchBar/>
        <Footer/>
      </>
  )
}
export default SearchResult