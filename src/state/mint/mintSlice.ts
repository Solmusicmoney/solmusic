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
  bonk: {
    mintAddress: string;
    associatedTokenAddress: string | null;
    bonkBalance: number;
    creatingTokenAccount: boolean;
    tokenAccountError: string | undefined;
    distributing: boolean;
  };
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
  bonk: {
    mintAddress: process.env.NEXT_PUBLIC_BONK_MINT_ADDRESS!,
    associatedTokenAddress: null,
    bonkBalance: 0,
    creatingTokenAccount: false,
    tokenAccountError: undefined,
    distributing: false,
  },
};

export const mintTokens = createAsyncThunk(
  "mint/mintTokens",
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
          destination: mint.associatedTokenAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData || "An error occurred");
      } else {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(JSON.stringify(err));
    }
  }
);
export const distributeBonkTokens = createAsyncThunk(
  "mint/distributeBonkTokens",
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
          destination: mint.bonk.associatedTokenAddress,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData || "An error occurred");
      } else {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      thunkAPI.rejectWithValue(JSON.stringify(err));
    }
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

    try {
      let response = await fetch("/api/solana/create-token-account", {
        method: "POST",
        body: JSON.stringify({
          associatedTokenAddress: mint.associatedTokenAddress,
          publicKey: mint.publicKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData || "An error occurred");
      } else {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      thunkAPI.rejectWithValue(JSON.stringify(err));
    }
  }
);
export const getOrCreateBonkTokenAccount = createAsyncThunk(
  "mint/getOrCreateBonkTokenAccount",
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
          associatedTokenAddress: mint.bonk.associatedTokenAddress,
          publicKey: mint.publicKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData || "An error occurred");
      } else {
        const data = await response.json();
        return data;
      }
    } catch (err) {
      thunkAPI.rejectWithValue(JSON.stringify(err));
    }
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
    setBonkTokenAddress: (state, action: PayloadAction<string>) => {
      state.bonk.associatedTokenAddress = action.payload;
    },
    setTokenBalance: (state, action: PayloadAction<number>) => {
      state.tokenBalance = action.payload;
    },
    setBonkBalance: (state, action: PayloadAction<number>) => {
      state.bonk.bonkBalance = action.payload;
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
        if (action.payload.playing) {
          state.progress += 1;
        }
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
      })
      .addCase(distributeBonkTokens.pending, (state, action) => {
        state.bonk.distributing = true;
      })
      .addCase(distributeBonkTokens.fulfilled, (state, action) => {
        state.bonk.distributing = false;
        state.bonk.bonkBalance = action.payload.balance;
      })
      .addCase(distributeBonkTokens.rejected, (state, action) => {
        state.bonk.distributing = false;
        state.bonk.tokenAccountError = action.error.message;
      })
      .addCase(getOrCreateBonkTokenAccount.pending, (state, action) => {
        state.bonk.creatingTokenAccount = true;
      })
      .addCase(getOrCreateBonkTokenAccount.fulfilled, (state, action) => {
        state.bonk.creatingTokenAccount = false;
        state.bonk.bonkBalance = action.payload.balance;
      })
      .addCase(getOrCreateBonkTokenAccount.rejected, (state, action) => {
        state.bonk.creatingTokenAccount = false;
        state.bonk.tokenAccountError = action.error.message;
      });
  },
});

export const {
  resetMint,
  setTokenAddress,
  setTokenBalance,
  setPublicKey,
  setBonkBalance,
  setBonkTokenAddress,
} = mintSlice.actions;

export default mintSlice.reducer;
