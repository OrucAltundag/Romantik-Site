# CLAUDE.md

Bu dosya, bu depoda çalışan Claude Code'a yol gösterir.

## Codex CLI ile iş birliği

Bu projede Claude ana orkestratördür. OpenAI Codex CLI, ikinci görüş ve yardımcı kodlama ajanı olarak kullanılabilir.

Codex'in tercih edilebileceği durumlar:
- Büyük veya karmaşık bir kod tabanını bağımsız olarak incelemek
- Bir hata için ikinci görüş almak
- Uygulama planını eleştirmek
- Test senaryoları üretmek
- Değişiklikleri kod incelemesinden geçirmek
- Alternatif implementasyonları karşılaştırmak
- Belirli ve sınırları açık bir kodlama görevini devretmek

Çalışma yöntemi:
1. Codex'e verilen görevi dar, ölçülebilir ve açık biçimde tanımla.
2. Çalışma dizinini açıkça belirt (`-C` / wrapper'ın `-WorkingDirectory` parametresi).
3. Gerekmedikçe Codex'e yazma yetkisi verme (varsayılan `-s read-only`).
4. İlk aşamada analiz veya plan iste.
5. Yazma görevi verildiyse işlem öncesinde `git status` kontrol et.
6. Codex tamamladıktan sonra `git diff`, testler, lint ve type-check sonuçlarını Claude doğrulasın.
7. Codex'in çıktısını doğru kabul etmeden önce ilgili dosyaları Claude kendisi incelesin.
8. Claude, kullanıcıya hangi işin Codex'e devredildiğini ve sonucun nasıl doğrulandığını açıklasın.

Güvenlik:
- `--yolo` ve `--dangerously-bypass-approvals-and-sandbox` kullanma.
- Claude tarafında `--dangerously-skip-permissions` kullanma.
- Gizli dosyaları, `.env` / `firebase-config.js` içeriğini, özel anahtarları veya erişim tokenlarını Codex promptuna ekleme.
- Destructive komutlar için kullanıcı onayı olmadan işlem yapma.
- `git reset --hard`, `git clean -fd`, force push, veri tabanı silme veya production deployment işlemlerini Codex'e otomatik yaptırma.

### Codex çağrısı (bu ortamda doğrulanmış sözdizimi — codex-cli 0.144.1)

Salt analiz (varsayılan, güvenli):
```powershell
# Bos stdin, Codex'in stdin beklemesini onler.
# Windows: bu makinede global config "elevated" oldugundan ve non-interactive
# exec'te "os error 3" verebildiginden, per-call "unelevated" override kullanilir
# (sandbox KAPATILMAZ; sadece yukseltmesiz calisir).
'' | codex exec -c 'windows.sandbox="unelevated"' -s read-only -C "<proje-yolu>" "<gorev>"
```

Yardımcı wrapper üzerinden (önerilir):
```powershell
.\scripts\ask-codex.ps1 -Task "<gorev>"
```

Notlar:
- `-s / --sandbox`: `read-only` (varsayılan), `workspace-write`, `danger-full-access`. `danger-full-access` kullanma.
- `-C / --cd`: çalışma dizinini açıkça sınırlar.
- `-a / --ask-for-approval`: `untrusted` | `on-request` | `never`. Onay mekanizmasını gereksiz yere `never`'a alma.
- Ayrıntılı kullanım örnekleri: [CODEX-USAGE.md](CODEX-USAGE.md).
