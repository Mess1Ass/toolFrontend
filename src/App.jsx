import { Layout, Nav } from '@douyinfe/semi-ui'
import { IconSemiLogo, IconHome } from '@douyinfe/semi-icons';
import { IconDescriptions, IconIntro, IconTree, IconAvatar, IconTreeSelect, IconTabs } from '@douyinfe/semi-icons-lab';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Birthday from './pages/Birthday/Birthday'
import BidExport from './pages/BidResultExport/BidExport'

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
          bodyStyle={{ height: '80vh' }}
          items={[
            { itemKey: 'home', text: '首页', icon: <IconHome /> },
            { itemKey: 'bidexport', text: '竞价数据导出', icon: <IconDescriptions /> },
              {
                text: '任务平台',
                icon: <IconTree />,
                itemKey: 'job',
                items: ['任务管理', '用户任务查询'],
              },
          ]}
          header={{
            logo: <IconSemiLogo style={{ height: '36px', fontSize: 36 }} />,
            text: 'SNH48 相关工具箱'
          }}
          footer={{
            collapseButton: true,
          }}
          onSelect={({ itemKey }) => {
            navigate(itemKey); // ✅ 加上路由跳转
          }}
          onClick={data => console.log('trigger onClick: ', data)}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', background: '#f8f8f8' }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/bidexport" element={<BidExport />} />
            {/* <Route path="/birthday" element={<Birthday />} /> */}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
