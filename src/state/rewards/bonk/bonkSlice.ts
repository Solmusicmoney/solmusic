import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { trackProgress } from "@/state/player/playerSlice";
import { Connection, PublicKey } from "@solana/web3.js";
import { RootStateType } from "@/state/store";
import { mint as mintAddress } from "@/lib/solana/load-env-mint";
import { useConnection } from "@solana/wallet-adapter-react";
import { connection } from "@/lib/solana/connect-to-network";
import { RewardType } from "@/state/mint/mintSlice";
import logo from "@/assets/rewards/bonk logo.jpg";

export const initialState: RewardType = {
  name: "Bonk",
  ticker: "BONK",
  imageUrl: logo.src,
  mintAddress: process.env.NEXT_PUBLIC_BONK_MINT_ADDRESS!,
  associatedTokenAddress: null,
  balance: 0,
  creatingTokenAccount: false,
  tokenAccountError: undefined,
  minting: false,
  mintingError: undefined,
  mintInterval: parseInt(process.env.NEXT_PUBLIC_BONK_MINT_INTERVAL!),
  amountPerInterval: parseInt(process.env.NEXT_PUBLIC_BONK_REWARD_AMOUNT!),
  decimals: 10 ** 5, // since bonk has 5 decimals
  network: "mainnet-beta",
};

export const distributeBonkTokens = createAsyncThunk(
  "mint/bonk/distributeBonkTokens",
  async (_, thunkAPI) => {
    const { mint } = thunkAPI.getState() as RootStateType;

    if (!connection || !mint.publicKey) {
      console.log("Wallet not connected");
      return;
    }

    try {
      let response = await fetch("/api/solana/distribute-bonk", {
        method: "POST",
        body: JSON.stringify({
          destination: mint.rewards.bonk.associatedTokenAddress,
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
export const getOrCreateBonkTokenAccount = createAsyncThunk(
  "mint/bonk/getOrCreateTokenAccount",
  async (_, thunkAPI) => {
    const { mint } = thunkAPI.getState() as RootStateType;

    if (!connection || !mint.publicKey) {
      console.log("Wallet not connected");
      return;
    }

    try {
      let response = await fetch("/api/solana/create-bonk-token-account", {
        method: "POST",
        body: JSON.stringify({
          associatedTokenAddress: mint.rewards.bonk.associatedTokenAddress,
          publicKey: mint.publicKey,
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

export const bonkSlice = createSlice({
  name: "bonk",
  initialState,
  reducers: {
    setBonkTokenAddress: (state, action: PayloadAction<string>) => {
      state.associatedTokenAddress = action.payload;
    },
    setBonkBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(distributeBonkTokens.pending, (state, action) => {
        state.minting = true;
      })
      .addCase(distributeBonkTokens.fulfilled, (state, action) => {
        state.minting = false;
        state.balance = action.payload.balance;
      })
      .addCase(distributeBonkTokens.rejected, (state, action) => {
        state.minting = false;
        state.tokenAccountError = action.error.message;
      })
      .addCase(getOrCreateBonkTokenAccount.pending, (state, action) => {
        state.creatingTokenAccount = true;
      })
      .addCase(getOrCreateBonkTokenAccount.fulfilled, (state, action) => {
        state.creatingTokenAccount = false;
        state.balance = action.payload.balance;
      })
      .addCase(getOrCreateBonkTokenAccount.rejected, (state, action) => {
        state.creatingTokenAccount = false;
        state.tokenAccountError = action.error.message;
      });
  },
});

export const { setBonkBalance, setBonkTokenAddress } = bonkSlice.actions;

export default bonkSlice.reducer;
