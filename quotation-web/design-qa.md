# Design QA

## Source of truth

- User-provided Yiheda upload-page screenshot: directional reference for a white enterprise canvas, restrained teal accents, manufacturing credibility, and an obvious upload-first task.
- Approved single-page plan: the visible product flow must be only upload -> AI recognition/rule parsing -> quote result.
- Previous prototype screenshot `qa/workbench-1440x900.png`: source for the established navy/teal tokens, typography density, border treatment, and brand character. Its sidebar, roles, records, and workbench structure are intentionally removed.

## Latest implementation evidence

- Upload stage, desktop viewport: `qa/single-upload-viewport-1440.png`
- Quote result, desktop viewport: `qa/single-result-1440.png`
- 3D-only quote result, 1024px viewport: `qa/single-result-1024.png`

## Visual review

- Compared the previous prototype and the latest 1440px result in the same review pass.
- Preserved the established navy/teal manufacturing SaaS visual language while removing all role navigation and dashboard chrome.
- The page now has one visual hierarchy: simple header, three-step progress, current stage content, and a lightweight footer.
- The result view keeps the price summary above recognition, process, risks, and explainable cost rows, so the main outcome is visible before supporting detail.
- Checked spacing, alignment, border continuity, text hierarchy, table density, color contrast, action priority, and visible clipping. No overlapping or broken regions were found.
- No gradients or decorative pseudo-technical artwork were introduced.

## Interaction review

- Complete STEP + PDF pair (`伺服电机安装座`) generated a quote with 94% confidence and seven cost rows.
- 3D-only input (`分度盘连接轴`) generated a quote with 68% confidence and the required missing-2D warning.
- Material-conflict pair (`传感器法兰`) paused pricing and disabled export; selecting `6061-T6铝合金` immediately restored a complete quote.
- Changing device rate from 120 to 180 and target margin from 28% to 35% updated the taxed unit price from ¥681.40 to ¥952.03 without rerunning recognition.
- Restoring default rules returned all fields and the taxed unit price to their original values.
- A mismatched STEP/PDF filename pair was blocked with a clear inline error.

## Responsive and technical review

- 1440 × 900: no horizontal page overflow; result page shows four price KPIs and two-column detail layout.
- 1024 × 768: no horizontal page overflow; body `scrollWidth` equals `clientWidth` and key controls remain visible.
- Browser console warnings/errors during the tested flow: none.
- Production build with Vite 6.4.2: passed.

final result: passed
