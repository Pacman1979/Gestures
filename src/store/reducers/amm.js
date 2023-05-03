import { createSlice } from '@reduxjs/toolkit'

export const amm = createSlice({
  name: 'amm',
  initialState: {
    contract: null, // these are all default values.
    shares: 0,
    swaps: [],
    depositing: {
      isDepositing: false,
      isSucccess: false,
      transactionHash: null // to get transaction Hash of the swap.
    },
    withdrawing: {
      isWithdrawing: false,
      isSucccess: false,
      transactionHash: null
    },
    swapping: {
      isSwapping: false,
      isSucccess: false,
      transactionHash: null
    }
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },
    sharesLoaded: (state, action) => {
      state.shares = action.payload
    },
    swapsLoaded: (state, action) => {
      state.swaps = action.payload
    },
    depositRequest: (state, action) => {
      state.depositing.isDepositing = true
      state.depositing.isSuccess = false
      state.depositing.transactionHash = null
    },
    depositSuccess: (state, action) => {
      state.depositing.isDepositing = false
      state.depositing.isSuccess = true
      state.depositing.transactionHash = action.payload
    },
    depositFail: (state, action) => {
      state.depositing.isDepositing = false
      state.depositing.isSuccess = false
      state.depositing.transactionHash = null
    },
    withdrawRequest: (state, action) => {
      state.withdrawing.isWithdrawing = true
      state.withdrawing.isSuccess = false
      state.withdrawing.transactionHash = null
    },
    withdrawSuccess: (state, action) => {
      state.withdrawing.isWithdrawing = false
      state.withdrawing.isSuccess = true
      state.withdrawing.transactionHash = action.payload
    },
    withdrawFail: (state, action) => {
      state.withdrawing.isWithdrawing = false
      state.withdrawing.isSuccess = false
      state.withdrawing.transactionHash = null
    },
    swapRequest: (state, action) => {
      state.swapping.isSwapping = true // The Spinner should appear and be spinning.
      state.swapping.isSuccess = false
      state.swapping.transactionHash = null
    },
    swapSuccess: (state, action) => {
      state.swapping.isSwapping = false // This should stop the Spinner and make it disappear.
      state.swapping.isSuccess = true
      state.swapping.transactionHash = action.payload // I think this is Redux store related??
    },
    swapFail: (state, action) => {
      state.swapping.isSwapping = false
      state.swapping.isSuccess = false
      state.swapping.transactionHash = null
    }
  }
})

export const {
  setContract,
  sharesLoaded,
  swapsLoaded,
  depositRequest,
  depositSuccess,
  depositFail,
  withdrawRequest,
  withdrawSuccess,
  withdrawFail,
  swapRequest,
  swapSuccess,
  swapFail
} = amm.actions;

export default amm.reducer;
