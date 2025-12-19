# Panduan Setup CORS di Backend Pyramid

## Masalah

Frontend yang di-host di Vercel tidak bisa mengakses backend di Render.com karena **CORS (Cross-Origin Resource Sharing)** belum dikonfigurasi.

Error yang muncul:
```
Failed to fetch
Access to fetch at 'https://uas-paw-kelompok9-sibeo.onrender.com/api/register' 
from origin 'https://your-project.vercel.app' has been blocked by CORS policy
```

## Solusi: Tambahkan CORS Middleware di Backend

### File: `e_learning/__init__.py`

```python
from pyramid.config import Configurator
from pyramid.session import SignedCookieSessionFactory

def cors_tween_factory(handler, registry):
    """CORS middleware untuk allow requests dari frontend"""
    def cors_tween(request):
        # Set CORS headers untuk semua response
        response = handler(request)
        response.headers.update({
            'Access-Control-Allow-Origin': '*',  # Atau specify Vercel URL
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '3600'
        })
        return response
    return cors_tween

def options_view_factory(context, request):
    """Handle OPTIONS preflight requests"""
    request.response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
        'Access-Control-Allow-Credentials': 'true'
    })
    return request.response

def main(global_config, **settings):
    """Application startup"""
    session_factory = SignedCookieSessionFactory('your-secret-key-here')
    
    config = Configurator(settings=settings, session_factory=session_factory)
    
    # Include transaction manager PERTAMA
    config.include('pyramid_tm')
    config.include('pyramid_retry')
    
    # TAMBAHKAN CORS TWEEN
    config.add_tween('e_learning.cors_tween_factory')
    
    # Handle preflight OPTIONS requests
    config.add_view(options_view_factory, request_method='OPTIONS')
    
    # --- ROUTES (existing routes) ---
    config.add_route('home', '/', request_method='GET')
    config.add_route('register', '/api/register', request_method='POST')
    config.add_route('login', '/api/login', request_method='POST')
    # ... rest of your routes
    
    config.scan('e_learning.views')
    
    return config.make_wsgi_app()
```

## Penjelasan

1. **CORS Tween**: Middleware yang menambahkan headers CORS ke setiap response
2. **Access-Control-Allow-Origin**: Mengizinkan request dari domain manapun (`*`) atau specify domain tertentu
3. **Access-Control-Allow-Methods**: Method HTTP yang diizinkan
4. **Access-Control-Allow-Headers**: Headers yang diizinkan dalam request
5. **Access-Control-Allow-Credentials**: Mengizinkan cookies/session
6. **OPTIONS Handler**: Handle preflight request yang dikirim browser sebelum request asli

## Testing

Setelah setup CORS, test dengan:

```bash
# Test dari terminal
curl -X OPTIONS https://uas-paw-kelompok9-sibeo.onrender.com/api/register \
  -H "Origin: https://vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Harus return status 200 dengan CORS headers
```

Atau test dari frontend:
1. Deploy frontend ke Vercel
2. Coba register/login
3. Harusnya tidak ada error "Failed to fetch" lagi

## Alternative: Specify Domain (Lebih Aman)

Untuk production, lebih baik specify domain frontend:

```python
# Ganti '*' dengan URL frontend
ALLOWED_ORIGINS = [
    'https://your-project.vercel.app',
    'https://sibeo-frontend.vercel.app',
    'http://localhost:3000'  # untuk development
]

def cors_tween_factory(handler, registry):
    def cors_tween(request):
        origin = request.headers.get('Origin')
        response = handler(request)
        
        if origin in ALLOWED_ORIGINS:
            response.headers.update({
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
                'Access-Control-Allow-Credentials': 'true'
            })
        
        return response
    return cors_tween
```

## Verifikasi CORS Bekerja

Buka browser console (F12) setelah deploy, harusnya melihat:

```
[v0] API Call: https://uas-paw-kelompok9-sibeo.onrender.com/api/register
[v0] Response status: 201
[v0] Response headers: {
  "access-control-allow-origin": "*",
  "content-type": "application/json"
}
[v0] API Response: {success: true, data: {...}}
```

Tidak ada lagi error "Failed to fetch" atau "CORS policy blocked".

## Troubleshooting

### 1. Masih Ada CORS Error Setelah Deploy
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Pastikan backend sudah di-restart setelah update code

### 2. Session/Cookies Tidak Tersimpan
- Set `Access-Control-Allow-Credentials: 'true'`
- Frontend harus set `credentials: 'include'` di fetch (sudah ada)

### 3. Error 500 Setelah Tambah CORS
- Check syntax Python
- Check indentation
- Review logs di Render.com dashboard

---

**Note**: File ini adalah panduan untuk tim backend. Frontend sudah siap dan menunggu backend mengaktifkan CORS.
