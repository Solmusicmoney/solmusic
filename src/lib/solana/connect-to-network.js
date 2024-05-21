"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
var web3_js_1 = require("@solana/web3.js");
var connection = new web3_js_1.Connection((0, web3_js_1.clusterApiUrl)(process.env.NEXT_PUBLIC_CLUSTER));
exports.connection = connection;
console.log("Connection created!");
