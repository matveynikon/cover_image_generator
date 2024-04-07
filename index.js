/**
import { Ai } from './vendor/@cloudflare/ai.js';

export default {
  async fetch(request, env) {
    const ai = new Ai(env.AI);

    const inputs = {
      prompt: "Generate an over the top cover image with eccentric features for a tutorial which has the following themes: hacking, web security, penetration testing, software vulnerabilities",
    };

    const response = await ai.run(
      "@cf/lykon/dreamshaper-8-lcm",
      inputs
    );

    return new Response(response, {
      headers: {
        "content-type": "image/png",
      },
    });
  },
};
*/
import { Ai } from './vendor/@cloudflare/ai.js';

export default {
  async fetch(request, env) {
    const ai = new Ai(env.AI);
    const html = `
    <!DOCTYPE html>
    <head>
    <link href='https://fonts.googleapis.com/css?family=ADLaM Display' rel='stylesheet'>
    <style>
    body{
      background: LightSeaGreen;
      font-family: 'ADLaM Display';font-size: 22px;
    }
    h1{
      text-align: center;
      font-size: 30px;
    }
    form{
      margin: 5%;
    }
    input{
      border-radius: 6px;
    }
    #sb{
      margin-top: 1%;
      padding: 1% 3% 1% 3%;
      background: white;
      color: black;
    }
    </style>
    </head>
		<body>
		  <div><h1>Generate Creative and Original Cover Images for Your Articles</h1></div>
      <form action="/" method="post">
        <label for="ade">Image should contain:</label><br>
        <input type="text" id="ade" name="ade"><br>
        <label for="ate">Cover image style:</label><br>
        <input type="text" id="ate" name="ate"><br>
        <label for="atm">Atmosphere:</label><br>
        <input type="text" id="atm" name="atm"><br>
        <label for="excl">Themes and things to avoid:</label><br>
        <input type="text" id="excl" name="excl"><br>
        <input type="submit" value="Submit" id="sb">
      </form> 
		</body>`;

    /**
     * readRequestBody reads in the incoming request body
     * Use await readRequestBody(..) in an async function to get the string
     * @param {Request} request the incoming request to read from
     */
    async function readRequestBody(request) {
      const contentType = request.headers.get("content-type");
      if (contentType.includes("application/json")) {
        return JSON.stringify(await request.json());
      } else if (contentType.includes("application/text")) {
        return request.text();
      } else if (contentType.includes("text/html")) {
        return request.text();
      } else if (contentType.includes("form")) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
          body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
      } else {
        // Perhaps some other type of data was submitted in the form
        // like an image, or some other binary data.
        return "a file";
      }
    }

    const { url } = request;
    if (request.method === "POST") {
      const formData = await request.formData();
      const inputs = {
        prompt: `a 1200px x 800px image which portrays: ${formData.get('ade')} and has the following styles: ${formData.get('ate')}. The image should not be or contain any of the following: ${formData.get('excl')}. The image should have color tones and features of the following atmosphere: ${formData.get('atm')}`,
      };
  
      const response = await ai.run(
        "@cf/bytedance/stable-diffusion-xl-lightning",
        inputs
      );

      const response2 = `
      <!DOCTYPE html>
      <body>
      ${response}
      <a href="${response}" download>
        Download
      </a>
      </body>
      `
  
      return new Response(response2, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
      
    } else if (request.method === "GET") {
      return new Response(html, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
    });
    }
  },
};
