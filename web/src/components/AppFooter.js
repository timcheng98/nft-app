import { Affix, Row, Col, Button, Layout } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import AppHeader from './AppHeader';

const AppFooter = ({ children }) => {
	return (
		<Layout.Footer style={{ height: 150 }} className="dark">
			<Row style={{ height: 150 }} align="middle">
				<Col span={24} style={{ textAlign: 'center'}}>
					<p>Copyright © 2021 Crypto WallStreetBets NFT - All Rights Reserved.</p>
				</Col>
			</Row>
		</Layout.Footer>
	);
};

export default AppFooter;
