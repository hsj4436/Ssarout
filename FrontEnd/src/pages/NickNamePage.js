import React, { useEffect } from "react";
import Footer from "../components/commonUse/Footer";
import Api from "../Api/Api";
import styles from "./NickNamePage.module.css";


const Redirecion = ({history}) => {
  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    getUserInfo();
  }, []);


  let profileImg;
  const getUserInfo = async () => {
    try {
      await Api.get("/api/v1/users").then((response) => {
        profileImg = response.data.data.profileImg;
        if (response.data.data.nickname != null) {
          window.location.replace("/");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const f2 = async () => {
    try {
      const nn = document.querySelector("#nickname").value;
      if (!nn) {
        window.alert("닉네임을 입력해주세요");
        return;
      }
      
      await Api.put("/api/v1/users", {
        nickname: nn,
        profileImg: profileImg,
      }).then((response) => {
        window.location.replace("/");
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div class="container">
      <div className={styles.logoContainer}>
        <div className={styles.div1}>싸:라웃</div>
      </div>
      <p className={styles.loginMent}><span className={styles.logo}>싸:라웃</span>에서 이용할 닉네임을 설정해주세요!</p>
      <hr className={styles.line}/>
      <form>
        <input className={styles.changeNickname} id="nickname" type="text"></input>
        <br/>
        <button className={styles.changeBtn} onClick={f2}>확인</button>
      </form></div>
      <Footer/>

    </div>
  );
};
export default Redirecion;
