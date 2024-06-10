import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { trackProgress } from "@/state/player/playerSlice";
import { Connection, PublicKey } from "@solana/web3.js";
import { RootStateType } from "@/state/store";
import { mint as mintAddress } from "@/lib/solana/load-env-mint";
import { useConnection } from "@solana/wallet-adapter-react";
import { connection } from "@/lib/solana/connect-to-network";
import { RewardType } from "@/state/mint/mintSlice";
import logo from "@/assets/rewards/solmusic logo.png";

export const initialState: RewardType = {
  name: "Solmusic",
  ticker: "SOLM",
  imageUrl: logo.src,
  mintAddress: process.env.NEXT_PUBLIC_TOKEN_MINT_ACCOUNT!,
  associatedTokenAddress: null,
  balance: 0,
  creatingTokenAccount: false,
  tokenAccountError: undefined,
  minting: false,
  mintingError: undefined,
  mintInterval: parseInt(process.env.NEXT_PUBLIC_BONK_MINT_INTERVAL!),
  amountPerInterval: parseInt(process.env.NEXT_PUBLIC_BONK_REWARD_AMOUNT!),
  decimals: 10 ** 2, // since solmusic has 2 decimals
  network: "devnet",
};

export const mintSolmusicTokens = createAsyncThunk(
  "mint/solmusic/mintTokens",
  async (_, thunkAPI) => {
    const { mint } = thunkAPI.getState() as RootStateType;

    if (!connection || !mint.publicKey) {
      console.log("Wallet not connected");
      return;
    }

    try {
      let response = await fetch("/api/solana/mint-tokens", {
        method: "POST",
        body: JSON.stringify({
          destination: mint.rewards.solmusic.associatedTokenAddress,
        }),
      });

      if (!response.ok) {
        thunkAPI.rejectWithValue(response.json() || "An error occured");
      }

      return response.json();
    } catch (err) {
      thunkAPI.rejectWithValue(JSON.stringify(err));
    }
  }
);
export const getOrCreateSolmusicTokenAccount = createAsyncThunk(
  "mint/solmusic/getOrCreateTokenAccount",
  async (_, thunkAPI) => {
    const { mint } = thunkAPI.getState() as RootStateType;

    if (!connection || !mint.publicKey) {
      console.log("Wallet not connected");
      return;
    }

    try {
      let response = await fetch("/api/solana/create-token-account", {
        method: "POST",
        body: JSON.stringify({
          associatedTokenAddress: mint.rewards.solmusic.associatedTokenAddress,
          publicKey: mint.publicKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData || "An error occurred");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(JSON.stringify(err));
    }
  }
);

export const solmusicSlice = createSlice({
  name: "solmusic",
  initialState,
  reducers: {
    setSolmusicTokenAddress: (state, action: PayloadAction<string>) => {
      state.associatedTokenAddress = action.payload;
    },
    setSolmusicBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(mintSolmusicTokens.pending, (state, action) => {
        state.minting = true;
      })
      .addCase(mintSolmusicTokens.fulfilled, (state, action) => {
        state.minting = false;
        state.balance = action.payload.balance;
      })
      .addCase(mintSolmusicTokens.rejected, (state, action) => {
        state.minting = false;
        state.tokenAccountError = action.error.message;
      })
      .addCase(getOrCreateSolmusicTokenAccount.pending, (state, action) => {
        state.creatingTokenAccount = true;
      })
      .addCase(getOrCreateSolmusicTokenAccount.fulfilled, (state, action) => {
        state.creatingTokenAccount = false;
        state.balance = action.payload.balance;
      })
      .addCase(getOrCreateSolmusicTokenAccount.rejected, (state, action) => {
        state.creatingTokenAccount = false;
        state.tokenAccountError = action.error.message;
      });
  },
});

export const { setSolmusicBalance, setSolmusicTokenAddress } =
  solmusicSlice.actions;

export default solmusicSlice.reducer;
