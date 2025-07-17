# PDF Component Snapshots

This directory contains snapshots of the PDF components that have been tested and verified to work correctly. These snapshots serve as a reference for future development and help prevent regressions.

## Included Snapshots

- `EnhancedLoveBlueprint.snapshot.tsx` - The standard premium report component
- `AIEnhancedLoveBlueprint.snapshot.tsx` - The AI-enhanced premium report component
- `SampleLoveBlueprint.snapshot.tsx` - The sample report component shown to users before purchase
- `LoveBlueprint.snapshot.tsx` - The base report component
- `generate-pdf-snapshot.ts` - The server-side PDF generation function

## How to Use

If you encounter issues with PDF generation, compare the current implementation with these snapshots to identify what might have changed. These snapshots represent a known working state of the PDF components.

To restore a component to its working state:

```typescript
// Example of restoring from snapshot
import EnhancedLoveBlueprintSnapshot from '../snapshots/EnhancedLoveBlueprint.snapshot';

// Use the snapshot version instead of the current version
<PDFDownloadLink
  document={<EnhancedLoveBlueprintSnapshot archetype={archetype} customerName={customerName} />}
  fileName={filename}
>
  {/* ... */}
</PDFDownloadLink>
```

## Key Fixes

The snapshots include fixes for:

1. Blank pages (pages 1 and 8)
2. Page break issues
3. Content overflow problems
4. Proper spacing and layout
5. Font sizing and readability

## Last Verified

These snapshots were last verified to work correctly on: June 10, 2025.