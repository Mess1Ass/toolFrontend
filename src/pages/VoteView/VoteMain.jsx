import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/VoteMain.css";
import ContributionList from './ContributionList';

export default function VoteMain() {
    const [voteData, setVoteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contributionOpen, setContributionOpen] = useState(false);
    const [contributionTitle, setContributionTitle] = useState('');
    const [contributionId, setContributionId] = useState(null);

    useEffect(() => {
        // 构造 POST 请求参数
        const params = new URLSearchParams();
        // 如果接口需要参数，这里添加，比如 params.append('key', 'value');
        // 目前该接口不需要参数，可以不加

        axios.post(
            "https://xox48.top/Api/vote2024",
            params, // POST body
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        )
            .then(res => {
                setVoteData(res.data.data.list);
            })
            .catch(err => {
                console.error("获取投票数据失败", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="vote-loading"><div className="vote-spinner"></div>加载中...</div>;
    if (!voteData) return <div className="vote-empty">暂无数据</div>;

    return (
        <div className="app-container"
            style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
            }}>
            <div className="table-wrap">
                <div className="el-table el-table--fit el-table--border el-table--scrollable-y el-table--enable-row-hover"
                    style={{ minWidth: "350px", height: "266px" }}>
                    <div className="el-table__header-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>排名</th>
                                    <th>所属</th>
                                    <th>成员</th>
                                    <th>分数</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voteData && voteData.map((item, idx) => (
                                    <tr key={item.cy_id || idx}>
                                        <td>{item.rank}</td>
                                        <td
                                            className={
                                                item.tname === 'YBS' ? 'ybs' :
                                                item.gname === 'GNZ' && item.tname === 'Z' ? 'gnzz' :
                                                item.gname === 'BEJ' && item.tname === 'B' ? 'bejb' :
                                                item.gname === 'BEJ' && item.tname === 'E' ? 'beje' :
                                                item.gname === 'SNH' && item.tname === 'N2' ? 'snhn2' :
                                                item.gname === 'SNH' && item.tname === 'H2' ? 'snhh2' :
                                                item.gname === 'SNH' && item.tname === 'S2' ? 'snhs2' :
                                                item.gname === 'SNH' && item.tname === 'X' ? 'snhx-gnzg' :
                                                item.gname === 'GNZ' && item.tname === 'G' ? 'snhx-gnzg' :
                                                item.gname === 'GNZ' && item.tname === 'N3' ? 'gnzn3' :
                                                item.gname === 'CKG' && item.tname === 'C' ? 'ckgc' :
                                                item.gname === 'CKG' && item.tname === 'K' ? 'ckgk' :
                                                item.gname === 'CGT' && item.tname === 'C2' ? 'cgtc2' :
                                                item.gname === 'CGT' && item.tname === 'G2' ? 'cgtg2' :
                                                ''
                                            }
                                        >
                                            <span style={{color:'#fff'}}>{item.gname} {item.tname}</span> 
                                        </td>
                                        <td>{item.nickname}</td>
                                        <td>{item.vote}</td>
                                        <td>
                                            <button onClick={() => {
                                                setContributionTitle(`${item.nickname} 的贡献榜`);
                                                setContributionId(item.cy_id);
                                                setContributionOpen(true);
                                            }}>贡献榜</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ContributionList
                visible={contributionOpen}
                onClose={() => setContributionOpen(false)}
                id={contributionId}
            />
        </div>
    );
}