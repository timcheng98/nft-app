import { Affix, Row, Col, Button, Layout, message } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

const AppLayout = ({ children }) => {
	const blockchain = useSelector((state) => state.blockchain);

	useEffect(() => {
		if (blockchain.errorMsg) {
			console.log(blockchain)
			message.error(blockchain.errorMsg)
		}

	}, [blockchain.errorMsg])
	return (
		<Layout.Content className='dark'>
			<AppHeader />
			<Layout.Content style={{ minHeight: '70vh' }} className='dark'>
				{children}
			</Layout.Content>
			<AppFooter />
		</Layout.Content>
	);
};

export default AppLayout;
