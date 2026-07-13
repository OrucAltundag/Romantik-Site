<#
.SYNOPSIS
    Claude ana orkestrator icin guvenli Codex CLI wrapper'i.

.DESCRIPTION
    OpenAI Codex CLI'yi (codex exec) kontrollu ve guvenli sekilde calistirir.
    - Calisma dizinini acikca mevcut projeye sinirlar (-C).
    - Varsayilan olarak SALT OKUNUR sandbox kullanir (-s read-only).
    - Insan onayini kapatan tehlikeli bypass secenekleri EKLENMEZ.
    - Prompt shell icinde eval edilmez; dogrudan arguman olarak gecirilir.

.PARAMETER Task
    Codex'e verilecek gorev metni (zorunlu).

.PARAMETER WorkingDirectory
    Calisma dizini. Varsayilan: script'in bulundugu repo koku.

.PARAMETER Sandbox
    Sandbox politikasi: read-only (varsayilan), workspace-write, danger-full-access.
    danger-full-access bilerek kisitlanmistir; yazma gerekiyorsa workspace-write kullanin.

.EXAMPLE
    .\scripts\ask-codex.ps1 -Task "Bu projeyi incele ve teknik borclari listele."

.EXAMPLE
    .\scripts\ask-codex.ps1 -Task "Su testleri ekle." -Sandbox workspace-write
#>
param(
    [Parameter(Mandatory = $true)]
    [string]$Task,

    [string]$WorkingDirectory = (Split-Path -Parent $PSScriptRoot),

    [ValidateSet("read-only", "workspace-write")]
    [string]$Sandbox = "read-only",

    # Windows sandbox uygulama modu. Bu makinede global config "elevated" olup
    # non-interactive exec'te "os error 3" verebildigi icin varsayilan "unelevated".
    # Sandbox KAPATILMAZ; sadece yukseltmesiz calisir. Guvenlik korunur.
    [ValidateSet("unelevated", "elevated")]
    [string]$WindowsSandbox = "unelevated"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command codex -ErrorAction SilentlyContinue)) {
    throw "Codex CLI bulunamadi. Once 'npm install -g @openai/codex' calistirin."
}

if (-not (Test-Path -LiteralPath $WorkingDirectory)) {
    throw "Calisma dizini bulunamadi: $WorkingDirectory"
}

$resolved = (Resolve-Path -LiteralPath $WorkingDirectory).Path

Write-Host "Codex calisma dizini : $resolved"
Write-Host "Sandbox politikasi   : $Sandbox"
Write-Host "Gorev                : $Task"
Write-Host ""

# codex exec (non-interactive):
#   -s / --sandbox        : sandbox politikasi (varsayilan read-only)
#   -C / --cd             : calisma dizinini acikca sinirla
#   -c windows.sandbox=.. : Windows sandbox uygulama modu (kalici degil, per-call)
# Prompt son arguman olarak gecirilir; stdin bloke olmasin diye bos girdi verilir.
# NOT: --dangerously-bypass-approvals-and-sandbox ve --yolo BILEREK kullanilmaz.
"" | codex exec -c "windows.sandbox=`"$WindowsSandbox`"" -s $Sandbox -C $resolved $Task
$exit = $LASTEXITCODE

if ($exit -ne 0) {
    throw "Codex basarisiz oldu. Cikis kodu: $exit"
}
