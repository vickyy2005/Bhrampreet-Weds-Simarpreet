import http.server
import json
import os
import socketserver

PORT = 8000
WISHES_FILE = os.path.join(os.path.dirname(__file__), "wishes.json")

# Ensure wishes file exists
if not os.path.exists(WISHES_FILE):
    with open(WISHES_FILE, "w", encoding="utf-8") as f:
        json.dump({"wishes": []}, f, indent=2)

class WeddingInvitationHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_HEAD(self):
        if self.path == "/api/wishes" or self.path.startswith("/api/wishes?"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
        else:
            super().do_HEAD()

    def do_GET(self):
        if self.path == "/api/wishes" or self.path.startswith("/api/wishes?"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            try:
                with open(WISHES_FILE, "r", encoding="utf-8") as f:
                    data = f.read()
            except Exception:
                data = json.dumps({"wishes": []})
            self.wfile.write(data.encode("utf-8"))
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/wishes":
            content_length = int(self.headers.get("Content-Length", 0))
            post_body = self.rfile.read(content_length)
            try:
                payload = json.loads(post_body.decode("utf-8"))
                name = str(payload.get("name", "")).strip()
                message = str(payload.get("message", "")).strip()

                if not name or not message:
                    self.send_response(400)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Name and message are required."}).encode("utf-8"))
                    return

                # Load existing wishes
                wishes_data = {"wishes": []}
                if os.path.exists(WISHES_FILE):
                    try:
                        with open(WISHES_FILE, "r", encoding="utf-8") as f:
                            wishes_data = json.load(f)
                    except Exception:
                        wishes_data = {"wishes": []}

                new_wish = {"name": name, "message": message}
                wishes_data["wishes"].insert(0, new_wish)

                with open(WISHES_FILE, "w", encoding="utf-8") as f:
                    json.dump(wishes_data, f, indent=2, ensure_ascii=False)

                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"wish": new_wish}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), WeddingInvitationHandler) as httpd:
        print(f"Server started at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
