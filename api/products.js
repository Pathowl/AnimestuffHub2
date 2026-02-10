import crypto from 'crypto';

export default async function handler(request, response) {
  // fetching api keys from .env file
  const APP_KEY = process.env.ALI_APP_KEY;
  const APP_SECRET = process.env.ALI_APP_SECRET;

  if (!APP_KEY || !APP_SECRET) {
    return response.status(500).json({ error: 'Brak kluczy API w pliku .env' });
  }

  // aliexpress query
  const apiUrl = 'https://api-sg.aliexpress.com/sync';
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  
  // Pobieramy słowo kluczowe z adresu URL (np. ?q=Naruto), domyślnie "Anime Figure"
  const keyword = request.query.q || 'Anime Figure';
  const page = request.query.page || 1;

  const params = {
    app_key: APP_KEY,
    format: 'json',
    method: 'aliexpress.affiliate.product.query',
    partner_id_type: '2',
    sign_method: 'md5',
    timestamp: timestamp,
    v: '2.0',
    keywords: keyword,
    target_currency: 'USD',
    target_language: 'EN',
    sort: 'LAST_VOLUME_DESC',
    page_size: '50',  // 50 items
    tracking_id: 'default',
    ship_to_country: 'US',
    page_no: page
  };

  // MD5 signature (standard Ali method) - ważne, żeby dokładnie tak było, bo inaczej Ali odrzuci zapytanie
  const sortedKeys = Object.keys(params).sort();
  let stringToSign = APP_SECRET;
  sortedKeys.forEach(key => stringToSign += key + params[key]);
  stringToSign += APP_SECRET;
  
  params.sign = crypto.createHash('md5').update(stringToSign, 'utf8').digest('hex').toUpperCase();

  // query
  const queryString = new URLSearchParams(params).toString();

  try {
    const fetchRes = await fetch(`${apiUrl}?${queryString}`, { method: 'POST' });
    const data = await fetchRes.json();

    // Checking for ali errors - Ali sometimes returns 200 OK but with an error message in the body, so we need to check that
    if (data.error_response) {
      return response.status(500).json({ error: data.error_response });
    }

    // Extracting products from the response - Ali's response structure can be a bit nested, so we need to navigate through it to get the product list
    const products = data.aliexpress_affiliate_product_query_response?.resp_result?.result?.products?.product;

    if (!products) {
      return response.status(404).json({ message: 'Nie znaleziono produktów' });
    }

    // Returning the products to the frontend - to jest lista produktów, którą frontend będzie wyświetlał
    return response.status(200).json({ products });

  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
}