import { PAYPAL_API_URL } from "./constants";

export const paypal = {};

// Paypal access token
async function generateAccessToken() {
   const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET } = process.env;
   const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64');

   const res = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type':'application/x-www-form-urlencoded',
    }
   });

   if(res.ok) {
    const data = await res.json();
    return data.access_token;
   } else {
        const errMessage = await res.text();
        throw new Error(errMessage);
   }
}