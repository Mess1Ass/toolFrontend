import { Typography, Button } from '@douyinfe/semi-ui'
import { useNavigate } from 'react-router-dom'
import { loadFireworksPreset } from 'tsparticles-preset-fireworks'
import Particles from 'react-tsparticles'
import { useCallback } from 'react'
import './Birthday.css'

const { Title, Paragraph } = Typography

const Birthday = () => {
  const navigate = useNavigate()

  // 初始化粒子引擎
  const particlesInit = useCallback(async engine => {
    await loadFireworksPreset(engine)
  }, [])

  return (
    <div className="birthday-wrapper">
      {/* 🎆 动态烟花背景 */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          preset: "fireworks",
          background: {
            color: {
              value: "#f9d423" // ✅ 解决 preset 的黑色背景问题
            }
          },
          fullScreen: { enable: true, zIndex: 0 }
        }}
      />


      {/* 🎉 中间祝福卡片 */}
      <div className="birthday-content">
        <Title heading={2} style={{ color: '#fff' }}>🎂 林鹭生日快乐！</Title>
        <Paragraph style={{ color: '#fff', fontSize: 18 }}>
          愿你被这个世界温柔以待，愿你的笑容灿烂如星河。
        </Paragraph>
        <Paragraph style={{ color: '#fff', fontSize: 18 }}>
          愿所有的美好如约而至，愿你所愿皆成所成。
        </Paragraph>
        <Button theme="light" onClick={() => navigate('/home')}>返回首页</Button>
      </div>

      {/* 🎵 背景音乐 */}
      <audio autoPlay loop>
        <source src="/happy birthday.mp3" type="audio/mpeg" />
        您的浏览器不支持 audio 标签。
      </audio>
    </div>
  )
}

export default Birthday
