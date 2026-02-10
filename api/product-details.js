import crypto from 'crypto';

export default async function handler(request, response) {
  const { id } = request.query; // id

  if (!id) {
    return response.status(400).json({ error: 'Missing product ID' });
  }

  const APP_KEY = process.env.ALI_APP_KEY;
  const APP_SECRET = process.env.ALI_APP_SECRET;
  const apiUrl = 'https://api-sg.aliexpress.com/sync';
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  const params = {
    app_key: APP_KEY,
    format: 'json',
    method: 'aliexpress.affiliate.productdetail.get',
    partner_id_type: '2',
    sign_method: 'md5',
    timestamp: timestamp,
    v: '2.0',
    product_ids: id, // id for particular product
    target_currency: 'USD',
    target_language: 'EN',
    fields: 'product_id,product_title,product_imgs,product_desc,target_sale_price,attribute' // Co chcemy pobrać
  };

  // Md5 signature (standard Ali method) - ważne, żeby dokładnie tak było, bo inaczej Ali odrzuci zapytanie
  const sortedKeys = Object.keys(params).sort();
  let stringToSign = APP_SECRET;
  sortedKeys.forEach(key => stringToSign += key + params[key]);
  stringToSign += APP_SECRET;
  params.sign = crypto.createHash('md5').update(stringToSign, 'utf8').digest('hex').toUpperCase();

  const queryString = new URLSearchParams(params).toString();

  try {
    const fetchRes = await fetch(`${apiUrl}?${queryString}`, { method: 'POST' });
    const data = await fetchRes.json();

    if (data.error_response) {
       // Ali sometimes returns 200 OK but with an error message in the body, so we need to check that
      return response.status(404).json({ error: 'Product details not found' });
    }

    const details = data.aliexpress_affiliate_productdetail_get_response?.resp_result?.result?.products?.product?.[0];

    return response.status(200).json({ details });

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}