import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./HistoryDetailCom.module.css";
import Api from '../../Api/Api';
import play from './play.png'
import pause from './pause.png'

const HistoryDetail = () => {
  const { title } = useParams(); // title 값 추출
  const decodedTitle = decodeURIComponent(title);
  const [hisDetailResults, sethisDetailResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [nickname, setNickname] = useState("Guest");

  const f1 = async () => {
    try {
      const response = await Api.get("/api/v1/users");
      setNickname(response.data.data.nickname);
    } catch (error) {
      console.error(error);
    }
  };

  const getHistoryDetail = async () => {
    try {
      const response = await Api.get("/api/v1/result/history");
      const matchingItems = response.data.data.results.filter((item) => item.title === decodedTitle);
      console.log(matchingItems);
      sethisDetailResults(matchingItems.map(item => ({ ...item, audio1: new Audio(item.mrFile), audio2: new Audio(item.recordFile) })));

    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const formattedDate = dateString.slice(5, 16)
      .replace('-', '/')
      .replace('T', ' ');
    return formattedDate;
  };

  const playAudio = (index) => {
    if (activeIndex !== null) {
      pauseAudio(activeIndex);
    }

    setActiveIndex(index);
    hisDetailResults[index].audio1.play();
    hisDetailResults[index].audio2.play();
  };

  const pauseAudio = (index) => {
    setActiveIndex(null);
    hisDetailResults[index].audio1.pause();
    hisDetailResults[index].audio1.currentTime = 0; // 오디오 시간 초기화
    hisDetailResults[index].audio2.pause();
    hisDetailResults[index].audio2.currentTime = 0; // 오디오 시간 초기화
  };

  useEffect(() => {
    f1();
    console.log(title);
    getHistoryDetail();
  }, []);

  return (
    <div>
      <h3 className={styles.titleMent}>{`내가 부른 ${decodedTitle} 🎵`}</h3>
      <p className={styles.growthMent}>마이페이지에서 성장그래프를 확인하세요</p>
      {hisDetailResults.map((item, index) => (
        <div key={index} className={styles.hisDetail}>
          <div className={styles.dataNBtn}>
            <p className={styles.dateTime}>{formatDate(item.createdDateTime)}</p>
            {activeIndex === index ? (
              <img className={styles.playBtn} alt="pause" src={pause} onClick={() => pauseAudio(index)}/>
            ) : (
              <img className={styles.playBtn} alt="play" src={play} onClick={() => playAudio(index)}/>
            )}
          </div>
          <hr className={styles.line}/>
        </div>
      ))}
    </div>
  );
};

export default HistoryDetail;
