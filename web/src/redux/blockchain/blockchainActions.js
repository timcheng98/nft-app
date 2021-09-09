// constants
import Web3 from 'web3';
import SmartContract from '../../contracts/WallStreetBets.json';
// log
import { fetchData } from '../data/dataActions';

const testAddress = '0xecA6B34146e533A8e3d2292Aa1C8d5d9A551305E'
const connectRequest = () => {
	return {
		type: 'CONNECTION_REQUEST',
	};
};

const disconnectRequest = () => {
	return {
		type: 'DISCONNECTION_REQUEST',
	};
};

const connectSuccess = (payload) => {
	return {
		type: 'CONNECTION_SUCCESS',
		payload: payload,
	};
};

const connectInit = (payload) => {
	return {
		type: 'CONNECTION_INIT',
		payload: payload,
	};
};

const connectFailed = (payload) => {
	return {
		type: 'CONNECTION_FAILED',
		payload: payload,
	};
};

const updateAccountRequest = (payload) => {
	return {
		type: 'UPDATE_ACCOUNT',
		payload: payload,
	};
};

export const connect = () => {
	return async (dispatch) => {
		dispatch(connectRequest());

		if (window.ethereum && window.ethereum.isMetaMask) {
			let web3 = new Web3(window.ethereum);

			try {
				let currentAccount = null;

				window.ethereum
					.request({ method: 'eth_requestAccounts' })
					.then((accounts) => {
						if (accounts.length === 0) {
							dispatch(connectFailed('Please connect to MetaMask.'));
						} else if (accounts[0] !== currentAccount) {
							currentAccount = accounts[0];
						}
					})
					.catch((err) => {
						if (err.code === 4001) {
							// EIP-1193 userRejectedRequest error
							// If this happens, the user rejected the connection request.
							dispatch(connectFailed('Please connect to MetaMask.'));
						} else {
							console.error(err);
						}
					});

				const networkId = await window.ethereum.request({
					method: 'net_version',
				});

				const NetworkData = await SmartContract.networks[networkId];

				if (NetworkData) {
					console.log('NetworkData.address', SmartContract.networks)
					const SmartContractObj = new web3.eth.Contract(
						SmartContract.abi,
						// NetworkData.address,
						testAddress
						);

					console.log(currentAccount)
					console.log(SmartContractObj)
					console.log(web3)

					dispatch(
						connectSuccess({
							account: currentAccount,
							smartContract: SmartContractObj,
							web3: web3,
						})
					);

					// Add listeners start
					window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
							dispatch(connectFailed('Please connect to MetaMask.'));
						} else if (accounts[0] !== currentAccount) {
							currentAccount = accounts[0];
						}
						dispatch(updateAccount(currentAccount));
					});
					window.ethereum.on('chainChanged', () => {
						window.location.reload();
					});
					// Add listeners end
				} else {
					dispatch(connectFailed('Change network to Polygon.'));
				}
			} catch (err) {
				dispatch(connectFailed('Something went wrong.'));
			}
		} else {
			dispatch(connectFailed('Install Metamask.'));
		}
	};
};

export const init = () => {
	return async (dispatch) => {

		if (window.ethereum) {
			let web3 = new Web3(window.ethereum);

			try {
			
				const networkId = await window.ethereum.request({
					method: 'net_version',
				});

				const NetworkData = await SmartContract.networks[networkId];

				if (NetworkData) {
					const SmartContractObj = new web3.eth.Contract(
						SmartContract.abi,
						// NetworkData.address
						testAddress
					);
					dispatch(
						connectInit({
							smartContract: SmartContractObj,
							web3: web3,
						})
					);

				} else {
					dispatch(connectFailed('Change network to Polygon.'));
				}
			} catch (err) {
				dispatch(connectFailed('Something went wrong.'));
			}
		} else {
			dispatch(connectFailed('Install Metamask.'));
		}
	};
};

export const updateAccount = (account) => {
	return async (dispatch) => {
		dispatch(updateAccountRequest({ account: account }));
		dispatch(fetchData(account));
	};
};
