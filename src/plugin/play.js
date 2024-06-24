import ytdl from 'ytdl-core';
import ytSearch from 'yt-search';
import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const searchResultsMap = new Map();
let searchIndex = 1; 

const playcommand = async (m, Matrix) => {
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

  const validCommands = ['song', 'video', 'play'];

  if (validCommands.includes(cmd)) {
    if (!text) {
      return m.reply('P͢l͢e͢a͢s͢e͢ p͢r͢o͢v͢i͢d͢e͢ a͢ s͢e͢a͢r͢c͢h͢ q͢u͢e͢r͢y͢.');
    }

    try {
      await m.React("🔎");

 
      const searchResults = await ytSearch(text);
      const videos = searchResults.videos.slice(0, 5); 

      if (videos.length === 0) {
        m.reply('No results found.');
        await m.React("❌");
        return;
      }


      videos.forEach((video, index) => {
        const uniqueId = searchIndex + index;
        searchResultsMap.set(uniqueId, video);
      });


      const currentResult = searchResultsMap.get(searchIndex);
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎧 Audio",
            id: `media_audio_${searchIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎥 Video",
            id: `media_video_${searchIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎵 Audio Document",
            id: `media_audiodoc_${searchIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎦 Video Document",
            id: `media_videodoc_${searchIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "⏩ Next",
            id: `next_${searchIndex + 1}`
          })
        }
      ];

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `R͢C͢D͢ M͢D͢ Y͢O͢U͢T͢U͢B͢E͢ S͢E͢A͢R͢C͢H͢\n\n*🔍Title:* ${currentResult.title}\n*✍️Author:* ${currentResult.author.name}\n*🥸 Views:* ${currentResult.views}\n*🏮 Duration:* ${currentResult.timestamp}\n`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "🇱🇰 P͢O͢W͢E͢R͢ B͢Y͢ R͢C͢D͢ M͢D͢"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                 ...(await prepareWAMessageMedia({ image: { url: `https://telegra.ph/file/2d9a21c403a79096b88c1.jpg` } }, { upload: Matrix.waUploadToServer })),
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
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

      searchIndex += 1; 
    } catch (error) {
      console.error("Error processing your request:", error);
      m.reply('Error processing your request.');
      await m.React("❌");
    }
  } else if (selectedId) { 
    if (selectedId.startsWith('next_')) {
      const nextIndex = parseInt(selectedId.replace('next_', ''));
      const currentResult = searchResultsMap.get(nextIndex);

      if (!currentResult) {
        return m.reply('No more results.');
      }
      const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎧 Audio",
            id: `media_audio_${nextIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎥 Video",
            id: `media_video_${nextIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎵 Audio Document",
            id: `media_audiodoc_${nextIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "🎦 Video Document",
            id: `media_videodoc_${nextIndex}`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "⏩ Next",
            id: `next_${nextIndex + 1}`
          })
        }
      ];

      const msg = generateWAMessageFromContent(m.from, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `R͢C͢D͢ M͢D͢ Y͢O͢U͢T͢U͢B͢E͢ S͢E͢A͢R͢C͢H\n\n*🔍Title:* ${currentResult.title}\n*✍️ Author:* ${currentResult.author.name}\n*🥸 Views:* ${currentResult.views}\n*🏮 Duration:* ${currentResult.timestamp}\n`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "🇱🇰 P͢O͢W͢E͢R͢ B͢Y͢ R͢C͢D͢ M͢D͢"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                 ...(await prepareWAMessageMedia({ image: { url: `https://telegra.ph/file/2d9a21c403a79096b88c1.jpg` } }, { upload: Matrix.waUploadToServer })),
                title: "",
                gifPlayback: true,
                subtitle: "",
                hasMediaAttachment: false 
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons
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
    } else if (selectedId.startsWith('media_')) {
      const parts = selectedId.split('_');
      const type = parts[1];
      const key = parseInt(parts[2]);
      const selectedMedia = searchResultsMap.get(key);

      if (selectedMedia) {
        try {
          const videoUrl = selectedMedia.url;
          let finalMediaBuffer, mimeType, content;

          const stream = ytdl(videoUrl, { filter: type === 'audio' || type === 'audiodoc' ? 'audioonly' : 'video' });

          if (type === 'audio' || type === 'audiodoc') {
            finalMediaBuffer = await getStreamBuffer(stream);
            mimeType = 'audio/mp3';
          } else {
            finalMediaBuffer = await getStreamBuffer(stream);
            mimeType = 'video/mp4';
          }

          const fileSizeInMB = finalMediaBuffer.length / (1024 * 1024);

          if (type === 'audio' && fileSizeInMB <= 300) {
            content = { audio: finalMediaBuffer, mimetype: 'audio/mpeg', caption: '𝚁𝙲𝙳 𝙼𝙳 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁' };
          } else if (type === 'video' && fileSizeInMB <= 300) {
            content = { video: finalMediaBuffer, mimetype: 'video/mp4', caption: '𝚁𝙲𝙳 𝙼𝙳 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁' };
          } else if (type === 'audiodoc') {
            content = { document: finalMediaBuffer, mimetype: 'audio/mp3', fileName: `${selectedMedia.title}.mp3` };
          } else if (type === 'videodoc') {
            content = { document: finalMediaBuffer, mimetype: 'video/mp4', fileName: `${selectedMedia.title}.mp4`, caption: `Downloading video: ${selectedMedia.title}` };
          }

          await Matrix.sendMessage(m.from, content, { quoted: m });
        } catch (error) {
          console.error("Error processing your request:", error);
          m.reply('Error processing your request.');
          await m.React("❌");
        }
      }
    }
  }
};

const getStreamBuffer = async (stream) => {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', err => reject(err));
  });
};

export default playcommand;
