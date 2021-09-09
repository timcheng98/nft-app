import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	Button,
	Layout,
	Row,
	Col,
	Tag,
	Statistic,
	Divider,
	Affix,
	Tooltip,
	message,
} from 'antd';
import axios from 'axios';
import _ from 'lodash';
import {
	TwitterOutlined,
	MediumOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { connect, init } from './redux/blockchain/blockchainActions';
import { fetchData } from './redux/data/dataActions';
import * as s from './styles/globalStyles';
import styled from 'styled-components';
import { create, urlSource } from 'ipfs-http-client';
import moment from 'moment';
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';
import AppLayout from './components/AppLayout';

function Home() {
	const dispatch = useDispatch();
	const blockchain = useSelector((state) => state.blockchain);
	const data = useSelector((state) => state.data);
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState('');
	const [showMore, setShowMore] = useState(false);
	const [NFTS, setNFTS] = useState([]);
	const [finished, setFinished] = useState(false);

	useEffect(() => {
		dispatch(init());
	}, []);

	const mint = (count) => {
		if (!blockchain.account) {
			return message.warning('please connect metamask wallet');
		}

		const amount = 100 * count; // Willing to send 2 ethers
		const amountToSend = blockchain.web3.utils.toWei(
			_.toString(amount),
			'ether'
		); // Convert to wei value
		blockchain.smartContract.methods
			.mint(count)
			.send({ from: blockchain.account, value: amountToSend })
			.once('error', (err) => {
				console.log(err);
				setLoading(false);
				setStatus('Error');
			})
			.then((receipt) => {
				console.log(receipt);
				setLoading(false);
				// clearCanvas();
				dispatch(fetchData(blockchain.account));
				setStatus('Successfully minting your NFT');
			});
	};

	const startMintingProcess = (count) => {
		setLoading(true);
		setStatus('Uploading to IPFS');
		try {
			mint(count);
		} catch (err) {
			console.log(err);
			setLoading(false);
			setStatus('Error');
		}
	};

	const fetchMetatDataForNFTS = async () => {
		setNFTS([]);
		// await blockchain.smartContract.methods
		// .setBaseURI('http://wallstreetbets-nft.com/').send({ from: blockchain.account })
		const promises = [];
		_.map(_.slice(data.allTokens, 0, 12), (nft) => {
			promises.push(axios.get(nft));
		});

		let result = await Promise.all(promises);

		console.log(result);
		result = _.map(result, 'data');
		setNFTS(_.orderBy(result, ['edition', 'asc']));
	};

	useEffect(() => {
		if (blockchain.account !== '' && blockchain.smartContract !== null) {
			dispatch(fetchData(blockchain.account));
		}
	}, [blockchain.smartContract, dispatch]);

	useEffect(() => {
		fetchMetatDataForNFTS();
	}, [data.allTokens]);

	const renderer = ({ days, hours, minutes, seconds, completed }) => {
		if (completed) {
			setFinished(true);
			// Render a completed state
			return (
				<Row justify='center' style={{ margin: '80px 0px' }}>
					<Col span={24}>
						<Row justify='center'>
							<Col span={24}>
								<Button
									className='dark-button scale-animation'
									style={{
										width: 200,
										margin: 10,
										border: 'none',
										height: 60,
										borderRadius: 50,
										fontSize: 24,
									}}
									onClick={() => startMintingProcess(1)}
								>
									Buy Now
								</Button>
							</Col>
						</Row>
						<Row justify='center'>
							<Col>
								<Button
									type='text'
									// className='dark'
									style={{ textAlign: 'center' }}
									onClick={() => setShowMore(!showMore)}
								>
									<span
										style={{
											textDecoration: 'underline',
											color: '#fff',
											backgroundColor: 'transparent',
										}}
									>
										{showMore ? 'Hide' : 'Show'} More Options
									</span>
								</Button>
							</Col>
						</Row>

						{showMore && (
							<Row justify='center' style={{ marginTop: 10 }}>
								<Col>
									<Button
										className='dark-button'
										style={{
											width: 100,
											margin: 10,
											border: 'none',
											height: 60,
											borderRadius: 10,
											fontSize: 18,
										}}
										onClick={() => startMintingProcess(5)}
									>
										Buy 5
									</Button>
									<Button
										className='dark-button'
										style={{
											width: 100,
											margin: 10,
											border: 'none',
											height: 60,
											borderRadius: 10,
											fontSize: 18,
										}}
										onClick={() => startMintingProcess(10)}
									>
										Buy 10
									</Button>
									<Button
										className='dark-button'
										style={{
											width: 100,
											margin: 10,
											border: 'none',
											height: 60,
											borderRadius: 10,
											fontSize: 18,
										}}
										onClick={() => startMintingProcess(15)}
									>
										Buy 15
									</Button>
									<Button
										className='dark-button'
										style={{
											width: 100,
											margin: 10,
											border: 'none',
											height: 60,
											borderRadius: 10,
											fontSize: 18,
										}}
										onClick={() => startMintingProcess(20)}
									>
										Buy 20
									</Button>
								</Col>
							</Row>
						)}
					</Col>
				</Row>
			);
		} else {
			// Render a countdown
			return (
				<Row justify='center'>
					<Col>
						<div
							className='dark-contrast'
							style={{
								fontSize: 60,
								borderRadius: 10,
								height: 120,
								width: 100,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: 10,
							}}
						>
							{days}
						</div>
						<strong>Days</strong>
					</Col>
					<Col>
						<div
							className='dark-contrast'
							style={{
								fontSize: 60,
								borderRadius: 10,
								height: 120,
								width: 100,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: 10,
							}}
						>
							{hours}
						</div>
						<strong>Hrs</strong>
					</Col>
					<Col>
						<div
							className='dark-contrast'
							style={{
								fontSize: 60,
								borderRadius: 10,
								height: 120,
								width: 100,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: 10,
							}}
						>
							{minutes}
						</div>
						<strong>Mins</strong>
					</Col>
					<Col>
						<div
							className='dark-contrast'
							style={{
								fontSize: 60,
								borderRadius: 10,
								height: 120,
								width: 100,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								margin: 10,
							}}
						>
							{seconds}
						</div>
						<strong>Sec</strong>
					</Col>
				</Row>
			);
		}
	};

	return (
		<AppLayout>
			<Row
				// className='showcase'
				justify='center'
				align='middle'
				style={{ margin: '0px 0px', minHeight: '80vh' }}
			>
				<Col
					// className='showcase-content'
					span={24}
					style={{ textAlign: 'center' }}
					gutter={[24, 24]}
				>
					<Row justify='center'>
						<Col span={14}>
							<h1
								className='h1 dark white-high'
								style={{ backgroundColor: 'transparent' }}
							>
								{finished
									? 'Crypto WallStreetBets NFT is Market-On-Open'
									: 'Crypto WallStreetBets NFT is coming...'}
							</h1>
							{finished && (
								<strong>
									<Tag color='blue'>NOW</Tag> All {NFTS.length} Crypto
									WallStreetBets NFT are successfully minted and revealed! 🎉
								</strong>
							)}
						</Col>
					</Row>
					<Row justify='center'>
						<Col span={24}>
							<Countdown
								date={moment('2021-09-06 18:25:00').toDate()}
								renderer={renderer}
							/>
						</Col>
					</Row>
				</Col>
			</Row>

			<Row style={{ marginBottom: 30 }} justify='center' gutter={[20, 20]}>
				<Col span={24}>
					<h2 style={{ textAlign: 'center', fontSize: 30 }} className='dark'>
						Collections
					</h2>
				</Col>
			</Row>
			<Row justify='center'>
				<Col span={18}>
					<Row gutter={[50, 50]} justify='start'>
						{!_.isEmpty(NFTS) &&
							_.map(NFTS, ({ edition, image, name }) => {
								return (
									<Col span={4} key={edition}>
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
														right: 25,
														zIndex: 1,
														fontSize: 18,
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
											style={{
												width: '100%',
												height: '100%',
											}}
										/>
									</Col>
								);
							})}
					</Row>
				</Col>
			</Row>
			<Row justify='center'>
				<Col>
					<a
						href='https://testnets.opensea.io/collection/crypto-wallstreetbets'
						className='white-high'
						target='_blank'
						rel='noreferrer'
					>
						<Button
							className='dark-button scale-animation'
							style={{
								width: 160,
								margin: 40,
								border: 'none',
								textAlign: 'center',
								height: 50,
								borderRadius: 50,
								fontSize: 18,
							}}
						>
							View More
						</Button>
					</a>
				</Col>
			</Row>
			<Information />
		</AppLayout>
	);
}

const Information = () => {
	return (
		<>
			<Divider id='about' />

			<Row justify='center' style={{ marginTop: 30 }} gutter={[24, 24]}>
				<Col span={24}>
					<h2 style={{ textAlign: 'center', fontSize: 30 }} className='dark'>
						About
					</h2>
				</Col>
				<Col
					span={12}
					style={{
						fontWeight: 'bold',
						fontSize: 20,
						textAlign: 'center',
						marginBottom: 30,
					}}
				>
					Crypto WallStreetBets is a tribute to the digital collectibles created
					by anonymous developers, and innovative algorithms. These 10000 pieces
					of artworks are inspired by the famouse WSB events, recalling the
					inner artist in you.
				</Col>
			</Row>
			<Row
				justify='center'
				gutter={[24, 24]}
				// id='about'
				// style={{ paddingTop: 60 }}
			>
				<Col
					span={12}
					style={{
						fontWeight: 'bold',
						fontSize: 20,
						textAlign: 'center',
						marginBottom: 30,
					}}
				>
					Each piece of the art is uniquely generated, there will never be two
					that look the same. Making owning a Crypto WallStreetBets art a true
					collectible experience.
				</Col>
			</Row>
			<Row justify='center' align='bottom'>
				<Divider />
				<Col span={24}>
					<h2 style={{ textAlign: 'center', fontSize: 30 }} className='dark'>
						NFT Shares Distribution
					</h2>
				</Col>
				<Col span={18}>
					<Row justify='center' align='bottom'>
						<Col
							span={8}
							style={{
								fontSize: 20,
								color: '#FFD700',
								fontWeight: 'bold',
								textAlign: 'center',
							}}
						>
							<span style={{ fontSize: 40, color: '#FFD700' }}>
								1% <br />
							</span>
							Airdrops
						</Col>
						<Col
							span={8}
							style={{
								fontSize: 24,
								color: '#FFD700',
								fontWeight: 'bold',
								textAlign: 'center',
							}}
						>
							<span style={{ fontSize: 60, color: '#FFD700' }}>
								98% <br />
							</span>
							Community
						</Col>
						<Col
							span={8}
							style={{
								fontSize: 20,
								color: '#FFD700',
								fontWeight: 'bold',
								textAlign: 'center',
							}}
						>
							<span style={{ fontSize: 40, color: '#FFD700' }}>
								1% <br />
							</span>
							Developers
						</Col>
					</Row>
				</Col>
			</Row>
			<Divider />
			<Row
				justify='center'
				gutter={[20, 0]}
				style={{ paddingBottom: 60, paddingTop: 60 }}
			>
				<Col span={24}>
					<h2
						style={{ textAlign: 'center', fontSize: 30, padding: '30px 0px' }}
						className='dark'
					>
						News Update
					</h2>
				</Col>
				<Col span={6}>
					<Button
						type='text'
						className='button-zoom'
						style={{
							width: '100%',
							backgroundColor: '#1DA1F2',
							color: '#fff',
							border: 'none',
							height: 65,
							borderRadius: 50,
							fontSize: 18,
							padding: '10px 20px',
						}}
						icon={<TwitterOutlined />}
					>
						follow @WallStreetBetsNFT
					</Button>
				</Col>
				<Col span={6}>
					<Button
						type='text'
						className='dark-button'
						style={{
							width: '100%',
							height: 65,
							borderRadius: 50,
							fontSize: 18,
							padding: '10px 20px',
							border: '2px solid #fff',
						}}
						icon={<MediumOutlined />}
					>
						follow WallStreetBetsNFT
					</Button>
				</Col>
			</Row>
			<Row justify='center' align='middle' style={{ paddingTop: 60 }}>
				<Col
					xs={24}
					sm={24}
					md={18}
					lg={18}
					className='dark'
					style={{
						textAlign: 'center',
						fontSize: 'calc(10px + 1vw)',
						fontWeight: 'bold',
						height: 350,
						width: '100%',
						borderRadius: 30,
						// border: '2px solid tran',
						backgroundImage:
							'linear-gradient(to right bottom, #051937, #004362, #006f75, #359a70, #a2be64)',
						boxShadow: 'rgba(0, 0, 0, 0.8) 0px 3px 12px',
					}}
				>
					<Row
						justify='center'
						align='middle'
						style={{
							textAlign: 'center',
							height: '100%',
						}}
					>
						<Col span={24}>
							<h2 className='white-high'>Contracts & Records</h2>
							<p>WallStreetBets NFT Contract:</p>
							<p style={{ width: '100%', overflowWrap: 'break-word' }}>
								0xbD8724Ec4F1Bbf98ce0db8612dE67E0a192F798d
							</p>
						</Col>
					</Row>
				</Col>
			</Row>
			<Divider />
			<Row justify='center'>
				<Col span={24}>
					<h2 style={{ textAlign: 'center', fontSize: 30 }} className='dark'>
						Contributor
					</h2>
				</Col>
				<Col span={18}>
					<h2 className='dark' style={{ paddingTop: 30 }}>
						Timothy Cheng
					</h2>
					<h3 className='dark'>@ Developer, Designer and Marketing</h3>
				</Col>
			</Row>
		</>
	);
};

export default Home;
