# TODO

- [x] deploy
- [x] auth
- [x] make scaffold ui
- [x] find difference between url and normal search
- [x] make regex for search
- [x] fix search functionality
- [x] make bangs
- [x] make db and attach with ui
- [x] delete bang from search
- [x] use gemini api for search intellisense (Don't forget to do {cache: no-store} in fetch)
- [x] integrate intellisense to ui
- [x] pull everything into new neon server
- [x] when trying to go settings to main page it will try to go "/" than "/settings" again. searcPage.tsx has const userBang = getUserChoice(); problem probably caused by await. Take a look at it.
- [x] make settings tab
- [x] make sure that user choice will used in search part
- [ ] YOU NEED RATE LIMITER you have 10 RPM and 1500 req/day put a reate limiter for 24h 1500req
- [ ] allow for custom bangs (will attach to db)
