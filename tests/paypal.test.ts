import { generateAccessToken } from '../lib/paypal';


test('generates token from paypal', async () => {
    const tokenRes = await generateAccessToken();
    console.log(tokenRes);
    
    expect(typeof tokenRes).toBe('string');
    expect(tokenRes.length).toBeGreaterThan(0);
});