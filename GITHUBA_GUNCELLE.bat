@echo off
chcp 65001 >nul
title Aksaray Belediyesi Is Takip - GitHub Guncelleyici
color 0A
echo ========================================================
echo   AKSARAY BELEDİYESİ İŞ TAKİP - GİTHUB GÜNCELLEME
echo ========================================================
echo.
echo Tolga YALÇINKAYA ve Yeni "Kişi Ekle" butonu GitHub'a yükleniyor...
echo (Tarayıcınızda veya ekranda GitHub onay penceresi açılırsa 'Authorize' veya 'Sign in' tıklayınız)
echo.
cd /d "C:\Users\ASUS\.gemini\antigravity\scratch\aksaray-belediyesi-is-takip"
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   [BAŞARILI] Kodlar GitHub'a yüklendi!
    echo   Render 1-2 dakika içinde otomatik güncellenecektir:
    echo   https://aksaray-belediyesi-is-takip.onrender.com
    echo ========================================================
) else (
    echo ========================================================
    echo   [BİLGİ] Eğer giriş onayı istiyorsa lütfen ekrandaki onayı verin
    echo   veya Masaüstündeki 'Aksaray_Site_Dosyalari' klasöründeki
    echo   dosyaları GitHub sitesine sürükleyip bırakabilirsiniz!
    echo ========================================================
)
echo.
pause