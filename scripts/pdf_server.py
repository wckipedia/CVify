#!/usr/bin/env python3
"""Tiny PDF export server for CVify.

Run this next to the Vite dev server:
  python3 scripts/pdf_server.py
"""

from __future__ import annotations

import json
import os
import re
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import sync_playwright


HOST = os.environ.get("CVIFY_PDF_HOST", "127.0.0.1")
PORT = int(os.environ.get("CVIFY_PDF_PORT", "8765"))
APP_URL = os.environ.get("CVIFY_APP_URL", "http://127.0.0.1:5173/print")
MAX_BODY_BYTES = 2 * 1024 * 1024


def sanitize_filename(name: str) -> str:
    cleaned = re.sub(r"[^\w\s-]", "", name.strip())
    cleaned = re.sub(r"\s+", "-", cleaned).lower()
    return cleaned or "resume"


def render_pdf(data: dict[str, Any]) -> bytes:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page(viewport={"width": 816, "height": 1056})
        page.emulate_media(media="print")
        page.add_init_script(
            "window.__CVIFY_PRINT_DATA__ = "
            + json.dumps(data, ensure_ascii=False)
            + "; window.__CVIFY_PRINT_READY__ = false;"
        )
        page.goto(APP_URL, wait_until="networkidle")
        page.wait_for_function("window.__CVIFY_PRINT_READY__ === true", timeout=10000)
        pdf = page.pdf(
            format="Letter",
            print_background=True,
            prefer_css_page_size=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        )
        browser.close()
        return pdf


class PdfRequestHandler(BaseHTTPRequestHandler):
    server_version = "CVifyPDF/1.0"

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_POST(self) -> None:
        if self.path != "/api/export-pdf":
            self.send_error(HTTPStatus.NOT_FOUND, "Unknown endpoint.")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0 or content_length > MAX_BODY_BYTES:
            self.send_error(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, "Request body too large.")
            return

        try:
            payload = json.loads(self.rfile.read(content_length))
            data = payload["data"]
            filename = sanitize_filename(str(payload.get("filename", "resume")))
            if not isinstance(data, dict):
                raise ValueError("Resume data must be an object.")
            pdf = render_pdf(data)
        except (KeyError, ValueError, json.JSONDecodeError) as error:
            self.send_error(HTTPStatus.BAD_REQUEST, str(error))
            return
        except PlaywrightError as error:
            self.send_error(
                HTTPStatus.INTERNAL_SERVER_ERROR,
                f"PDF renderer failed: {error}",
            )
            return

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/pdf")
        self.send_header(
            "Content-Disposition",
            f'attachment; filename="{filename}.pdf"',
        )
        self.send_header("Content-Length", str(len(pdf)))
        self.end_headers()
        self.wfile.write(pdf)

    def log_message(self, format: str, *args: Any) -> None:
        print("%s - %s" % (self.address_string(), format % args))


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), PdfRequestHandler)
    print(f"CVify PDF server listening on http://{HOST}:{PORT}")
    print(f"Rendering print route from {APP_URL}")
    server.serve_forever()


if __name__ == "__main__":
    main()
