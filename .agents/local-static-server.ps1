param(
  [string]$Root = 'C:\xampp\htdocs\SSANJUKTA WEBSITE\sarab',
  [int]$Port = 8000
)

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()

$mimeTypes = @{
  '.css'  = 'text/css; charset=utf-8'
  '.eot'  = 'application/vnd.ms-fontobject'
  '.gif'  = 'image/gif'
  '.html' = 'text/html; charset=utf-8'
  '.jpeg' = 'image/jpeg'
  '.jpg'  = 'image/jpeg'
  '.js'   = 'application/javascript; charset=utf-8'
  '.png'  = 'image/png'
  '.svg'  = 'image/svg+xml'
  '.ttf'  = 'font/ttf'
  '.txt'  = 'text/plain; charset=utf-8'
  '.woff' = 'font/woff'
  '.woff2' = 'font/woff2'
}

Write-Host "Serving $Root on http://127.0.0.1:$Port/"

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $buffer = New-Object byte[] 8192
    $bytesRead = $stream.Read($buffer, 0, $buffer.Length)
    if ($bytesRead -le 0) {
      continue
    }

    $requestText = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $bytesRead)
    $requestLine = ($requestText -split "`r`n")[0]
    $parts = $requestLine.Split(' ')
    if ($parts.Length -lt 2) {
      continue
    }

    $path = [System.Uri]::UnescapeDataString($parts[1])
    if ([string]::IsNullOrWhiteSpace($path) -or $path -eq '/') {
      $path = '/index.html'
    }

    $relativePath = $path.TrimStart('/').Replace('/', '\')
    $fullPath = Join-Path $Root $relativePath

    if (Test-Path $fullPath -PathType Container) {
      $fullPath = Join-Path $fullPath 'index.html'
    }

    if (Test-Path $fullPath -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      $ext = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
      $contentType = $mimeTypes[$ext]
      if (-not $contentType) {
        $contentType = 'application/octet-stream'
      }

      $header = "HTTP/1.1 200 OK`r`nContent-Type: $contentType`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
      $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      $stream.Write($bytes, 0, $bytes.Length)
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
      $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      $stream.Write($body, 0, $body.Length)
    }
  } finally {
    if ($stream) { $stream.Close() }
    $client.Close()
  }
}
