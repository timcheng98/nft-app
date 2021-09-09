import AppLayout from './components/AppLayout';
import { Affix, Row, Col, Button, Popover, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import axios from 'axios';
import { fetchAccountData } from './redux/data/dataActions';

const Account = () => {
	const [NFTS, setNFTS] = useState([]);
	const data = useSelector((state) => state.data);
	const blockchain = useSelector((state) => state.blockchain);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!blockchain) return;
		fetchMetatDataForNFTS();
	}, [blockchain]);

	const fetchMetatDataForNFTS = async () => {
		setNFTS([]);
		// await blockchain.smartContract.methods
		// .setBaseURI('http://wallstreetbets-nft.com/').send({ from: blockchain.account })
		const promises = [];
		_.map(data.accountTokens, (nft) => {
			promises.push(axios.get(nft));
		});

		let result = await Promise.all(promises);

		console.log(result);
		result = _.map(result, 'data');
		setNFTS(_.orderBy(result, ['edition', 'asc']));
	};

	useEffect(() => {
		if (blockchain.account !== '' && blockchain.smartContract !== null) {
			dispatch(fetchAccountData(blockchain.account));
		}
	}, [blockchain.smartContract, dispatch]);

	useEffect(() => {
		fetchMetatDataForNFTS();
	}, [data.accountTokens]);

	console.log(NFTS);
	return (
		<AppLayout>
			<Row style={{ paddingTop: '60px' }} justify='center' gutter={[20, 20]}>
				<Col span={24}>
					<h2 style={{ textAlign: 'center', fontSize: 30 }} className='dark'>
						My Collections
					</h2>
				</Col>
			</Row>{' '}
			<Row justify='center' style={{ marginTop: 30 }}>
				<Col span={18}>
					<Row gutter={[50, 50]} justify='start'>
						{!_.isEmpty(NFTS) &&
							_.map(NFTS, ({ edition, image, name }) => {
								return (
									<Col span={6} key={edition}>
										<Tooltip title='View on opensea'>
											<a
												href={`https://opensea.io/assets/matic/0x827acb09a2dc20e39c9aad7f7190d9bc53534192/${edition}`}
												className='white-high'
												target='_blank'
												rel='noreferrer'
											>
												<EyeOutlined
													style={{
														position: 'absolute',
														// top: 10,
														right: 30,
														zIndex: 1,
														fontSize: 24,
														padding: 10,
														cursor: 'pointer',
													}}
												/>
											</a>
										</Tooltip>

										<img
											className='my-collection'
											src={image}
											alt={name}
											style={{ width: '100%', height: '100%' }}
										/>
										<p style={{ textAlign: 'center', paddingTop: 10 }}>
											{name}
										</p>
									</Col>
								);
							})}
					</Row>
				</Col>
			</Row>
		</AppLayout>
	);
};

export default Account;
