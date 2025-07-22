import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Modal } from '@douyinfe/semi-ui';
import "./css/VoteMain.css";

export default function ContributionList({ visible, onClose, id: propId }) {
    const paramsRoute = useParams();
    const id = propId || paramsRoute.id;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [voterangeModalVisible, setVoterangeModalVisible] = useState(false);
    const [voterangeLoading, setVoterangeLoading] = useState(false);
    const [voterangeData, setVoterangeData] = useState(null);

    useEffect(() => {
        if (!visible || !id) return;
        const params = new URLSearchParams();
        params.append("user_id", id);

        setLoading(true);
        axios.post(
            "https://xox48.top/Api/votefans",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        )
            .then(res => {
                setData(res.data.data || null);
            })
            .catch(() => {
                setData(null);
            })
            .finally(() => setLoading(false));
    }, [id, visible]);

    // 响应式样式
    const isMobile = window.innerWidth < 600;
    const tableWrapperStyle = {
        overflowX: 'auto',
        marginTop: 6,
        width: '100%',
        WebkitOverflowScrolling: 'touch',
    };
    const contentStyle = {
        maxHeight: '85vh',
        overflowY: 'auto',
    };
    const tableStyle = {
        minWidth: 320,
        fontSize: isMobile ? 12 : 14,
        whiteSpace: 'nowrap',
    };

    // voterange 分布点击
    const handleShowVoterange = (user_id) => {
        setVoterangeModalVisible(true);
        setVoterangeLoading(true);
        setVoterangeData(null);
        axios.post(
            'https://xox48.top/Api/voterange',
            new URLSearchParams({ user_id }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json, text/plain, */*',
                },
            }
        ).then(res => {
            setVoterangeData(res.data);
        }).catch(() => {
            setVoterangeData({ error: 1, msg: '请求失败' });
        }).finally(() => setVoterangeLoading(false));
    };

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            title="贡献榜"
            centered
            width={isMobile ? '99vw' : '80vw'}
            style={{
                maxWidth: '99vw',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
            }}
            bodyStyle={{ padding: isMobile ? '8px 2px 12px 2px' : '18px 20px 22px 20px', ...contentStyle }}
            autoFocus={false}
        >
            {loading ? (
                <div className="vote-loading"><div className="vote-spinner"></div>加载中...</div>
            ) : !data ? (
                <div className="vote-empty">暂无贡献数据</div>
            ) : (
                <div>
                    <div style={{ marginBottom: 10, fontSize: isMobile ? 12 : 15 }}>
                        <span>总分：<b>{data.score}</b></span>
                        <span style={{ marginLeft: 10 }}>排名：<b>{data.rank}</b></span>
                        <span style={{ marginLeft: 10 }}>总人数：<b>{data.pnum}</b></span>
                    </div>
                    {data.tips && <div style={{ marginBottom: 10, color: '#888', fontSize: isMobile ? 10 : 13 }}>{data.tips}</div>}
                    {/* 礼物统计表格放在前面 */}
                    {data.gift && data.gift.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <b style={{ fontSize: isMobile ? 12 : 15, display: 'block', margin: '12px 0 6px 0', borderTop: '1px solid #eee', paddingTop: 8 }}>礼物统计</b>
                            <div style={tableWrapperStyle}>
                                <table className="contribution-table" style={tableStyle}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: 36 }}>序号</th>
                                            <th>礼物名</th>
                                            <th>数量</th>
                                            <th>分数</th>
                                            <th>人数</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.gift.map((gift, idx) => (
                                            <tr key={gift.gift_name + idx}>
                                                <td>{idx + 1}</td>
                                                <td>{gift.gift_name}</td>
                                                <td>{gift.gift_num}</td>
                                                <td>{gift.vote}</td>
                                                <td>{gift.pnum}</td>
                                            </tr>
                                        ))}
                                        {/* 合计行 */}
                                        {data.gift.length > 1 && (
                                            <tr style={{ fontWeight: 600, background: '#f7f7fa' }}>
                                                <td colSpan={2} style={{ textAlign: 'right' }}>合计</td>
                                                <td>{data.gift.reduce((sum, g) => sum + Number(g.gift_num), 0)}</td>
                                                <td>{data.gift.reduce((sum, g) => sum + Number(g.vote), 0).toFixed(2)}</td>
                                                <td>{data.gift.reduce((sum, g) => sum + Number(g.pnum), 0)}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    <div style={{ marginBottom: 12 }}>
                        <b style={{ fontSize: isMobile ? 12 : 15 }}>贡献榜</b>
                        <div style={tableWrapperStyle}>
                            <table className="contribution-table" style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th>排名</th>
                                        <th>粉丝昵称</th>
                                        <th>分数</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.list && data.list.length > 0 ? data.list.map((fan, idx) => (
                                        <tr key={fan.user_id || idx}>
                                            <td>{idx + 1}</td>
                                            <td>{fan.user_name}</td>
                                            <td>{fan.vote}</td>
                                            <td>
                                                <span className="table-link" onClick={() => handleShowVoterange(fan.user_id)}>分布</span>
                                            </td>
                                        </tr>
                                    )) : <tr><td colSpan={3} style={{ textAlign: 'center' }}>暂无数据</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* voterange Modal */}
            <Modal
                visible={voterangeModalVisible}
                onCancel={() => { setVoterangeModalVisible(false); setVoterangeData(null); }}
                footer={null}
                title="分布详情"
                centered
                width={isMobile ? '98vw' : 520}
                bodyStyle={{ padding: isMobile ? '8px 2px 12px 2px' : '18px 20px 22px 20px', maxHeight: '80vh', overflowY: 'auto' }}
            >
                {voterangeLoading ? (
                    <div className="vote-loading"><div className="vote-spinner"></div>加载中...</div>
                ) : voterangeData && Array.isArray(voterangeData?.data?.list) ? (
                    <table className="contribution-table" style={{ minWidth: 320, margin: '0 auto' }}>
                        <thead>
                            <tr>
                                <th>排名</th>
                                <th>成员名</th>
                                <th>分数</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voterangeData.data.list.length > 0 ? (
                                voterangeData.data.list
                                    .slice()
                                    .sort((a, b) => parseFloat(b.vote) - parseFloat(a.vote))
                                    .map((item, idx) => (
                                        <tr key={item.cy_name + idx}>
                                            <td>{idx + 1}</td>
                                            <td>{item.cy_name}</td>
                                            <td>{item.vote}</td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={3} style={{ textAlign: 'center' }}>暂无分布数据</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', color: '#888' }}>暂无分布数据</div>
                )}
            </Modal>
        </Modal>
    );
}

ContributionList.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    id: PropTypes.any,
}; 