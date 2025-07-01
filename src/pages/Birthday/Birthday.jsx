import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Slider, Modal } from '@douyinfe/semi-ui';
import Particles from 'react-tsparticles';
import { loadFireworksPreset } from 'tsparticles-preset-fireworks';
import './Birthday.css';

const Birthday = () => {
  const audioRef = useRef(null);
  const isTogglingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(100); // 0~100
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);


  // 🎆 烟花背景初始化
  const particlesInit = useCallback(async (engine) => {
    await loadFireworksPreset(engine);
  }, []);

  // 🎵 尝试自动播放背景音乐（不会报错）
  useEffect(() => {
    const tryAutoPlay = async () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = volume / 100;

      try {
        await audio.play();
        setPlaying(true);
      } catch (err) {
        console.warn('自动播放失败，用户需手动播放', err);
      }
    };
    tryAutoPlay();
  }, []);

  // 🔊 音量调节
  const handleVolumeChange = (val) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = val / 100;
    setVolume(val);
  };

  // ▶️/⏸ 切换音乐播放
  const toggleMusic = () => {
    if (isTogglingRef.current) return;
    isTogglingRef.current = true;

    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch((e) => console.error('播放失败:', e))
        .finally(() => {
          isTogglingRef.current = false;
        });
    } else {
      audio.pause();
      setPlaying(false);
      isTogglingRef.current = false;
    }
  };

  return (
    <div className="birthday-wrapper">
      {/* 🎆 动态背景 */}
      <Particles
        init={particlesInit}
        options={{
          preset: 'fireworks',
          background: { color: { value: 'transparent' } },
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* 🎵 背景音乐 */}
      <audio ref={audioRef} loop>
        <source src="/happy birthday.mp3" type="audio/mpeg" />
        您的浏览器不支持 audio 标签。
      </audio>

      {/* 左上角音乐控制区 */}
      <div className="music-controls">
        {/* 🎵 播放按钮 */}
        <Button
          size="small"
          type="primary"
          theme="solid"
          onClick={toggleMusic}
        >
          {playing ? '⏸ 暂停' : '▶️ 播放'}
        </Button>

        <div className="music-slider">
          {/* 🔊 音量滑块 */}
          <Slider
            size="small"
            value={volume}
            onChange={handleVolumeChange}
            showBoundary
            min={0}
            max={100}
            tipFormatter={(val) => `${val}%`}
          />
        </div>
      </div>

      {/* 🎂 内容 */}
      <div className="birthday-content">
        <h1>🎉 林鹭生日快乐！🎂</h1>
        <p>愿你每一天都像今天一样灿烂和幸福。</p>
      </div>

      {/* 🎁 红包按钮 */}
      <div className="red-envelope-container">
        <Button
          theme="solid"
          type="warning"
          size="large"
          className="red-envelope-button"
          onClick={() => setShowEnvelope(true)}
        >
          🧧 点我领取生日红包
        </Button>
      </div>

      {/* 🎁 红包弹窗 */}
      <Modal
        title={null}
        visible={showEnvelope}
        onCancel={() => {
          setShowEnvelope(false);
          setEnvelopeOpened(false); // 重置状态
        }}
        footer={null}
        centered
        className="red-envelope-modal"
        closable={false}
      >
        <div className="envelope-box">
          {!envelopeOpened ? (
            <div className="envelope-closed" onClick={() => setEnvelopeOpened(true)}>
              <div className="circle-button">开</div>
              <p className="tap-text">点击开红包</p>
            </div>
          ) : (
            <div className="envelope-opened">
              <p className="open-result">😢 手慢了，红包已被抢完！</p>
            </div>
          )}
        </div>
      </Modal>



    </div>
  );
};

export default Birthday;
