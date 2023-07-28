import React from "react";
import { Link } from "react-router-dom"
import Header from "../components/commonUse/Header"
import AISearchBar from "../components/AI/AISearchBar";

const SearchResult = () =>{
    // const location = useLocation()
    // const data = location.state.data
    return(
      <>
        <Header/>
        <button><Link to="/mypage">뒤로가기</Link></button>
        <AISearchBar/>
      </>
  )
}
export default SearchResult