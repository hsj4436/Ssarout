import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from "./HistoryDetailCom.module.css";
import Api from '../../Api/Api';
import play from './play.png'
import pause from './pause.png'

const HistoryDetail = () => {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const [hisDetailResults, sethisDetailResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const getHistoryDetail = async () => {
    try {
      const response = await Api.get("/api/v1/result/history");
      const matchingItems = response.data.data.results.filter((item) => item.title === decodedTitle);
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
    hisDetailResults[index].audio2.onended = () => {
      pauseAudio(index);
    };
  };

  const pauseAudio = (index) => {
    setActiveIndex(null);
    hisDetailResults[index].audio1.pause();
    hisDetailResults[index].audio1.currentTime = 0;
    hisDetailResults[index].audio2.pause();
    hisDetailResults[index].audio2.currentTime = 0;
  };
  
  useEffect(() => {
    console.log(title);
    getHistoryDetail();
    let stopSongInterval;
    stopSongInterval = setInterval(() => {
      if (!window.location.pathname.includes('/history/') && activeIndex !== null) {
        pauseAudio(activeIndex);
        clearInterval(stopSongInterval);
      }
    }, 100);
    return () => {
      clearInterval(stopSongInterval);
      if (activeIndex !== null) {
        pauseAudio(activeIndex);
      }
    };
  }, [activeIndex]);

  return (
    <div>
      <h3 className={styles.titleMent}>{`내가 부른 ${decodedTitle} 🎵`}</h3>
      <p className={styles.growthMent}>마이페이지에서 성장그래프를 확인하세요</p>
      {hisDetailResults && (
        hisDetailResults.map((item, index) => (
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
      ))
      )}
    </div>
  );
};

export default HistoryDetail;
