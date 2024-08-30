import { config } from "dotenv";
config();
import axios from "axios";

class YandexCloud {
  private folderId: string;
  private oauth: string;
  private iam: string | null = null;

  constructor() {
    this.folderId = process.env.YANDEX_CLOUD_FOLDER_ID || "";
    this.oauth = process.env.YANDEX_CLOUD_OAUTH || "";
  }

  public async getIAMtoken() {
    await axios
      .post<{ iamToken: string; expiresAt: string }>(
        "https://iam.api.cloud.yandex.net/iam/v1/tokens",
        {
          yandexPassportOauthToken: this.oauth,
        },
      )
      .then(({ data }) => {
        this.iam = data.iamToken;
      });
  }

  public async sendMessageToGPT(
    promt: string,
    message: string,
  ): Promise<string> {
    let result = "false";

    await axios
      .post<{
        result: { alternatives: { message: { role: string; text: string } }[] };
      }>(
        "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
        {
          modelUri: `gpt://${this.folderId}/yandexgpt-lite/latest`,
          messages: [
            {
              role: "system",
              text: promt,
            },
            {
              role: "user",
              text: message,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${this.iam}`,
          },
        },
      )
      .then(({ data }) => {
        result = data.result.alternatives[0].message.text;
      })
      .catch(() => {
        result = "false";
      });

    return result;
  }
}

export default YandexCloud;
