$ErrorActionPreference = 'Stop'
$videoRoot = Split-Path -Parent $PSScriptRoot
$lessons = Get-Content -Raw (Join-Path $videoRoot 'public/lessons.json') | ConvertFrom-Json
$voice = New-Object -ComObject SAPI.SpVoice
$voice.Voice = @($voice.GetVoices() | Where-Object { $_.GetDescription() -like '*Zira*' })[0]
$manifest = @{}
function Get-WaveDuration([string]$path) {
  $reader = [System.IO.BinaryReader]::new([System.IO.File]::OpenRead($path))
  try {
    $reader.BaseStream.Position = 12
    $byteRate = 0
    $dataBytes = 0
    while ($reader.BaseStream.Position + 8 -le $reader.BaseStream.Length) {
      $id = [Text.Encoding]::ASCII.GetString($reader.ReadBytes(4))
      $size = $reader.ReadUInt32()
      $next = $reader.BaseStream.Position + $size + ($size % 2)
      if ($id -eq 'fmt ') {
        $reader.BaseStream.Position += 8
        $byteRate = $reader.ReadUInt32()
      }
      if ($id -eq 'data') { $dataBytes = $size }
      $reader.BaseStream.Position = $next
    }
    return $dataBytes / $byteRate
  } finally { $reader.Dispose() }
}
foreach ($lesson in $lessons) {
  $clips = @()
  for ($i=0; $i -lt $lesson.chapters.Count; $i++) {
    $path = Join-Path $videoRoot "public/voice/$($lesson.id)-$i.wav"
    for ($rate=0; $rate -le 5; $rate++) {
      $stream = New-Object -ComObject SAPI.SpFileStream
      $stream.Format.Type = 22
      $stream.Open($path, 3, $false)
      $voice.AudioOutputStream = $stream
      $voice.Rate = $rate
      [void]$voice.Speak($lesson.chapters[$i].text)
      $stream.Close()
      $duration = Get-WaveDuration $path
      if ($duration -le 7.55) { break }
    }
    if ($duration -gt 7.55) { throw "Narration exceeds chapter: $($lesson.id)-$i" }
    $clips += @{file="voice/$($lesson.id)-$i.wav";duration=$duration;rate=$rate}
    Write-Output "$($lesson.id) chapter $($i+1): $([Math]::Round($duration,2)) seconds, rate $rate"
  }
  $manifest[$lesson.id] = $clips
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 (Join-Path $videoRoot 'src/voice.json')
