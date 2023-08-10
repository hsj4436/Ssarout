import { ScoreDrawer } from "./ScoreDrawer";
import ToneDetector from "./ToneDetector";
import ToneGenerator from "./ToneGenerator";
import { Note, parseScore } from "./ScoreParser";
import Sharer from "./Sharer";

import SongEditor from "./SongEditor";
import createElem from "./DOMUtil";
import Api from "../Api/Api";

const UPDATE_INTERVAL = 1000 / 60;

export class Test {
  constructor(appContainer,songId,rerecordlyrics) {
    this.detector = null;
    this.drawer = null;
    // this.player = null;
    this.wrapper = null;
    this.lastTime = 0;
    this.elapsed = 0;
    this.audio = null;
    this.inited = false;
    this.key = 0;
    this.playMusic = true;
    this.sharer = new Sharer();
    this.songEditor = new SongEditor();
    this.blind = null;
    this.response = null;
    this.loop = this.loop.bind(this);
    this.drawer = new ScoreDrawer();
    this.createElements();
    appContainer.appendChild(this.wrapper);
    requestAnimationFrame(this.loop);
    this.score = [];
    this.soundFile = null;
    this.BlobUrl = ""
    this.songId = songId
    this.rerecordlyrics = rerecordlyrics
    
  }

  async createElements() {
    this.blind = createElem("div", { class: "blind" }, "Click to start app");
    const wrapper = createElem("div", {});
    const canvasContainer = createElem("div", {});
    const canvas = this.drawer.renderElement();
    canvasContainer.appendChild(canvas);
    this.drawer.start([]);

    wrapper.appendChild(canvasContainer);

    wrapper.appendChild(this.songEditor.render());
    wrapper.appendChild(this.sharer.render());
    this.wrapper = wrapper;
    this.bindEvents();
    document.body.appendChild(this.blind);
    try{
      this.response = await Api.get("api/v1/song/info", {params:{songId:9}});
      this.response = this.response.data.data;
      console.log(this.response)

    }
    catch(e){
      console.error(e)
    }
  }

  bindEvents() {
    this.sharer.on("song-select", this.songSelected.bind(this));

    this.songEditor.on("play", async () => {
      if (!this.inited) return;
      this.detector.recording(); // 녹음 시작
      // setTimeout(() => { // 노래 시간에 따라 맞춰야함
      // 서버 될때는 이걸로
      console.log(this.songEditor.score.length)
      if(this.songEditor.score.length > 0){
        // this.playSong(parseScore(this.response.lyrics));
        // 로컬서버든 뭐든 서버 안될때는 이걸로 
        this.playSong(parseScore(this.songEditor.score))
        // }, 9100);
      } else {
        console.log(this.songEditor.score)
        console.log(this.rerecordlyrics)
        this.playSong(this.rerecordlyrics)
      }
    });
    this.songEditor.on("stop", this.stopSong.bind(this));
    this.songEditor.on("key-up", this.keyUp.bind(this));
    this.songEditor.on("key-down", this.keyDown.bind(this));
    this.songEditor.on("change", (prop, value) => {
      switch (prop) {
        case "melody":
          this.toggleSound(value);
          break;
        case "volume":
          this.setVolume(value);
          break;
      }
    });

    this.blind.addEventListener("click", async () => {
      await this.init();
      this.blind.style.display = "none";
    });
  }

  // @autobind 데코레이터를 제거하고 바인딩된 메소드를 정의합니다.
  songSelected(song) {
    this.songEditor.score = song.score;
  }

  async init() {
    this.audio = new (window.AudioContext || window.webkitAudioContext)();
    this.detector = new ToneDetector(this.audio);
    // this.player = new ToneGenerator(this.audio);

    this.detector.on("note", this.onNote.bind(this));
    await this.detector.init();
    this.inited = true;
    this.drawer.inited();
  }

  
  playSong(notes) {
    console.log(notes,"d요기요기요기")
    this.drawer.start(notes);
  }
  getBlobUrl(data){
    this.detector.recording(data);
    setTimeout(() =>{
      this.BlobUrl = this.detector.Url
    })
    
  }
  // @autobind 데코레이터를 제거하고 바인딩된 메소드를 정의합니다.
  stopSong() {
    this.score = this.drawer.scores();
    
    let data = this.drawer.stop();
    
    // 서버에서 실행 할 때는 주석해제
    // data.notes = parseScore(this.response.lyrics)
    
    console.log(parseScore(this.songEditor.score))
    data.notes = parseScore(this.songEditor.score)
    data.songId = this.songId.songId

    // this.drawer.start([]);
    // this.detector.recording();
    this.getBlobUrl(data)
    setTimeout(()=>{
      this.drawer.setStopRecord(false);

    })
    setTimeout(() => {
      // console.log(this.BlobUrl)
      data.BlobUrl = this.BlobUrl
      if(this.songEditor.score.length > 0){
        window.localStorage.setItem("data", JSON.stringify(data))
        window.location.href="/analysis"
      }});
  }

  // @autobind 데코레이터를 제거하고 바인딩된 메소드를 정의합니다.
  onNote(note) {
    this.drawer.pushNote(note);
  }

  loop(time) {
    const stopRecord = this.drawer.getStopRecord();

    if (stopRecord) {
      //mr 끝났을때 녹음 완료
      this.stopSong();
    }

    if (this.lastTime === 0) {
      this.lastTime = time;
    }
    const delta = time - this.lastTime;
    this.elapsed += delta;
    this.lastTime = time;

    while (this.elapsed > UPDATE_INTERVAL) {
      this.update(UPDATE_INTERVAL);
      this.elapsed -= UPDATE_INTERVAL;
    }

    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }

  update(delta) {
    if (!this.inited) return;

    this.detector.update(delta);
    this.drawer.update(delta);
    if (this.playMusic) {
      const note = this.drawer.getCurrentNote();
      // this.player.playNote(note, this.key);
    }
  }

  render() {
    this.drawer.render();
  }

  // setVolume(v) {
  //   this.player.setVolume(v);
  // }

  toggleSound(force) {
    if (force === undefined) {
      this.playMusic = !this.playMusic;
    } else {
      this.playMusic = force;
    }
    // if (!this.playMusic) {
    //   this.player.playTone(0);
    // }
  }

  // @autobind 데코레이터를 제거하고 바인딩된 메소드를 정의합니다.
  keyUp() {
    this.setKey(this.key + 1);
  }

  // @autobind 데코레이터를 제거하고 바인딩된 메소드를 정의합니다.
  keyDown() {
    this.setKey(this.key - 1);
  }

  setKey(key) {
    this.key = key;
    this.songEditor.key = key;
    this.drawer.octav = this.key;
  }
}

export default Test;
