const initialState = {
  loading: false,
  name: "",
  allTokens: [],
  accountTokens: [],
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...initialState,
        loading: false,
        name: action.payload.name,
        allTokens: action.payload.allTokens,
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    case "CHECK_ACCOUNT_DATA_SUCCESS":
      return {
        ...initialState,
        loading: false,
        name: action.payload.name,
        accountTokens: action.payload.accountTokens,
      };
    default:
      return state;
  }
};

export default dataReducer;
