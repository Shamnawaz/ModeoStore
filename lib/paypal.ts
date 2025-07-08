import { PAYPAL_API_URL } from "./constants";

export const paypal = {};

// Paypal access token
export async function generateAccessToken() {
   const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
   const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64');

   const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    }
   });

     const jsonData = await handleResponse(res);
     return jsonData.access_token;
}

async function handleResponse(response: any) {
     if (response.status === 200 || response.status === 201) {
          return response.json();
     }
     const errorMessage = await response.text();
     throw new Error(errorMessage);
}