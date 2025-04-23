export async function onRequest(context) {
  console.log('[Pages Function] onRequest triggered!');
  const { request, env, params } = context;
  
  // Извлекаем путь из параметров
  const path = Array.isArray(params.path) ? params.path.join('/') : params.path || '';
  
  console.log(`[Pages Function] Receiving ${request.method} request to /api/${path}`);
  
  // Создаем URL для API воркера
  const apiUrl = new URL(`https://whatsapp-webhook.alekenov.workers.dev/api/${path}`);
  
  // Копируем все параметры запроса
  const url = new URL(request.url);
  url.searchParams.forEach((value, key) => {
    apiUrl.searchParams.set(key, value);
  });

  // Проверка на OPTIONS запрос для CORS preflight
  if (request.method === 'OPTIONS') {
    console.log(`[Pages Function] Handling OPTIONS preflight request`);
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  try {
    console.log(`[Pages Function] Forwarding ${request.method} request to ${apiUrl.toString()}`);
    
    let requestBody = null;
    
    // Копируем тело запроса, если метод не GET/HEAD/OPTIONS
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const contentType = request.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        // Для JSON запросов читаем и логируем тело
        const clonedRequest = request.clone();
        const bodyText = await clonedRequest.text();
        console.log(`[Pages Function] Request body: ${bodyText}`);
        requestBody = bodyText;
      } else {
        // Для других типов просто копируем тело как ArrayBuffer
        requestBody = await request.clone().arrayBuffer();
      }
    }
    
    // Создаем заголовки для нового запроса, копируя оригинальные
    const headers = new Headers();
    for (const [key, value] of request.headers.entries()) {
      headers.set(key, value);
    }
    
    // Создаем новый запрос
    const newRequest = new Request(apiUrl.toString(), {
      method: request.method,
      headers: headers,
      body: requestBody,
      redirect: 'follow'
    });
    
    // Проксируем запрос на воркер
    const response = await fetch(newRequest);
    
    console.log(`[Pages Function] Received response with status ${response.status}`);
    
    // Если получили не-успешный ответ, логируем его тело
    if (!response.ok) {
      const clonedResponse = response.clone();
      const responseText = await clonedResponse.text();
      console.log(`[Pages Function] Error response body: ${responseText}`);
    }
    
    // Добавляем CORS заголовки
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Access-Control-Allow-Origin', '*');
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Возвращаем ответ клиенту
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  } catch (error) {
    console.error(`[Pages Function] Error proxying to worker:`, error.message);
    
    return new Response(JSON.stringify({ 
      error: 'Failed to connect to API',
      message: error.message,
      path: path,
      url: apiUrl.toString(),
      method: request.method
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
