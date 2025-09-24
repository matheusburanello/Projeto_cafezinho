import http.server
import socketserver
import json
from urllib.parse import urlparse, parse_qs

class MyHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Content-Type', 'application/json')
        
        if path == '/':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps({"message": "API funcionando"}).encode())
        elif path == '/products':
            self.send_response(200)
            self.end_headers()
            products = [
                {
                    "_id": "60d5ecb74f8a8b001f5e4e1a",
                    "title": "Expresso Cappuccino",
                    "description": ["cappuccino"],
                    "price": 8.50,
                    "category": "Drinks",
                    "available": True
                }
            ]
            self.wfile.write(json.dumps(products).encode())
        elif path == '/products/meta/categories':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps(["Drinks"]).encode())
        elif path == '/ping':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps({"message": "pong"}).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

PORT = 3335
with socketserver.TCPServer(("0.0.0.0", PORT), MyHandler) as httpd:
    print(f"Servidor rodando na porta {PORT}")
    print(f"Acesse em: http://10.53.52.27:{PORT}")
    httpd.serve_forever()
