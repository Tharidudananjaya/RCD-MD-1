// config.js
const fs = require("fs");
require("dotenv").config();

const config = {
  SESSION_ID: process.env.SESSION_ID || "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoia0E3SkFnY0tWYXI1SlU5WUVnMTExSE5mNmlKS1FZcTR1dkNrUHp1TnEzQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic1ZzRlh3Z2wxTXN3anZJL0pieWE0SEpCN0ZYU1NwdGtqQ3FzbDVwZ3RUcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJRQk00TUJrbGZ5SW5uSlBOeDM5WGJibWx3SkdCaEFwT2hZVit4OVFIdTNFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJZWGxIZ0w1UE1Lb0h0eU5PbWZnQVhkeitkajF5R2pXWmRsakhUQjBXam5NPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFCSnVvNlZYdTB3aW9KZG0waWtES2Urdyt4ejA5R3NWUmFiZUNhYVRrM3c9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkZIYzM4UzV3b05IeC9kdDBVU0tKZWE4QlJzYUVFYlI4TG9MTHBsVDdvMVk9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0ZyTFQ0YjA3MW52d1NIeFFIcWNCWUhVQVlmVzdPTE11cmFkVWtielVtZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSHFFODkwUkxBOHI2SmFsQjArdStPR1hEQWh6a0Y4ZXlzMUNzcWNoSkN5az0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlY0YWxCWnZzTWhhM1pqYUdtNEUrZldqSmFOeHhNZ09jejdsUFJpZnF2TERQajVQZzNXaGZWZXVaKzJIM0JXVjBxRmFzV0Q1aGc4RDV1THk1dkV4bGhBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTUxLCJhZHZTZWNyZXRLZXkiOiJjdzVYOXFYcml4SEtubXhNYzNNbnZyRWtwQjJnNUtUUjFFa3lHcXNvV2FFPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJaUTBfVExUcFFfNnc5TkdrRnotZk5nIiwicGhvbmVJZCI6ImQzOGUyZjg5LWFlN2ItNDFiNS1iN2MxLWFmMWVmNjQyMGY2ZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJNZ2dVTzBkR002RGJxcUh5YW00TkF2emFBSG89In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMERmalB0OHJnRy94UStuZkZSdzFiWUNQdmxJPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkNQRVI4WUZZIiwibWUiOnsiaWQiOiI5NDc4NDQwNTIzNzoyN0BzLndoYXRzYXBwLm5ldCIsIm5hbWUiOiLjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaTjhaQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0o2UHpPSUhFS1g0a2JRR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6Ikk5MnEzZmtPVFRKTncvQjQrTVU2Rmc4Tm1jb2xaYno4M2FCOU00OVk3d3M9IiwiYWNjb3VudFNpZ25hdHVyZSI6ImU2djMvL2lPaEJRY0FGcFBSZ25VaEd2OXN5aE8vTmt0N1V0RFYxcTVVU3B4VjV5YVJ6ZDNueFNSQ0Nnb2c2d3Y1OTNJRXNQdFRqWWdOTEl2cnRyUkN3PT0iLCJkZXZpY2VTaWduYXR1cmUiOiJwWEtQNXRBaVFIemFyMFhldEpHU3pYNWNvN055R1NzbDhXVzNTZWtHYmxwSVZQekhVRkZhL3VSK0ZGaXdaQWJkRmdRRUt5WHM3VHFhYTI1eTRNeVNqZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6Ijk0Nzg0NDA1MjM3OjI3QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlNQZHF0MzVEazB5VGNQd2VQakZPaFlQRFpuS0pXVzgvTjJnZlRPUFdPOEwifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MTk5NTg1NzcsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSklLIn0=",
  AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN !== undefined ? process.env.AUTO_STATUS_SEEN === 'true' : true, 
  AUTO_DL: process.env.AUTO_DL !== undefined ? process.env.AUTO_DL === 'true' : false,
  AUTO_READ: process.env.AUTO_READ !== undefined ? process.env.AUTO_READ === 'true' : false,
  AUTO_TYPING: process.env.AUTO_TYPING !== undefined ? process.env.AUTO_TYPING === 'false' : false,
  AUTO_RECORDING: process.env.AUTO_RECORDING !== undefined ? process.env.AUTO_RECORDING === 'true' : true,
  ALWAYS_ONLINE: process.env.ALWAYS_ONLINE !== undefined ? process.env.ALWAYS_ONLINE === 'true' : false,
  AUTO_REACT: process.env.AUTO_REACT !== undefined ? process.env.AUTO_REACT === 'true' : false,
   /*auto block only for 212 */
  AUTO_BLOCK: process.env.AUTO_BLOCK !== undefined ? process.env.AUTO_BLOCK === 'true' : true,
  
  
  REJECT_CALL: process.env.REJECT_CALL !== undefined ? process.env.REJECT_CALL === 'true' : false, 
  NOT_ALLOW: process.env.NOT_ALLOW !== undefined ? process.env.NOT_ALLOW === 'true' : true,
  MODE: process.env.MODE || 'private',
  OWNER_NAME: process.env.OWNER_NAME || "▶ RCD MD ◀",
  OWNER_NUMBER: process.env.OWNER_NUMBER || "94789958225",
  WELCOME: process.env.WELCOME !== undefined ? process.env.WELCOME === 'true' : false, 
};


module.exports = config;
