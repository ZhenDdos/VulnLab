# VulnLab

Учебный магазин на React, Express и PostgreSQL для практики SAST, SCA и анализа
конфигурации контейнеров. В проекте есть намеренно внесённые уязвимости. Я
запускаю его только локально и использую вымышленные данные; сам стенд не
выкладываю в интернет и не использую в production.

## Быстрый запуск

1. Скопируйте пример настроек backend в локальный файл:

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

   Чтобы удалить локальную базу вместе с контейнерами, запустите
   `docker compose down --volumes`.

## Проверки безопасности

AppSec-проверки проекта:

| Проверка | Инструмент | Запуск и область |
| --- | --- | --- |
| SAST | Semgrep | PR, расписание и изменения backend/frontend/правил |
| SCA | Dependabot | Еженедельные обновления npm-пакетов и GitHub Actions |
| DAST | OWASP ZAP Baseline | Push, PR или вручную; frontend на `http://localhost:5173`; отчёт — artifact |
| Качество | npm scripts | Push, PR или вручную; backend tests/build, frontend lint/build |

Чтобы запускать ZAP в GitHub Actions, добавьте secrets `DB_USER`,
`DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` и `JWT_SECRET` в **Settings →
Secrets and variables → Actions**. Для CI задайте `DB_HOST=db` и
`DB_PORT=5432`. Workflow пропускает PR из форков: GitHub не передаёт им
Secrets. Если хотите запускать проверку и на PR Dependabot, добавьте те же
значения в **Settings → Secrets and variables → Dependabot**. Для Semgrep
нужен secret `SEMGREP_APP_TOKEN`.

ZAP Baseline сканирует только frontend и не заменяет проверку аутентифицированных
API-маршрутов. Интерпретация результатов и ограничения описаны в
[документации AppSec-проверок](docs/SECURITY_LAB.md). SQLI-001 разобран отдельно
в [карточке находки](docs/security/findings/SQLI-001.md).

Локальные команды из PowerShell:

```powershell
# SCA для каждого npm-проекта
Push-Location backend; npm audit; Pop-Location
Push-Location frontend; npm audit; Pop-Location

# Проверка Dockerfile и конфигурации Compose (Trivy должен быть установлен)
trivy config .

# Проверка образа backend после сборки
docker build -t vulnlab .\backend
trivy image vulnlab
```

Для локального SAST используйте Semgrep с правилами `p/owasp-top-ten` и
`p/nodejs`. Это учебная лаборатория, а не шаблон конфигурации для production.
