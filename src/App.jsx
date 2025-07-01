import { Layout, Nav } from '@douyinfe/semi-ui'
import { IconGift, IconHome } from '@douyinfe/semi-icons'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Birthday from './pages/Birthday/Birthday'

const { Header, Sider, Content } = Layout

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isBirthdayPage = location.pathname === '/birthday'

  // 初次打开页面跳转到 /home
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home')
    }
  }, [location.pathname])

  // 🎂 生日页面：使用独立布局
  if (isBirthdayPage) {
    return (
      <Routes>
        <Route path="/birthday" element={<Birthday />} />
      </Routes>
    )
  }

  // 🧭 主页面：常规布局（带导航）
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider style={{ backgroundColor: '#fff' }}>
        <Nav
          selectedKeys={[location.pathname]}
          onSelect={({ itemKey }) => navigate(itemKey)}
          items={[
            { itemKey: '/home', text: '首页', icon: <IconHome /> },
            //{ itemKey: '/birthday', text: '生日祝福', icon: <IconGift /> }
          ]}
          header={{
            logo: <img src="https://semi.design/logo.png" alt="logo" width={32} />,
            text: '导航栏'
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: 'white', paddingLeft: 24 }}>
          <h3>🌟 我的前端练习项目</h3>
        </Header>
        <Content style={{ padding: '24px', background: '#f8f8f8' }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            {/* <Route path="/birthday" element={<Birthday />} /> */}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
