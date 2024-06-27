import {
    getContentType,
    jidDecode,
    downloadMediaMessage,
    downloadContentFromMessage,
    generateWAMessage,
    areJidsSameUser,
    generateForwardMessageContent,
    makeInMemoryStore
} from "@whiskeysockets/baileys";
import { fileTypeFromBuffer } from 'file-type';
import fs from 'fs';
import pino from 'pino';
import path from 'path';
import PhoneNumber from 'awesome-phonenumber';
import { writeExifImg, writeExifVid } from './lib/exif.cjs'; // Adjust the path as needed
import { getBuffer, getSizeMedia } from './lib/myfunc.cjs'; // Adjust the path as needed
import baileys from "@whiskeysockets/baileys";
const proto = baileys.proto;
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

function decodeJid(jid) {
    const { user, server } = jidDecode(jid) || {};
    return user && server ? `${user}@${server}`.trim() : jid;
}

const downloadMedia = async message => {
    let type = Object.keys(message)[0];
    let m = message[type];
    if (type === "buttonsMessage" || type === "viewOnceMessageV2") {
        if (type === "viewOnceMessageV2") {
            m = message.viewOnceMessageV2?.message;
            type = Object.keys(m || {})[0];
        } else type = Object.keys(m || {})[1];
        m = m[type];
    }
    const stream = await downloadContentFromMessage(
        m,
        type.replace("hi", "")
    );
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
};

async function main() {
    const { default: makeWASocket, useSingleFileAuthState } = baileys;
    const { state, saveState } = useSingleFileAuthState('./auth_info.json');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ['Your WhatsApp Bot', 'Chrome', '1.0.0'],
        msgRetryCounterMap: {}
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message) return;
        const message = serialize(m, sock, pino().child({ level: 'silent' }));
        
        // Your voice message URL
        const voiceURL = 'https://github.com/purnapurna2007/Voice-/raw/main/media/Hi.mp3';
        
        // Send the voice message
        await sock.sendMessage(message.from, {
            audio: { url: voiceURL },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: message });
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
            // reconnect if not logged out
            if (shouldReconnect) {
                main();
            }
        } else if (connection === 'open') {
            console.log('opened connection');
        }
    });

    sock.ev.on('creds.update', saveState);
}

function serialize(m, sock, logger) {
    // The rest of your serialize function code
}

main();
