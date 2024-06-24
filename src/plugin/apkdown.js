import { search, download } from 'aptoide-scraper';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const apkMap = new Map();
let apkIndex = 1; // Global index for APKs

const searchAPK = async (m, Matrix) => {
  let selectedListId;
  const selectedButtonId = m?.message?.templateButtonReplyMessage?.selectedId;
  const interactiveResponseMessage = m?.message?.interactiveResponseMessage;

  if (interactiveResponseMessage) {
    const paramsJson = interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson;
    if (paramsJson) {
      const params = JSON.parse(paramsJson);
      selectedListId = params.id;
    }
  }

  const selectedId = selectedListId || selectedButtonId;

  const prefixMatch = m.body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  const validCommands = ['apk', 'searchapk', 'apkdl', 'app'];

  if (validCommands.includes(cmd)) {
    if (!text) return m.reply('Please provide a search query for APKs');

    try {
      await m.React("🔎");


      let searchResult = await search(text);
      const topAPKs = searchResult.slice(0, 10);

      if (topAPKs.length === 0) {
        m.reply('No APKs found.');
        await m.React("❌");
        return;
      }

      const apkButtons = await Promise.all(topAPKs.map(async (apk, index) => {
        const uniqueId = `apk_${apkIndex + index}`;
        const apkDetails = await download(apk.id); 
        apkMap.set(uniqueId, {
          ...apk,
          size: apkDetails.size 
        });
        return {
          "header": "",
          "title": `📥 ${apk.name}`, 
          "description": `Size: ${apkDetails.size}`,
          "id": uniqueId 
        };
      }));

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `𝐑𝐂𝐃-𝐌𝐃 𝐀𝐏𝐊 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫\n\n🔍 𝐒𝐞𝐚𝐫𝐜𝐡 𝐚𝐧𝐝 𝐝𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐲𝐨𝐮𝐫 𝐟𝐚𝐯𝐨𝐫𝐢𝐭𝐞 𝐀𝐏𝐊𝐬 𝐞𝐚𝐬𝐢𝐥𝐲\n\n📌 𝐒𝐢𝐦𝐩𝐥𝐲 𝐬𝐞𝐥𝐞𝐜𝐭 𝐚𝐧 𝐀𝐏𝐊 𝐟𝐫𝐨𝐦 𝐭𝐡𝐞 𝐥𝐢𝐬𝐭 𝐛𝐞𝐥𝐨𝐰 𝐭𝐨 𝐠𝐞𝐭 𝐬𝐭𝐚𝐫𝐭𝐞𝐝.\n\n`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "🇱🇰 P͢O͢W͢E͢R͢ B͢Y͢ R͢C͢D͢ M͢D͢"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                ...(await prepareWAMessageMedia({ image: { url: `https://telegra.ph/file/2d9a21c403a79096b88c1.jpg` } }, { upload: Matrix.waUploadToServer })),
                title: ``,
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "🔎 Select An Apk ",
                      sections: [
                        {
                          title: "😎 Top 10 APK Results",
                          highlight_label: "🤩 Top 10",
                          rows: apkButtons
                        },
                      ]
                    })
                  }
                ],
              }),
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              }
            }),
          },
        },
      }, {});

      await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
        messageId: msg.key.id
      });
      await m.React("✅");


      apkIndex += topAPKs.length;
    } catch (error) {
      console.error("Error processing your request:", error);
      m.reply('Error processing your request.');
      await m.React("❌");
    }
  } else if (selectedId) { 
    const selectedAPK = apkMap.get(selectedId);

    if (selectedAPK) {
      try {
        const apkDetails = await download(selectedAPK.id); 
        const url = apkDetails.dllink;
        const iconUrl = apkDetails.icon;
        const size = apkDetails.size;

        await Matrix.sendMessage(m.from, { image: { url: iconUrl }, caption: `Y̼o̼u̼ s̼e̼l̼e̼c̼t̼e̼d̼ t̼h̼i̼s̼ A̼P̼K̼:\n\nName: ${selectedAPK.name}\nsize: ${size}\n\n🇱🇰 P͢O͢W͢E͢R͢ B͢Y͢ R͢C͢D͢ M͢D͢` }, { quoted: m });

  
        const apkMessage = {
          document: { url },
          mimetype: 'application/vnd.android.package-archive',
          fileName: `${selectedAPK.name}.apk`
        };

        await Matrix.sendMessage(m.from, apkMessage, { quoted: m });
      } catch (error) {
        console.error("Error sending APK:", error);
        m.reply('Error sending APK.');
      }
    } else {
    }
  }
};

export default searchAPK;
