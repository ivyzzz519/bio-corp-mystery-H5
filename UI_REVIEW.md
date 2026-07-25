# Mobile UI review

Phase 5 includes both the shared mobile visual system and the page-specific puzzle scenes. Reload a page before reviewing if it was already open.

## Review now

- Entry page: dark mystery atmosphere, typography, identity card, article readability and primary action.
- OA workbench: progress bar, app bar, account/search card, gradient welcome card and two-column statistics.
- Shared navigation: workbench, search, mailbox and clues in the bottom navigation.
- Mailbox and search: touch targets, card spacing, single-column reading and fixed navigation clearance.
- Safe areas: top and bottom controls respect device insets.

## Tested viewports

- 320 x 568: compact phone
- 375 x 667: common small iPhone viewport
- 390 x 844: current mainstream phone viewport
- 430 x 932: large phone viewport

## Page-specific review

- Cloud note login and diary search.
- Partner website presentation.
- Zhang Chi virtual file actions: download the DCM, open the download tray, tap the file card, rename it to `.zip`, extract it and open the WAV transcript.
- Ending 1, deep archive terminal and Ending 2.
- Page-level hierarchy, copy density and puzzle-specific feedback.

Ending 1 and the Ending 2 outro now provide a skip-animation control for mobile reading.

## Final package QA — 2026-07-25

Tested from the extracted `bio-corp-mystery-H5-v1.0.0.zip`, served as static files:

- All 21 routes loaded at 320 x 568, 375 x 667, 390 x 844 and 430 x 932.
- No horizontal overflow or visibly broken images remained at any tested viewport.
- No browser console errors were reported during the final route pass.
- Valid and invalid keyword searches returned the expected states.
- The virtual B-09B flow passed: download, open tray, rename to `.zip`, extract and open the WAV transcript.
- Ending 1, hidden archive authentication (failure and success), Ending 2 recap questions and skip-animation behavior passed.

The 320 px pass exposed and resolved two scrollbar-related width issues in the shared mobile shell and progress bar. Physical-device verification was subsequently completed and accepted by the release owner.
