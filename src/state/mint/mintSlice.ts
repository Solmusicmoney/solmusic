import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { trackProgress } from "../player/playerSlice";
import { Connection, PublicKey } from "@solana/web3.js";
import { RootStateType } from "../store";
import { mint as mintAddress } from "@/lib/solana/load-env-mint";
import { useConnection } from "@solana/wallet-adapter-react";
import { connection } from "@/lib/solana/connect-to-network";

export interface MintStateType {
  progress: number;
  minting: boolean;
  associatedTokenAddress: string | null;
  creatingTokenAccount: boolean;
  tokenAccountError: string | undefined;
  tokenBalance: number;
  mintInterval: number;
  mintingError: string | undefined;
  publicKey: string | undefined;
  mintAddress: string;
}

const initialState: MintStateType = {
  progress: 0,
  minting: false,
  associatedTokenAddress: null,
  creatingTokenAccount: false,
  tokenAccountError: undefined,
  tokenBalance: 0,
  mintInterval: 60, // 60 seconds. take to env, and use value to initialize rate limiter
  mintingError: undefined,
  publicKey: undefined,
  mintAddress: mintAddress.toBase58(),
};

export const mintTokens = createAsyncThunk(
  "mint/mintTokens",
  async (_, thunkAPI) => {
    const { mint } = thunkAPI.getState() as RootStateType;

    if (!connection || !mint.publicKey) {
      console.log("Wallet not connected");
      return;
    }

    let response = await fetch("/api/solana/mint-tokens", {
      method: "POST",
      body: JSON.stringify({
        destination: mint.associatedTokenAddress,
      }),
    });

    return response.json();
  }
);

export const getOrCreateTokenAccount = createAsyncThunk(
  "mint/getOrCreateTokenAccount",
  async (_, thunkAPI) => {
    const { mint } = thunkAPI.getState() as RootStateType;

    if (!connection || !mint.publicKey) {
      console.log("Wallet not connected");
      return;
    }

    let response = await fetch("/api/solana/create-token-account", {
      method: "POST",
      body: JSON.stringify({
        associatedTokenAddress: mint.associatedTokenAddress,
        publicKey: mint.publicKey,
      }),
    });

    return response.json();
  }
);

export const mintSlice = createSlice({
  name: "mint",
  initialState,
  reducers: {
    resetMint: (state) => {
      state.progress = 0;
    },
    setTokenAddress: (state, action: PayloadAction<string>) => {
      state.associatedTokenAddress = action.payload;
    },
    setTokenBalance: (state, action: PayloadAction<number>) => {
      state.tokenBalance = action.payload;
    },
    setPublicKey: (
      state,
      action: PayloadAction<MintStateType["publicKey"]>
    ) => {
      state.publicKey = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(trackProgress, (state, action) => {
        state.progress += 1;
      })
      .addCase(mintTokens.pending, (state, action) => {
        state.minting = true;
      })
      .addCase(mintTokens.fulfilled, (state, action) => {
        state.minting = false;
        state.tokenBalance = action.payload.balance;
      })
      .addCase(mintTokens.rejected, (state, action) => {
        state.minting = false;
        state.mintingError = action.error.message;
      })
      .addCase(getOrCreateTokenAccount.pending, (state, action) => {
        state.creatingTokenAccount = true;
      })
      .addCase(getOrCreateTokenAccount.fulfilled, (state, action) => {
        state.creatingTokenAccount = false;
        state.tokenBalance = action.payload.balance;
      })
      .addCase(getOrCreateTokenAccount.rejected, (state, action) => {
        state.creatingTokenAccount = false;
        state.tokenAccountError = action.error.message;
      });
  },
});

export const { resetMint, setTokenAddress, setTokenBalance, setPublicKey } =
  mintSlice.actions;

export default mintSlice.reducer;
