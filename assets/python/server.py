import http.server
import socketserver
import os
import sys
import webbrowser
import threading
import time

# Set the directory you want to serve
parent_dir = os.getcwd()

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=parent_dir, **kwargs)

# Set up the server
port = 8000
handler = CustomHandler

# Set the browser controller and URL or the server
browser_controller = None
server_url = f"http://localhost:{port}"

def open_browser():
    # Wait for a moment to ensure the server has started
    time.sleep(1)
    # Open a new browser window and keep the controller
    browser_controller = webbrowser.get()
    browser_controller.open(server_url, new=1, autoraise=True)

# Try to start the server
try:
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving files from: {parent_dir}")
        print(f"Server running on {server_url}")
        print("Press Ctrl+C to stop the server")

        # Start a thread to open the browser
        threading.Thread(target=open_browser, daemon=True).start()

        httpd.serve_forever()
        
except KeyboardInterrupt:
    print("\nServer stopped.")
    sys.exit(0)