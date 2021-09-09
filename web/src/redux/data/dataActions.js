// log
import store from '../store';
import _ from 'lodash';
import axios from 'axios';

const fetchDataRequest = () => {
	return {
		type: 'CHECK_DATA_REQUEST',
	};
};

const fetchDataSuccess = (payload) => {
	return {
		type: 'CHECK_DATA_SUCCESS',
		payload: payload,
	};
};

const fetchAccountDataSuccess = (payload) => {
	return {
		type: 'CHECK_ACCOUNT_DATA_SUCCESS',
		payload: payload,
	};
};

const fetchDataFailed = (payload) => {
	return {
		type: 'CHECK_DATA_FAILED',
		payload: payload,
	};
};
export const fetchAccountData = () => {
	return async (dispatch) => {
		dispatch(fetchDataRequest());
		try {
			const totalNfts = await store
				.getState()
				.blockchain.smartContract.methods.walletOfOwner(
					store.getState().blockchain.account
				)
				.call();

			const baseURI = await store
				.getState()
				.blockchain.smartContract.methods._baseTokenURI.call()
				.call();

				console.log('totalNfts', totalNfts);
			const nfts = [];
			_.map(totalNfts, async (item) => {
				// const resp = await axios.get(`${baseURI}/${item + 1}`);
				nfts.push(`${baseURI}${item}`);
			});

			dispatch(
				fetchAccountDataSuccess({
					accountTokens: nfts,
				})
			);
		} catch (err) {
			console.log(err);
			dispatch(fetchDataFailed('Could not load data from contract.'));
		}
	};
};

export const fetchData = (account) => {
	return async (dispatch) => {
		dispatch(fetchDataRequest());
		try {
			let name = await store
				.getState()
				.blockchain.smartContract.methods.name()
				.call();
			const total = await store
				.getState()
				.blockchain.smartContract.methods.totalSupply()
				.call();

			const baseURI = await store
				.getState()
				.blockchain.smartContract.methods._baseTokenURI.call()
				.call();

			const nfts = [];
			_.times(total, async (item) => {
				// const resp = await axios.get(`${baseURI}/${item + 1}`);
				nfts.push(`${baseURI}${item}`);
			});

			dispatch(
				fetchDataSuccess({
					name,
					allTokens: nfts,
				})
			);
		} catch (err) {
			console.log(err);
			dispatch(fetchDataFailed('Could not load data from contract.'));
		}
	};
};
