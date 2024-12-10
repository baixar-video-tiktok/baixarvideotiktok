# baixar video tiktok

O TikTok Video Downloader é uma ferramenta online gratuita e fácil de usar para baixar vídeos do TikTok sem marca d’água, garantindo qualidade máxima. Compatível com PCs desktop, smartphones Android, iPhones, iPads e tablets, esta solução permite salvar seus vídeos favoritos em formato MP4 ou extrair o áudio em MP3 de alta definição. Aproveite uma experiência rápida e eficiente para armazenar vídeos do TikTok com a melhor qualidade disponível.
Uma ferramenta de integração de API de vídeos do TikTok baseada no framework Hono, utilizando o serviço Cloudflare Workers. Permite a rápida implementação de APIs para conectar-se ao seu provedor de TikTok API.
Sem necessidade de servidor, construído com sintaxe Node.js.

## Experiência Online

[https://baixarvideo-tik.com](https://baixarvideo-tik.com)

## pilha de tecnologia

Hono
node.js
javascript

## Obtenha os detalhes de um único vídeo com base na URL compartilhada do TikTok

principalmente formatando os dados e extraindo apenas os parâmetros necessários.

Endpoint: /tiktok-v2/get-one-video
Método: POST
Parâmetro:
• videoUrl (String)

## Transfira o link do vídeo para o armazenamento R2.

Isto é feito porque, ao baixar diretamente o arquivo de vídeo obtido de terceiros, os usuários front-end podem enfrentar problemas de CORS, resultando em falhas de download. É necessário que o Worker primeiro transfira o arquivo para o armazenamento R2 e, em seguida, forneça um link de download para que os usuários possam baixar o arquivo diretamente do R2.

Endpoint: /load-file
Método: GET
Parâmetro:
• videoUrl (String)
• fileName (String)

## Run & deploy

```
npm install
npm run dev
```

```
npm run deploy
```
