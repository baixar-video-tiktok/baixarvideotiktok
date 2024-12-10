import { Hono } from "hono";
import { cors } from "hono/cors";
type Bindings = {
  tiktok_v2_key: string;
  tiktok_v2_url: string;
  baixar: R2Bucket;
};
const app = new Hono<{ Bindings: Bindings }>();
app.use("/*", cors());
app.get("/", async (c) => {
  return c.text("Hello Hono");
});

app.post("/tiktok-v2/get-one-video", async (c) => {
  const reqJson = await c.req.json();
  const videoUrl = reqJson.url;
  const apiKey = c.env.tiktok_v2_key;
  const apiUrl = c.env.tiktok_v2_url;
  try {
    // Use fetch para iniciar uma solicitação para a interface externa
    const url = new URL(apiUrl);
    if (videoUrl) url.searchParams.append("share_url", videoUrl);
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey, // Se a autenticação for necessária, adicione seu token
      },
    });

    // Verifique a resposta da API externa
    if (!response.ok) {
      // return c.json({ success: true, reData });
      throw new Error(`External API error: ${response.status}`);
    }
    // Obtenha os dados retornados
    const reData = await response.json();
    if (reData.data.status_code === 0) {
      const usefulData = {
        contentType: reData.data.aweme_details[0].content_type,
        authorName: reData.data.aweme_details[0].author.nickname,
        authorAvatar:
          reData.data.aweme_details[0].author.avatar_300x300.url_list[0],
        authorSignature: reData.data.aweme_details[0].author.signature,
        authorUid: reData.data.aweme_details[0].author.uid,
        createTime: reData.data.aweme_details[0].create_time,
        music: {
          title: reData.data.aweme_details[0].music.title,
          album: reData.data.aweme_details[0].music.album,
          author: reData.data.aweme_details[0].music.author,
          authorAvatar:
            reData.data.aweme_details[0].music.avatar_thumb.url_list[0],
          musicAvatar:
            reData.data.aweme_details[0].music.cover_thumb.url_list[0],
          createTime:
            reData.data.aweme_details[0].music.cover_thumb.create_time,
          duration: reData.data.aweme_details[0].music.duration,
          url: reData.data.aweme_details[0].music.play_url.uri,
        },
        video: {
          cover: reData.data.aweme_details[0].video.cover.url_list[0],
          dynamicCover:
            reData.data.aweme_details[0].video.ai_dynamic_cover.url_list[0],
          duration: reData.data.aweme_details[0].video.duration,
          height: reData.data.aweme_details[0].video.height,
          url1: reData.data.aweme_details[0].video.bit_rate[0].play_addr
            .url_list[0],

          url2: reData.data.aweme_details[0].video.bit_rate[0].play_addr
            .url_list[1],

          url3: reData.data.aweme_details[0].video.bit_rate[0].play_addr
            .url_list[2],
        },
        satisfies: {
          collectCount: reData.data.aweme_details[0].statistics.collect_count,
          commentCount: reData.data.aweme_details[0].statistics.comment_count,
          diggCount: reData.data.aweme_details[0].statistics.digg_count,
          downloadCount: reData.data.aweme_details[0].statistics.download_count,
          playCount: reData.data.aweme_details[0].statistics.play_count,
          shareCount: reData.data.aweme_details[0].statistics.share_count,
          whatsappShareCount:
            reData.data.aweme_details[0].statistics.whatsapp_share_count,
        },
      };
      return c.json({ success: true, usefulData });
    } else {
      return c.json({ success: false, reData });
    }
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: error }, 500);
  }
});

app.get("/load-file", async (c) => {
  const fileName = c.req.query("fileName");
  const downloadUrl = c.req.query("videoUrl");
  const check_file = await c.env.baixar.get(fileName);
  if (!check_file) {
    const response = await fetch(downloadUrl);
    if (response.status !== 200) {
      return c.json({ status: 1 });
    } else {
      await c.env.baixar.put(fileName, response.body);
    }
    return c.json({ status: 2 });
  } else {
    return c.json({ status: 0 });
  }
  // return explicar
  // 0 O arquivo foi baixado e já existe
  // 1 Falha ao baixar o arquivo (erro ao acessar o link de download)
  // 2 O arquivo foi baixado e salvo com sucesso no armazenamento R2.
});

export default app;
