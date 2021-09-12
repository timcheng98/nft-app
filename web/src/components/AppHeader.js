import { Affix, Row, Col, Button, Layout } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { connect } from '../redux/blockchain/blockchainActions';
const AppHeader = () => {
	const dispatch = useDispatch();
	const blockchain = useSelector((state) => state.blockchain);

	return (
		<Affix>
			<Layout.Header
				className='dark'
				style={{
					lineHeight: 1.5,
					// background: '#fff',
					height: 80,
					boxShadow: 'rgba(0, 0, 0, 0.8) 0px 3px 12px',
				}}
			>
				<Row
					justify='space-between'
					align='middle'
					style={{ margin: '0px 30px', height: 80 }}
				>
					<Col span={8}>Logo</Col>
					<Col span={blockchain.account ? 14 : 12}>
						<Row
							justify='space-between'
							align='middle'
							style={{ fontSize: 16 }}
						>
							<Col>
								<Link to='/' className='white-high'>
									Home
								</Link>{' '}
							</Col>
							<Col>
								<Link to='/#about' className='white-high'>
									About
								</Link>
							</Col>
							<Col>
								<a
									href='https://testnets.opensea.io/collection/crypto-wallstreetbets'
									className='white-high'
									target='_blank'
									rel='noreferrer'
								>
									All Collections
								</a>
							</Col>
							<a href='/#faq' className='white-high'>
								FAQ
							</a>
							{blockchain.account && (
								<Col>
									<Link to='/account' className='white-high'>
										My Collections
									</Link>
								</Col>
							)}
							<Col>
								<Button
									className='dark-button'
									onClick={() => {
										if (!blockchain.account) {
											dispatch(connect());
										}
									}}
									style={{
										border: 'none',
										borderRadius: 10,
										height: 50,
										width: 160,
										fontWeight: 'bold',
									}}
								>
									{blockchain.account ? (
										<div
											style={{
												width: '100%',
												textOverflow: 'ellipsis',
												overflow: 'hidden',
												whiteSpace: 'nowrap',
											}}
										>
											{blockchain.account.substring(0, 6)}...{' '}
											{blockchain.account.substring(
												blockchain.account.length - 6,
												blockchain.account.length
											)}
										</div>
									) : (
										'Connect Wallet'
									)}
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Layout.Header>
		</Affix>
	);
};

export default AppHeader;
