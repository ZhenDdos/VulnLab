# VulnLab

Учебный магазин на React, Express и PostgreSQL для практики SAST, SCA и анализа
конфигурации контейнеров. Лаборатория предназначена для намеренно внесённых
реальных уязвимостей в изолированной учебной среде. Используйте её только
локально и с вымышленными данными; не публикуйте уязвимый экземпляр в интернете
и не используйте его в production.

## Быстрый запуск

1. Создайте локальный файл окружения:

   ```powershell
   Copy-Item backend\.env.example backend\.env
   ```

2. Запустите приложение из корня репозитория:

   ```powershell
   docker compose up --build
   ```

   Frontend: http://localhost:5173, API: http://localhost:8000,
   документация API: http://localhost:8000/api-docs.

3. Остановите контейнеры:

   ```powershell
   docker compose down
   ```

   Чтобы удалить также локальную базу данных, отдельно выполните
   `docker compose down --volumes`.

## Проверки безопасности

Проверки можно запускать вручную командами ниже. Конфигурацию CI и правила
сканеров для проекта можно добавить отдельно.

Локальные команды из PowerShell:

```powershell
# SCA для каждого npm-проекта
Push-Location backend; npm audit; Pop-Location
Push-Location frontend; npm audit; Pop-Location

# Проверка Dockerfile и конфигурации Compose (Trivy должен быть установлен)
trivy config .

# Проверка образа backend после сборки
docker build -t insecure-app .\backend
trivy image insecure-app
```

Для SAST локально используйте CodeQL CLI или Semgrep с правилами
`p/owasp-top-ten` и `p/nodejs`. Не используйте учебные настройки как шаблон
для настоящего сервиса.

## Каталог сценариев и исправлений

См. [документацию лаборатории](docs/SECURITY_LAB.md): там описаны реальные
уязвимости и сценарии, которые будут добавляться, ожидаемые результаты
сканирования и процесс подготовки исправлений.
