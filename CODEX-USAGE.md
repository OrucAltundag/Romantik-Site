# Claude + Codex Kullanımı

Bu projede **Claude ana orkestratördür**; OpenAI Codex CLI ikinci görüş ve yardımcı
kodlama ajanı olarak kullanılır. Codex'in çıktısı körü körüne kabul edilmez —
diff, testler ve dosya değişiklikleri her zaman Claude tarafından doğrulanır.

## Salt analiz

Claude'a:

> Bu projedeki kimlik doğrulama akışını önce kendin incele. Ardından Codex'ten bağımsız bir ikinci görüş al. Codex'e dosya değiştirmemesini söyle. İki analizi karşılaştırarak sonucu raporla.

## Hata araştırma

> Bu hatayı incele. Önce logları ve ilgili kodu kendin analiz et. Sonra Codex'e yalnızca hata nedenleri ve muhtemel çözümler için danış. Codex'in önerilerini testlerle doğrula.

## Kod inceleme

> Mevcut git diff'ini sen incele. Sonra Codex'ten bağımsız bir code review iste. Bulguları önem sırasına göre birleştir; doğrulanmamış iddiaları sonuç olarak sunma.

## Uygulama görevi

> Bu özelliğin uygulanması için önce bir plan hazırla. Planı Codex'e eleştirt. Son planı bana göster. Onay gerekmiyorsa değişiklikleri uygula, ardından testleri çalıştır ve Codex'ten son diff için review al.

## Doğrudan wrapper kullanımı

Windows (PowerShell):

```powershell
.\scripts\ask-codex.ps1 -Task "Bu projeyi incele, dosya degistirme ve en onemli teknik borclari listele."
```

macOS/Linux:

```bash
./scripts/ask-codex.sh "Bu projeyi incele, dosya degistirme ve en onemli teknik borclari listele."
```

## Ham CLI çağrısı (wrapper olmadan)

```powershell
# Bos stdin, Codex'in stdin beklemesini onler.
# Windows'ta "unelevated" override, elevated sandbox setup hatasini atlar (asagidaki nota bakin).
'' | codex exec -c 'windows.sandbox="unelevated"' -s read-only -C "C:\Users\dadil\Documents\Yazilimsal_Projeler\Romantik-Site" "<gorev>"
```

Seçenekler (codex-cli 0.144.1):
- `-s read-only` (varsayılan güvenli) · `-s workspace-write` (yazma gerekirse)
- `-C <dir>`: çalışma dizinini sınırla
- `-a untrusted|on-request|never`: onay politikası (gereksiz yere `never` yapma)

## Güvenlik kuralları

- `--yolo`, `--dangerously-bypass-approvals-and-sandbox`, `-s danger-full-access` **kullanılmaz**.
- Claude tarafında `--dangerously-skip-permissions` **kullanılmaz**.
- `firebase-config.js`, `.env`, API anahtarları ve tokenlar Codex promptuna **eklenmez**.
- `git reset --hard`, `git clean -fd`, force push, DB silme, production deploy
  işlemleri Codex'e **otomatik yaptırılmaz**; kullanıcı onayı gerekir.

## Windows sandbox notu

Bu makinede Codex `~/.codex/config.toml` içinde `[windows] sandbox = "elevated"`
ile yapılandırılmıştır. Non-interactive `codex exec` çağrılarında bu modun
"setup refresh" adımı `os error 3` (`codex-windows-sandbox-setup.exe` bulunamadı)
verir ve shell komutları çalışmaz.

**Çözüm (doğrulanmış):** Her çağrıda `-c 'windows.sandbox="unelevated"'` override'ı
kullanın. Bu, sandbox'ı **kapatmaz** — yalnızca yükseltmesiz çalıştırarak bozuk
elevated kurulum adımını atlar. `scripts/ask-codex.ps1` bunu varsayılan yapar
(`-WindowsSandbox unelevated`). Global `config.toml` değiştirilmez.
