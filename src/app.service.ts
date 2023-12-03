import { Injectable, UnauthorizedException } from '@nestjs/common';
// @Injectable()
// export class AppService {
//   constructor(private readonly httpService: HttpService) {}

//   async getLeads(query?: string): Promise<any> {
//     const apiUrl = 'https://scarduus.amocrm.ru/api/v4/leads';

//     const headers = {
//       Authorization:
//         'Bearer def50200a795cdde5612f54a205f13acd93add9ee295535ed60738e36bfb99dfe707acb2d7c7ce1290c9532ed8fb0fd6db8f23cf08d39419f7b50bf7d6ab0f9171f3c2e21b34d74645b4972e1b216bb43e429d93879a44778d0b751f176d544a4f63e42be66dff859820ce99110f35d7583dc964f63e6d9d8505fa9d679273196ea8d9ed030ac82f443d8d0eee4fd087a051fca2966a4e63267c389fb94cf631ed14a2d842d324456e03650c4b22b6bdfff0c29244e0f19ef77e3ae052efd1c03dc361d3560c444f282cfee8f5a74550e88c841d56b524650098c61b60fa0777b4aa161fcbb1811c98a36746ff0ce3846f926dcd54aa95929158740e3c39938b98aae2f6e611721f2b73e89832fb40aca31ec0415d9938b735c379f1dd91cc943eb8b1300acf53098a350575a6d1f860e4b805b8eedb598c27c6988f0bc3cfde8254be800dfaad64056a2c165c393ceb04dc76b360a3e26676bd96f3f54bf1536af8af7cfb027cee5d71f6f32a237afd9962ccea832cbf4b8ab1cba11fc2cc05461c93346fb2385f97707d1260ce0bdcb1799ce0e9c274da11a202d98d57b01500bb85b79280b40bde61cfaf1eef08a0e1c3164bc3dcdf2f38db1f94551aab129cd61472224c8d82fad03914a8819aebbdea689c7531fcaf3872fb3cbc3769b4d25e5633386de8',
//     };

//     const params: any = {};

//     if (query && query.length >= 3) {
//       params.query = query;
//     }

//     try {
//       const response = await this.httpService
//         .get(apiUrl, { headers, params })
//         .toPromise();
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   }
// }
import axios, { AxiosResponse } from 'axios';
@Injectable()
export class ApiService {
  private readonly apiUrl = process.env.API_URL;
  private readonly clientId = process.env.CLIENT_ID;
  private readonly clientSecret = process.env.CLIENT_SECRET;
  private readonly redirectUri = 'http://www.example.com';
  private accessToken: string;
  private refreshToken: string;

  async getAmoCRMLeads() {
    if (!this.accessToken) {
      await this.refreshAccessToken();
    }

    try {
      const response: AxiosResponse = await axios.get(this.apiUrl, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Если токен устарел
        await this.refreshAccessToken();
        return this.getAmoCRMLeads();
      }
      throw error;
    }
  }

  private async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const tokenUrl = 'https://scarduus.amocrm.ru/oauth2/access_token';

    try {
      const response: AxiosResponse = await axios.post(tokenUrl, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh access token');
    }
  }
}
